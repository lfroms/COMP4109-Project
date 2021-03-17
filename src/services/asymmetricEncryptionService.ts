import { BaseEncryptionService } from './base';

export default class AsymmetricEncryptionService extends BaseEncryptionService {
  public async encrypt(plaintext: string, publicKey: JsonWebKey) {
    const textEncoder = new TextEncoder();

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      await this.convertJsonWebKeyToCryptoKey(publicKey, 'encrypt'),
      textEncoder.encode(plaintext)
    );

    return this.arrayBufferToString(ciphertext);
  }

  public async decrypt(ciphertext: string, privateKey: JsonWebKey) {
    const textDecoder = new TextDecoder();

    const plaintext = await window.crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP',
      },
      await this.convertJsonWebKeyToCryptoKey(privateKey, 'decrypt'),
      super.stringToArrayBuffer(ciphertext)
    );

    return textDecoder.decode(plaintext);
  }

  public static async generateKeyPair(): Promise<JsonWebKeyPair> {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    return {
      publicKey: await window.crypto.subtle.exportKey('jwk', keyPair.publicKey),
      privateKey: await window.crypto.subtle.exportKey('jwk', keyPair.privateKey),
    };
  }

  private convertJsonWebKeyToCryptoKey(keyData: JsonWebKey, mode: 'encrypt' | 'decrypt') {
    return window.crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      false,
      [mode]
    );
  }
}
