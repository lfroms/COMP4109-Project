import Base64 from 'base64-arraybuffer';

export default class BaseEncryptionService {
  protected arrayBufferToString(buffer: ArrayBuffer): string {
    return Base64.encode(buffer);
  }

  protected stringToArrayBuffer(string: string): ArrayBuffer {
    return Base64.decode(string);
  }
}
