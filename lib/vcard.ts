import type { UserProfile } from "./types"

function escapeVCard(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n")
}

export function generateVCard(profile: UserProfile, photoBase64?: string): string {
  const nameParts = (profile.full_name || "").trim().split(/\s+/)
  const lastName = nameParts.length > 1 ? nameParts.pop()! : ""
  const firstName = nameParts.join(" ")

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(profile.full_name || "")}`,
    `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
  ]

  if (profile.organization) {
    lines.push(`ORG:${escapeVCard(profile.organization)}`)
  }

  if (profile.job_title) {
    lines.push(`TITLE:${escapeVCard(profile.job_title)}`)
  }

  if (profile.phone) {
    lines.push(`TEL;TYPE=CELL:${profile.phone}`)
  }

  if (profile.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${profile.email}`)
  }

  if (profile.website) {
    lines.push(`URL:${profile.website}`)
  }

  if (profile.location) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCard(profile.location)};;;;`)
  }

  if (profile.bio) {
    lines.push(`NOTE:${escapeVCard(profile.bio)}`)
  }

  // Add profile photo if available as base64
  if (photoBase64) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`)
  } else if (profile.avatar_url) {
    // Fallback: include photo as URL reference
    lines.push(`PHOTO;VALUE=URI:${profile.avatar_url}`)
  }

  profile.links
    .filter((link) => link.enabled && link.url)
    .forEach((link) => {
      lines.push(`URL;TYPE=${link.platform.toUpperCase()}:${link.url}`)
    })

  lines.push("END:VCARD")
  return lines.join("\r\n")
}

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const dataUrl = reader.result as string
        // Remove the data:image/...;base64, prefix
        const base64 = dataUrl.split(",")[1] || null
        resolve(base64)
      }
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function downloadVCard(profile: UserProfile): Promise<void> {
  // Try to fetch the profile photo as base64 for embedding
  let photoBase64: string | null = null
  if (profile.avatar_url) {
    photoBase64 = await fetchImageAsBase64(profile.avatar_url)
  }

  const vcfContent = generateVCard(profile, photoBase64 || undefined)
  const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${(profile.full_name || "contact").replace(/\s+/g, "_")}.vcf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
