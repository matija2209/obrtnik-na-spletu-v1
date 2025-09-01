import { Field } from "payload"

const iconOptions = [
  { label: 'Sparkles', value: 'Sparkles' },
  { label: 'Zap', value: 'Zap' },
  { label: 'Droplet (Drop)', value: 'Drop' },
  { label: 'Hand (Hands)', value: 'Hands' },
  { label: 'Footprints', value: 'Footprints' },
  { label: 'Paintbrush', value: 'Paintbrush' },
  { label: 'Bager', value: 'bager' },
  { label: 'Excavator', value: 'excavator' },
  { label: 'Wrecking Ball', value: 'wrecking-ball' },
];

const iconField = (): Field => {
  return {
    name: 'icon',
    type: 'select',
    label: 'Ikona elementa (neobvezno)',
    options: iconOptions,
    admin: {
      description: 'Izberite ikono, ki se prikaže ob elementu v spustnem meniju.',
    }
  }
}

export default iconField
