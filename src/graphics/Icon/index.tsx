import React from 'react'
import Image from 'next/image'
import logoImage from '../../assets/obrtnik-na-spletu-transparent.png'


export const Icon = () => {
  return (
      <Image
        src={logoImage}
        alt="Obrtnik na spletu logo"
        width={15}
        height={15} // Calculated based on original SVG aspect ratio (563/518 * 150)
        priority // Optional: Add priority if this is an LCP element
      />
  )
}