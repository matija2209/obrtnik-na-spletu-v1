import { Field } from "payload"

const backgroundColour = ():Field => {
    return {
    name: 'bgc',
    label: {sl:'Barva ozadja', de:'Hintergrundfarbe', en:'Background Color'},
    type: 'select',
    defaultValue: 'inherit', // Uses existing colourScheme behavior
    options: [
      { label: {sl:'Privzeto (iz barvne sheme)', de:'Standard (aus Farbschema)', en:'Default (from color scheme)'}, value: 'inherit' },
      { label: {sl:'Belo ozadje', de:'Weißes Hintergrund', en:'White Background'}, value: 'white' },
      { label: {sl:'Svetlo sivo', de:'Hellgrau', en:'Light Gray'}, value: 'light' },
      { label: {sl:'Svetlo 30%', de:'Hell 30%', en:'Light 30%'}, value: 'light-30' },
      { label: {sl:'Svetlo 50%', de:'Hell 50%', en:'Light 50%'}, value: 'light-50' },
      { label: {sl:'Priglušeno sivo', de:'Leichtgrau', en:'Muted Gray'}, value: 'muted' },
      { label: {sl:'Primarno ozadje', de:'Primäres Hintergrund', en:'Primary Background'}, value: 'primary' },
      { label: {sl:'Primarno 30%', de:'Primär 30%', en:'Primary 30%'}, value: 'primary-30' },
      { label: {sl:'Primarno 50%', de:'Primär 50%', en:'Primary 50%'}, value: 'primary-50' },
      { label: {sl:'Sekundarno ozadje', de:'Sekundäres Hintergrund', en:'Secondary Background'}, value: 'secondary' },
      { label: {sl:'Sekundarno 30%', de:'Sekundär 30%', en:'Secondary 30%'}, value: 'secondary-30' },
      { label: {sl:'Sekundarno 50%', de:'Sekundär 50%', en:'Secondary 50%'}, value: 'secondary-50' },
      { label: {sl:'Poudarjeno ozadje', de:'Akzentfarbe', en:'Accent Color'}, value: 'accent' },
      { label: {sl:'Poudarjeno 30%', de:'Akzent 30%', en:'Accent 30%'}, value: 'accent-30' },
      { label: {sl:'Temno ozadje', de:'Dunkles Hintergrund', en:'Dark Background'}, value: 'dark' },
      { label: {sl:'Temno 30%', de:'Dunkel 30%', en:'Dark 30%'}, value: 'dark-30' },
      { label: {sl:'Temno 50%', de:'Dunkel 50%', en:'Dark 50%'}, value: 'dark-50' },
      { label: {sl:'Temno 80%', de:'Dunkel 80%', en:'Dark 80%'}, value: 'dark-80' },
    ],
    admin: {
      description: {
        sl: 'Specifična barva ozadja za ta blok. Če je "Privzeto", se uporabi barvna shema.',
        de: 'Spezifische Hintergrundfarbe für diesen Block. Wenn "Standard", wird das Farbschema verwendet.',
        en: 'Specific background color for this block. If "Default", the color scheme is used.',
      },
    }
  }
}

export default backgroundColour