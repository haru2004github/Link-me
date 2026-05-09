"use client"

import {
  Linkedin,
  Facebook,
  Github,
  MessageSquare,
  Send,
  Globe,
  UserPlus,
  Share2,
} from "lucide-react"

const demoLinks = [
  { icon: Linkedin, label: "LinkedIn", color: "#0077b5" },
  { icon: Facebook, label: "Facebook", color: "#1877f2" },
  { icon: Github, label: "GitHub", color: "#333" },
  { icon: MessageSquare, label: "WhatsApp", color: "#25d366" },
  { icon: Send, label: "Telegram", color: "#0088cc" },
  { icon: Globe, label: "Portfolio", color: "#3b82f6" },
]

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px]">
      {/* Phone Frame */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/90 bg-card shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        {/* Screen Content */}
        <div className="relative min-h-[520px] bg-card px-5 pt-10 pb-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center pt-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              BP
            </div>
            <h3 className="mt-3 text-base font-bold text-card-foreground">
              Bhone Pyae Sone
            </h3>
            <p className="text-xs text-muted-foreground">
              Senior Software Engineer
            </p>
            <p className="text-xs text-muted-foreground">
              Myanmar Digital Solutions
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-medium text-primary-foreground"
            >
              <UserPlus className="h-3 w-3" />
              Save Contact
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-card-foreground"
            >
              <Share2 className="h-3 w-3" />
              Share
            </button>
          </div>

          {/* Links */}
          <div className="mt-4 flex flex-col gap-2">
            {demoLinks.map((link) => (
              <div
                key={link.label}
                className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-4 py-2.5 transition-colors"
              >
                <link.icon
                  className="h-4 w-4"
                  style={{ color: link.color }}
                />
                <span className="text-sm font-medium text-card-foreground">
                  {link.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating decorations */}
      <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/10 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-accent/10 blur-xl" />
    </div>
  )
}
