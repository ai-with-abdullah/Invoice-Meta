'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AnimationWrapperProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  x?: number
  scale?: number
  opacity?: number
}

export default function AnimationWrapper({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  y = 0,
  x = 0,
  scale = 1,
  opacity = 1
}: AnimationWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div 
        className={className}
        style={{ 
          opacity: 0,
          transform: `translateY(${y}px) translateX(${x}px) scale(${scale})`
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      animate={{ opacity, y: 0, x: 0, scale: 1 }}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  )
} 