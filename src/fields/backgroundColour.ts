import { Field } from "payload"

const backgroundColour = ():Field => {
    return {
    name: 'bgColor',
    label: 'Barva ozadja',
    type: 'select',
    defaultValue: 'inherit', // Uses existing colourScheme behavior
    options: [
      { label: 'Privzeto (iz barvne sheme)', value: 'inherit' },
      { label: 'Belo ozadje', value: 'white' },
      { label: 'Svetlo sivo', value: 'light' },
      { label: 'Svetlo 30%', value: 'light-30' },
      { label: 'Svetlo 50%', value: 'light-50' },
      { label: 'Priglušeno sivo', value: 'muted' },
      { label: 'Primarno ozadje', value: 'primary' },
      { label: 'Primarno 30%', value: 'primary-30' },
      { label: 'Primarno 50%', value: 'primary-50' },
      { label: 'Sekundarno ozadje', value: 'secondary' },
      { label: 'Sekundarno 30%', value: 'secondary-30' },
      { label: 'Sekundarno 50%', value: 'secondary-50' },
      { label: 'Poudarjeno ozadje', value: 'accent' },
      { label: 'Poudarjeno 30%', value: 'accent-30' },
      { label: 'Temno ozadje', value: 'dark' },
      { label: 'Temno 30%', value: 'dark-30' },
      { label: 'Temno 50%', value: 'dark-50' },
      { label: 'Temno 80%', value: 'dark-80' },
    ],
    admin: {
      description: 'Specifična barva ozadja za ta blok. Če je "Privzeto", se uporabi barvna shema.',
    }
  }
}

export default backgroundColour