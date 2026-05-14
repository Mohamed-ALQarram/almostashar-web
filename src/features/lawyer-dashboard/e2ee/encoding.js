export const bytesToBase64Url = (bytes) => {
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });

    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
};

export const base64UrlToBytes = (input) => {
    const value = input || '';
    const padded = value.replace(/-/g, '+').replace(/_/g, '/')
        + '==='.slice((value.length + 3) % 4);
    const binary = atob(padded);

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
