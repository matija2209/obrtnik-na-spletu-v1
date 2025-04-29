import React from 'react'
import Image from 'next/image'
import logoImage from '../../assets/obrtnik-na-spletu-transparent.png'
// import classes from './index.module.scss' // Remove SCSS module import

// const css = `
//   html[data-theme="dark"] path {
//     fill: white;
//   }

//   .graphic-logo {
//     width: 150px;
//     height: auto;
//   }`

export const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}> 
      <Image
        src={logoImage}
        alt="Obrtnik na spletu logo"
        width={150}
        height={163} // Calculated based on original SVG aspect ratio (563/518 * 150)
        priority // Optional: Add priority if this is an LCP element
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}> 
        <span style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.25rem' }}>ObrtnikNaSpletu</span> 
        <span style={{ fontSize: '0.875rem', color: '#4B5563', maxWidth: '20rem' }}> 
          Spletna stran že od 99€ – brez skritih stroškov, brez tveganja!
        </span>
      </div>
    </div>
  )
}