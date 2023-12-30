import { HashProvider } from '@/shared/app/providers/hash-provider';
import { hash, compare } from 'bcrypt';

export class BcryptHashProvider implements HashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6);
  }

  async compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash);
  }
}
