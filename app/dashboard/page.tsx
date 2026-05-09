"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppState } from "@/lib/store"
import { DashboardNav } from "@/components/dashboard-nav"
import { ProfileEditor } from "@/components/profile-editor"
import { LinkManager } from "@/components/link-manager"
import { ThemeSelector } from "@/components/theme-selector"
import { QrCodePanel } from "@/components/qr-code-panel"
import { AnalyticsPanel } from "@/components/analytics-panel"
import { LivePreview } from "@/components/live-preview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Link as LinkIcon,
  Palette,
  QrCode,
  BarChart3,
  Loader2,
  Save,
  Globe,
  GlobeLock,
  Check,
  ExternalLink,
} from "lucide-react"

export default function DashboardPage() {
  const { state, saveProfile, publishProfile } = useAppState()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [publishing, setPublishing] = useState(false)

  if (state.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!state.currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">
          No profile found. Please sign in.
        </p>
      </div>
    )
  }

  const handleSave = async () => {
    const result = await saveProfile()
    if (result.success) {
      toast({
        title: "Saved successfully",
        description: "Your profile changes have been saved.",
      })
    } else {
      toast({
        title: "Save failed",
        description: result.error || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    // Save first, then publish
    const saveResult = await saveProfile()
    if (!saveResult.success) {
      toast({
        title: "Save failed",
        description:
          saveResult.error || "Could not save before publishing. Try again.",
        variant: "destructive",
      })
      setPublishing(false)
      return
    }

    const newPublished = !state.currentUser?.published
    const pubResult = await publishProfile(newPublished)
    setPublishing(false)

    if (pubResult.success) {
      toast({
        title: newPublished ? "Profile published!" : "Profile unpublished",
        description: newPublished
          ? `Your profile is now live at /${state.currentUser?.username}`
          : "Your profile is no longer visible to the public.",
      })
    } else {
      toast({
        title: "Publish failed",
        description: pubResult.error || "Something went wrong.",
        variant: "destructive",
      })
    }
  }

  const isPublished = state.currentUser.published

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Editor Panel */}
          <div className="min-w-0 flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    Profile Builder
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Customize your digital business card
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Publish Status Badge */}
                  {isPublished ? (
                    <Badge
                      variant="secondary"
                      className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                    >
                      <Check className="h-3 w-3" />
                      Live
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <GlobeLock className="h-3 w-3" />
                      Draft
                    </Badge>
                  )}

                  {/* View Public Profile Link */}
                  {isPublished && state.currentUser.username && (
                    <a
                      href={`/${state.currentUser.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  )}

                  {/* Save Button */}
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    disabled={state.saving}
                    className="gap-1.5 bg-transparent"
                  >
                    {state.saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {state.saving ? "Saving..." : "Save"}
                  </Button>

                  {/* Publish / Unpublish Button */}
                  <Button
                    onClick={handlePublish}
                    disabled={publishing || state.saving}
                    className={
                      isPublished
                        ? "gap-1.5 bg-amber-600 text-white hover:bg-amber-700"
                        : "gap-1.5"
                    }
                  >
                    {publishing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isPublished ? (
                      <GlobeLock className="h-4 w-4" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    {publishing
                      ? "Publishing..."
                      : isPublished
                        ? "Unpublish"
                        : "Publish"}
                  </Button>
                </div>
              </div>
            </motion.div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-6"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger
                  value="profile"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="links"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Links</span>
                </TabsTrigger>
                <TabsTrigger
                  value="theme"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <Palette className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Theme</span>
                </TabsTrigger>
                <TabsTrigger
                  value="qr"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">QR</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="profile" className="mt-6">
                    <ProfileEditor />
                  </TabsContent>
                  <TabsContent value="links" className="mt-6">
                    <LinkManager />
                  </TabsContent>
                  <TabsContent value="theme" className="mt-6">
                    <ThemeSelector />
                  </TabsContent>
                  <TabsContent value="qr" className="mt-6">
                    <QrCodePanel />
                  </TabsContent>
                  <TabsContent value="analytics" className="mt-6">
                    <AnalyticsPanel />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="hidden lg:block lg:w-[360px] lg:flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="mb-4 text-sm font-medium text-muted-foreground">
                Live Preview
              </h2>
              <LivePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
