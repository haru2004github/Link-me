// Simple QR Code generator using Canvas API
// Creates QR codes from text using a basic matrix approach

type CorrectionLevel = "L" | "M" | "Q" | "H"

interface QROptions {
  size?: number
  bgColor?: string
  fgColor?: string
  logoUrl?: string
  correctionLevel?: CorrectionLevel
}

// Simple QR encoding using a seeded pattern (for display/demo purposes)
// In production, use a proper QR library
function generateQRMatrix(text: string, size: number = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  )

  // Finder patterns (3 corners)
  const addFinderPattern = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          if (row + r < size && col + c < size) {
            matrix[row + r][col + c] = true
          }
        }
      }
    }
  }

  addFinderPattern(0, 0)
  addFinderPattern(0, size - 7)
  addFinderPattern(size - 7, 0)

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0
    matrix[i][6] = i % 2 === 0
  }

  // Data encoding (seeded from text hash)
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }

  let seed = Math.abs(hash)
  for (let r = 8; r < size; r++) {
    for (let c = 8; c < size; c++) {
      if (r < 9 && c < 9) continue
      if (r === 6 || c === 6) continue
      if (r >= size - 8 && c < 8) continue
      if (r < 8 && c >= size - 8) continue

      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      matrix[r][c] = (seed % 3) !== 0
    }
  }

  return matrix
}

export function generateQRCodeDataURL(
  text: string,
  options: QROptions = {}
): string {
  const {
    size = 256,
    bgColor = "#ffffff",
    fgColor = "#000000",
  } = options

  const matrixSize = 25
  const matrix = generateQRMatrix(text, matrixSize)
  const cellSize = Math.floor(size / matrixSize)
  const totalSize = cellSize * matrixSize

  const canvas = document.createElement("canvas")
  canvas.width = totalSize
  canvas.height = totalSize
  const ctx = canvas.getContext("2d")!

  // Background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, totalSize, totalSize)

  // Modules
  ctx.fillStyle = fgColor
  for (let row = 0; row < matrixSize; row++) {
    for (let col = 0; col < matrixSize; col++) {
      if (matrix[row][col]) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }

  return canvas.toDataURL("image/png")
}
