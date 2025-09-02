import { Field } from "payload"

const buttonVariantField = ():Field => {
    return {
    name: 'bv',
    type: 'radio',
    label: {
      sl: 'Tip Gumba (Stil)',
      de: 'Button-Typ (Stil)',
      en: 'Button Type (Style)',
    },
    required: false,
    options: [
      { label: {
        sl: 'Privzeti',
        de: 'Standard',
            en: 'Default',
          }, value: 'default' },
      { label: {
        sl: 'Sekundarni',
        de: 'Sekundär',
        en: 'Secondary',
      }, value: 'secondary' },
      { label: {
        sl: 'Destruktivni',
      }, value: 'destructive' },
      { label: {
        sl: 'Obojeni',
        de: 'Obojeni',
        en: 'Outline',
      }, value: 'outline' },
      { label: {
        sl: 'Ghost',
        de: 'Ghost',
        en: 'Ghost',
      }, value: 'ghost' },
      { label: {
        sl: 'Povezava',
        de: 'Link',
        en: 'Link',
      }, value: 'link' },
      
    ],
    admin: {
      description: {
        sl: 'Izberite stil gumba (npr. Primary, Secondary). To lahko vpliva na izgled gumba na spletni strani.',
        de: 'Wählen Sie den Button-Typ (Stil) (z.B. Primary, Secondary). Dies kann sich auf das Aussehen des Buttons auf der Website auswirken.',
        en: 'Select the button type (style) (e.g. Primary, Secondary). This can affect the appearance of the button on the website.',
      },
    },
    defaultValue: 'default', // Optional: Set a default value
  }
}

  export default buttonVariantField