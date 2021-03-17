import { BaseEncryptionService } from './base';

interface EncryptedPayload {
  m: string;
  iv: string;
}

export default class SymmetricEncryptionService extends BaseEncryptionService {
  private key: CryptoKey;

  constructor(key: CryptoKey) {
    super();
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
      this.key,
      textEncoder.encode(plaintext)
    );

    return {
      m: this.arrayBufferToString(ciphertext),
      iv: this.arrayBufferToString(iv),
    };
  }

  public async decrypt(encryptedPayload: EncryptedPayload) {
    const { m, iv } = encryptedPayload;
    const textDecoder = new TextDecoder();

    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: this.stringToArrayBuffer(iv),
      },
      this.key,
      this.stringToArrayBuffer(m)
    );

    return textDecoder.decode(plaintext);
  }

  public static generateKey() {
    return window.crypto.subtle.generateKey(
      {
        name: 'AES-CBC',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  public exportJsonWebKey() {
    return window.crypto.subtle.exportKey('jwk', this.key);
  }

  public static async convertJsonWebKeyToCryptoKey(jsonWebKey: JsonWebKey) {
    return window.crypto.subtle.importKey(
      'jwk',
      jsonWebKey,
      {
        name: 'AES-CBC',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
}
