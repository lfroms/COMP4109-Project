import Base64 from 'base64-arraybuffer';
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

  public static async convertPublicKeyToString(publicKey: CryptoKey) {
    const key = await window.crypto.subtle.exportKey('spki', publicKey);

    return Base64.encode(key);
  }

  public static convertStringToPublicKey(string: string) {
    const arrayBuffer = Base64.decode(string);

    return window.crypto.subtle.importKey(
      'spki',
      arrayBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['encrypt']
    );
  }
}
