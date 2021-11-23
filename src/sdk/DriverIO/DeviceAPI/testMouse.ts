import { MouseInterface } from './MouseInterface'
import { DeviceType } from '../../DB'
import { sleep } from '../../../unitys/timeFunc'

export class TestMouse implements MouseInterface {
  constructor(dev: DeviceType) {
    this.deviceType = dev
  }

  type: 'mouse' = 'mouse'
  deviceType: DeviceType
  open = async () => true

  destroy = async () => true

  setReSet = async () => {
    this.config = []
    this.rate = 500
    this.dpi = []
    this.lightSet = {
      type: 'LightOff',
    }
    return true
  }
  checkMacroLenthIsFull = (macroArr: MacroEvent[]) => {
    if (macroArr.length > 110) return true
    return false
  }
  getFirmwareVersion = async () => {
    await sleep(300)
    return 1
  }
  rate: 500 | 250 | 125 | 1000 = 500
  setReportRate = async (rate: 500 | 250 | 125 | 1000) => {
    await sleep(300)
    this.rate = rate
    return true
  }
  getReportRate = async () => {
    await sleep(300)
    return this.rate
  }
  dpi: number[] = [1, 1, 1, 1, 1, 1, 1]
  setDPI = async (dpiArr: Array<number>) => {
    await sleep(300)
    this.dpi = [...dpiArr]
    return true
  }
  getDpi = async () => {
    await sleep(300)
    return this.dpi
  }
  getCurrentDpi = async () => {
    await sleep(300)
    return {
      dpiValue: 256,
      dpiNum: 3,
    }
  }
  lightSet: LightSetting = {
    type: 'LightOff',
  }
  setLightSetting = async (lightSet: LightSetting) => {
    await sleep(300)
    this.lightSet = lightSet
    return true
  }
  logolightSet: LightSetting = {
    type: 'LightOff',
  }
  setLogoLightSetting = async (lightSet: LightSetting) => {
    await sleep(300)
    this.logolightSet = this.logolightSet
    return true
  }
  getLogoLightSetting = async () => {
    await sleep(300)
    return this.logolightSet
  }
  getLightSetting = async () => {
    await sleep(300)
    return this.lightSet
  }
  config: ConfigValue[] = []
  setKeyConfig = async (config: ConfigValue[]) => {
    await sleep(300)
    this.config = [...config]
    return true
  }
  getKeyConfig = async () => {
    await sleep(300)
    return this.config
  }
  upgrade = async (filePath: string, progressCallBack: (v: number) => void) => {
    for (let i = 0; i < 100; i++) {
      await sleep(100)
      progressCallBack(i / 100)
    }
    progressCallBack(1)
    return true
  }
}
