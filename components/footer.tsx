"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail, Zap } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-gradient-to-b from-background to-background/80 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl cyber-text">CYBER</span>
                <span className="text-xs -mt-1 text-muted-foreground">NEXUS</span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-4">
              The next generation of online discussions with our immersive, futuristic forum experience.
            </p>
            <div className="flex gap-4">
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 cyber-text">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors cyber-link">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/communities"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Communities
                </Link>
              </li>
              <li>
                <Link
                  href="/topics"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 cyber-text">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors cyber-link">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors cyber-link">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors cyber-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 cyber-text">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-muted-foreground hover:text-foreground transition-colors cyber-link"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary/10 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Cyber Nexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

