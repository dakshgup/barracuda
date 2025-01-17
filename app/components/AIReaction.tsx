import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIReactionProps {
  response: string
  isTyping: boolean
}

export default function AIReaction({ response, isTyping }: AIReactionProps) {
  const [displayedResponse, setDisplayedResponse] = useState('')

  useEffect(() => {
    if (response) {
      let i = 0
      const intervalId = setInterval(() => {
        setDisplayedResponse(response.slice(0, i))
        i++
        if (i > response.length) {
          clearInterval(intervalId)
        }
      }, 20)
      return () => clearInterval(intervalId)
    }
  }, [response])

  return (
    <AnimatePresence>
      {(isTyping || response) && (
        <motion.div
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

