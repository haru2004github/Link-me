import React from "react"
export type UserRole = "admin" | "pro" | "free"

export type ThemeId =
  | "minimal-light"
  | "minimal-dark"
  | "glassmorphism"
  | "gradient"
  | "ocean-breeze"
  | "sunset-glow"
  | "forest-deep"
  | "neon-nights"
  | "sakura"
  | "royal-gold"
  | "arctic-frost"
  | "midnight-indigo"
  | "coral-reef"
  | "lavender-dream"
  | "monochrome"
  | "custom"

export interface SocialLink {
  id: string
  platform: string
  label: string
  url: string
  icon: string
  enabled: boolean
  sort_order?: number
}

export interface UserProfile {
  id: string
  username: string
  full_name: string
  job_title: string
  organization: string
  bio: string
  avatar_url: string
  phone: string
  email: string
  website: string
  location: string
  role: UserRole
  theme: ThemeId
  custom_color: string
  published: boolean
  links: SocialLink[]
  created_at: string
  profile_views: number
  contact_saves: number
  is_admin?: boolean
}

export const RESERVED_KEYWORDS = [
  "admin",
  "settings",
  "help",
  "dashboard",
  "login",
  "signup",
  "api",
  "profile",
  "about",
  "auth",
]

export const PLATFORM_OPTIONS = [
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin", inputType: "url", placeholder: "https://linkedin.com/in/username", prefix: "" },
  { value: "facebook", label: "Facebook", icon: "Facebook", inputType: "url", placeholder: "https://facebook.com/username", prefix: "" },
  { value: "messenger", label: "Messenger", icon: "MessageCircle", inputType: "text", placeholder: "username", prefix: "https://m.me/" },
  { value: "whatsapp", label: "WhatsApp", icon: "MessageSquare", inputType: "tel", placeholder: "+959 xxx xxx xxx", prefix: "https://wa.me/" },
  { value: "instagram", label: "Instagram", icon: "Instagram", inputType: "text", placeholder: "username (without @)", prefix: "https://instagram.com/" },
  { value: "twitter", label: "X / Twitter", icon: "Twitter", inputType: "text", placeholder: "username (without @)", prefix: "https://x.com/" },
  { value: "tiktok", label: "TikTok", icon: "Music", inputType: "text", placeholder: "username (without @)", prefix: "https://tiktok.com/@" },
  { value: "youtube", label: "YouTube", icon: "Youtube", inputType: "url", placeholder: "https://youtube.com/@channel", prefix: "" },
  { value: "github", label: "GitHub", icon: "Github", inputType: "text", placeholder: "username", prefix: "https://github.com/" },
  { value: "telegram", label: "Telegram", icon: "Send", inputType: "text", placeholder: "username (without @)", prefix: "https://t.me/" },
  { value: "website", label: "Website", icon: "Globe", inputType: "url", placeholder: "https://your-site.com", prefix: "" },
  { value: "email", label: "Email", icon: "Mail", inputType: "email", placeholder: "example@gmail.com", prefix: "mailto:" },
  { value: "phone", label: "Phone", icon: "Phone", inputType: "tel", placeholder: "+959 xxx xxx xxx", prefix: "tel:" },
  { value: "viber", label: "Viber", icon: "PhoneCall", inputType: "tel", placeholder: "+959 xxx xxx xxx", prefix: "viber://chat?number=" },
  { value: "custom", label: "Custom Link", icon: "Link", inputType: "url", placeholder: "https://...", prefix: "" },
] as const

export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  preview: string
  pro: boolean
  category: "light" | "dark" | "gradient" | "premium"
  colors: {
    bg: string
    card: string
    text: string
    subtext: string
    linkBg: string
    linkText: string
    btnBg: string
    btnOutline: string
    whatsapp: string
    avatarBg: string
  }
  bgStyle?: React.CSSProperties
}

export const THEME_CONFIGS: ThemeConfig[] = [
  // === LIGHT THEMES ===
  {
    id: "minimal-light",
    name: "Minimal Light",
    description: "Clean white background with subtle borders",
    preview: "bg-gray-50 border border-gray-200",
    pro: false,
    category: "light",
    colors: {
      bg: "bg-gray-50",
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      subtext: "text-gray-500",
      linkBg: "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300",
      linkText: "text-gray-800",
      btnBg: "bg-gray-900 text-white hover:bg-gray-800",
      btnOutline: "border-gray-300 text-gray-700 hover:bg-gray-100",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-white text-gray-700 border border-gray-200",
    },
  },
  {
    id: "sakura",
    name: "Sakura",
    description: "Soft pink Japanese cherry blossom",
    preview: "bg-gradient-to-br from-pink-100 to-rose-200",
    pro: false,
    category: "light",
    colors: {
      bg: "bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100",
      card: "bg-white/80 border-pink-200/60",
      text: "text-rose-900",
      subtext: "text-rose-600/70",
      linkBg: "bg-white/70 border-pink-200/50 hover:bg-white/90 hover:border-pink-300",
      linkText: "text-rose-800",
      btnBg: "bg-rose-500 text-white hover:bg-rose-600",
      btnOutline: "border-rose-300 text-rose-600 hover:bg-rose-50",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-rose-100 text-rose-700 border border-rose-200",
    },
  },
  {
    id: "arctic-frost",
    name: "Arctic Frost",
    description: "Cool icy blue light theme",
    preview: "bg-gradient-to-br from-sky-50 to-blue-100",
    pro: false,
    category: "light",
    colors: {
      bg: "bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50",
      card: "bg-white/80 border-sky-200/50",
      text: "text-sky-950",
      subtext: "text-sky-700/70",
      linkBg: "bg-white/70 border-sky-200/50 hover:bg-white/90 hover:border-sky-300",
      linkText: "text-sky-900",
      btnBg: "bg-sky-600 text-white hover:bg-sky-700",
      btnOutline: "border-sky-300 text-sky-700 hover:bg-sky-50",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-sky-100 text-sky-700 border border-sky-200",
    },
  },
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    description: "Gentle purple pastel aesthetic",
    preview: "bg-gradient-to-br from-violet-50 to-purple-100",
    pro: true,
    category: "light",
    colors: {
      bg: "bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50",
      card: "bg-white/80 border-violet-200/50",
      text: "text-violet-950",
      subtext: "text-violet-600/70",
      linkBg: "bg-white/70 border-violet-200/50 hover:bg-white/90 hover:border-violet-300",
      linkText: "text-violet-900",
      btnBg: "bg-violet-600 text-white hover:bg-violet-700",
      btnOutline: "border-violet-300 text-violet-700 hover:bg-violet-50",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-violet-100 text-violet-700 border border-violet-200",
    },
  },
  // === DARK THEMES ===
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description: "Elegant dark with light text",
    preview: "bg-gray-900 border border-gray-700",
    pro: false,
    category: "dark",
    colors: {
      bg: "bg-gray-950",
      card: "bg-gray-900 border-gray-800",
      text: "text-gray-100",
      subtext: "text-gray-400",
      linkBg: "bg-gray-900 border-gray-800 hover:bg-gray-800/80",
      linkText: "text-gray-200",
      btnBg: "bg-white text-gray-950 hover:bg-gray-100",
      btnOutline: "border-gray-700 text-gray-300 hover:bg-gray-800",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-gray-800 text-gray-200",
    },
  },
  {
    id: "neon-nights",
    name: "Neon Nights",
    description: "Electric dark with neon cyan accents",
    preview: "bg-gray-950 border-2 border-cyan-400",
    pro: true,
    category: "dark",
    colors: {
      bg: "bg-gray-950",
      card: "bg-gray-900/80 border-cyan-500/30",
      text: "text-cyan-50",
      subtext: "text-cyan-200/60",
      linkBg: "bg-gray-900/60 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-gray-800/60",
      linkText: "text-cyan-100",
      btnBg: "bg-cyan-500 text-gray-950 hover:bg-cyan-400",
      btnOutline: "border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300",
    },
  },
  {
    id: "midnight-indigo",
    name: "Midnight Indigo",
    description: "Deep indigo dark with warm accents",
    preview: "bg-indigo-950 border border-indigo-700",
    pro: true,
    category: "dark",
    colors: {
      bg: "bg-indigo-950",
      card: "bg-indigo-900/60 border-indigo-700/40",
      text: "text-indigo-50",
      subtext: "text-indigo-300/70",
      linkBg: "bg-indigo-900/50 border-indigo-700/30 hover:bg-indigo-800/60 hover:border-indigo-600/50",
      linkText: "text-indigo-100",
      btnBg: "bg-amber-500 text-indigo-950 hover:bg-amber-400",
      btnOutline: "border-indigo-500/40 text-indigo-200 hover:bg-indigo-800/40",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-indigo-800/60 text-indigo-200 border border-indigo-700/40",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Stylish black & white contrast",
    preview: "bg-neutral-950 border border-neutral-600",
    pro: false,
    category: "dark",
    colors: {
      bg: "bg-neutral-950",
      card: "bg-neutral-900 border-neutral-700",
      text: "text-neutral-50",
      subtext: "text-neutral-400",
      linkBg: "bg-neutral-900 border-neutral-700 hover:bg-neutral-800",
      linkText: "text-neutral-100",
      btnBg: "bg-neutral-50 text-neutral-950 hover:bg-neutral-200",
      btnOutline: "border-neutral-600 text-neutral-300 hover:bg-neutral-800",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-neutral-800 text-neutral-200 border border-neutral-700",
    },
  },
  // === GRADIENT THEMES ===
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass with blur backdrop",
    preview: "bg-blue-500/30 border border-white/30 backdrop-blur",
    pro: true,
    category: "gradient",
    colors: {
      bg: "bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400",
      card: "bg-white/10 backdrop-blur-xl border-white/20",
      text: "text-white",
      subtext: "text-white/75",
      linkBg: "bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20",
      linkText: "text-white",
      btnBg: "bg-white/90 text-blue-700 hover:bg-white",
      btnOutline: "border-white/30 text-white hover:bg-white/10",
      whatsapp: "bg-[#25d366]/90 text-white hover:bg-[#25d366]",
      avatarBg: "bg-white/20 backdrop-blur text-white",
    },
  },
  {
    id: "gradient",
    name: "Emerald Gradient",
    description: "Dynamic emerald-teal gradient",
    preview: "bg-gradient-to-br from-emerald-500 to-teal-500",
    pro: true,
    category: "gradient",
    colors: {
      bg: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
      card: "bg-white/15 backdrop-blur border-white/20",
      text: "text-white",
      subtext: "text-white/80",
      linkBg: "bg-white/15 backdrop-blur border-white/20 hover:bg-white/25",
      linkText: "text-white",
      btnBg: "bg-white text-emerald-700 hover:bg-white/90",
      btnOutline: "border-white/30 text-white hover:bg-white/10",
      whatsapp: "bg-white/20 text-white hover:bg-white/30",
      avatarBg: "bg-white/20 backdrop-blur text-white",
    },
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Deep blue to cyan tones",
    preview: "bg-gradient-to-br from-blue-800 to-cyan-600",
    pro: true,
    category: "gradient",
    colors: {
      bg: "bg-gradient-to-br from-blue-900 via-blue-700 to-cyan-600",
      card: "bg-white/10 backdrop-blur border-white/15",
      text: "text-white",
      subtext: "text-cyan-100/80",
      linkBg: "bg-white/10 backdrop-blur border-white/15 hover:bg-white/20",
      linkText: "text-white",
      btnBg: "bg-cyan-400 text-blue-900 hover:bg-cyan-300",
      btnOutline: "border-cyan-300/40 text-cyan-100 hover:bg-white/10",
      whatsapp: "bg-[#25d366]/90 text-white hover:bg-[#25d366]",
      avatarBg: "bg-cyan-400/20 backdrop-blur text-white",
    },
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    description: "Warm orange to rose gradient",
    preview: "bg-gradient-to-br from-orange-500 to-rose-500",
    pro: true,
    category: "gradient",
    colors: {
      bg: "bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600",
      card: "bg-white/15 backdrop-blur border-white/20",
      text: "text-white",
      subtext: "text-orange-100/80",
      linkBg: "bg-white/15 backdrop-blur border-white/20 hover:bg-white/25",
      linkText: "text-white",
      btnBg: "bg-white text-rose-600 hover:bg-white/90",
      btnOutline: "border-white/30 text-white hover:bg-white/10",
      whatsapp: "bg-[#25d366]/90 text-white hover:bg-[#25d366]",
      avatarBg: "bg-white/20 backdrop-blur text-white",
    },
  },
  {
    id: "forest-deep",
    name: "Forest Deep",
    description: "Rich green woodland aesthetic",
    preview: "bg-gradient-to-br from-green-900 to-emerald-700",
    pro: true,
    category: "gradient",
    colors: {
      bg: "bg-gradient-to-br from-green-900 via-emerald-800 to-teal-800",
      card: "bg-white/10 backdrop-blur border-white/15",
      text: "text-white",
      subtext: "text-emerald-200/80",
      linkBg: "bg-white/10 backdrop-blur border-white/15 hover:bg-white/20",
      linkText: "text-white",
      btnBg: "bg-emerald-400 text-green-900 hover:bg-emerald-300",
      btnOutline: "border-emerald-400/40 text-emerald-200 hover:bg-white/10",
      whatsapp: "bg-[#25d366]/90 text-white hover:bg-[#25d366]",
      avatarBg: "bg-emerald-400/20 backdrop-blur text-white",
    },
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    description: "Vibrant coral to warm pink",
    preview: "bg-gradient-to-br from-red-400 to-pink-500",
    pro: true,
    category: "gradient",
    colors: {
      bg: "bg-gradient-to-br from-red-400 via-pink-500 to-rose-500",
      card: "bg-white/15 backdrop-blur border-white/20",
      text: "text-white",
      subtext: "text-rose-100/80",
      linkBg: "bg-white/15 backdrop-blur border-white/20 hover:bg-white/25",
      linkText: "text-white",
      btnBg: "bg-white text-rose-600 hover:bg-white/90",
      btnOutline: "border-white/30 text-white hover:bg-white/10",
      whatsapp: "bg-[#25d366]/90 text-white hover:bg-[#25d366]",
      avatarBg: "bg-white/20 backdrop-blur text-white",
    },
  },
  // === PREMIUM ===
  {
    id: "royal-gold",
    name: "Royal Gold",
    description: "Luxury dark with gold accents",
    preview: "bg-gray-950 border-2 border-amber-500",
    pro: true,
    category: "premium",
    colors: {
      bg: "bg-gray-950",
      card: "bg-gray-900/80 border-amber-500/20",
      text: "text-amber-50",
      subtext: "text-amber-200/60",
      linkBg: "bg-gray-900/60 border-amber-500/15 hover:border-amber-400/40 hover:bg-gray-800/60",
      linkText: "text-amber-100",
      btnBg: "bg-amber-500 text-gray-950 hover:bg-amber-400",
      btnOutline: "border-amber-500/40 text-amber-300 hover:bg-amber-500/10",
      whatsapp: "bg-[#25d366] text-white hover:bg-[#22c55e]",
      avatarBg: "bg-amber-500/10 border border-amber-500/30 text-amber-300",
    },
  },
  {
    id: "custom",
    name: "Custom Brand",
    description: "Use your brand color as accent",
    preview: "bg-blue-600 border-2 border-blue-400",
    pro: true,
    category: "premium",
    colors: {
      bg: "",
      card: "bg-white/10 backdrop-blur border-white/20",
      text: "text-white",
      subtext: "text-white/80",
      linkBg: "bg-white/15 backdrop-blur border-white/20 hover:bg-white/25",
      linkText: "text-white",
      btnBg: "bg-white/90 text-gray-900 hover:bg-white",
      btnOutline: "border-white/30 text-white hover:bg-white/10",
      whatsapp: "bg-[#25d366]/90 text-white hover:bg-[#25d366]",
      avatarBg: "bg-white/20 backdrop-blur text-white",
    },
  },
]
