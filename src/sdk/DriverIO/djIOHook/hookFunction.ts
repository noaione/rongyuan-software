import { equals } from "ramda"
import { res } from "../../../res"
import { MouseKey } from "../DeviceAPI/DeviceInterface"

export interface IOHookEvent {
  type: string
  keychar?: number
  keycode?: number
  rawcode?: number
  button?: number
  clicks?: number
  x?: number
  y?: number
}

let lastEvent: IOHookEvent
let lastTime: number = 0
export const getMacroEvents = (event: IOHookEvent): MacroEvent[] => {
  if (equals(lastEvent, event)) {
    return []
  }
  // console.error('EEEEEEEVVVVVVVVVEEEEEEEEEE',event)
  lastEvent = event
  let delt = 0
  const nowTime = Math.floor(process.uptime() * 1000)

  if (lastTime === 0) {
    lastTime = nowTime
  } else {
    delt = nowTime - lastTime
    lastTime = nowTime
  }


  const hookE: MacroEvent = hookEventToMacroEvent(event)
  // console.error('HHHHHHOOOOOLLLLLL',hookE);
  

  return delt !== 0 ? [{ type: 'delay', value: delt }, hookE] : [hookE]
}
export const cleanTime = () => lastTime = 0
const hookEventToMacroEvent = (event: IOHookEvent): MacroEvent => {
  const action =
    event.type.substr(event.type.length - 2, 2) === 'up' ? 'up' : 'down'

  
  const hid = res.映射.scanCodeMapHIDCode(event.keycode)
  // console.error('HHHHHHHIIIIIIIDDDDDD',hid);
  
  if (event.type.substr(0, 1) === 'k') {
    return {
      type: 'keyboard',
      action: action,
      value: hid === undefined ? 0 : hid,
    }
  }
  if (event.type.substr(0, 1) === 'm') {
    return {
      type: 'mouse_button',
      action: action,
      value: event.button !== undefined ? MouseKey.Left - 1 + event.button : 0,
    }
  }
  return { type: 'delay', value: 0 } //never
}