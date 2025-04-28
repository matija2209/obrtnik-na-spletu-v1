import React from 'react'

export function GradientBlob() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-[100%] opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl animate-blob" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-red-500/20 to-yellow-500/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-green-500/20 to-teal-500/20 blur-3xl animate-blob animation-delay-4000" />
      </div>
    </div>
  )
}

export default GradientBlob 