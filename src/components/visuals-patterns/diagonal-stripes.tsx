import React from 'react'

export function DiagonalStripes() {
  return (
    <div className="absolute inset-0">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor), 
                           linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }}
      />
    </div>
  )
}

export default DiagonalStripes 