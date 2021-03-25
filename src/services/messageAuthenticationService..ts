import { BaseEncryptionService } from './base';
import Base64 from 'base64-arraybuffer';

export default class messageAuthenticationService extends BaseEncryptionService {
  private key: CryptoKey;

  constructor(key: CryptoKey) {
    super();
    this.key = key;
  }

  public async sign(ciphertext: string): Promise<string> {
    const signedCipherText = await window.crypto.subtle.sign(
      'HMAC',
      this.key,
      this.stringToArrayBuffer(ciphertext)
    );

    return this.arrayBufferToString(signedCipherText);
  }

  public async verify(mac: string, data: string) {
    return await window.crypto.subtle.verify(
      'HMAC',
      this.key,
      this.stringToArrayBuffer(mac),
      this.stringToArrayBuffer(data)
    );
  }

  public static async createCryptoKeyFromString(string: string) {
    return window.crypto.subtle.importKey(
      'raw',
      Base64.decode(string),
      {
        name: 'HMAC',
        hash: 'SHA-512',
      },
      true,
      ['sign', 'verify']
    );
  }

  public static generateKey() {
    return window.crypto.subtle.generateKey(
      {
        name: 'HMAC',
        hash: { name: 'SHA-512' },
      },
      true,
      ['sign', 'verify']
    );
  }

  public async exportKeyToString() {
    const key = await window.crypto.subtle.exportKey('raw', this.key);

    return this.arrayBufferToString(key);
  }
}
