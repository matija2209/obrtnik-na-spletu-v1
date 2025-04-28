"use client"
import React from 'react'

export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              backgroundColor: 'currentColor',
              animation: `float-${i} ${Math.random() * 10 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes float-0 { 
          0% { transform: translate(0, 0); }
          100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); }
        }
        ${[...Array(49)].map((_, i) => `
          @keyframes float-${i + 1} {
            0% { transform: translate(0, 0); }
            100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px); }
          }
        `).join('')}
      `}</style>
    </div>
  )
}

export default FloatingParticles 