import React from 'react'

export function VerticalStripes() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='1' viewBox='0 0 40 1' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v1H0z' fill='currentColor' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 1px'
      }}
    />
  )
}

export default VerticalStripes 