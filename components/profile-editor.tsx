"use client"

import React from "react"

import { useState, useRef } from "react"
import { useAppState } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"

export function ProfileEditor() {
  const { state, setState } = useAppState()
  const user = state.currentUser
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  if (!user) return null

  const updateField = (field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      currentUser: prev.currentUser
        ? { ...prev.currentUser, [field]: value }
        : null,
    }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        updateField("avatar_url", data.url)
      }
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?"

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Photo</CardTitle>
          <CardDescription>
            Upload a photo for your public profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {user.avatar_url && (
                  <AvatarImage
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.full_name}
                  />
                )}
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarUpload}
                className="hidden"
                aria-label="Upload profile photo"
              />
              <Button
                type="button"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-2 border-background shadow-sm"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {user.full_name || "Your Name"}
              </p>
              <p className="text-xs text-muted-foreground">
                linkme.app/{user.username || "username"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                JPEG, PNG, WebP or GIF. Max 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>
            Your name, title, and bio shown on your card
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={user.full_name || ""}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={user.username || ""}
                onChange={(e) =>
                  updateField(
                    "username",
                    e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                  )
                }
                placeholder="username"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={user.job_title || ""}
                onChange={(e) => updateField("job_title", e.target.value)}
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={user.organization || ""}
                onChange={(e) => updateField("organization", e.target.value)}
                placeholder="e.g. Company Name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={user.bio || ""}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Write a short bio..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Details</CardTitle>
          <CardDescription>
            Used for vCard generation and direct contact
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={user.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+959 xxx xxx xxx"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={user.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://your-site.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={user.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Yangon, Myanmar"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
