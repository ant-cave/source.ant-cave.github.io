// 前端图片压缩工具：浏览器端把图片压缩为 JPEG，减轻服务器带宽与磁盘压力。
// 压缩参数与原后端一致（JPEG quality=50，不改变尺寸），保证上游分类效果不变。

const JPEG_QUALITY = 0.5
const MAX_DIMENSION = 16384 // 防御性上限，避免超大大图把 canvas 撑爆

function _shrink(width, height) {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return { width, height }
  }
  const scale = MAX_DIMENSION / Math.max(width, height)
  return { width: Math.round(width * scale), height: Math.round(height * scale) }
}

/**
 * 将单个图片文件压缩为 JPEG Blob，并保留原始文件名。
 * 处理 EXIF 朝向（imageOrientation），RGBA 转白底（与原后端 RGB 转换等价）。
 */
export async function compressToJpegBlob(file) {
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch (e) {
    // 浏览器不支持 EXIF 朝向时退化为普通解码
    bitmap = await createImageBitmap(file)
  }

  const { width, height } = _shrink(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  // 白底，避免透明像素转 JPEG 后变黑
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => b ? resolve(b) : reject(new Error('图片压缩失败')), 'image/jpeg', JPEG_QUALITY)
  })
  return blob
}