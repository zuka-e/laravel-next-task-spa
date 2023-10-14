import {
  createCipheriv,
  createDecipheriv,
  createHash,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

const CIPHER_ALGORITHM = 'aes-256-cbc';
const DIGEST_ALGORITHM = 'sha256';
const PASSWORD = 'd55e76182c856f450ad654f13e2f5b02'; // randomBytes(16).toString('hex')
const SALT = '8bd861407f94eaf7e7c68150d472119f'; // randomBytes(16).toString('hex')
/** @see https://nodejs.org/api/crypto.html#cryptopbkdf2syncpassword-salt-iterations-keylen-digest */
const CIPHER_KEY = pbkdf2Sync(PASSWORD, SALT, 10, 32, DIGEST_ALGORITHM);
const IV_SIZE = 16;

/**
 * @see https://nodejs.org/api/crypto.html#class-cipher - Using the cipher.update() and cipher.final() methods:
 */
export const encrypt = (text: string): string => {
  /** Random IV makes an different encrypted value from the same text. */
  const iv = randomBytes(IV_SIZE);
  const cipher = createCipheriv(CIPHER_ALGORITHM, CIPHER_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const encryptedWithIv = Buffer.concat([iv, encrypted]);

  return encryptedWithIv.toString('hex');
};

/**
 * @see https://nodejs.org/api/crypto.html#class-decipher - Using the decipher.update() and decipher.final() methods
 */
export const decrypt = (text: string): string | null => {
  try {
    const encryptedWithIv = Buffer.from(text, 'hex');
    const iv = encryptedWithIv.subarray(0, IV_SIZE);
    const encrypted = encryptedWithIv.subarray(IV_SIZE);
    const decipher = createDecipheriv(CIPHER_ALGORITHM, CIPHER_KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  } catch (e) {
    console.log(`"${text}" is a invalid ciphertext.\n` + e);
    return null;
  }
};

/**
 * @see https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options
 */
export const digestText = (text: string): string => {
  return createHash(DIGEST_ALGORITHM).update(text).digest('hex');
};
