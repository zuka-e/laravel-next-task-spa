import {
  type BinaryLike,
  type CipherGCMTypes,
  createCipheriv,
  createDecipheriv,
  createHash,
  pbkdf2Sync,
  randomBytes,
  scryptSync,
} from 'crypto';

const DIGEST_ALGORITHM = 'sha512';

/**
 * Derive a key from secrets.
 *
 * @param password
 * @param salt
 * @param keylen in bytes
 */
const deriveKey = (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
): Buffer => {
  return typeof window === 'undefined'
    ? // https://nodejs.org/api/crypto.html#cryptoscryptsyncpassword-salt-keylen-options
      scryptSync(password, salt, keylen)
    : // https://nodejs.org/api/crypto.html#cryptopbkdf2syncpassword-salt-iterations-keylen-digest
      pbkdf2Sync(password, salt, 10 ** 4, keylen, DIGEST_ALGORITHM);
};

const CIPHER_ALGORITHM: CipherGCMTypes = 'aes-256-gcm';
/** Password to for cipher key */
// const PASSWORD = 'd55e76182c856f450ad654f13e2f5b02'; // randomBytes(16).toString('hex')
/** Salt to give the cipher key uniqueness */
// const SALT = '8bd861407f94eaf7e7c68150d472119f'; // randomBytes(16).toString('hex')
/** Cipher key length (bytes) which comes from `CIPHER_ALGORITHM` (256bits) */
// const KEYLEN = 32;
/** Cipher key string for encryption */
const APP_KEY =
  '16991860abf02e87b5d0937eae98ba3f0197a5288a72a1885215abf79845bdb9'; // deriveKey(PASSWORD, SALT, KEYLEN).toString('hex');

/** Cipher key for encryption */
const CIPHER_KEY = Buffer.from(APP_KEY, 'hex');
/** Initialization vector length (bytes) */
const IV_SIZE = 16;

/**
 * Encrypt the string.
 */
export const encrypt = (text: string): string => {
  // cf. https://nodejs.org/api/crypto.html#class-cipher - Example: Using the cipher.update() and cipher.final() methods

  // ※ Random IV makes an different encrypted value from the same text.
  const iv = randomBytes(IV_SIZE);
  const cipher = createCipheriv(CIPHER_ALGORITHM, CIPHER_KEY, iv);
  const encryptedText = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag(); // required for GCM (16bytes)
  const encrypted = Buffer.concat([iv, encryptedText, authTag]);

  return encrypted.toString('hex');
};

/**
 * Try decrypting the string and get the result, or `null` on failure.
 */
export const decrypt = (text: string): string | null => {
  // cf. https://nodejs.org/api/crypto.html#class-decipher - Example: Using the decipher.update() and decipher.final() methods
  const encrypted = Buffer.from(text, 'hex');

  const authTagSize = 16; // bytes
  const authTagPos = encrypted.length - authTagSize;

  const iv = encrypted.subarray(0, IV_SIZE);
  const encryptedText = encrypted.subarray(IV_SIZE, authTagPos);
  const authTag = encrypted.subarray(authTagPos);

  try {
    const decipher = createDecipheriv(CIPHER_ALGORITHM, CIPHER_KEY, iv);

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
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

/** aka Secret salt (cf. random salt associated with a hash) */
const PEPPER = '576c8f7fad69e3b194705a9e378dca9c'; // randomBytes(16).toString('hex')
/** Random salt length (bytes) */
const SALT_SIZE = 16;
/** Generated hash length (bytes) */
const HASH_SIZE = 32;

/**
 * Generate a hashed value.
 */
export const hash = (text: string): string => {
  const peppered = text + PEPPER;
  const salt = randomBytes(SALT_SIZE).toString('hex');
  const hashed = deriveKey(peppered, salt, HASH_SIZE).toString('hex');

  // ※ (random) salt need to be preserved with a hash.
  return salt + hashed;
};

/**
 * Determine if `plain` text could be `hashed` text.
 */
export const verifyHash = (plain: string, hashed: string): boolean => {
  /** Salt length in `hex` */
  const saltLength = SALT_SIZE * 2;
  const salt = hashed.substring(0, saltLength);
  const targetHash = hashed.substring(saltLength);
  const pepperedPlain = plain + PEPPER;
  const hashedPlain = deriveKey(pepperedPlain, salt, HASH_SIZE).toString('hex');

  // cf. https://www.php.net/manual/en/function.hash-equals.php
  return hashedPlain === targetHash;
};
