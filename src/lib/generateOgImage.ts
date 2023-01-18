import fs from 'fs'
import path from 'path'
import { createCanvas, registerFont, loadImage } from 'canvas'
import { size, getH } from './fn'

const current = process.cwd()

export const generateOgImage = async (title: string): Promise<Buffer> => {
  // font を登録
  const font = path.resolve(current, 'src/lib/canvas/assets/NotoSansJP-Bold.otf')
  registerFont(font, { family: 'NotoSansJP' })

  // canvas を作成
  const { width, height } = size
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // 元になる画像を読み込む
  const src = path.resolve(current, 'src/lib/canvas/assets/og-image.png')
  const image = await loadImage(fs.readFileSync(src))

  // 元の画像を canvas にセットする
  ctx.drawImage(image, 0, 0, width, height)

  // タイトルの style
  ctx.font = '28px "NotoSansJP"'
  ctx.textAlign = 'center'

  // タイトルを元の画像にセットする
  const lines = title.replace('\\n', '\n').split('\n')
  const maxWidth = 400
  const w = width / 2
  const sum = lines.length
  const write = (text: string, h: number) => {
    ctx.fillText(text, w, h, maxWidth)
  }

  if (sum === 0 || sum > 3) {
    throw new Error(`Invalid lines: ${sum}`)
  }

  for (const [i, line] of Object.entries(lines)) {
    const currentLineNumber = Number(i) + 1
    const h = getH(sum, currentLineNumber)
    write(line, h)
  }

  return canvas.toBuffer('image/png')
}
