'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function generateAIResponse(question: string, answer: string) {
  const prompt = `
    You are a friendly AI assistant working as a receptionist for a SaaS company. 
    You're helping with the onboarding process. The user just answered the following question:
    
    Question: ${question}
    User's Answer: ${answer}
    
    Please provide a brief, friendly response (1-2 sentences) that acknowledges their answer 
    and encourages them to continue with the onboarding process. Be empathetic and positive.
  `

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt: prompt,
  })

  return text
}

