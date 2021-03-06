import bcrypt from 'bcrypt'
import { HashComparer } from '../../../data/protocols/criptography/hash-comparer'
import { Hasher } from '../../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) { }

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare(password: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hash)
    return new Promise(resolve => resolve(isValid))
  }
}
