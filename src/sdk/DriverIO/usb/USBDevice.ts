import { WinUSB } from './WinUSB'
import { timeOutFUNC as timeOut } from '../../../unitys/timeFunc'
import { USBInterface } from './USBInterface'
import { MacUSB } from './MacUSB'
import * as os from 'os'
import { DeviceType } from '../../DB'


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class USBDevice {
  public deviceType: DeviceType
  private usb: USBInterface

  constructor(device: DeviceType) {
    this.deviceType = device
    if (os.platform() === 'win32') {
      this.usb = new WinUSB(device)
    } else {
      this.usb = new MacUSB(device)
    }
  }


  whoAmI = async () => {
    const b = Buffer.alloc(64)
    b[0] = 0x8f
    const buf = await this.commomFeature(b)
    console.log('who am  i  buff', buf)
    return buf?.readInt32LE(1)
  }

  commomFeature = async (cmdBuf: Buffer) => {
    if ((await this.writeFeatureCmd(cmdBuf)) === undefined) return undefined
    return await this.readFeatureCmd()
  }
  commomOUTIN = async (cmdBuf: Buffer) => {
    if ((await this.writeOutPutCmdWithType(0xba, cmdBuf)) === undefined)
      return undefined
    return await this.readInputCmdWithType(0xba)
  }

  open = timeOut(async () => await this.usb.initDevice())

  destroy = timeOut(async () => await this.usb.destroyDevice())

  writeOutPutCmdWithType = timeOut(
    async (reportId: number, buf: Buffer) =>
      await this.usb.sendOutputReport(reportId, buf)
  )

  readInputCmdWithType = timeOut(async (reportId: number) =>
    this.usb.readInputReport(reportId)
  )



  writeFeatureCmd = timeOut(async (buf: Buffer, sleepTime = 100) => {
    await sleep(sleepTime)
    return this.usb.sendFeature(buf)
  })

  readFeatureCmd = timeOut(async (sleepTime = 100) => {
    await sleep(sleepTime)
    return this.usb.readFeature()
  })

  writeDataCmd = timeOut(async (buf: Buffer) => this.usb.writeData(buf))

  readDataCmd = timeOut(async () => this.usb.readData())
}
