import {
  RequestGenericInterface,
  FastifyInstance,
  FastifyServerOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify'
import {generateOgImage} from "./lib/canvas";
import fs from 'fs'
import path from 'path'
import fetch from 'isomorphic-unfetch'

const blogDomain = process.env.BLOG_DOMAIN || 'http://localhost:3000'
const cwd = process.cwd()

interface RequestGeneric extends RequestGenericInterface {
  Params: {
    slug: string
  }
}

export default async function (instance: FastifyInstance, opts: FastifyServerOptions, done: any) {
  instance.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send('ok')
  })

  instance.get('/check', async (req: FastifyRequest<RequestGeneric>, reply: FastifyReply) => {
    try {
      // first-post で疎通をチェックする
      const slug = 'first-post'
      const res = await fetch(`${blogDomain}/api/posts/${slug}?filter=og-image-title`)
      const json = await res.json() as { ogImageTitle: string }

      reply.send({ title: json.ogImageTitle })
    } catch (e: any) {
      console.error(e.message);

      reply.send({ error: e.message })
    }
  })

  instance.get('/posts/:slug/image', async (req: FastifyRequest<RequestGeneric>, reply: FastifyReply) => {
    const slug = req.params.slug

    reply.header('Content-Type', 'image/png')

    try {
      const res = await fetch(`${blogDomain}/api/posts/${slug}?filter=og-image-title`)
      const json = await res.json() as { ogImageTitle: string }
      const img = await generateOgImage(json.ogImageTitle)

      reply.send(img)
    } catch (e: any) {
      console.error(e.message);
      const file = path.resolve(cwd, 'src/assets/blog/site-image.png')
      const siteImg = fs.readFileSync(file)

      reply.send(siteImg)
    }
  })

  done()
}
