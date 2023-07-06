import * as bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export async function hashPassword(plainPassword: string): Promise<string> {
  const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS)
  return hash
}

export async function isPasswordMatch(options: {
  password: string
  password_hash: string
}): Promise<boolean> {
  const match = await bcrypt.compare(options.password, options.password_hash)
  return match
}


