import { USBInterface } from './USBInterface'

import { T } from 'ramda'

import * as os from 'os'
import { hid_win } from '../win_dll/hid/bind'
import { DeviceType } from '../../DB'

const usb = os.platform() === 'win32' ? hid_win.init() : undefined

export const findWinUSB = async () => {
  return await usb?.getSystemHid()
}

export class WinUSB implements USBInterface {
  deviceType: DeviceType

  private ptr = { isNull: T }
  constructor(d: DeviceType) {
    this.deviceType = d
  }

  initDevice = async () => {
    if (usb === undefined) return false
    // const ptr = await usb.openHidDevice(
    //   this.deviceType.vid!,
    //   this.deviceType.pid!,
    //   this.deviceType.usage!,
    //   this.deviceType.usagePage!
    // )
    if (typeof this.deviceType.devAddr !== 'string') return false

    //console.log('!!!!!!!', this.deviceType)
    let ptr
    if (this.deviceType.pid === 0x024F && this.deviceType.vid === 0x05ac || this.deviceType.pid === 0x7d12 && this.deviceType.vid === 0x0c45) {
      ptr = await usb.openHidDevice4(this.deviceType.devAddr)
    } else {
      ptr = await usb.openHidDevice3(this.deviceType.devAddr)
    }

    const isSucceed = ptr.isNull() === false
    //console.warn('!!!!OPPPEEEENNNN', isSucceed)
    if (isSucceed) this.ptr = ptr
    return isSucceed
  }
  destroyDevice = async () => {
    if (usb === undefined) return false
    if (this.ptr.isNull()) return false
    let isSucceed

    if (this.deviceType.pid === 0x024F && this.deviceType.vid === 0x05ac || this.deviceType.pid === 0x7d12 && this.deviceType.vid === 0x0c45) {
      isSucceed = true
    } else {
      isSucceed = await usb.destroyDevice(this.ptr)
    }

    if (isSucceed) this.ptr = { isNull: T }
    return isSucceed
  }

  sendOutputReport = async (reportId: number, buf: Buffer) => {
    if (usb === undefined) return false
    if (this.ptr.isNull()) return false
    return await usb.sendOutputReport(this.ptr, reportId, buf)
  }
  readInputReport = async (reportId: number) => {
    if (usb === undefined) return undefined
    if (this.ptr.isNull()) return undefined

    return await usb.readInputReport(this.ptr, reportId)
  }
  sendFeature = async (buf: Buffer) => {
    if (usb === undefined) return false
    if (this.ptr.isNull()) return false
    if (this.deviceType.pid === 0x024F && this.deviceType.vid === 0x05ac || this.deviceType.pid === 0x7d12 && this.deviceType.vid === 0x0c45) {
      const a = await usb.sendFeature1(this.ptr, buf)
      console.log('!!!sendFeature1sendFeature1sendFeature1sendFeature1', a)
      return a
    } else {
      return await usb.sendFeature(this.ptr, buf)
    }
  }
  readFeature = async () => {
    if (usb === undefined) return undefined
    if (this.ptr.isNull()) return undefined
    if (this.deviceType.pid === 0x024F && this.deviceType.vid === 0x05ac || this.deviceType.pid === 0x7d12 && this.deviceType.vid === 0x0c45) {
      return await usb.readFeature1(this.ptr)
    } else {
      return await usb.readFeature(this.ptr)
    }
  }

  writeData = async (buf: Buffer) => {
    if (usb === undefined) return false
    if (this.ptr.isNull()) return false

    return await usb.writeData(this.ptr, buf)
  }

  readData = async () => {
    if (usb === undefined) return undefined
    if (this.ptr.isNull()) return undefined

    return await usb.readData(this.ptr)
  }
}
