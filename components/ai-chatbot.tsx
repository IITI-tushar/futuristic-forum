"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, X, Bot, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const botResponses = [
  "Welcome to Nexus Forum! How can I assist you today?",
  "I can help you find interesting topics to explore.",
  "Would you like me to recommend some trending discussions?",
  "You might enjoy our AI and Technology section based on your interests.",
  "Feel free to ask me anything about the forum features!",
]

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your Nexus AI assistant. How can I help you today?", isBot: true },
  ])
  const [inputValue, setInputValue] = useState("")
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
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = { id: messages.length + 1, text: inputValue, isBot: false }
    setMessages([...messages, userMessage])
    setInputValue("")

    // Simulate bot response after a short delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      const botMessage = { id: messages.length + 2, text: randomResponse, isBot: true }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-20 right-6 w-80 sm:w-96 h-96 rounded-xl overflow-hidden",
              "bg-background/80 backdrop-blur-lg border border-primary/20",
              "shadow-2xl shadow-primary/10 z-50 flex flex-col",
            )}
          >
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-white" />
                <h3 className="font-medium text-white">Nexus AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.isBot ? "justify-start" : "justify-end")}>
                  <div className={cn("flex gap-2 max-w-[80%]", message.isBot ? "flex-row" : "flex-row-reverse")}>
                    {message.isBot ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/20">U</AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "rounded-lg p-3",
                        message.isBot
                          ? "bg-muted text-foreground"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
                      )}
                    >
                      {message.text}
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
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-muted/50 border-primary/10 focus-visible:ring-primary/30"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg",
            "bg-gradient-to-r from-purple-600 to-pink-600",
            "hover:from-purple-500 hover:to-pink-500",
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

