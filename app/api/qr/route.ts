import QRCode from "qrcode"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const fg = request.nextUrl.searchParams.get("fg") || "#0f172a"
  const bg = request.nextUrl.searchParams.get("bg") || "#ffffff"
  const size = Number.parseInt(
    request.nextUrl.searchParams.get("size") || "512",
    10
  )

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: fg,
        light: bg,
      },
      errorCorrectionLevel: "M",
    })

    return NextResponse.json({ dataUrl })
  } catch (error) {
    console.error("QR generation error:", error)
    return NextResponse.json({ error: "QR generation failed" }, { status: 500 })
  }
}
