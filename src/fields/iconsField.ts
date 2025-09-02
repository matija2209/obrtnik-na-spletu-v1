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
  { label: 'Phone', value: 'Phone' },
  { label: 'Mail', value: 'Mail' },
  { label: 'Plant Rage Weed', value: 'plant-rage-weed' },
  { label: 'Gardening Shears', value: 'gardening-shears' },
  { label: 'Snowflake', value: 'snowflake' },
  { label: 'Stone Path', value: 'stone-path' },
  { label: 'Sprout', value: 'sprout' },
  { label: 'Shovel', value: 'shovel' },
  { label: 'Tree', value: 'tree' },
  { label: 'Front Loader', value: 'front-loader' },
  { label: 'Lamp', value: 'lamp' },
  { label: 'Water Drop', value: 'water-drop' },
  { label: 'Fence', value: 'fence' },
  { label: 'Leaves', value: 'leaves' },
  { label: 'Flower', value: 'flower' },
  { label: 'Grass', value: 'grass' },
  { label: 'Google', value: 'google' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Building', value: 'Building' },
];

const iconField = (): Field => {
  return {
    name: 'icon',
    type: 'select',
    label: {sl:'Ikona elementa (neobvezno)', de:'Symbol des Elements (optional)', en:'Icon of element (optional)'},
    options: iconOptions,
    admin: {
      description: {sl:'Izberite ikono, ki se prikaže ob elementu v spustnem meniju.', de:'Wählen Sie das Symbol, das im Dropdown-Menü des Elements angezeigt wird.', en:'Select the icon that appears in the dropdown menu of the element.'},
    }
  }
}

export default iconField
