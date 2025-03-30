"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, X, Bot, Sparkles, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

// AI responses with typing animation
const AiResponse = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 15) // Typing speed

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return (
    <div>
      {displayedText}
      {currentIndex < text.length && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1"></span>}
    </div>
  )
}

// Sample AI responses
const aiResponses = [
  "Welcome to Cyber Nexus! I'm your AI guide to this digital realm. How can I assist you today?",
  "I can help you navigate through different discussion categories or find specific topics that interest you.",
  "The Tech & AI section is particularly active today with discussions about neural interfaces and quantum computing.",
  "Would you like me to recommend some trending discussions based on your interests?",
  "The cyberpunk aesthetic of our forum is inspired by classic sci-fi works like Neuromancer and Blade Runner.",
  "Our community has members from over 50 countries, all sharing a passion for future technology and digital culture.",
]

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to Cyber Nexus! I'm your AI guide to this digital realm. How can I assist you today?",
      isBot: true,
      isTyping: false,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return

    // Add user message
    const userMessage = { id: messages.length + 1, text: inputValue, isBot: false }
    setMessages([...messages, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response after a short delay
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        isBot: true,
        isTyping: true,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleTypingComplete = () => {
    setIsTyping(false)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isExpanded ? "90vw" : "380px",
              height: isExpanded ? "80vh" : "500px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed z-50 overflow-hidden",
              "bg-background/90 backdrop-blur-lg border border-primary/20",
              "shadow-2xl shadow-primary/10 flex flex-col",
              "cyber-panel rounded-xl",
              isExpanded ? "top-[10vh] left-[5vw]" : "bottom-20 right-6",
            )}
          >
            <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-white" />
                <h3 className="font-medium text-white">Nexus AI Assistant</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 cyber-scrollbar">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.isBot ? "justify-start" : "justify-end")}>
                  <div className={cn("flex gap-2 max-w-[80%]", message.isBot ? "flex-row" : "flex-row-reverse")}>
                    {message.isBot ? (
                      <Avatar className="h-8 w-8 cyber-avatar">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 cyber-avatar">
                        <AvatarFallback className="bg-primary/20">U</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "rounded-lg p-3",
                        message.isBot
                          ? "bg-muted text-foreground cyber-message-bot"
                          : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white cyber-message-user",
                      )}
                    >
                      {message.isBot && message.isTyping ? (
                        <AiResponse text={message.text} onComplete={handleTypingComplete} />
                      ) : (
                        message.text
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-primary/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask anything about Cyber Nexus..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  className="flex-1 bg-muted/50 border-primary/10 focus-visible:ring-primary/30 cyber-input"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isTyping}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 cyber-button"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg cyber-button-circle",
            "bg-gradient-to-r from-cyan-600 to-blue-600",
            "hover:from-cyan-500 hover:to-blue-500",
            "flex items-center justify-center",
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="h-6 w-6" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-3 w-3 text-yellow-300" />
              </motion.div>
            </div>
          )}
        </Button>
      </motion.div>
    </>
  )
}

