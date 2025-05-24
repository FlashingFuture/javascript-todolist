import jwt from 'jsonwebtoken';

const privateKey = process.env.PRIVATE_KEY!;

export function signToken(id: number, userId: string): string {
  const payload = { id, userId };
  const options: jwt.SignOptions = { expiresIn: '1h' };
  return jwt.sign(payload, privateKey, options) as string;
}

export function verifyToken(token: string): any | null {
  try {
    console.log('verify success');
    return jwt.verify(token, privateKey);
  } catch (err) {
    console.log('verify faliure');
    return null;
  }
}
