"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, ShieldAlert } from "lucide-react"

export function SystemSettings() {
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")

  useEffect(() => {
    const fetchKeywords = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("reserved_keywords")
        .select("keyword")
        .order("keyword")
      if (data) {
        setKeywords(data.map((d) => d.keyword))
      }
    }
    fetchKeywords()
  }, [])

  const addKeyword = async () => {
    const keyword = newKeyword.trim().toLowerCase()
    if (!keyword || keywords.includes(keyword)) return

    const supabase = createClient()
    const { error } = await supabase
      .from("reserved_keywords")
      .insert({ keyword })

    if (!error) {
      setKeywords((prev) => [...prev, keyword].sort())
      setNewKeyword("")
    }
  }

  const removeKeyword = async (keyword: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("reserved_keywords")
      .delete()
      .eq("keyword", keyword)

    if (!error) {
      setKeywords((prev) => prev.filter((k) => k !== keyword))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Reserved Keywords
          </CardTitle>
          <CardDescription>
            These usernames are blocked to prevent URL squatting and confusion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add a reserved keyword..."
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                className="max-w-sm"
              />
              <Button onClick={addKeyword} size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="gap-1.5 py-1.5 pr-1.5 text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 rounded-full p-0.5 transition-colors hover:bg-foreground/10"
                    aria-label={`Remove ${keyword}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              {keywords.length} keywords reserved. Users cannot register
              usernames that match these terms.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Configuration</CardTitle>
          <CardDescription>
            General platform settings and defaults
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Platform Name</Label>
              <Input value="LinkMe Myanmar" readOnly className="bg-secondary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Default Theme</Label>
              <Input
                value="Minimal Light"
                readOnly
                className="bg-secondary"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Max Links (Free)</Label>
              <Input value="5" readOnly className="bg-secondary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Max Links (Pro)</Label>
              <Input value="Unlimited" readOnly className="bg-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
