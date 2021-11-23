import { USBInterface } from './USBInterface'
import * as usb from 'usb'
import { DeviceType } from '../../DB'
import { currentUSB } from './DetectSupportDevice'

export class MacUSB implements USBInterface {
  deviceType: DeviceType
  device?: usb.Device
  constructor(dev: DeviceType) {
    this.deviceType = dev
  }

  initDevice: () => Promise<boolean> = () =>
    new Promise((resolve) => {
      this.device = currentUSB.find(v => v.deviceAddress === this.deviceType.devAddr)
      if (this.device === undefined) {
        resolve(false)
        return
      }

      this.device.open()
      resolve(true)
    })
  destroyDevice: () => Promise<boolean> = async () => {
    if (this.device) {
      this.device.close()
      return true
    }
    return false
  }

  sendOutputReport: (reportId: number, buf: Buffer) => Promise<boolean> = (
    reportId: number,
    buf: Buffer
  ) =>
    new Promise((resolve) => {
      if (!this.device) return resolve(false)
      /*
                bmRequestType=0×21;表示USBHID类请求；
                bRequest=0×09;表示SetReport()请求；
                wValue=0×02ba;Report ID = 0,Report Type = 0×03(01:Input,02:Output,03:Feature,04-ff:Reserved)
                wIndex=0×0000;表示选择端点0。
                */
      this.device.controlTransfer(
        0x21,
        0x09,
        Buffer.from([reportId, 0x02]).readInt16LE(0),
        0,
        buf,
        (error, data) => {
          if (error) resolve(false)
          else resolve(true)
        }
      )
    })

  readInputReport: (reportId: number) => Promise<Buffer | undefined> = async (
    reportId: number
  ) =>
    new Promise((resolve) => {
      if (!this.device) return resolve(undefined)
      this.device.controlTransfer(
        0xa1,
        0x01,
        Buffer.from([reportId, 0x01]).readInt16LE(0),
        0,
        2,
        (error, buf) => {
          if (error) resolve(undefined)
          else resolve(buf)
        }
      )
    })

  sendFeature: (buf: Buffer) => Promise<boolean> = async (buf: Buffer) =>
    new Promise((resolve) => {
      if (!this.device) return resolve(false)
      /*
            bmRequestType=0×21;表示USBHID类请求；
            bRequest=0×09;表示SetReport()请求；
            wValue=0×02ba;Report ID = 0,Report Type = 0×03(01:Input,02:Output,03:Feature,04-ff:Reserved)
            wIndex=0×0000;表示选择端点0。
            */
      // buf = Buffer.from([0x0d,0x01,0x00,0x00,0x00])
      // const buf1 = Buffer.from([0x0d,0x01,0x01,0x05,0x01])

      this.device.controlTransfer(
        0x21,
        0x09,
        Buffer.from([0x00, 0x03]).readInt16LE(0),
        Buffer.from([0x02, 0x00]).readInt16LE(0),
        buf,
        (error, data) => {
          if (error) resolve(false)
          else resolve(true)
        }
      )
    })
  readFeature: () => Promise<Buffer | undefined> = async () =>
    new Promise((resolve) => {
      if (!this.device) return resolve(undefined)
      this.device.controlTransfer(
        0xa1,
        0x01,
        Buffer.from([0x00, 0x03]).readInt16LE(0),
        Buffer.from([0x02, 0x00]).readInt16LE(0),
        64,
        (error, buf) => {
          if (error) resolve(undefined)
          else resolve(buf)
        }
      )
    })
  writeData = async (buf: Buffer) =>
    new Promise<boolean>((resolve) => {
      return false
      //if (!this.device) return resolve(false)
      /*
            bmRequestType=0×21;表示USBHID类请求；
            bRequest=0×09;表示SetReport()请求；
            wValue=0×02ba;Report ID = 0,Report Type = 0×03(01:Input,02:Output,03:Feature,04-ff:Reserved)
            wIndex=0×0000;表示选择端点0。
            */
      // buf = Buffer.from([0x0d,0x01,0x00,0x00,0x00])
      // const buf1 = Buffer.from([0x0d,0x01,0x01,0x05,0x01])

      // this.device.controlTransfer(0x21, 0x09, Buffer.from([0x00, 0x02]).readInt16LE(0), Buffer.from([0x02, 0x00]).readInt16LE(0), buf, (error, data) => {
      //     if (error) resolve(false)
      //     else resolve(true)
      // })
    })

  readData = async () => {
    return undefined
  }
}
