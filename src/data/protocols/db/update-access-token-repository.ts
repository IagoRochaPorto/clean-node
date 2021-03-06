export interface UpdateAccessTokenRepository {
  updateByEmail: (id: string, token: string) => Promise<void>
}
