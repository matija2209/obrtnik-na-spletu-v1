

// Removed local CtaField definition

import backgroundColour from "@/fields/backgroundColour";
import { Block } from "payload";

const TextBlock: Block = {
  slug: 'text',
  interfaceName: 'TextBlock',
  labels: {
    singular: {
      sl: 'Tekst',
      de: 'Text',
      en: 'Text',
    },
    plural: {
        sl: 'Teksti',
      de: 'Texte',
      en: 'Texts',
    },
  },
  fields: [
    {
      name: 'template',
      label: {
        sl: 'Vrsta',
        de: 'Typ',
        en: 'Type',
      },
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: {
            sl: 'Privzeti',
            de: 'Standard',
            en: 'Default',
          },
          value: 'default',
        },
      ],
    },
    {
      name: 'text',
      type: 'richText',
      label: {
        sl: 'Tekst',
        de: 'Text',
        en: 'Text',
      },
    },
    {
      name:"idHref",
      type:"text",
      defaultValue:"o-nas"
    },
    backgroundColour(),
  ],
};

export default TextBlock; 