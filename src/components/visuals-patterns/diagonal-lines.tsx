import React from 'react'

export function DiagonalLines() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='currentColor' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '6px 6px'
      }}
    />
  )
}

export default DiagonalLines 