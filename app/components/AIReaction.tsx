import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIReactionProps {
  response: { text: string; audioBase64: string } | null
  isTyping: boolean
}

export default function AIReaction({ response, isTyping }: AIReactionProps) {
  const [displayedResponse, setDisplayedResponse] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)

  useEffect(() => {
    if (!response?.text) {
      setDisplayedResponse('')
      return
    }

    // Initialize audio
    if (response.audioBase64) {
      const audio = new Audio(`data:audio/mp3;base64,${response.audioBase64}`)
      audioRef.current = audio
      
      // Calculate timing for audio playback
      const msPerChar = (audio.duration * 1000) / response.text.length
      
      let i = 0
      const intervalId = setInterval(() => {
        setDisplayedResponse(response.text.slice(0, i))
        
        // Start audio if it's the first character
        if (i === 1) {
          audioRef.current?.play()
        }
        
        i++
        if (i > response.text.length) {
          clearInterval(intervalId)
        }
      }, msPerChar)

      return () => {
        clearInterval(intervalId)
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
      }
    }
  }, [response])

  return (
    <AnimatePresence mode="wait">
      {(isTyping || displayedResponse) && (
        <motion.div
          key={response?.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-4 p-4 bg-blue-100 rounded-lg relative"
        >
          <div className="absolute top-0 left-4 -mt-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-blue-100 border-t-transparent border-l-transparent border-r-transparent" />
          {isTyping ? (
            <p>Thinking...</p>
          ) : (
            <p>{displayedResponse}</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

