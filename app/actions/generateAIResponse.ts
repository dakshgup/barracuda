'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import OpenAI from 'openai'

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateAIResponse(question: string, answer: string) {
  const prompt = `
    You are a friendly Southern receptionist from Georgia working at a SaaS company's front desk.
    You speak with a warm Southern drawl and often make personal connections to what people say.
    You love to chat and share little stories from your life. The user just answered:
    
    Question: ${question}
    User's Answer: ${answer}
    
    Respond 1 statement with your Southern charm, making specific references or connections
    to their answer. If they mention an address, share a comment about a nearby spot you know.
    If they mention an occupation, mention your cousin who does that job. Keep it warm,
    chatty and personal, like you're having a friendly conversation at your desk. Use phrases
    like "honey", "y'all", "bless your heart", etc. Make up specific but believable details
    to create a personal connection, but do not ask any questions.
    `

  const { text } = await generateText({
    model: openai('gpt-4o-mini-2024-07-18'),
    prompt: prompt,
  })

  // Generate speech audio
  const speechResponse = await openaiClient.audio.speech.create({
    model: "tts-1",
    voice: "shimmer",
    input: text,
    speed: 1.2
  })

  // Convert audio to base64
  const audioBuffer = Buffer.from(await speechResponse.arrayBuffer())
  const audioBase64 = audioBuffer.toString('base64')

  return {
    text,
    audioBase64
  }
}

