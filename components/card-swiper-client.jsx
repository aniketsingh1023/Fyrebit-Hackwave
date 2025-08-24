"use client"

import { useState, useEffect } from "react"

export function CardSwiperClient({ children, className, cardsToShow = 1, loop = false }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const cards = Array.isArray(children) ? children : [children]

  const nextCard = () => {
    if (loop) {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1))
    }
  }

  const prevCard = () => {
    if (loop) {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0))
    }
  }

  useEffect(() => {
    if (!isClient || !loop) return

    const interval = setInterval(() => {
      nextCard()
    }, 3000)

    return () => clearInterval(interval)
  }, [isClient, currentIndex, loop])

  if (!isClient) {
    return <div className={className}>{cards[0]}</div>
  }

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {card}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
