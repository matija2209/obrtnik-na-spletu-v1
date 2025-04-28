import React from 'react'

export function BoxesPattern() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20L0 20z' fill='currentColor' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '20px 20px'
      }}
    />
  )
}

export default BoxesPattern 