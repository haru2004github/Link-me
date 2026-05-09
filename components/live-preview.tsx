"use client"

import React from "react"
import { useAppState } from "@/lib/store"
import { THEME_CONFIGS } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  UserPlus,
  Share2,
  MessageSquare,
  Linkedin,
  Facebook,
  MessageCircle,
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
} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Linkedin, Facebook, MessageCircle, MessageSquare, Instagram, Twitter,
  Music, Youtube, Github, Send, Globe, Mail, Phone, PhoneCall, Link,
}

const platformColors: Record<string, string> = {
  linkedin: "#0077b5",
  facebook: "#1877f2",
  messenger: "#0084ff",
  whatsapp: "#25d366",
  instagram: "#e4405f",
  twitter: "#1da1f2",
  tiktok: "#000000",
  youtube: "#ff0000",
  github: "#333333",
  telegram: "#0088cc",
  website: "#3b82f6",
  email: "#ea4335",
  phone: "#34a853",
  viber: "#7360f2",
  custom: "#6b7280",
}

export function LivePreview() {
  const { state } = useAppState()
  const user = state.currentUser
  if (!user) return null

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?"

  const enabledLinks = user.links.filter((l) => l.enabled)
  const isPro = user.role === "pro" || user.role === "admin"
  const themeConfig = THEME_CONFIGS.find((t) => t.id === user.theme) || THEME_CONFIGS[0]
  const t = themeConfig.colors

  return (
    <div className="relative mx-auto w-[320px]">
      {/* iPhone Frame */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/90 shadow-2xl">
        <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        <div
          className={cn("min-h-[580px] overflow-y-auto px-5 pt-10 pb-6", t.bg)}
          style={
            user.theme === "custom"
              ? { backgroundColor: user.custom_color || "#3b82f6" }
              : undefined
          }
        >
          <div className="flex flex-col items-center pt-4">
            <Avatar className={cn("h-20 w-20 shadow-lg ring-2 ring-white/20", t.avatarBg)}>
              {user.avatar_url && (
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
              )}
              <AvatarFallback className={cn("text-2xl font-bold", t.avatarBg)}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <h3 className={cn("mt-3 text-center text-base font-bold", t.text)}>
              {user.full_name || "Your Name"}
            </h3>
            {user.job_title && (
              <p className={cn("mt-0.5 text-center text-xs", t.subtext)}>
                {user.job_title}
                {user.organization && ` at ${user.organization}`}
              </p>
            )}
            {!user.job_title && user.organization && (
              <p className={cn("text-center text-xs", t.subtext)}>
                {user.organization}
              </p>
            )}
            {user.bio && (
              <p className={cn("mt-2 line-clamp-2 text-center text-xs leading-relaxed", t.subtext)}>
                {user.bio}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <div className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold", t.btnBg)}>
              <UserPlus className="h-3 w-3" />
              Save Contact
            </div>
            <div className={cn("flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold", t.btnOutline)}>
              <Share2 className="h-3 w-3" />
              Share
            </div>
          </div>

          {isPro && user.phone && (
            <div className={cn("mt-2 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold", t.whatsapp)}>
              <MessageSquare className="h-3 w-3" />
              Direct WhatsApp
            </div>
          )}

          {/* Links */}
          <div className="mt-4 flex flex-col gap-2">
            {enabledLinks.map((link) => {
              const IconComponent = iconMap[link.icon] || Link
              const color = platformColors[link.platform] || "#6b7280"
              return (
                <div
                  key={link.id}
                  className={cn("flex items-center gap-3 rounded-xl border px-4 py-2.5", t.linkBg)}
                >
                  <IconComponent className="h-4 w-4 flex-shrink-0" style={{ color }} />
                  <span className={cn("flex-1 text-xs font-medium", t.linkText)}>
                    {link.label}
                  </span>
                  <svg className={cn("h-3 w-3 opacity-40", t.linkText)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )
            })}
          </div>

          {enabledLinks.length === 0 && (
            <div className="mt-8 flex flex-col items-center gap-2">
              <Link className={cn("h-8 w-8 opacity-30", t.text)} />
              <p className={cn("text-xs opacity-50", t.text)}>
                No links added yet
              </p>
            </div>
          )}

          {/* Footer - hidden for Pro/Admin */}
          {!isPro && (
            <div className="mt-6 text-center">
              <span className={cn("text-[10px] font-medium opacity-40", t.subtext)}>
                Powered by LinkMe
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
