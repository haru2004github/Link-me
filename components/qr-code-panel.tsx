"use client"

import { useEffect, useState } from "react"
import { useAppState } from "@/lib/store"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, Loader2 } from "lucide-react"

export function QrCodePanel() {
  const { state } = useAppState()
  const user = state.currentUser
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const profileUrl = user
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/${user.username}`
    : ""

  useEffect(() => {
    if (!profileUrl) return

    const fetchQr = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/qr?url=${encodeURIComponent(profileUrl)}&size=512&fg=%230f172a&bg=%23ffffff`
        )
        if (res.ok) {
          const data = await res.json()
          setQrDataUrl(data.dataUrl)
        }
      } catch (err) {
        console.error("QR fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchQr()
  }, [profileUrl])

  if (!user) return null

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = `${user.username}-qrcode.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">QR Code</CardTitle>
          <CardDescription>
            Share your profile with a scannable QR code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
              {loading ? (
                <div className="flex h-48 w-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl || "/placeholder.svg"}
                  alt="QR Code for your profile"
                  className="h-48 w-48"
                />
              ) : (
                <div className="flex h-48 w-48 items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Failed to generate
                  </p>
                </div>
              )}
            </div>

            <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
              <span className="flex-1 truncate text-sm text-muted-foreground">
                {profileUrl}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUrl}
                className="flex-shrink-0 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex w-full gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 gap-1.5"
                disabled={!qrDataUrl || loading}
              >
                <Download className="h-4 w-4" />
                Download QR
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
