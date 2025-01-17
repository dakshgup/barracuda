'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AIReaction from './components/AIReaction'
import { generateAIResponse } from './actions/generateAIResponse'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon } from '@radix-ui/react-icons'

const questions = [
  { id: 'name', question: "What's your name?", type: 'input' },
  { id: 'company', question: "What company do you work for?", type: 'input' },
  { id: 'role', question: "What's your role at the company?", type: 'input' },
  { id: 'teamSize', question: "How many people are on your team?", type: 'input' },
  { id: 'useCase', question: "What problem are you trying to solve with our product?", type: 'textarea' },
  { id: 'goals', question: "What are your main goals for using our platform?", type: 'textarea' },
  { id: 'integration', question: "What tools does your team currently use that you'd like to integrate with?", type: 'textarea' },
  { id: 'timeline', question: "When are you looking to get started?", type: 'input' },
  { id: 'features', question: "Which features are most important to you?", type: 'textarea' },
]

export default function OnboardingForm() {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [aiResponse, setAIResponse] = useState<{ text: string; audioBase64: string } | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [direction, setDirection] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showLady, setShowLady] = useState(false)
  const [currentInput, setCurrentInput] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const answer = formData.get(questions[currentStep].id) as string
    
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: answer }))
    setIsTyping(true)

    const response = await generateAIResponse(questions[currentStep].question, answer)
    setAIResponse(response)
    setIsTyping(false)
    
    setTimeout(() => setShowLady(true), 100)
  }

  const handleNext = () => {
    setShowLady(false)
    if (currentStep < questions.length - 1) {
      setDirection(1)
      setCurrentStep(prev => prev + 1)
      setAIResponse(null)
      setCurrentInput('')
      setIsTyping(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && aiResponse) {
      handleNext()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const renderSummary = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Summary of Your Responses</h2>
        {questions.map((q) => (
          <div key={q.id} className="border-b pb-4">
            <p className="font-semibold">{q.question}</p>
            <p className="mt-2">{answers[q.id]}</p>
          </div>
        ))}
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center space-y-8 max-w-lg px-4">
          <h1 className="text-5xl font-bold tracking-tight font-mono">
            Enterprise Interest Form
          </h1>
          <div className="relative">
            <div className="absolute -inset-1 bg-gray-200 rounded-lg blur opacity-25"></div>
            <img 
              src="/v0.png" 
              alt="Enterprise Logo" 
              className="relative w-72 h-auto mx-auto drop-shadow-xl"
            />
          </div>
          <Button 
            onClick={() => setStarted(true)}
            size="lg"
            className="mt-12 bg-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-lg"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 overflow-hidden relative pt-16">
      {!isTyping && aiResponse && (
        <Button 
          onClick={handleNext}
          variant="outline"
          className="fixed top-4 right-4 z-50"
        >
          Next →
        </Button>
      )}
      
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          {!isComplete ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold mb-4">{questions[currentStep].question}</h2>
                  {questions[currentStep].type === 'input' ? (
                    <Input 
                      name={questions[currentStep].id} 
                      className="mb-4" 
                      required 
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                    />
                  ) : (
                    <Textarea 
                      name={questions[currentStep].id} 
                      className="mb-4" 
                      required 
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                    />
                  )}
                  <Button type="submit">Submit</Button>
                </form>
                
                <AIReaction response={aiResponse} isTyping={isTyping} />
              </motion.div>
            </AnimatePresence>
          ) : (
            renderSummary()
          )}
        </CardContent>
      </Card>
      
      <AnimatePresence>
        {showLady && (
          <motion.img
            src="/lady.png"
            alt="Lady"
            className="fixed bottom-0 -translate-x-1/2 w-96 h-auto"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: "spring", damping: 20 }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

