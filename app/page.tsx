"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  QrCode,
  Share2,
  UserPlus,
  Zap,
  Shield,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingNav } from "@/components/landing-nav"
import { PhoneMockup } from "@/components/phone-mockup"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(221_83%_53%/0.08),transparent_60%)]" />
        <motion.div
          className="relative mx-auto max-w-7xl px-6"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl text-center lg:pt-12 lg:text-left">
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium text-foreground">
                  <Zap className="h-3.5 w-3.5 text-accent" />
                  Made for Myanmar Professionals
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-8 font-display text-5xl font-bold leading-tight tracking-tight text-foreground text-balance lg:text-6xl"
              >
                Your Digital
                <br />
                <span className="text-primary">Business Card</span>
                <br />
                in One Link
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg leading-relaxed text-muted-foreground"
              >
                Create a professional link-in-bio page that works as your
                digital business card. Share your contact info, social links,
                and portfolio with a single tap.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 px-8">
                    Create Your Card
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/bhonepyaesone">
                  <Button size="lg" variant="outline" className="gap-2 px-8 bg-transparent">
                    See Live Demo
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="flex-shrink-0">
              <PhoneMockup />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-secondary/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              Everything you need to network
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Built for Myanmar professionals who want to make lasting
              connections in the digital age.
            </p>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            {[
              {
                icon: UserPlus,
                title: "One-Tap Save Contact",
                description:
                  "Generate vCard files instantly. Your new contacts can save your info to their phone with a single tap.",
              },
              {
                icon: QrCode,
                title: "Branded QR Codes",
                description:
                  "Create custom QR codes with your branding. Perfect for business cards, flyers, and events.",
              },
              {
                icon: Share2,
                title: "Native Sharing",
                description:
                  "Leverage the Web Share API for seamless sharing on any mobile device. WhatsApp, Messenger, and more.",
              },
              {
                icon: Smartphone,
                title: "Mobile-First Design",
                description:
                  "Optimized for the way Myanmar uses the internet. Fast, lightweight, and beautiful on any screen.",
              },
              {
                icon: Zap,
                title: "Real-Time Preview",
                description:
                  "See your changes live as you build. Our visual editor shows exactly how your profile will look.",
              },
              {
                icon: Shield,
                title: "Pro Themes",
                description:
                  "Stand out with glassmorphism, animated gradients, and custom branding colors. Make an impression.",
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl font-bold text-foreground lg:text-4xl"
            >
              Ready to go digital?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-muted-foreground"
            >
              Join thousands of Myanmar professionals already using LinkMe to
              grow their network and make lasting impressions.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 px-10">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                LinkMe
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className="text-sm text-muted-foreground">
                Built for Myanmar. Powered by modern web technology.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Developed by Bhone Pyae Sone
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
