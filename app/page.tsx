'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import AIReaction from './components/AIReaction'
import { generateAIResponse } from './actions/generateAIResponse'

const questions = [
  { id: 'name', question: "What's your name?", type: 'input' },
  { id: 'role', question: "What's your role?", type: 'input' },
  { id: 'goals', question: "What are your main goals for using our product?", type: 'textarea' },
  { id: 'experience', question: "How would you describe your experience level with similar tools?", type: 'textarea' },
]

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [aiResponse, setAIResponse] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const answer = formData.get(questions[currentStep].id) as string
    
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: answer }))
    setIsTyping(true)

    const response = await generateAIResponse(questions[currentStep].question, answer)
    setAIResponse(response)
    setIsTyping(false)

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">{questions[currentStep].question}</h2>
            {questions[currentStep].type === 'input' ? (
              <Input name={questions[currentStep].id} className="mb-4" required />
            ) : (
              <Textarea name={questions[currentStep].id} className="mb-4" required />
            )}
            <Button type="submit">Next</Button>
          </form>
          <AIReaction response={aiResponse} isTyping={isTyping} />
        </CardContent>
      </Card>
    </div>
  )
}

