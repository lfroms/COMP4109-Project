import { BaseEncryptionService } from './base';

export default class AsymmetricEncryptionService extends BaseEncryptionService {
  public async encrypt(plaintext: string, publicKey: CryptoKey) {
    const textEncoder = new TextEncoder();

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      textEncoder.encode(plaintext)
    );

    return this.arrayBufferToString(ciphertext);
  }

  public async decrypt(ciphertext: string, privateKey: CryptoKey) {
    const textDecoder = new TextDecoder();

    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      privateKey,
      super.stringToArrayBuffer(ciphertext)
    );

    return textDecoder.decode(plaintext);
  }

  public static async generateKeyPair() {
    return window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
}
