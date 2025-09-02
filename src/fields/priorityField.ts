import { Field } from "payload";

const priorityField = ():Field => {
    return {
        name:"priority",
        type:"number",
        label: {
          sl: 'Prioriteta',
          de: 'Priorität',
          en: 'Priority',
        },
        defaultValue:0,
        admin: {
          position:"sidebar",
          description: {
            sl: 'Prioriteta prikaza storitve na strani storitve',
            de: 'Priorität der Anzeige der Leistung auf der Service-Seite',
            en: 'Priority of display of the service on the service page',
          }
        }
      }
}
export default priorityField;