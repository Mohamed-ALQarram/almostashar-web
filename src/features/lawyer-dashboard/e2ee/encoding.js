export const bytesToBase64 = (bytes) => {
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary);
};

export const base64ToBytes = (base64) => {
    const binary = atob(base64 || '');
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

export const utf8ToBytes = (value) => new TextEncoder().encode(value);

export const bytesToUtf8 = (bytes) => new TextDecoder().decode(bytes);

export const concatBytes = (...arrays) => {
    const length = arrays.reduce((sum, item) => sum + item.length, 0);
    const result = new Uint8Array(length);
    let offset = 0;

    arrays.forEach((item) => {
        result.set(item, offset);
        offset += item.length;
    });

    return result;
};
