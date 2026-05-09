"use client"

import React from "react"
import { useAppState } from "@/lib/store"
import { PLATFORM_OPTIONS, type SocialLink } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  GripVertical,
  Plus,
  Trash2,
  Linkedin,
  Facebook,
  MessageCircle,
  MessageSquare,
  Instagram,
  Twitter,
  Music,
  Youtube,
  Github,
  Send,
  Globe,
  Mail,
  Phone,
  PhoneCall,
  Link,
  Info,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin,
  Facebook,
  MessageCircle,
  MessageSquare,
  Instagram,
  Twitter,
  Music,
  Youtube,
  Github,
  Send,
  Globe,
  Mail,
  Phone,
  PhoneCall,
  Link,
}

function getPlatformConfig(platform: string) {
  return PLATFORM_OPTIONS.find((p) => p.value === platform) || PLATFORM_OPTIONS[PLATFORM_OPTIONS.length - 1]
}

function getInputLabel(platform: string): string {
  switch (platform) {
    case "email": return "Email Address"
    case "phone": return "Phone Number"
    case "viber": return "Viber Phone Number"
    case "whatsapp": return "WhatsApp Number"
    case "telegram": return "Telegram Username"
    case "instagram": return "Instagram Username"
    case "twitter": return "X / Twitter Username"
    case "tiktok": return "TikTok Username"
    case "messenger": return "Messenger Username"
    case "github": return "GitHub Username"
    case "linkedin":
    case "facebook":
    case "youtube":
    case "website": return "Profile URL"
    default: return "URL"
  }
}

function getHelpText(platform: string): string | null {
  switch (platform) {
    case "email": return "Enter the email address (e.g. example@gmail.com)"
    case "phone": return "Enter phone with country code (e.g. +959 xxx xxx xxx)"
    case "viber": return "Enter phone number with country code for Viber"
    case "whatsapp": return "Enter phone with country code for WhatsApp"
    case "telegram": return "Enter username without @ (e.g. johndoe)"
    case "instagram": return "Enter username without @ (e.g. johndoe)"
    case "twitter": return "Enter username without @ (e.g. johndoe)"
    case "tiktok": return "Enter username without @ (e.g. johndoe)"
    case "messenger": return "Enter your Messenger username"
    case "github": return "Enter your GitHub username"
    default: return null
  }
}

// Build the full URL from user input based on platform
function buildUrl(platform: string, rawValue: string): string {
  const config = getPlatformConfig(platform)
  if (!config.prefix) return rawValue
  // If user already typed a full URL, keep it
  if (rawValue.startsWith("http://") || rawValue.startsWith("https://") || rawValue.startsWith("mailto:") || rawValue.startsWith("tel:") || rawValue.startsWith("viber://")) {
    return rawValue
  }
  return `${config.prefix}${rawValue.replace(/^@/, "")}`
}

// Extract the raw value from a full URL for display in input
function extractRawValue(platform: string, url: string): string {
  const config = getPlatformConfig(platform)
  if (!config.prefix || !url) return url
  if (url.startsWith(config.prefix)) {
    return url.slice(config.prefix.length)
  }
  return url
}

export function LinkManager() {
  const { state, setState } = useAppState()
  const user = state.currentUser
  if (!user) return null

  const updateLinks = (links: SocialLink[]) => {
    setState((prev) => ({
      ...prev,
      currentUser: prev.currentUser
        ? { ...prev.currentUser, links }
        : null,
    }))
  }

  const addLink = () => {
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      platform: "custom",
      label: "New Link",
      url: "",
      icon: "Link",
      enabled: true,
    }
    updateLinks([...user.links, newLink])
  }

  const removeLink = (id: string) => {
    updateLinks(user.links.filter((l) => l.id !== id))
  }

  const updateLink = (
    id: string,
    field: keyof SocialLink,
    value: string | boolean
  ) => {
    updateLinks(
      user.links.map((l) => {
        if (l.id !== id) return l
        if (field === "platform" && typeof value === "string") {
          const platform = PLATFORM_OPTIONS.find((p) => p.value === value)
          return {
            ...l,
            platform: value,
            label: platform?.label || l.label,
            icon: platform?.icon || l.icon,
            url: "", // reset url when changing platform
          }
        }
        return { ...l, [field]: value }
      })
    )
  }

  const updateLinkValue = (id: string, platform: string, rawValue: string) => {
    const fullUrl = buildUrl(platform, rawValue)
    updateLinks(
      user.links.map((l) => {
        if (l.id !== id) return l
        return { ...l, url: fullUrl }
      })
    )
  }

  const moveLink = (index: number, direction: "up" | "down") => {
    const newLinks = [...user.links]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newLinks.length) return
    ;[newLinks[index], newLinks[targetIndex]] = [
      newLinks[targetIndex],
      newLinks[index],
    ]
    updateLinks(newLinks)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Social Links</CardTitle>
              <CardDescription>
                Add and manage your social media and contact links
              </CardDescription>
            </div>
            <Button onClick={addLink} size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="popLayout">
            <div className="flex flex-col gap-3">
              {user.links.map((link, index) => {
                const IconComponent = iconMap[link.icon] || Link
                const platformConfig = getPlatformConfig(link.platform)
                const rawValue = extractRawValue(link.platform, link.url)
                const helpText = getHelpText(link.platform)
                return (
                  <motion.div
                    key={link.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-4"
                  >
                    <div className="flex flex-col gap-0.5 pt-2">
                      <button
                        type="button"
                        onClick={() => moveLink(index, "up")}
                        disabled={index === 0}
                        className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                        aria-label="Move link up"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-card">
                      <IconComponent className="h-5 w-5 text-foreground" />
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs">Platform</Label>
                          <Select
                            value={link.platform}
                            onValueChange={(v) =>
                              updateLink(link.id, "platform", v)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PLATFORM_OPTIONS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>
                                  {p.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-xs">Display Label</Label>
                          <Input
                            value={link.label}
                            onChange={(e) =>
                              updateLink(link.id, "label", e.target.value)
                            }
                            className="h-9"
                            placeholder="Display name"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">{getInputLabel(link.platform)}</Label>
                        <Input
                          value={rawValue}
                          onChange={(e) =>
                            updateLinkValue(link.id, link.platform, e.target.value)
                          }
                          type={platformConfig.inputType === "email" ? "email" : platformConfig.inputType === "tel" ? "tel" : "text"}
                          className="h-9"
                          placeholder={platformConfig.placeholder}
                        />
                        {helpText && (
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Info className="h-3 w-3 flex-shrink-0" />
                            {helpText}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-1">
                      <Switch
                        checked={link.enabled}
                        onCheckedChange={(v) =>
                          updateLink(link.id, "enabled", v)
                        }
                        aria-label={`Toggle ${link.label}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remove ${link.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>

          {user.links.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Link className="h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                No links yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Add your first social link to get started
              </p>
              <Button onClick={addLink} size="sm" className="mt-4 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
