import { Subject } from 'rxjs'

import usb = require('usb')

import { equals } from 'ramda'
import { DeviceType } from '../../DB'
import { kCompany } from '../../../appConfig'
import { findWinUSB } from './WinUSB'
import { hid_win } from '../win_dll/hid/bind'
import { sleep } from '../../../unitys/timeFunc'
import { supportDev } from '../../../supportDev'

export type DetctEvent = {
  type: '设备插入' | '设备拔出'
  deviceType: DeviceType
}

//因为是同步的 所以这条 api 要在 initUSBDetect 之前调用才能收到已经插入设备的通知
export const detectSubject = new Subject<DetctEvent>()

//////
const win = process.platform === 'win32'
export const currentUSB: usb.Device[] = []
const currentDeviceType: DeviceType[] = []

let supportDevices: DeviceType[]
let lastWinUSBList: hid_win.hid_win_DeviceType[] | undefined
const findSupportDevice = async () => {
  //<-------
  //console.log('findSupportDevice !!!!!!!')

  const devList = usb.getDeviceList()
  console.log('PPPPIIIIDDDD VVVIIIIDDDD', devList.map(v => ({
    vid: v.deviceDescriptor.idVendor.toString(16),
    pid: v.deviceDescriptor.idProduct.toString(16)
  })))
  for (let i = 0; i < devList.length; i++) {


    const usb = devList[i]
    //先检查是否已经连接
    const isExit = currentUSB.some(v => equals(usb, v))
    if (isExit) continue

    const dt = supportDevices.find(
      (d) =>
        usb.deviceDescriptor.idVendor === d.vid &&
        usb.deviceDescriptor.idProduct === d.pid
    )

    if (dt === undefined) continue
    const d = new DeviceType()
    Object.assign(d, dt)
    d.devAddr = usb.deviceAddress
    if (win) {
      await sleep(1000)
      let usbList = await findWinUSB()
      console.log('WINUSBLIST', usbList)
      if (usbList === undefined) return
      //console.log('1111111111', d, d.featureReportByteLength != undefined)
      const wus = usbList.filter(
        (wd) =>
          d.vid === wd.vid &&
          d.pid === wd.pid &&
          d.usage === wd.usage &&
          d.usagePage === wd.usagePage &&
          (d.featureReportByteLength != undefined ? d.featureReportByteLength === wd.featureReportByteLength : true)
      )
      console.log('!!!!!!!WUS', wus)
      const wu = wus.find(v => {

        return !currentDeviceType.some(c => v.DevicePath === c.devAddr)

      })
      if (wu === undefined) continue
      d.devAddr = wu.DevicePath
    }
    //如果有 发送通知
    //console.log('如果有 发送通知', d, devList.map(v => v.deviceDescriptor.idVendor + '   ' + v.deviceDescriptor.idProduct))
    currentUSB.push(usb)
    detectSubject.next({
      type: '设备插入',
      deviceType: d,
    })
    currentDeviceType.push(d)
  }
}

export const initUSBDetect = async () => {
  if (supportDevices) return currentUSB

  usb.on('attach', (device) => {
    findSupportDevice()
  })

  usb.on('detach', (device) => {
    currentUSB.forEach(async (usb, index) => {
      if (equals(usb, device)) {
        if (win) {
          const winUsbList = await findWinUSB()
          if (winUsbList === undefined) return
          currentDeviceType.forEach(v => {
            const still = winUsbList.some(wu => wu.DevicePath === v.devAddr)
            if (still === false) {
              detectSubject.next({
                type: '设备拔出',
                deviceType: v,
              })
              currentDeviceType.splice(currentDeviceType.indexOf(v), 1)
            }
          })

        } else {
          const d = currentDeviceType.find(
            (d) =>
              d.pid === usb.deviceDescriptor.idProduct &&
              d.vid === usb.deviceDescriptor.idVendor &&
              d.devAddr === usb.deviceAddress
          )
          if (d === undefined) return
          currentUSB.splice(index, 1)
          detectSubject.next({
            type: '设备拔出',
            deviceType: d,
          })
          currentDeviceType.splice(currentDeviceType.indexOf(d), 1)
        }

      }
    })
  })

  supportDevices = await DeviceType.find({ where: { company: kCompany } })
  console.log(supportDevices)
  findSupportDevice() //<----

  return currentUSB
}
