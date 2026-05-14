# AlMostashar E2EE MVP Frontend Implementation Guide

**Audience:** React Web and Flutter frontend engineers  
**Scope:** End-to-end encrypted chat messages, images, documents, case documents, and request attachments  
**Backend branch:** `Mohamed-ALQarram/almostashar-api` / `E2E_Encryption`

---

## 0. Executive Summary

The backend now supports an E2EE MVP where:

- Each device is an independent E2EE endpoint.
- The backend stores only:
  - device public keys,
  - encrypted chat payloads,
  - encrypted document/file metadata,
  - encrypted content keys per recipient device.
- The backend never receives private keys, plaintext messages, plaintext files, or raw content keys.
- The frontend is responsible for:
  - generating and storing device keys,
  - registering device public keys,
  - encrypting messages/files before sending,
  - wrapping content keys for every authorized recipient device,
  - decrypting received messages/files locally,
  - maintaining local trusted-device/TOFU state.

The high-level model is:

```text
User Device Key Pair
        ↓
Get active recipient devices
        ↓
Generate random contentKey per message/file
        ↓
AES-GCM encrypt message/file with contentKey
        ↓
For every recipient device:
    ECDH(senderPrivateKey, recipientPublicKey)
    HKDF(sharedSecret) → wrappingKey
    AES-GCM encrypt contentKey with wrappingKey
        ↓
Send ciphertext + encryptedContentKeys to backend
```

---

## 1. Important Backend Contract Note

Before implementing full document decryption in frontend, confirm this backend detail:

### 1.1 Chat messages are decryptable

`EncryptedChatMessageDto` includes:

```text
senderDeviceId
ciphertext
nonce
tag
keys
document?
```

The receiver can use `senderDeviceId` to find the sender device public key and unwrap the message key.

### 1.2 Standalone documents need an uploader/sender device id

For case documents and request documents that are not read through a chat message, the frontend also needs the device id that wrapped the document content key.

Current document DTO shape is approximately:

```ts
type EncryptedCaseDocumentDto = {
  documentId: number;
  storageUrl: string;
  encryptedDocumentName?: string | null;
  documentNameNonce?: string | null;
  documentNameTag?: string | null;
  fileNonce: string;
  fileTag: string;
  fileSize?: number | null;
  mimeType?: string | null;
  createdAt: string;
  keys: EncryptedResourceKeyDto[];
};
```

This does **not** include `senderDeviceId` / `uploaderDeviceId`.

For the frontend to decrypt standalone case/request documents, the backend should add one of these:

```text
Recommended:
CaseDocuments.CreatedByUserId
CaseDocuments.CreatedByDeviceId
EncryptedCaseDocumentDto.createdByUserId
EncryptedCaseDocumentDto.createdByDeviceId
```

or at least:

```text
EncryptedCaseDocumentDto.senderDeviceId
```

Without this, the frontend cannot know which sender public key to use for:

```text
ECDH(currentDevicePrivateKey, senderDevicePublicKey)
```

### 1.3 Temporary rule until backend adds this

- Chat message text: fully decryptable.
- Chat-attached document: decrypt using the parent message `senderDeviceId`.
- Standalone case/request documents: require backend to expose `createdByDeviceId` or `senderDeviceId`.

This guide assumes the backend either:
1. already adds that field before frontend integration, or
2. the frontend uses the parent message `senderDeviceId` for chat-attached documents.

---

## 2. Required Libraries

## 2.1 React Web

Use built-in Web Crypto for cryptography.

Install:

```bash
npm install @microsoft/signalr idb-keyval uuid
```

Recommended optional packages:

```bash
npm install axios zod
```

Suggested usage:

| Need | Library |
|---|---|
| ECDH / HKDF / AES-GCM | Browser `window.crypto.subtle` |
| SignalR | `@microsoft/signalr` |
| Persistent key storage | `idb-keyval` or IndexedDB wrapper |
| Device id generation | `uuid` |
| HTTP client | `fetch` or `axios` |
| Runtime DTO validation | `zod` |

Do **not** store private keys in `localStorage`.

Use IndexedDB for non-extractable `CryptoKey` objects when possible.

---

## 2.2 Flutter

Install packages:

```yaml
dependencies:
  cryptography: ^2.7.0
  flutter_secure_storage: ^9.2.2
  uuid: ^4.5.1
  dio: ^5.7.0
  signalr_netcore: ^1.4.0
  file_picker: ^8.1.2
  image_picker: ^1.1.2
  mime: ^1.0.6
  path_provider: ^2.1.4
```

Optional local cache:

```yaml
dependencies:
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  sqflite: ^2.3.3
```

Suggested usage:

| Need | Library |
|---|---|
| ECDH / HKDF / AES-GCM | `cryptography` |
| Secret/private key storage | `flutter_secure_storage` |
| HTTP | `dio` |
| SignalR | `signalr_netcore` |
| File picking | `file_picker` / `image_picker` |
| Device id | `uuid` |

---

## 3. Cryptographic Decisions

Both React and Flutter must implement the **same** cryptographic formats.

### 3.1 Algorithms

Use:

```text
Key agreement: ECDH P-256
KDF: HKDF-SHA256
Content encryption: AES-GCM 256-bit key
Key wrapping encryption: AES-GCM 256-bit key
AES-GCM nonce: 12 random bytes
Encoding: base64url without padding
```

### 3.2 Public key format

Use this format for `IdentityPublicKey`:

```text
base64url(raw uncompressed P-256 public key)
```

Raw uncompressed P-256 public key is 65 bytes:

```text
0x04 || X(32 bytes) || Y(32 bytes)
```

This format is supported by Web Crypto as `raw` ECDH public key and by Flutter `cryptography` as `SimplePublicKey(..., type: KeyPairType.p256)`.

### 3.3 Private key format

React Web:

- Prefer storing the private key as a non-extractable `CryptoKey` in IndexedDB.
- If you cannot store `CryptoKey` reliably across browsers, export encrypted private key material using a local device secret, but this is more complex.
- Do not store raw private key in `localStorage`.

Flutter:

- Store private key material in `flutter_secure_storage`.
- If the selected crypto library provides platform-backed key storage, use it.
- Do not store private keys in shared preferences or unencrypted files.

### 3.4 Content key

Every encrypted message or file gets a fresh random 256-bit key:

```text
contentKey = randomBytes(32)
```

### 3.5 Key wrapping

For each recipient device:

```text
sharedSecret = ECDH(senderDevicePrivateKey, recipientDevicePublicKey)
wrappingKey = HKDF-SHA256(sharedSecret, salt, info, 32 bytes)
encryptedContentKey = AES-GCM(wrappingKey, contentKey)
```

Recommended canonical HKDF fields:

```text
salt = UTF8("AM-E2EE-v1|salt|" + senderDeviceId + "|" + recipientDeviceId)
info = UTF8("AM-E2EE-v1|wrap|" + resourceType + "|" + senderDeviceId + "|" + recipientDeviceId)
```

Where:

```text
resourceType = "ChatMessage" or "CaseDocument"
```

The receiver can reconstruct the same values because it knows:

```text
senderDeviceId
currentDeviceId
resourceType
```

### 3.6 AES-GCM AAD

The backend currently does not store an AAD field. To avoid cross-client mismatch, the MVP can use empty AAD:

```text
aad = empty bytes
```

If the team later wants metadata authentication, add an explicit `aadVersion` and canonical AAD rules to the backend/client contract.

### 3.7 Nonce rules

Every AES-GCM encryption must use a random 12-byte nonce:

```text
message nonce
file nonce
document name nonce
key wrap nonce
```

Never reuse the same:

```text
key + nonce
```

---

## 4. Required Frontend Modules

Build the frontend in modules instead of putting crypto inside screens.

Recommended structure:

```text
/e2ee
  deviceIdentity.ts / device_identity.dart
  cryptoEncoding.ts / crypto_encoding.dart
  ecdh.ts / ecdh.dart
  hkdf.ts / hkdf.dart
  aesGcm.ts / aes_gcm.dart
  keyWrapping.ts / key_wrapping.dart
  messageEncryption.ts / message_encryption.dart
  documentEncryption.ts / document_encryption.dart
  trustedDevices.ts / trusted_devices.dart

/api
  authApi.ts / auth_api.dart
  devicesApi.ts / devices_api.dart
  chatsApi.ts / chats_api.dart
  documentsApi.ts / documents_api.dart
  casesApi.ts / cases_api.dart
  clientRequestsApi.ts / client_requests_api.dart

/realtime
  signalrClient.ts / signalr_client.dart
```

---

## 5. Local Storage Requirements

Each frontend app must store:

### 5.1 Device state

```ts
type LocalDeviceState = {
  deviceId: string;
  deviceName: string;
  deviceType: "Web" | "Mobile" | "Desktop";
  identityPublicKey: string;
  privateKeyRef: string; // IndexedDB key id, secure storage key, etc.
  createdAt: string;
};
```

### 5.2 Trusted peer devices

For TOFU/device-change detection:

```ts
type TrustedPeerDevice = {
  userId: number;
  deviceId: string;
  identityPublicKey: string;
  firstSeenAt: string;
  lastSeenAt: string;
  status: "trusted" | "changed" | "revoked";
};
```

When `GET /api/chats/{chatId}/devices` returns devices:

- If `(userId, deviceId)` is new:
  - store it as trusted on first use;
  - optionally show notice: "New device added".
- If `(userId, deviceId)` exists but public key changed:
  - show strong warning;
  - do not encrypt for that device until user confirms or app policy allows.
- If a previously trusted device no longer appears:
  - mark as not currently active or revoked locally.

### 5.3 Local decrypted cache

You may cache decrypted messages/documents locally for UX, but encrypt local cache at rest if possible.

Recommended:

- Keep server source of truth as encrypted.
- Cache plaintext only in memory where possible.
- For persistent local cache, encrypt with a local database key stored in OS secure storage.

---

## 6. Backend Endpoints Used by Frontend

Base URL examples below assume:

```text
https://api.example.com
```

SignalR hub:

```text
/hubs/almostashar
```

---

## 6.1 Auth

### Login

```http
POST /api/auth/login
```

Request must include `deviceId`:

```json
{
  "email": "user@example.com",
  "password": "password",
  "deviceId": "device-uuid"
}
```

Response:

```json
{
  "user": { },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

Important:

- Generate/store `deviceId` before login.
- Send it during login.
- The access token should contain `device_id`.
- E2EE endpoints require an active current device.

### Refresh token

```http
POST /api/auth/refresh
```

Use existing refresh flow. Refresh token is associated with the `DeviceId`.

---

## 6.2 Device APIs

### Register current device

```http
POST /api/devices/register
Authorization: Bearer <accessToken>
```

Body:

```json
{
  "deviceId": "device-uuid",
  "deviceName": "Chrome on Windows",
  "deviceType": "Web",
  "identityPublicKey": "base64url-public-key"
}
```

Response returns the registered device.

Frontend flow:

1. Generate key pair locally if not already generated.
2. Login with `deviceId`.
3. Call `/api/devices/register`.
4. Store returned active device state locally.

### Get my devices

```http
GET /api/devices/me
```

Use for "Manage devices" screen.

### Revoke device

```http
POST /api/devices/{deviceId}/revoke
```

After revoking current device, logout locally and delete local private key.

---

## 6.3 Chat devices

Before sending encrypted chat message:

```http
GET /api/Chats/{chatId}/devices
```

Response shape:

```ts
type ChatParticipantDevicesResponseDto = {
  participants: Array<{
    userId: number;
    devices: UserDeviceDto[];
  }>;
};

type UserDeviceDto = {
  id: number;
  deviceId: string;
  deviceName: string;
  deviceType: "Web" | "Mobile" | "Desktop";
  identityPublicKey: string;
  status: "Active" | "Revoked";
  createdAt: string;
  lastSeenAt?: string | null;
  revokedAt?: string | null;
};
```

Use this response to:

- update local TOFU store,
- build recipient device list,
- encrypt content keys for every active participant device.

---

## 6.4 Chat messages

### Get messages

```http
GET /api/Chats/Messages?chatId=<chatId>&pageSize=50&nextCursor=<optional>
```

Response items are encrypted:

```ts
type EncryptedChatMessageDto = {
  messageId: number;
  chatId: number;
  senderId: number;
  senderDeviceId: string;
  messageType: "Text" | "Image" | "Document" | "TextWithAttachment";
  ciphertext: string;
  nonce: string;
  tag: string;
  sentAt: string;
  isSeen: boolean;
  seenAt?: string | null;
  keys: EncryptedResourceKeyDto[];
  document?: EncryptedCaseDocumentDto | null;
};
```

The backend returns the encrypted key for the current device. If `keys` is empty:

- current device may not have access,
- device may be new and content was created before activation,
- message may be malformed or missing keys.

### Mark read

```http
PUT /api/Chats/{chatId}/messages/{lastReadMessageId}/mark-read
```

Same as before.

---

## 6.5 SignalR

Connect to:

```text
/hubs/almostashar
```

Use access token auth.

### Send encrypted message

Hub method:

```text
SendEncryptedMessage
```

Payload:

```ts
type SendEncryptedMessageRequest = {
  chatId: number;
  senderDeviceId: string;
  messageType: string;
  ciphertext: string;
  nonce: string;
  tag: string;
  messageKeys: EncryptedResourceKeyDto[];
  document?: EncryptedDocumentPayload | null;
};
```

### Receive encrypted message

Client event:

```text
ReceiveEncryptedMessage
```

Payload is `EncryptedChatMessageDto`.

### Typing

Existing typing indicator remains:

```text
SendTypingIndicator
ReceiveTypingIndicator
```

---

## 6.6 Document upload

The file must be encrypted **before** upload.

### Upload encrypted bytes

```http
POST /api/documents/upload
Content-Type: multipart/form-data
```

Form field:

```text
File = encrypted file blob
```

Response:

```json
{
  "fileUrl": "https://..."
}
```

Use the returned `fileUrl` as `storageUrl` in `EncryptedDocumentPayload`.

### Get presigned URL

```http
POST /api/documents/presigned-url
```

Use it to download encrypted bytes, then decrypt locally.

---

## 6.7 Case document upload

```http
POST /api/cases/{caseId}/documents
```

Body is `EncryptedDocumentPayload`:

```json
{
  "storageUrl": "...",
  "encryptedDocumentName": "...",
  "documentNameNonce": "...",
  "documentNameTag": "...",
  "fileNonce": "...",
  "fileTag": "...",
  "fileSize": 123456,
  "mimeType": "application/pdf",
  "documentKeys": [
    {
      "recipientUserId": 1,
      "recipientDeviceId": "device-1",
      "encryptedContentKey": "...",
      "keyNonce": "...",
      "keyTag": "..."
    }
  ]
}
```

---

## 6.8 Client request attachments

Direct request:

```http
POST /api/client/requests/direct
```

Broadcast request:

```http
POST /api/client/requests/broadcast
```

Both can include:

```json
{
  "attachments": [
    {
      "storageUrl": "...",
      "encryptedDocumentName": "...",
      "documentNameNonce": "...",
      "documentNameTag": "...",
      "fileNonce": "...",
      "fileTag": "...",
      "fileSize": 123456,
      "mimeType": "application/pdf",
      "documentKeys": []
    }
  ]
}
```

Direct request attachments must be encrypted for:

```text
client active devices + selected lawyer active devices
```

Broadcast request attachments in MVP are encrypted only for:

```text
client active devices
```

Broadcast attachments are not shown to lawyers during listing. Sharing with a lawyer after acceptance is future work.

---

## 7. Shared DTOs

Use these in React/Flutter.

```ts
export type EncryptedResourceKeyDto = {
  recipientUserId: number;
  recipientDeviceId: string;
  encryptedContentKey: string;
  keyNonce: string;
  keyTag: string;
};

export type EncryptedDocumentPayload = {
  storageUrl: string;
  encryptedDocumentName?: string | null;
  documentNameNonce?: string | null;
  documentNameTag?: string | null;
  fileNonce: string;
  fileTag: string;
  fileSize?: number | null;
  mimeType?: string | null;
  documentKeys: EncryptedResourceKeyDto[];
};

export type EncryptedCaseDocumentDto = EncryptedDocumentPayload & {
  documentId: number;
  createdAt: string;

  // Required for standalone document decryption.
  // Ask backend to add this if missing.
  createdByDeviceId?: string;
};

export type SendEncryptedMessageRequest = {
  chatId: number;
  senderDeviceId: string;
  messageType: string;
  ciphertext: string;
  nonce: string;
  tag: string;
  messageKeys: EncryptedResourceKeyDto[];
  document?: EncryptedDocumentPayload | null;
};

export type EncryptedChatMessageDto = {
  messageId: number;
  chatId: number;
  senderId: number;
  senderDeviceId: string;
  messageType: string;
  ciphertext: string;
  nonce: string;
  tag: string;
  sentAt: string;
  isSeen: boolean;
  seenAt?: string | null;
  keys: EncryptedResourceKeyDto[];
  document?: EncryptedCaseDocumentDto | null;
};
```

---

## 8. Encoding Helpers

All binary values sent to backend should be strings.

Use:

```text
base64url without padding
```

Values to encode:

```text
public keys
ciphertext
nonce
tag
encryptedContentKey
encryptedDocumentName
```

React helper:

```ts
export function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/")
    + "===".slice((input.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

export function utf8ToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

export function bytesToUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}
```

---

## 9. React Web Crypto Implementation

### 9.1 Generate device key pair

```ts
async function generateDeviceKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    false, // private key should be non-extractable
    ["deriveBits"]
  );
}
```

### 9.2 Export public key

```ts
async function exportPublicKeyRaw(publicKey: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey("raw", publicKey);
  return bytesToBase64Url(new Uint8Array(raw));
}
```

### 9.3 Import peer public key

```ts
async function importPeerPublicKey(base64url: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    base64UrlToBytes(base64url),
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    false,
    []
  );
}
```

### 9.4 Derive wrapping key

```ts
async function deriveWrappingKey(params: {
  privateKey: CryptoKey;
  recipientPublicKeyBase64Url: string;
  senderDeviceId: string;
  recipientDeviceId: string;
  resourceType: "ChatMessage" | "CaseDocument";
}): Promise<CryptoKey> {
  const peerPublicKey = await importPeerPublicKey(params.recipientPublicKeyBase64Url);

  const sharedBits = await crypto.subtle.deriveBits(
    {
      name: "ECDH",
      public: peerPublicKey,
    },
    params.privateKey,
    256
  );

  const sharedKey = await crypto.subtle.importKey(
    "raw",
    sharedBits,
    "HKDF",
    false,
    ["deriveKey"]
  );

  const salt = utf8ToBytes(
    `AM-E2EE-v1|salt|${params.senderDeviceId}|${params.recipientDeviceId}`
  );

  const info = utf8ToBytes(
    `AM-E2EE-v1|wrap|${params.resourceType}|${params.senderDeviceId}|${params.recipientDeviceId}`
  );

  return crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt,
      info,
    },
    sharedKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}
```

### 9.5 AES-GCM encrypt/decrypt

```ts
async function aesGcmEncrypt(key: CryptoKey, plaintext: Uint8Array) {
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, tagLength: 128 }, key, plaintext)
  );

  const tagLength = 16;
  const ciphertext = encrypted.slice(0, encrypted.length - tagLength);
  const tag = encrypted.slice(encrypted.length - tagLength);

  return {
    ciphertext: bytesToBase64Url(ciphertext),
    nonce: bytesToBase64Url(nonce),
    tag: bytesToBase64Url(tag),
  };
}

async function aesGcmDecrypt(
  key: CryptoKey,
  ciphertextB64: string,
  nonceB64: string,
  tagB64: string
): Promise<Uint8Array> {
  const ciphertext = base64UrlToBytes(ciphertextB64);
  const tag = base64UrlToBytes(tagB64);
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);

  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64UrlToBytes(nonceB64),
      tagLength: 128,
    },
    key,
    combined
  );

  return new Uint8Array(plaintext);
}
```

### 9.6 Generate random content key

```ts
async function generateContentKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true, // must export raw to wrap for devices
    ["encrypt", "decrypt"]
  );
}

async function exportRawAesKey(key: CryptoKey): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.exportKey("raw", key));
}

async function importRawAesKey(bytes: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    bytes,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}
```

### 9.7 Wrap content key for a device

```ts
async function wrapContentKeyForDevice(params: {
  contentKey: CryptoKey;
  senderPrivateKey: CryptoKey;
  senderDeviceId: string;
  recipientUserId: number;
  recipientDeviceId: string;
  recipientPublicKey: string;
  resourceType: "ChatMessage" | "CaseDocument";
}): Promise<EncryptedResourceKeyDto> {
  const wrappingKey = await deriveWrappingKey({
    privateKey: params.senderPrivateKey,
    recipientPublicKeyBase64Url: params.recipientPublicKey,
    senderDeviceId: params.senderDeviceId,
    recipientDeviceId: params.recipientDeviceId,
    resourceType: params.resourceType,
  });

  const rawContentKey = await exportRawAesKey(params.contentKey);
  const encrypted = await aesGcmEncrypt(wrappingKey, rawContentKey);

  return {
    recipientUserId: params.recipientUserId,
    recipientDeviceId: params.recipientDeviceId,
    encryptedContentKey: encrypted.ciphertext,
    keyNonce: encrypted.nonce,
    keyTag: encrypted.tag,
  };
}
```

### 9.8 Unwrap content key

```ts
async function unwrapContentKey(params: {
  encryptedKey: EncryptedResourceKeyDto;
  myPrivateKey: CryptoKey;
  senderPublicKey: string;
  senderDeviceId: string;
  myDeviceId: string;
  resourceType: "ChatMessage" | "CaseDocument";
}): Promise<CryptoKey> {
  const wrappingKey = await deriveWrappingKey({
    privateKey: params.myPrivateKey,
    recipientPublicKeyBase64Url: params.senderPublicKey,
    senderDeviceId: params.senderDeviceId,
    recipientDeviceId: params.myDeviceId,
    resourceType: params.resourceType,
  });

  const rawContentKey = await aesGcmDecrypt(
    wrappingKey,
    params.encryptedKey.encryptedContentKey,
    params.encryptedKey.keyNonce,
    params.encryptedKey.keyTag
  );

  return importRawAesKey(rawContentKey);
}
```

---

## 10. Flutter Crypto Implementation Outline

### 10.1 Setup

```dart
final ecdh = Ecdh.p256(length: 256);
final aesGcm = AesGcm.with256bits();
final hkdf = Hkdf(
  hmac: Hmac.sha256(),
  outputLength: 32,
);
```

### 10.2 Generate device key pair

```dart
final keyPair = await Ecdh.p256(length: 256).newKeyPair();
final publicKey = await keyPair.extractPublicKey();
```

Export public key bytes:

```dart
final publicKeyBytes = publicKey.bytes;
// Encode as base64url without padding.
```

Make sure `publicKey.bytes` is the same raw uncompressed P-256 format expected by web. Test cross-platform before shipping.

### 10.3 Derive wrapping key

Pseudo-code:

```dart
Future<SecretKey> deriveWrappingKey({
  required SimpleKeyPairData myPrivateKey,
  required SimplePublicKey peerPublicKey,
  required String senderDeviceId,
  required String recipientDeviceId,
  required String resourceType,
}) async {
  final sharedSecret = await Ecdh.p256(length: 256).sharedSecretKey(
    keyPair: myPrivateKey,
    remotePublicKey: peerPublicKey,
  );

  final salt = utf8.encode('AM-E2EE-v1|salt|$senderDeviceId|$recipientDeviceId');
  final info = utf8.encode('AM-E2EE-v1|wrap|$resourceType|$senderDeviceId|$recipientDeviceId');

  return Hkdf(
    hmac: Hmac.sha256(),
    outputLength: 32,
  ).deriveKey(
    secretKey: sharedSecret,
    nonce: salt,
    info: info,
  );
}
```

### 10.4 AES-GCM encrypt

```dart
Future<EncryptedPayload> aesGcmEncryptBytes(SecretKey key, List<int> plaintext) async {
  final nonce = randomBytes(12);

  final secretBox = await AesGcm.with256bits().encrypt(
    plaintext,
    secretKey: key,
    nonce: nonce,
  );

  return EncryptedPayload(
    ciphertext: base64UrlNoPadding(secretBox.cipherText),
    nonce: base64UrlNoPadding(secretBox.nonce),
    tag: base64UrlNoPadding(secretBox.mac.bytes),
  );
}
```

### 10.5 AES-GCM decrypt

```dart
Future<List<int>> aesGcmDecryptBytes({
  required SecretKey key,
  required String ciphertext,
  required String nonce,
  required String tag,
}) async {
  final box = SecretBox(
    base64UrlDecodeNoPadding(ciphertext),
    nonce: base64UrlDecodeNoPadding(nonce),
    mac: Mac(base64UrlDecodeNoPadding(tag)),
  );

  return AesGcm.with256bits().decrypt(box, secretKey: key);
}
```

---

## 11. First App Launch Flow

### 11.1 React / Flutter

On app startup:

```text
1. Load local device state.
2. If missing:
   - generate UUID deviceId.
   - generate ECDH P-256 key pair.
   - export public key.
   - store private key securely.
   - store local device state.
3. Continue to login.
```

Pseudo-code:

```ts
async function ensureLocalDevice(): Promise<LocalDeviceState> {
  const existing = await loadDeviceState();
  if (existing) return existing;

  const deviceId = crypto.randomUUID();
  const keyPair = await generateDeviceKeyPair();
  const publicKey = await exportPublicKeyRaw(keyPair.publicKey);

  await savePrivateKey(deviceId, keyPair.privateKey);
  const state = {
    deviceId,
    deviceName: detectDeviceName(),
    deviceType: "Web",
    identityPublicKey: publicKey,
    privateKeyRef: deviceId,
    createdAt: new Date().toISOString(),
  };

  await saveDeviceState(state);
  return state;
}
```

---

## 12. Login + Device Registration Flow

```text
1. ensureLocalDevice()
2. POST /api/auth/login with email/password/deviceId
3. Save access token and refresh token
4. POST /api/devices/register with device public key
5. Continue app flow
```

Example:

```ts
const localDevice = await ensureLocalDevice();

const loginResponse = await authApi.login({
  email,
  password,
  deviceId: localDevice.deviceId,
});

tokenStore.save(loginResponse.tokens);

await devicesApi.register({
  deviceId: localDevice.deviceId,
  deviceName: localDevice.deviceName,
  deviceType: localDevice.deviceType,
  identityPublicKey: localDevice.identityPublicKey,
});
```

If registration fails because public key changed for the same device id:

- Treat local device state as corrupted.
- Logout.
- Ask user to reset local E2EE device state.
- A new device will only decrypt future content.

---

## 13. Sending a Text Message

### 13.1 Full flow

```text
1. Ensure current device is registered and active.
2. GET /api/Chats/{chatId}/devices.
3. Apply TOFU checks to all returned devices.
4. Build recipient device list:
   - all active devices of the other participant,
   - all active devices of current user,
   - include current device too if possible.
5. Generate messageContentKey.
6. AES-GCM encrypt message text.
7. Wrap messageContentKey for every recipient device.
8. Send SignalR SendEncryptedMessage.
9. Optimistically render local plaintext message.
```

### 13.2 Build recipient list

```ts
function buildChatRecipientDevices(
  participants: ChatParticipantDevicesResponseDto,
  currentUserId: number
): Array<{
  userId: number;
  deviceId: string;
  publicKey: string;
}> {
  return participants.participants.flatMap((p) =>
    p.devices
      .filter((d) => d.status === "Active")
      .map((d) => ({
        userId: p.userId,
        deviceId: d.deviceId,
        publicKey: d.identityPublicKey,
      }))
  );
}
```

### 13.3 Encrypt text message

```ts
async function createEncryptedTextMessage(params: {
  chatId: number;
  plaintext: string;
  currentUserId: number;
  currentDevice: LocalDeviceState;
  senderPrivateKey: CryptoKey;
  recipientDevices: RecipientDevice[];
}): Promise<SendEncryptedMessageRequest> {
  const contentKey = await generateContentKey();

  const encryptedMessage = await aesGcmEncrypt(
    contentKey,
    utf8ToBytes(params.plaintext)
  );

  const messageKeys = await Promise.all(
    params.recipientDevices.map((device) =>
      wrapContentKeyForDevice({
        contentKey,
        senderPrivateKey: params.senderPrivateKey,
        senderDeviceId: params.currentDevice.deviceId,
        recipientUserId: device.userId,
        recipientDeviceId: device.deviceId,
        recipientPublicKey: device.publicKey,
        resourceType: "ChatMessage",
      })
    )
  );

  return {
    chatId: params.chatId,
    senderDeviceId: params.currentDevice.deviceId,
    messageType: "Text",
    ciphertext: encryptedMessage.ciphertext,
    nonce: encryptedMessage.nonce,
    tag: encryptedMessage.tag,
    messageKeys,
    document: null,
  };
}
```

### 13.4 Send via SignalR

```ts
await hubConnection.invoke("SendEncryptedMessage", encryptedRequest);
```

---

## 14. Receiving a Text Message

### 14.1 Full flow

```text
1. Receive EncryptedChatMessageDto.
2. Find key where recipientDeviceId == currentDeviceId.
3. Find sender device public key using senderDeviceId.
4. TOFU-check sender public key.
5. ECDH + HKDF to derive wrappingKey.
6. Unwrap message contentKey.
7. AES-GCM decrypt message ciphertext.
8. Render plaintext.
```

### 14.2 Sender public key lookup

Implement a cache:

```ts
type DevicePublicKeyCache = {
  [deviceId: string]: {
    userId: number;
    publicKey: string;
    lastFetchedAt: string;
  };
};
```

If `senderDeviceId` is missing from cache:

```text
GET /api/Chats/{chatId}/devices
```

Then find device by `senderDeviceId`.

### 14.3 Decrypt message

```ts
async function decryptChatMessage(params: {
  message: EncryptedChatMessageDto;
  currentDeviceId: string;
  myPrivateKey: CryptoKey;
  senderPublicKey: string;
}): Promise<string> {
  const myKey = params.message.keys.find(
    (k) => k.recipientDeviceId === params.currentDeviceId
  );

  if (!myKey) {
    throw new Error("No encrypted message key for this device.");
  }

  const contentKey = await unwrapContentKey({
    encryptedKey: myKey,
    myPrivateKey: params.myPrivateKey,
    senderPublicKey: params.senderPublicKey,
    senderDeviceId: params.message.senderDeviceId,
    myDeviceId: params.currentDeviceId,
    resourceType: "ChatMessage",
  });

  const plaintextBytes = await aesGcmDecrypt(
    contentKey,
    params.message.ciphertext,
    params.message.nonce,
    params.message.tag
  );

  return bytesToUtf8(plaintextBytes);
}
```

---

## 15. Sending a Message With Image/Document

There are two independent encrypted resources:

```text
1. Chat message/caption → ChatMessage contentKey
2. File bytes → CaseDocument contentKey
```

### 15.1 Full flow

```text
1. Pick file/image.
2. Generate fileContentKey.
3. AES-GCM encrypt raw file bytes locally.
4. Upload encrypted bytes to /api/documents/upload.
5. Backend returns fileUrl.
6. Encrypt document name using fileContentKey or a separate metadata key.
7. Wrap fileContentKey for every recipient device.
8. Also encrypt optional message text/caption with messageContentKey.
9. Send SignalR SendEncryptedMessage with document payload.
```

### 15.2 Encrypt file

```ts
async function encryptFile(file: File): Promise<{
  encryptedBlob: Blob;
  fileNonce: string;
  fileTag: string;
  fileContentKey: CryptoKey;
}> {
  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const fileContentKey = await generateContentKey();
  const encrypted = await aesGcmEncrypt(fileContentKey, fileBytes);

  const encryptedBytes = base64UrlToBytes(encrypted.ciphertext);

  return {
    encryptedBlob: new Blob([encryptedBytes], { type: "application/octet-stream" }),
    fileNonce: encrypted.nonce,
    fileTag: encrypted.tag,
    fileContentKey,
  };
}
```

### 15.3 Upload encrypted file

```ts
async function uploadEncryptedFile(encryptedBlob: Blob): Promise<string> {
  const form = new FormData();
  form.append("File", encryptedBlob, "encrypted.bin");

  const response = await api.post("/api/documents/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.fileUrl;
}
```

### 15.4 Encrypt document name

Use file content key for metadata name encryption:

```ts
async function encryptDocumentName(fileContentKey: CryptoKey, fileName: string) {
  return aesGcmEncrypt(fileContentKey, utf8ToBytes(fileName));
}
```

### 15.5 Build document payload

```ts
async function createEncryptedDocumentPayload(params: {
  file: File;
  currentDevice: LocalDeviceState;
  senderPrivateKey: CryptoKey;
  recipientDevices: RecipientDevice[];
}): Promise<EncryptedDocumentPayload> {
  const encryptedFile = await encryptFile(params.file);
  const storageUrl = await uploadEncryptedFile(encryptedFile.encryptedBlob);

  const encryptedName = await encryptDocumentName(
    encryptedFile.fileContentKey,
    params.file.name
  );

  const documentKeys = await Promise.all(
    params.recipientDevices.map((device) =>
      wrapContentKeyForDevice({
        contentKey: encryptedFile.fileContentKey,
        senderPrivateKey: params.senderPrivateKey,
        senderDeviceId: params.currentDevice.deviceId,
        recipientUserId: device.userId,
        recipientDeviceId: device.deviceId,
        recipientPublicKey: device.publicKey,
        resourceType: "CaseDocument",
      })
    )
  );

  return {
    storageUrl,
    encryptedDocumentName: encryptedName.ciphertext,
    documentNameNonce: encryptedName.nonce,
    documentNameTag: encryptedName.tag,
    fileNonce: encryptedFile.fileNonce,
    fileTag: encryptedFile.fileTag,
    fileSize: params.file.size,
    mimeType: params.file.type || "application/octet-stream",
    documentKeys,
  };
}
```

### 15.6 Send with chat message

```ts
const encryptedRequest: SendEncryptedMessageRequest = {
  chatId,
  senderDeviceId: currentDevice.deviceId,
  messageType: "Document",
  ciphertext: encryptedCaption.ciphertext,
  nonce: encryptedCaption.nonce,
  tag: encryptedCaption.tag,
  messageKeys,
  document: encryptedDocumentPayload,
};

await hubConnection.invoke("SendEncryptedMessage", encryptedRequest);
```

If no caption, use an empty string as plaintext:

```text
""
```

The backend requires `ciphertext`, `nonce`, and `tag`.

---

## 16. Decrypting a Chat-Attached File

### 16.1 Full flow

```text
1. Decrypt parent message normally.
2. If message.document exists:
   - find document key for current device.
   - use parent message senderDeviceId as the wrapping sender device.
   - unwrap fileContentKey.
   - request presigned URL.
   - download encrypted bytes.
   - AES-GCM decrypt file bytes.
   - decrypt document name if present.
```

### 16.2 Decrypt document key

```ts
async function decryptChatAttachedDocument(params: {
  message: EncryptedChatMessageDto;
  currentDeviceId: string;
  myPrivateKey: CryptoKey;
  senderPublicKey: string;
}): Promise<{ fileKey: CryptoKey; documentName?: string }> {
  if (!params.message.document) {
    throw new Error("Message has no document.");
  }

  const documentKey = params.message.document.keys.find(
    (k) => k.recipientDeviceId === params.currentDeviceId
  );

  if (!documentKey) {
    throw new Error("No encrypted document key for this device.");
  }

  const fileKey = await unwrapContentKey({
    encryptedKey: documentKey,
    myPrivateKey: params.myPrivateKey,
    senderPublicKey: params.senderPublicKey,
    senderDeviceId: params.message.senderDeviceId,
    myDeviceId: params.currentDeviceId,
    resourceType: "CaseDocument",
  });

  let documentName: string | undefined;

  if (
    params.message.document.encryptedDocumentName &&
    params.message.document.documentNameNonce &&
    params.message.document.documentNameTag
  ) {
    const nameBytes = await aesGcmDecrypt(
      fileKey,
      params.message.document.encryptedDocumentName,
      params.message.document.documentNameNonce,
      params.message.document.documentNameTag
    );

    documentName = bytesToUtf8(nameBytes);
  }

  return { fileKey, documentName };
}
```

### 16.3 Download and decrypt file

```ts
async function downloadAndDecryptFile(params: {
  document: EncryptedCaseDocumentDto;
  fileKey: CryptoKey;
}): Promise<Blob> {
  const presigned = await api.post("/api/documents/presigned-url", {
    fileUrl: params.document.storageUrl,
  });

  const encryptedBytes = new Uint8Array(
    await fetch(presigned.data.url).then((r) => r.arrayBuffer())
  );

  const plaintext = await aesGcmDecrypt(
    params.fileKey,
    bytesToBase64Url(encryptedBytes),
    params.document.fileNonce,
    params.document.fileTag
  );

  return new Blob([plaintext], {
    type: params.document.mimeType ?? "application/octet-stream",
  });
}
```

Adjust the presigned-url request/response field names to match the exact backend DTO.

---

## 17. Upload Case Document

For `POST /api/cases/{caseId}/documents`:

```text
1. Get case participants/devices.
2. Encrypt file locally.
3. Upload encrypted file.
4. Wrap fileContentKey for all required devices.
5. POST EncryptedDocumentPayload to case endpoint.
```

The frontend needs a way to know required recipient devices for the case.

Recommended options:

1. If this case has an associated chat, call:
   ```http
   GET /api/Chats/{chatId}/devices
   ```
2. If there is no chat, backend should expose a case participants devices endpoint:
   ```http
   GET /api/cases/{caseId}/devices
   ```
3. Do not guess user ids/devices manually.

If the backend does not provide case devices, the frontend cannot reliably produce complete document keys for case uploads.

---

## 18. Create Direct Request With Attachments

For `POST /api/client/requests/direct`:

```text
1. User selects lawyer/service.
2. Frontend must know selected lawyer's active devices.
3. Encrypt attachments for:
   - client's active devices,
   - selected lawyer's active devices.
4. Send attachments array in request body.
```

Needed data:

```text
client active devices
selected lawyer active devices
```

If the backend does not expose lawyer devices before request creation, add an endpoint such as:

```http
GET /api/users/{userId}/devices
```

or include active device public keys in the lawyer selection response.

Without selected lawyer device public keys, the frontend cannot encrypt direct request attachments for the lawyer.

---

## 19. Create Broadcast Request With Attachments

MVP rule:

```text
Broadcast attachments are encrypted only for the client's active devices.
Lawyers do not receive document keys during broadcast listing.
```

Flow:

```text
1. Get current user's active devices.
2. Encrypt attachments for current user's devices only.
3. POST /api/client/requests/broadcast.
4. Lawyers see broadcast request metadata, but not attachments.
```

Future sharing flow after lawyer acceptance:

```text
1. Client loads original encrypted document.
2. Client decrypts fileContentKey.
3. Client fetches accepted lawyer's active devices.
4. Client wraps fileContentKey for lawyer devices.
5. Client sends new EncryptedResourceKeys to backend.
```

This future backend endpoint does not currently exist.

---

## 20. TOFU Device Trust Logic

Implement this before sending any encrypted payload.

### 20.1 First seen device

When a device public key is first seen:

```text
store (userId, deviceId, identityPublicKey)
trustStatus = trusted
```

### 20.2 Same device id, different public key

This is dangerous.

Frontend should:

```text
1. Block sending to that device.
2. Show warning:
   "This user's device key changed. This may indicate a new installation or a security issue."
3. Require user confirmation or support policy.
```

### 20.3 New device for known user

Show notice:

```text
"This user added a new device. Future messages may be readable on that device."
```

For MVP, this can be non-blocking.

### 20.4 Revoked/missing device

If backend no longer returns a device:

```text
mark local trust record inactive/revoked
do not encrypt future content for it
```

---

## 21. SignalR Client Setup

### 21.1 React

```ts
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${API_BASE_URL}/hubs/almostashar`, {
    accessTokenFactory: () => tokenStore.getAccessToken(),
  })
  .withAutomaticReconnect()
  .build();

connection.on("ReceiveEncryptedMessage", async (message: EncryptedChatMessageDto) => {
  await messageStore.saveEncrypted(message);
  const plaintext = await e2ee.decryptChatMessage(message);
  ui.addMessage({ ...message, plaintext });
});

await connection.start();
```

### 21.2 Flutter

```dart
final hubConnection = HubConnectionBuilder()
    .withUrl(
      '$apiBaseUrl/hubs/almostashar',
      options: HttpConnectionOptions(
        accessTokenFactory: () async => await tokenStore.getAccessToken(),
      ),
    )
    .withAutomaticReconnect()
    .build();

hubConnection.on('ReceiveEncryptedMessage', (arguments) async {
  final json = arguments![0] as Map<String, dynamic>;
  final message = EncryptedChatMessageDto.fromJson(json);
  final plaintext = await e2ee.decryptChatMessage(message);
  messageStore.add(message, plaintext);
});

await hubConnection.start();
```

---

## 22. Error Handling Rules

### 22.1 No key for current device

Show:

```text
This message was not encrypted for this device.
It may have been sent before this device was added.
```

Do not show plaintext placeholder as if it is a normal error.

### 22.2 Decryption failed

Possible causes:

- wrong public key,
- changed device key,
- corrupted ciphertext,
- wrong algorithm implementation,
- backend/client encoding mismatch.

Show:

```text
Unable to decrypt this message.
```

Log locally for debugging, but do not upload plaintext or private key details.

### 22.3 Device inactive

If API returns `Device.CurrentInactive` or similar:

```text
1. Logout user or show "This device has been revoked".
2. Delete local tokens.
3. Keep private key only if user may re-register same device; otherwise delete it.
```

### 22.4 Missing active devices

If sending fails because keys are missing for active recipient devices:

```text
1. Refresh device list.
2. Re-run TOFU checks.
3. Rebuild encrypted keys.
4. Retry once.
```

---

## 23. Frontend Screens to Update

### 23.1 Login screen

- Ensure device exists before login.
- Pass `deviceId` to login.
- Register device after login.

### 23.2 Device management screen

Use:

```http
GET /api/devices/me
POST /api/devices/{deviceId}/revoke
```

Display:

```text
Device name
Device type
Status
Created at
Last seen
```

### 23.3 Chat list

Usually no decryption needed unless showing last message preview.

Since backend no longer stores plaintext last message:

- show generic preview: "Encrypted message",
- or locally cache decrypted last message per chat.

### 23.4 Chat room

- Load encrypted messages.
- Decrypt locally.
- Connect SignalR.
- Send encrypted payloads only.
- Handle unsupported/undecryptable messages.

### 23.5 Case documents screen

- Load case details.
- For each document, use `createdByDeviceId` or parent chat `senderDeviceId`.
- Decrypt document key.
- Download encrypted bytes.
- Decrypt locally.

### 23.6 Client request screens

- Direct request create: encrypt attachments for client + selected lawyer devices.
- Broadcast request create: encrypt attachments for client devices only.
- My requests: decrypt own attachments if current device has keys.
- Lawyer broadcast listing: do not expect documents in MVP.

---

## 24. Implementation Checklist

### Device setup

- [ ] Generate stable `deviceId`.
- [ ] Generate ECDH P-256 key pair.
- [ ] Store private key securely.
- [ ] Export public key as base64url raw P-256.
- [ ] Login with `deviceId`.
- [ ] Register device after login.

### API integration

- [ ] Implement `/api/devices/register`.
- [ ] Implement `/api/devices/me`.
- [ ] Implement `/api/devices/{deviceId}/revoke`.
- [ ] Implement `/api/Chats/{chatId}/devices`.
- [ ] Implement encrypted message retrieval.
- [ ] Implement encrypted document upload.
- [ ] Implement presigned download + decrypt.

### Crypto

- [ ] Base64url helpers match across React and Flutter.
- [ ] P-256 public key format verified between platforms.
- [ ] ECDH output verified between React and Flutter.
- [ ] HKDF salt/info identical across platforms.
- [ ] AES-GCM nonce is always random 12 bytes.
- [ ] Tags are correctly split/combined in React WebCrypto.
- [ ] Flutter AES-GCM mac maps to backend `tag`.

### TOFU

- [ ] Store trusted devices locally.
- [ ] Detect new devices.
- [ ] Detect public key changes.
- [ ] Do not encrypt to changed devices silently.

### Chat

- [ ] Send encrypted text message.
- [ ] Receive/decrypt encrypted text message.
- [ ] Send encrypted document/image.
- [ ] Receive/decrypt encrypted document/image.
- [ ] Gracefully handle missing key for current device.

### Case/request documents

- [ ] Upload encrypted case document.
- [ ] Decrypt case document.
- [ ] Create direct request with encrypted attachments.
- [ ] Create broadcast request with client-only encrypted attachments.
- [ ] Do not show broadcast attachments to lawyers before explicit sharing.

---

## 25. Test Plan

### 25.1 Single device

- Login and register device.
- Send message.
- Receive message.
- Decrypt successfully.
- Upload encrypted file.
- Download and decrypt successfully.

### 25.2 Multi-device same user

- Login as client on mobile and web.
- Send from mobile.
- Confirm client web can decrypt sent message.
- Send from lawyer.
- Confirm both client devices can decrypt.

### 25.3 New device

- Add new web device.
- Confirm old messages show "not encrypted for this device".
- Confirm new messages decrypt successfully.

### 25.4 Revoked device

- Revoke a device.
- Confirm it no longer appears in active device list.
- Confirm sending client does not encrypt new messages for revoked device.
- Confirm revoked device API requests fail if token/device is invalidated.

### 25.5 TOFU

- First time seeing a device: store key.
- Same device same key: no warning.
- Same device different key: warning/block.
- New device for known user: notice.

### 25.6 Cross-platform compatibility

Use one test vector:

```text
React device A encrypts for Flutter device B.
Flutter device B decrypts.
Flutter device B encrypts for React device A.
React device A decrypts.
```

Verify:

```text
public key encoding
ECDH shared secret
HKDF result
AES-GCM decrypt
base64url encode/decode
```

---

## 26. Common Mistakes

### Mistake 1: Uploading plaintext files

Wrong:

```text
original.pdf → /api/documents/upload
```

Correct:

```text
encrypt original.pdf locally → encrypted bytes → /api/documents/upload
```

### Mistake 2: Storing private key in localStorage

Wrong:

```text
localStorage.setItem("privateKey", ...)
```

Correct:

```text
IndexedDB non-extractable CryptoKey on web
flutter_secure_storage on mobile
```

### Mistake 3: Encrypting only for the other user

Wrong:

```text
encrypt only for receiver mobile
```

Correct:

```text
encrypt for all active receiver devices + sender devices for sync
```

### Mistake 4: Forgetting current device key

The backend does not require a key for the current device, but including it is better.

If you do not include it, the sending device must keep local plaintext/content key cache.

### Mistake 5: Trying to decrypt without sender device public key

Every decrypt operation needs:

```text
current device private key
sender device public key
encrypted content key for current device
```

For standalone documents, backend must expose `createdByDeviceId` / `senderDeviceId`.

### Mistake 6: Reusing nonce

Never reuse AES-GCM nonce with the same key.

---

## 27. Suggested Development Order

Implement in this order:

```text
1. Base64url helpers.
2. Device key generation/storage.
3. Login with deviceId.
4. Device registration.
5. GET chat devices + TOFU store.
6. ECDH/HKDF/AES-GCM utilities.
7. Encrypt/decrypt content key.
8. Send encrypted text message.
9. Receive/decrypt encrypted text message.
10. Encrypt file bytes and upload encrypted file.
11. Send encrypted document message.
12. Receive/decrypt document message.
13. Case document upload/decrypt.
14. Direct request encrypted attachments.
15. Broadcast request client-only attachments.
16. Device management UI.
17. Cross-platform test vectors.
```

---

## 28. Minimal Backend Requirements Checklist for Frontend Team

Confirm these are available before completing frontend integration:

- [x] `POST /api/auth/login` accepts `deviceId`.
- [x] `POST /api/devices/register`.
- [x] `GET /api/devices/me`.
- [x] `POST /api/devices/{deviceId}/revoke`.
- [x] `GET /api/Chats/{chatId}/devices`.
- [x] SignalR hub `/hubs/almostashar`.
- [x] Hub method `SendEncryptedMessage`.
- [x] Event `ReceiveEncryptedMessage`.
- [x] `GET /api/Chats/Messages` returns `senderDeviceId`.
- [x] `POST /api/documents/upload`.
- [x] `POST /api/cases/{caseId}/documents`.
- [ ] Standalone document DTOs include `createdByDeviceId` or `senderDeviceId`.
- [ ] Frontend can obtain active devices for direct request selected lawyer before request creation.
- [ ] Frontend can obtain active devices for case participants before case document upload.

---

## 29. Final Rule

The frontend must never send these to the backend:

```text
plaintext messages
plaintext files
private keys
raw content keys
decrypted document names
```

The backend should only receive:

```text
public device keys
ciphertext
nonce
tag
encrypted content keys
encrypted file metadata
storage URLs for encrypted files
```
