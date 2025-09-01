import { Field } from "payload"

const isTransparent = ():Field => {
    return {
    name:"isTransparent",
    type:"checkbox",
    label:"Je transparenten",
    defaultValue:false,
    required:false,
  }
}

export default isTransparent