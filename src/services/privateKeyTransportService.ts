import Base64 from 'base64-arraybuffer';

const RSA_KEY_START = '-----BEGIN RSA PRIVATE KEY-----';
const RSA_KEY_END = '-----END RSA PRIVATE KEY-----';

export default class PrivateKeyTransportService {
  private privateKey: CryptoKey;

  constructor(privateKey: CryptoKey) {
    this.privateKey = privateKey;
  }

  public async downloadAsFile() {
    const exportedKey = await window.crypto.subtle.exportKey('pkcs8', this.privateKey);

    const fileContents = this.createPemString(exportedKey);
    this.downloadPlaintextFile(fileContents);
  }

  public static createCryptoKeyFromPem(string: string) {
    const pemContents = string.substring(RSA_KEY_START.length, string.length - RSA_KEY_END.length);
    const bodyAsArrayBuffer = Base64.decode(pemContents);

    return window.crypto.subtle.importKey(
      'pkcs8',
      bodyAsArrayBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256',
      },
      true,
      ['decrypt']
    );
  }

  /** Formats an ArrayBuffer as a Base64-encoded RSA private key file. */
  private createPemString(data: ArrayBuffer) {
    const base64Encoded = Base64.encode(data);
    const body = base64Encoded.match(/.{1,64}/g)?.join('\n') ?? '';

    return `${RSA_KEY_START}\r\n${body}\r\n${RSA_KEY_END}`;
  }

  /** Creates a temporary HTML element linking to a download of a plaintext file.
   * When called, the plaintext file is downloaded by the browser. */
  private downloadPlaintextFile(contents: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents));
    element.setAttribute('download', 'private_key.pem');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}
