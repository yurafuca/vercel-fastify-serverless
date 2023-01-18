import * as dotenv from "dotenv";
import fastify from 'fastify'

dotenv.config();

const app = fastify()

app.register(import('./blog'), {
  prefix: '/'
})

// document
// https://www.fastify.io/docs/latest/Guides/Serverless/#vercel
export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
}

// ローカルで開発するときはこれを使う
const isDev = process.env.ENV === 'development'
if (isDev) {
  app.listen(8080, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}
