import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'

const INPUT = 'public/hero-building.png'
const OUTPUT = 'public/hero-building.png'

const img = sharp(INPUT)
const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const result = Buffer.from(data)

for (let i = 0; i < result.length; i += channels) {
  const r = result[i]
  const g = result[i + 1]
  const b = result[i + 2]
  // near-white pixels → transparent (threshold 215 keeps building detail)
  if (r > 215 && g > 215 && b > 215) {
    result[i + 3] = 0
  }
}

await sharp(result, { raw: { width, height, channels } })
  .png()
  .toFile(OUTPUT)

console.log('Background removed →', OUTPUT)
