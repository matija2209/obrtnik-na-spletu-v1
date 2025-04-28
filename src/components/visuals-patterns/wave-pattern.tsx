import React from 'react'

export function WavePattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute w-full h-full opacity-[0.02]"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="wave"
            x="0"
            y="0"
            width="100"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 15 Q 25 5, 50 15 T 100 15 V 20 H 0 Z"
              fill="currentColor"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M0 15 Q 25 5, 50 15 T 100 15 V 20 H 0 Z;
                  M0 15 Q 25 25, 50 15 T 100 15 V 20 H 0 Z;
                  M0 15 Q 25 5, 50 15 T 100 15 V 20 H 0 Z"
              />
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wave)" />
      </svg>
    </div>
  )
}

export default WavePattern 