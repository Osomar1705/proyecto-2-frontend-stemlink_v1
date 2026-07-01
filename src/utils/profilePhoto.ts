const MAX_SOURCE_SIZE = 3 * 1024 * 1024
const OUTPUT_SIZE = 512

export async function prepareProfilePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Selecciona una imagen válida.')
  }

  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error('La imagen debe pesar menos de 3 MB.')
  }

  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = OUTPUT_SIZE
  canvas.height = OUTPUT_SIZE

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('No pudimos procesar la imagen seleccionada.')
  }

  const sourceSize = Math.min(bitmap.width, bitmap.height)
  const sourceX = (bitmap.width - sourceSize) / 2
  const sourceY = (bitmap.height - sourceSize) / 2

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
  context.drawImage(
    bitmap,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  )
  bitmap.close()

  return canvas.toDataURL('image/jpeg', 0.82)
}
