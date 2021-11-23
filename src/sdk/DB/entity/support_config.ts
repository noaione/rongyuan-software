import { DeviceType } from '..'
import { kCompany } from '../../../appConfig'
import { supportDev } from '../../../supportDev'


export const config = supportDev.map(v => new DeviceType(v))
config.push(new DeviceType({
  id: 999,
  vid: 0x0c45,
  pid: 0x7040,
  usage: 1,
  usagePage: 12,
  name: 'help',
  displayName: 'help',
  support_onboard: 2,
  type: 'keyboard',
  group: 'rongyuan_k_rgb',
  company: kCompany,
}))