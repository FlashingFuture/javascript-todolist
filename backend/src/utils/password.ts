import { pbkdf2Sync, randomBytes } from "crypto";

const ITERATIONS = parseInt(process.env.HASH_ITERATIONS ?? "10000", 10);
const KEYLEN = parseInt(process.env.HASH_KEYLEN ?? "64", 10);
const DIGEST = process.env.HASH_DIGEST ?? "sha512";

export const hashPassword = (
  password: string
): { passwordHash: string; salt: string } => {
  const salt = randomBytes(64).toString("base64");
  const passwordHash = pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEYLEN,
    DIGEST
  ).toString("base64");

  return { salt, passwordHash };
};

export const verifyPassword = (
  password: string,
  salt: string,
  originalHash: string
): boolean => {
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST).toString(
    "base64"
  );
  return hash === originalHash;
};
