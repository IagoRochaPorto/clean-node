import { Express, Router } from 'express'
import fastglob from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fastglob.sync('**/src/main/routes/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router))
}
