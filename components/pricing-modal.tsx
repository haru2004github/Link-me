"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Check,
  X,
  Crown,
  Palette,
  BarChart3,
  Link,
  UserPlus,
  QrCode,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  highlightFeature?: string
}

const FREE_FEATURES = [
  { label: "Up to 5 links", included: true, icon: Link },
  { label: "3 free themes", included: true, icon: Palette },
  { label: "Basic QR code", included: true, icon: QrCode },
  { label: "Profile page", included: true, icon: Zap },
  { label: "Save Contact button", included: false, icon: UserPlus },
  { label: "Click analytics", included: false, icon: BarChart3 },
  { label: "Premium themes", included: false, icon: Crown },
  { label: "Remove branding", included: false, icon: X },
]

const PRO_FEATURES = [
  { label: "Unlimited links", included: true, icon: Link },
  { label: "All 17+ themes", included: true, icon: Palette },
  { label: "Branded QR with logo", included: true, icon: QrCode },
  { label: "Profile page", included: true, icon: Zap },
  { label: "Save Contact button", included: true, icon: UserPlus },
  { label: "Full click analytics", included: true, icon: BarChart3 },
  { label: "All premium themes", included: true, icon: Crown },
  { label: "Remove branding footer", included: true, icon: Check },
]

export function PricingModal({
  open,
  onOpenChange,
  highlightFeature,
}: PricingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-center">
            Unlock all features and take your digital presence to the next level
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-xl border border-border p-5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">Free</h3>
              <Badge variant="secondary" className="text-[10px]">
                Current
              </Badge>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">
              $0
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Get started with the basics
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {FREE_FEATURES.map((feature) => (
                <div
                  key={feature.label}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    !feature.included && "opacity-50"
                  )}
                >
                  {feature.included ? (
                    <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <X className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "text-foreground",
                      !feature.included && "line-through",
                      highlightFeature &&
                        feature.label
                          .toLowerCase()
                          .includes(highlightFeature.toLowerCase()) &&
                        "font-semibold text-destructive"
                    )}
                  >
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-xl border-2 border-primary bg-primary/5 p-5">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="gap-1 bg-primary text-primary-foreground">
                <Crown className="h-3 w-3" />
                Recommended
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">Pro</h3>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">
              $4.99
              <span className="text-sm font-normal text-muted-foreground">
                /month
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Everything you need to stand out
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {PRO_FEATURES.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                  <span
                    className={cn(
                      "text-foreground",
                      highlightFeature &&
                        feature.label
                          .toLowerCase()
                          .includes(highlightFeature.toLowerCase()) &&
                        "font-semibold text-primary"
                    )}
                  >
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
            <Button className="mt-5 w-full gap-1.5">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Contact admin to upgrade your account. Developed by Bhone Pyae Sone.
        </p>
      </DialogContent>
    </Dialog>
  )
}
