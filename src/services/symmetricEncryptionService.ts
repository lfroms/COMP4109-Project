import { decode as Base64Decode, encode as Base64Encode } from 'base64-arraybuffer';

interface EncryptedPayload {
  ciphertext: string;
  iv: string;
}

export default class SymmetricEncryptionService {
  private key: JsonWebKey;

  constructor(key: JsonWebKey) {
    this.key = key;
  }

  public async encrypt(plaintext: string): Promise<EncryptedPayload> {
    const textEncoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-CBC',
        iv,
      },
      await this.convertJsonWebKeyToCryptoKey(this.key),
      textEncoder.encode(plaintext)
    );

    return {
      ciphertext: this.arrayBufferToString(ciphertext),
      iv: this.arrayBufferToString(iv),
    };
  }

  public async decrypt(encryptedPayload: EncryptedPayload) {
    const { ciphertext, iv } = encryptedPayload;
    const textDecoder = new TextDecoder();

    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: this.stringToArrayBuffer(iv),
      },
      await this.convertJsonWebKeyToCryptoKey(this.key),
      this.stringToArrayBuffer(ciphertext)
    );

    return textDecoder.decode(plaintext);
  }

  public static async generateSymmetricKey() {
    const key = await this.generateAESKey();

    return window.crypto.subtle.exportKey('jwk', key);
  }

  private static generateAESKey() {
    return window.crypto.subtle.generateKey(
      {
        name: 'AES-CBC',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async convertJsonWebKeyToCryptoKey(keyData: JsonWebKey) {
    return await window.crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'AES-CBC',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private arrayBufferToString(buffer: ArrayBuffer): string {
    return Base64Encode(buffer);
  }

  private stringToArrayBuffer(string: string): ArrayBuffer {
    return Base64Decode(string);
  }
}
