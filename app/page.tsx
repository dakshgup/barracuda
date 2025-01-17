'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AIReaction from './components/AIReaction'
import { generateAIResponse } from './actions/generateAIResponse'
import { motion, AnimatePresence } from 'framer-motion'

const questions = [
  { id: 'name', question: "What's your name?", type: 'input' },
  { id: 'role', question: "What's your home address?", type: 'input' },
  { id: 'goals', question: "What's your occupation?", type: 'textarea' },
  { id: 'experience', question: "How old are you?", type: 'textarea' },
]

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [aiResponse, setAIResponse] = useState('')
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
      setAIResponse('')
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden relative">
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

