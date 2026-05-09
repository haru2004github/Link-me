"use client"

import React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { downloadVCard } from "@/lib/vcard"
import { THEME_CONFIGS, type UserProfile } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  UserPlus,
  Share2,
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
  Link as LinkIcon,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react"
import Link from "next/link"

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Linkedin, Facebook, MessageCircle, MessageSquare, Instagram, Twitter,
  Music, Youtube, Github, Send, Globe, Mail, Phone, PhoneCall, Link: LinkIcon,
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
}

export function PublicProfile({ username }: { username: string }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saveClicked, setSaveClicked] = useState(false)
  const [shareClicked, setShareClicked] = useState(false)
  const visitTracked = useRef(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${username}`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
          if (!visitTracked.current) {
            visitTracked.current = true
            fetch("/api/analytics/visit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ profile_id: data.id }),
            }).catch(() => {})
          }
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  const handleLinkClick = useCallback(
    (linkId: string) => {
      if (!user) return
      fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link_id: linkId, profile_id: user.id }),
      }).catch(() => {})
    },
    [user]
  )

  const handleSaveContact = useCallback(() => {
    if (!user) return
    downloadVCard(user)
    setSaveClicked(true)
    setTimeout(() => setSaveClicked(false), 2000)
  }, [user])

  const handleShare = useCallback(async () => {
    if (!user) return
    const profileUrl = `${window.location.origin}/${user.username}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.full_name} - Digital Business Card`,
          text: `Check out ${user.full_name}'s digital business card`,
          url: profileUrl,
        })
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(profileUrl)
      setShareClicked(true)
      setTimeout(() => setShareClicked(false), 2000)
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (notFound || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <LinkIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Profile not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            {"The username \""}{username}{"\" doesn't exist or is not published yet."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </motion.div>
      </div>
    )
  }

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
  const themeConfig =
    THEME_CONFIGS.find((t) => t.id === user.theme) || THEME_CONFIGS[0]
  const t = themeConfig.colors

  return (
    <div
      className={cn("flex min-h-screen flex-col items-center", t.bg)}
      style={
        user.theme === "custom"
          ? { backgroundColor: user.custom_color || "#3b82f6" }
          : undefined
      }
    >
      {/* Main content area */}
      <div className="flex w-full max-w-[480px] flex-1 flex-col px-6 py-10">
        <motion.div
          className="flex flex-col items-center"
          initial="hidden"
          animate="visible"
        >
          {/* Avatar */}
          <motion.div custom={0} variants={fadeUp}>
            <Avatar className={cn("h-28 w-28 shadow-xl ring-4 ring-white/20 sm:h-32 sm:w-32", t.avatarBg)}>
              {user.avatar_url && (
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} crossOrigin="anonymous" />
              )}
              <AvatarFallback className={cn("text-3xl font-bold sm:text-4xl", t.avatarBg)}>
                {initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Name */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            className={cn("mt-5 text-center text-2xl font-bold tracking-tight sm:text-3xl", t.text)}
          >
            {user.full_name}
          </motion.h1>

          {/* Title */}
          {user.job_title && (
            <motion.p
              custom={2}
              variants={fadeUp}
              className={cn("mt-1.5 text-center text-sm sm:text-base", t.subtext)}
            >
              {user.job_title}
              {user.organization && ` at ${user.organization}`}
            </motion.p>
          )}

          {!user.job_title && user.organization && (
            <motion.p
              custom={2}
              variants={fadeUp}
              className={cn("text-center text-sm sm:text-base", t.subtext)}
            >
              {user.organization}
            </motion.p>
          )}

          {/* Bio */}
          {user.bio && (
            <motion.p
              custom={3}
              variants={fadeUp}
              className={cn(
                "mt-3 max-w-sm text-center text-sm leading-relaxed sm:text-base",
                t.subtext
              )}
            >
              {user.bio}
            </motion.p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 flex gap-3"
        >
          {isPro && (
            <button
              type="button"
              onClick={handleSaveContact}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all active:scale-95 sm:py-4",
                t.btnBg
              )}
            >
              {saveClicked ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {saveClicked ? "Saved!" : "Save Contact"}
            </button>
          )}
          <button
            type="button"
            onClick={handleShare}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-semibold transition-all active:scale-95 sm:py-4",
              t.btnOutline
            )}
          >
            {shareClicked ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {shareClicked ? "Copied!" : "Share"}
          </button>
        </motion.div>

        {/* Links */}
        <div className="mt-6 flex flex-col gap-3">
          {enabledLinks.map((link, index) => {
            const IconComponent = iconMap[link.icon] || LinkIcon
            const color = platformColors[link.platform] || "#6b7280"
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target={link.url.startsWith("mailto:") || link.url.startsWith("tel:") ? "_self" : "_blank"}
                rel="noopener noreferrer"
                custom={index + 5}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileTap={{ scale: 0.97 }}
                onClick={() => handleLinkClick(link.id)}
                className={cn(
                  "flex items-center gap-4 rounded-xl border px-5 py-4 transition-all sm:px-6 sm:py-5",
                  t.linkBg
                )}
              >
                <IconComponent
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color }}
                />
                <span className={cn("flex-1 text-sm font-medium sm:text-base", t.linkText)}>
                  {link.label}
                </span>
                <svg className={cn("h-4 w-4 opacity-40", t.linkText)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.a>
            )
          })}
        </div>

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Footer - always at bottom */}
        <motion.div
          custom={enabledLinks.length + 6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center gap-1 pb-4"
        >
          {!isPro && (
            <Link
              href="/"
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium opacity-50 transition-opacity hover:opacity-80",
                t.subtext
              )}
            >
              Powered by LinkMe
            </Link>
          )}
          <span className={cn("text-[10px] opacity-30", t.subtext)}>
            Developed by Bhone Pyae Sone
          </span>
        </motion.div>
      </div>
    </div>
  )
}
