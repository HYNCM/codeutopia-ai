import { useState, useEffect, useCallback, useRef } from 'react'

interface UseTypewriterOptions {
  /** Speed in milliseconds per character */
  speed?: number
  /** Callback when typing is complete */
  onComplete?: () => void
  /** Start immediately or wait for trigger */
  autoStart?: boolean
}

interface UseTypewriterReturn {
  /** Current displayed text (progressively revealed) */
  displayedText: string
  /** Whether typing is currently in progress */
  isTyping: boolean
  /** Whether typing has completed */
  isComplete: boolean
  /** Start typing from the beginning */
  start: () => void
  /** Skip to show full text immediately */
  skip: () => void
  /** Reset to empty state */
  reset: () => void
}

/**
 * Hook to create a typewriter/streaming text effect
 * @param fullText - The complete text to be typed out
 * @param options - Configuration options
 */
export function useTypewriter(fullText: string, options: UseTypewriterOptions = {}): UseTypewriterReturn {
  const { speed = 30, onComplete, autoStart = true } = options

  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const indexRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearTypingInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    // Reset state
    indexRef.current = 0
    setDisplayedText('')
    setIsTyping(true)
    setIsComplete(false)

    clearTypingInterval()

    // Start typing
    intervalRef.current = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, indexRef.current + 1))
        indexRef.current += 1
      } else {
        clearTypingInterval()
        setIsTyping(false)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)
  }, [fullText, speed, onComplete, clearTypingInterval])

  const skip = useCallback(() => {
    clearTypingInterval()
    setDisplayedText(fullText)
    setIsTyping(false)
    setIsComplete(true)
    indexRef.current = fullText.length
    onComplete?.()
  }, [fullText, onComplete, clearTypingInterval])

  const reset = useCallback(() => {
    clearTypingInterval()
    setDisplayedText('')
    setIsTyping(false)
    setIsComplete(false)
    indexRef.current = 0
  }, [clearTypingInterval])

  // Auto-start when fullText changes (if enabled)
  useEffect(() => {
    if (autoStart && fullText) {
      start()
    }

    return () => {
      clearTypingInterval()
    }
  }, [fullText, autoStart, start, clearTypingInterval])

  return {
    displayedText,
    isTyping,
    isComplete,
    start,
    skip,
    reset,
  }
}

/**
 * Simulates streaming response by calling onChunk for each character
 * Useful for mocking LLM streaming API
 */
export async function simulateStreaming(
  text: string,
  onChunk: (char: string, accumulated: string) => void,
  options: { charDelay?: number; chunkSize?: number } = {},
): Promise<void> {
  const { charDelay = 20, chunkSize = 1 } = options
  let accumulated = ''

  for (let i = 0; i < text.length; i += chunkSize) {
    await new Promise((resolve) => setTimeout(resolve, charDelay))
    const chunk = text.slice(i, i + chunkSize)
    accumulated += chunk
    onChunk(chunk, accumulated)
  }
}
