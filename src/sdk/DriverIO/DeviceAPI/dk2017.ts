import { USBDevice } from '../../DriverIO/usb/USBDevice'

import { equals } from 'ramda'
import { valueForKey, valueForIndex } from '../../../unitys/tableValueForKey'
import { setBitTo0, getUint8Bit0Index, getBit, setBit } from '../../../unitys/bitOperation'
import { KeyboardInterface } from './KeyboardInterface'
import { MouseKey } from './DeviceInterface'
import { sleep } from '../../../unitys/timeFunc'
import { defaultMatrix_dk2017 } from './dk2017matrix'
import * as fs from 'fs'

export class Dk2017 extends USBDevice implements KeyboardInterface {
  //0x0c45, 0x7044, 0x01, 0xff13
  type: 'keyboard' = 'keyboard'
  defaultMatrix = defaultMatrix_dk2017
  currentProfile = 0
  setMusicFollow = async (uint8array: Uint8Array) => {
    //console.time('uint8array')
    const b = new Array(8)
    b[0] = 0x0e

    let flag = 14

    let hanleArr = uint8array.slice(flag, flag + 32)

    while (hanleArr.filter(v => v !== 0).length < 5 && flag > 0) {
      flag--
      hanleArr = uint8array.slice(flag, flag + 32)
    }

    const sendArr = b.concat(...hanleArr)

    const sendBuf = Buffer.from(sendArr.concat(new Array(64 - sendArr.length)))
    //console.log(sendBuf, uint8array)
    const res = this.writeFeatureCmd(sendBuf, 0)
    //console.timeEnd('uint8array')
    return res
  }


  getFirmwareVersion = async () => {
    const b = Buffer.alloc(64)
    b[0] = 0x80
    const buf = await this.commomFeature(b)
    //console.log('version', buf)
    return buf?.readUInt16LE(1)
  }
  setReportRate = async (
    rate: 1000 | 500 | 250 | 125,

  ) => {
    let num
    switch (rate) {
      case 1000:
        num = 0x01
        break
      case 500:
        num = 0x02
        break
      case 250:
        num = 0x04
        break
      case 125:
        num = 0x08
        break
      default:
        num = 0x00
        break
    }
    const b = Buffer.alloc(64)
    b[0] = 0x01
    b[1] = this.currentProfile
    b[2] = num

    return await this.writeFeatureCmd(b)
  }

  getReportRate = async () => {
    const b = Buffer.alloc(64)
    b[0] = 0x81
    b[1] = this.currentProfile
    const buf = await this.commomFeature(b)
    const num = buf?.readUInt8(2)
    switch (num) {
      case 0x01:
        return 1000
      case 0x02:
        return 500
      case 0x04:
        return 250
      case 0x08:
        return 125

      default:
        return 'err'
    }
  }
  //0-7
  setCurrentProfile = async (profile: number = 0) => {
    const b = Buffer.alloc(64)
    b[0] = 0x02
    b[1] = profile

    const res = await this.writeFeatureCmd(b)
    if (res) {
      this.currentProfile = profile
      return true
    }
    return false
  }

  getCurrentProfile = async () => {
    const b = Buffer.alloc(64)
    b[0] = 0x82
    const buf = await this.commomFeature(b)
    const num = buf?.readUInt8(1)
    if (num) this.currentProfile = num
    return num
  }
  /*
    Bit0: Win Key App Key Lock Control   0: unlock/1: lock
    Bit1: Keyboard Lock Control
    Bit2: WASD Key and Arrow Key Exchange
    Bit3: Win Key and Fn Key Exchange
    Bit4: Repeat Key
    Bit5: Reserve
    Bit6: Reserve
    Bit7: Reserve
    */

  setKeyboardOption = async (option: KeyboardOption) => {
    const b = Buffer.alloc(64)
    b[0] = 0x03
    b[1] = this.currentProfile

    const bit0 = Number(option.winKeyAppKeyLockControl)
    const bit1 = Number(option.keyboardLockControl)
    const bit2 = Number(option.wasdKeyAndArrowKeyExchange)
    const bit3 = Number(option.winKeyAndFnKeyExchange)
    const bit4 = Number(option.repeateKey)

    b[2] = bit0 | (bit1 << 1) | (bit2 << 2) | (bit3 << 3) | (bit4 << 4)

    return await this.writeFeatureCmd(b)
  }

  getKeyboardOption = async () => {
    const b = Buffer.alloc(64)
    b[0] = 0x83
    b[1] = this.currentProfile
    const buf = await this.commomFeature(b)
    const num = buf?.readUInt8(2)
    if (num === undefined) return
    const keyboardOption: KeyboardOption = {
      winKeyAppKeyLockControl: !!(num & 0b1),
      keyboardLockControl: !!(num & 0b10),
      wasdKeyAndArrowKeyExchange: !!(num & 0b100),
      winKeyAndFnKeyExchange: !!(num & 0b1000),
      repeateKey: !!(num & 0b10000),
    }
    return keyboardOption
  }
  //brightness 0~6
  setLightSetting = async (lightSet: dk2017LightSetting) => {
    const b = Buffer.alloc(64)
    b[0] = 0x04

    let effect: number = 0
    let speed: number = 0
    let brightness: number = 0
    let option: number = 0

    switch (lightSet.type) {
      case 'LightOff':
        effect = 0x00
        break
      case 'LightAlwaysOn':
        effect = 0x01
        brightness = lightSet.value
        break
      case 'LightBreath':
        effect = 0x02
        speed = lightSet.speed
        break
      case 'LightWave':
        effect = 0x03
        speed = lightSet.speed
        option = lightSet.option === 'right' ? 0 : 1
        break
      case 'LightRipple':
        effect = 0x04
        speed = lightSet.speed
        option = lightSet.option === 'full' ? 0 : 1
        break
      case 'LightRaindrop':
        effect = 0x05
        speed = lightSet.speed
        break
      case 'LightSnake':
        effect = 0x06
        speed = lightSet.speed
        option = lightSet.option === 'z' ? 0 : 1
        break
      case 'LightPressAction':
        effect = 0x07
        speed = lightSet.speed
        option = lightSet.option === 'onToOff' ? 0 : 1
        break
      case 'LightConverage':
        effect = 0x08
        speed = lightSet.speed
        break
      case 'LightUserPicture':
        effect = 0x09
        option = 0
        break
      default:
        break
    }

    b[1] = effect
    b[2] = 5 - speed
    b[3] = brightness
    b[4] = option

    return await this.writeFeatureCmd(b)
  }

  getLightSetting = async (): Promise<LightSetting | undefined> => {
    const b = Buffer.alloc(64)
    b[0] = 0x84
    const buf = await this.commomFeature(b)
    if (buf === undefined) return undefined
    const effect = buf[1]
    const speed = 5 - buf[2]
    const brightness = buf[3]
    const option = buf[4]
    //console.log('!!!!!', effect, option)
    switch (effect) {
      case 0:
        return {
          type: 'LightOff',
        }
      case 1:
        return {
          type: 'LightAlwaysOn',
          value: brightness,
          rgb: 0,
        }
      case 2:
        return {
          type: 'LightBreath',
          value: 0,
          speed: speed,
          rgb: 0,
        }
      case 3:
        return {
          type: 'LightWave',
          value: 0,
          speed: speed,
          option: option === 0 ? 'right' : 'left',
        }
      case 4:
        return {
          type: 'LightRipple',
          value: 0,
          speed: speed,
          option: option === 0 ? 'full' : 'single',
        }
      case 5:
        return {
          type: 'LightRaindrop',
          value: 0,
          speed: speed,
        }
      case 6:
        return {
          type: 'LightSnake',
          value: 0,
          speed: speed,
          option: option === 0 ? 'z' : 'return',
        }
      case 7:
        return {
          type: 'LightPressAction',
          value: 0,
          speed: speed,
          option: option === 0 ? 'onToOff' : 'offToOn',
        }
      case 8:
        return {
          type: 'LightConverage',
          value: 0,
          speed: speed,
        }
      case 9:
        return {
          type: 'LightUserPicture',
          value: 0,
        }
      default:
        return undefined
    }
  }

  setMode = async (mode: 'gaming' | 'normal', profile: number = 0) => {
    const b = Buffer.alloc(64)
    b[0] = 0x05
    b[1] = profile
    b[2] = mode === 'gaming' ? 1 : 0
    return await this.writeFeatureCmd(b)
  }

  getMode = async (profile: number = 0) => {
    const b = Buffer.alloc(64)
    b[0] = 0x85
    b[1] = profile
    const buf = await this.commomFeature(b)
    const num = buf?.readUInt8(2)
    if (num === undefined) return num
    return num === 0 ? 'normal' : 'gaming'
  }
  ///
  setKeyConfig = async (configs: ConfigValue[]) => {
    //console.error(configs)
    const macros = configs.filter((v) => v.type === 'ConfigMacro')
    if (macros.length > 19) throw Error('宏最多写入19条')
    let macroIndex = 0
    const b = Buffer.alloc(64)
    b[0] = 0x06
    b[1] = this.currentProfile
    b[2] = 0xc0
    b[3] = 0x01
    const allChangeArr: {
      changeArr: number[],
      orginHid: number,
      index?: number
    }[] = []
    for (let i = 0; i < configs.length; i++) {
      let changeArr: number[]
      const config = configs[i]
      switch (config.type) {
        case 'forbidden':
          changeArr = [0, 0, 0, 0]
          break
        case 'combo':
          changeArr = [0, skeyToHidTable[config.skey], config.key, config.key2]
          break
        case 'ConfigChangeToMouseBtn':
          changeArr = [...mouseKeyTable[config.key]]
          break
        case 'ConfigFunction':
          changeArr = [...specialFunTablectionMap[config.key]]
          break
        case 'ConfigMacro':


          let mt: number
          switch (config.macroType) {
            case 'repeat_times':
              mt = 0
              break
            case 'touch_repeat':
              mt = 2
              break
            case 'on_off':
              mt = 1
              break
            default:
              mt = 0
              break
          }
          changeArr = [9, mt, macroIndex, 0]
          //console.log(changeArr)
          //写入宏
          //console.log('HHHHHHHHH', config)
          if (!(await this.setMacro(config, macroIndex)))
            throw Error('写入宏失败')
          macroIndex++
          break
        default:
          changeArr = [0, 0, 0, 0]
          break
      }
      allChangeArr.push({
        changeArr: changeArr,
        orginHid: config.original,
        index: config.index
      })
    }
    // console.log(allChangeArr)
    const matrix = this.changeAllConfig(allChangeArr)

    /////
    const h = await this.writeFeatureCmd(b)
    if (!h) return undefined
    ////
    console.log('下命令 ！！！：', matrix)
    for (let i = 0; i < 7; i++) {
      // console.log('第', i, '条', i * 64, ' : ', 64 + i * 64, matrix.slice(i * 64, 64 + i * 64))
      const buf = Buffer.from(matrix.slice(i * 64, 64 + i * 64))
      const sucess = await this.writeFeatureCmd(buf)
      if (!sucess) return false
    }

    return true

  }
  /*
  /////
  //fn 键暂时先不改 后面再说， 协议里有 但是 码比较特殊(已处理)
  // 协议 不支持 狙击键 和 火力键
  setKeyMatrix = async (config: ConfigValue, profile: number = 0) => {
    const currentMatrix = await this._getKeyMatrix(profile)
    // console.log('currentMatrix :', currentMatrix)
    if (currentMatrix === undefined) return undefined
    if (currentMatrix.length != 448) return undefined
    const b = Buffer.alloc(64)
    b[0] = 0x06
    b[1] = profile
    b[2] = 0xc0
    b[3] = 0x01

    let changeArr: Array<number>
    let macroIndex = 0
    switch (config.type) {
      case 'forbidden':
        changeArr = [0, 0, 0, 0]
        break
      case 'combo':
        changeArr = [0, skeyToHidTable[config.skey], config.key, config.key2]
        break
      case 'ConfigChangeToMouseBtn':
        changeArr = [...mouseKeyTable[config.key]]
        break
      case 'ConfigFunction':
        changeArr = [...specialFunTablectionMap[config.key]]
        break
      case 'ConfigMacro':
        const configs = await this.matrixToConfigValues([...currentMatrix])
        const macros = configs.filter((v) => v.type === 'ConfigMacro')
        macroIndex = macros.length
        //console.log('macroIndex', macroIndex)
        if (macros.length > 19) return Error('宏最多写入19条')
        let mt: number
        switch (config.macroType) {
          case 'repeat_times':
            mt = 0
            break
          case 'touch_repeat':
            mt = 1
            break
          case 'on_off':
            mt = 2
            break
          default:
            mt = 0
            break
        }
        changeArr = [9, mt, macroIndex, 0]
        //console.log(changeArr)
        //写入宏
        if (!(await this.setMacro(config, macroIndex)))
          return Error('写入宏失败')
        //macroIndex++
        break
      default:
        changeArr = [0, 0, 0, 0]
        break
    }
    const matrix = changeMatrix(config.original, changeArr, [...currentMatrix])

    if (matrix === undefined) return undefined

    /////
    const h = await this.writeFeatureCmd(b)
    if (!h) return undefined
    ////
    console.log('下命令 ！！！：', matrix)
    for (let i = 0; i < 7; i++) {
      // console.log('第', i, '条', i * 64, ' : ', 64 + i * 64, matrix.slice(i * 64, 64 + i * 64))
      const buf = Buffer.from(matrix.slice(i * 64, 64 + i * 64))
      const sucess = await this.writeFeatureCmd(buf)
      if (!sucess) return false
    }

    return true
  }*/

  getKeyConfig = async () => {
    const buf = await this._getKeyMatrix()
    if (buf === undefined) return undefined
    console.log('读出来的 matirx', buf)
    return this.matrixToConfigValues([...buf])
  }

  protected async _getKeyMatrix() {
    const b = Buffer.alloc(64)
    b[0] = 0x86
    b[1] = this.currentProfile
    const buf = await this.commomFeature(b)

    if (buf === undefined) return undefined
    let res = Buffer.alloc(0)
    for (let i = 0; i < 7; i++) {
      const b = await this.readFeatureCmd(10)
      //console.error('BBBBBB', i, b)
      if (b === undefined) throw '_getKeyMatrix !!!undefine'

      if (b != undefined) res = Buffer.concat([res, b])
    }
    return res
  }
  checkMacroLenthIsFull = (marcoArr: MacroEvent[]) => {
    let bufIndex = 0
    bufIndex += 2
    let needDely = false

    for (let i = 0; i < marcoArr.length; i++) {

      const setAttr = (cur: MouseButton | MouseMove | KeyBoard) => {
        let attrNum = 0
        if (i + 1 < marcoArr.length) {
          const m = marcoArr[i + 1]
          if (m.type === 'delay' && m.value <= 127) {
            attrNum = m.value
          }
        }

        if (cur.type !== 'mouse_move')
          attrNum = (attrNum << 1) | (cur.action === 'down' ? 1 : 0)
        bufIndex++
        needDely = true
        if (attrNum > 1) {
          needDely = false
          i++
        }
      }
      const tmpME = marcoArr[i]

      if (tmpME.type !== 'delay' && needDely === true) {
        bufIndex += 2
      }
      switch (tmpME.type) {
        case 'delay':
          if (needDely) {
            bufIndex += 2
          } else {
            bufIndex += 2
            bufIndex += 2
          }
          needDely = false
          break
        case 'keyboard':
          bufIndex++
          needDely = true//写这里为了消除警告 tslint bug
          setAttr(tmpME)
          break
        case 'mouse_button':
          bufIndex++
          setAttr(tmpME)
          break
        case 'mouse_move':
          bufIndex++
          setAttr(tmpME)
          bufIndex++
          bufIndex++
          break
        default:
          break
      }
      if (bufIndex >= 256 - 8) return true
      //console.log('第i次 buf', buf, i, needDely, tmpME)
    }
    return false
  }
  private setMacro = async (macros: ConfigMacro, index: number) => {

    console.log('setMacrosetMacrosetMacrosetMacrosetMacrosetMacrosetMacrosetMacrosetMacro', macros)
    const b = Buffer.alloc(64)
    b[0] = 0x08
    b[1] = index
    b[2] = 0x00
    b[3] = 0x01
    const h = await this.writeFeatureCmd(b)
    if (h === false) return false
    const marcoArr: MacroEvent[] = macros.macro

    const buf = Buffer.alloc(256)
    let bufIndex = 0
    //写入重复次数
    buf.writeUInt16LE(macros.repeatCount, 0)
    bufIndex += 2
    let needDely = false
    //
    console.log('marcoArrmarcoArrmarcoArrmarcoArr', marcoArr)
    for (let i = 0; i < marcoArr.length; i++) {

      const setAttr = (cur: MouseButton | MouseMove | KeyBoard) => {
        let attrNum = 0
        if (i + 1 < marcoArr.length) {
          const m = marcoArr[i + 1]
          if (m.type === 'delay' && m.value <= 127) {
            attrNum = m.value
          }
        }
        if (cur.type !== 'mouse_move')
          attrNum = cur.action === 'down' ? setBit(attrNum, 7, 1) : setBit(attrNum, 7, 0)
        console.log('attrNum :', attrNum)
        buf.writeUInt8(attrNum, bufIndex)
        bufIndex++
        needDely = true
        if ((attrNum & 0x7f) > 0) {
          needDely = false
          i++
        }

      }
      const tmpME = marcoArr[i]
      console.log('tmpMEtmpMEtmpMEtmpMEtmpME', tmpME, i, needDely)
      if (tmpME.type !== 'delay' && needDely === true) {
        buf.writeUInt16LE(0, bufIndex) //必须有间隔
        bufIndex += 2
      }


      switch (tmpME.type) {
        case 'delay':
          if (needDely) {
            buf.writeUInt16LE(tmpME.value, bufIndex)
            bufIndex += 2
          } else {
            buf.writeUInt16LE(0, bufIndex)
            bufIndex += 2
            buf.writeUInt16LE(tmpME.value, bufIndex)
            bufIndex += 2
          }
          needDely = false
          break
        case 'keyboard':
          buf.writeUInt8(tmpME.value, bufIndex)
          bufIndex++
          needDely = true//写这里为了消除警告 tslint bug
          setAttr(tmpME)
          break
        case 'mouse_button':
          buf.writeUInt8(mouseKeyTable[tmpME.value][2], bufIndex)
          bufIndex++
          setAttr(tmpME)
          break
        case 'mouse_move':
          /*v1
                    0x00 0xf9 [   0x00 0x00  ]
                    Y    X    [  delay       ]
          */
          /*v2
                    xy:
                    
                    delay<127
                    
                    0xf9  | delay | x | y
                    
                    delay>= 127
                    
                    0xf9 | 0 | x | y | delay_L | delay_H

          */
          buf.writeUInt8(0xf9, bufIndex)
          bufIndex++
          setAttr(tmpME)
          buf.writeInt8(tmpME.dx, bufIndex)
          bufIndex++
          buf.writeInt8(tmpME.dy, bufIndex)
          bufIndex++
          break
        default:
          break
      }
      //console.log('第i次 buf', buf, i, needDely, tmpME)
    }
    //
    console.log('写入的红', [...buf].map(v => v.toString(16)))
    for (let i = 0; i < 4; i++) {
      const bufS = Buffer.from([...buf.slice(i * 64, 64 + i * 64)])

      const sucess = await this.writeFeatureCmd(bufS)

      if (!sucess) return false
    }

    return true
  }
  //关掉 按键 的 hid 数组
  setLightPic = async (pic: UserPicItem[]) => {
    const b = Buffer.alloc(64)
    b[0] = 0x09
    b[1] = 0
    b[2] = 0x14
    b[3] = 0x00

    const buf = Buffer.alloc(64).fill(0xff)
    const indexArr = pic.map((v) => this.findIndexInDefaultMatrix(v.hid))
    console.log('user pic indexArr', pic, indexArr)
    for (let i = 0; i < indexArr.length; i++) {
      const index = indexArr[i]
      //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', index)
      if (index === undefined)
        throw Error('setLightPic 没有找到对应的hid')
      const n = buf.readUInt8(Math.floor(index / 8))
      buf.writeUInt8(setBitTo0(n, index % 8), Math.floor(index / 8))
    }
    //
    const h = await this.writeFeatureCmd(b)
    if (h === false) return false
    console.log('BBBBUUUUFFFF', buf)
    return await this.writeFeatureCmd(buf)
  }

  getLightPic = async () => {
    const b = Buffer.alloc(64)
    b[0] = 0x89
    b[1] = 0

    const buf = await this.commomFeature(b)
    if (buf === undefined) return buf

    const res = await this.readFeatureCmd()
    if (res === undefined) return undefined

    console.log('RRRREEEESSSS ', res)
    let hidArr: number[] = []

    for (let i = 0; i < res.length; i++) {
      const resI = res[i]
      if (resI !== 0xff) {
        const indexArr = getUint8Bit0Index(resI)
        //console.log('getUint8Bit0Index!!!!!', indexArr)
        hidArr = hidArr.concat(indexArr.map((v) => {
          //console.log('findHidWithIndexInMatrix', v + i * 8, '------->>>>', this.findHidWithIndexInMatrix(v + i * 8))
          return this.findHidWithIndexInMatrix(v + i * 8)
        }))
      }
    }
    console.log('PICPIChidArrhidArrhidArrhidArr!!!!!', hidArr.filter(v => v !== undefined).map(v => {
      return {
        hid: v,
        rgb: 0
      }
    }))
    return hidArr.filter(v => v !== undefined).map(v => {
      return {
        hid: v,
        rgb: 0
      }
    })
  }
  getMacro = async (index: number) => {
    //for dev
    const b = Buffer.alloc(64)
    b[0] = 0x88
    b[1] = index
    const buf = await this.commomFeature(b)
    if (buf === undefined) return undefined
    let res = Buffer.alloc(0)
    for (let i = 0; i < 4; i++) {
      const b = await this.readFeatureCmd()
      if (b != undefined) res = Buffer.concat([res, b])
    }
    return this.buffToMacroEvents(res)
  }
  setReSet = async () => {
    const b = Buffer.alloc(64)
    b[0] = 0x0a
    const res = await this.writeFeatureCmd(b)
    await sleep(2000)
    return res
  }


  matrixToConfigValues = async (matrix: Array<number>) => {
    if (matrix.length !== this.defaultMatrix.length) return []
    const configArr: Array<ConfigValue> = []
    for (let i = 0; i < matrix.length; i += 4) {
      const nArr4 = matrix.slice(i, i + 4)
      const dArr4 = this.defaultMatrix.slice(i, i + 4)
      let index: number = 0
      if (!equals(nArr4, dArr4)) {
        for (let j = 0; j < i; j += 4) {
          if (equals(dArr4, this.defaultMatrix.slice(j, j + 4))) {
            index++
          }
        }
        let orginHid = dArr4[2]
        ///fn 判断
        if (equals(dArr4, [0x0a, 0x01, 0, 0])) {
          orginHid = 0x0a010000
        }
        ///
        if (equals(nArr4, [0, 0, 0, 0])) {
          //禁用
          configArr.push({
            type: 'forbidden',
            original: orginHid,
            index: index === 0 ? undefined : index
          })
        } else if (nArr4[0] === 0) {
          //组合键[0, skeyToHidTable[config.skey], config.key, config.key2]
          configArr.push({
            type: 'combo',
            original: orginHid,
            skey: valueForKey(skeyToHidTable, nArr4[1])!, // as SpecialKey,
            key: nArr4[2],
            key2: nArr4[3],
            index: index === 0 ? undefined : index
          })
        } else if (nArr4[0] === 1) {
          //鼠标键 [...mouseKeyTable[config.key]]
          configArr.push({
            type: 'ConfigChangeToMouseBtn',
            original: orginHid,
            key: valueForIndex(mouseKeyTable, nArr4)!, //Number(valueForKey(mouseKeyTable, nArr4))
            index: index === 0 ? undefined : index
          })
        } else if (nArr4[0] === 3) {
          //特殊功能 [...specialFunTablectionMap[config.key]]
          configArr.push({
            type: 'ConfigFunction',
            original: orginHid,
            key: valueForKey(specialFunTablectionMap, [...nArr4])!, // as CommonSpecialFuntion
            index: index === 0 ? undefined : index
          })
        } else if (nArr4[0] === 9) {
          //宏
          let mt: MacroRepeatType
          switch (nArr4[1]) {
            case 0:
              mt = 'repeat_times'
              break
            case 2:
              mt = 'touch_repeat'
              break
            case 1:
              mt = 'on_off'
              break
            default:
              mt = 'repeat_times'
              break
          }
          let macroEventArr

          const res = await this.getMacro(nArr4[2])
          if (res !== undefined)
            macroEventArr = res


          configArr.push({
            type: 'ConfigMacro',
            original: orginHid,
            macro: macroEventArr === undefined ? [] : macroEventArr.macroEvents,
            macroType: mt,
            repeatCount: macroEventArr === undefined ? 0 : macroEventArr.repeatCount,
            index: index === 0 ? undefined : index
          })
        } else if (equals(nArr4, [0x0a, 0x01, 0, 0])) {//改建改为fn 正常不会发生
          console.log('改 fn 按键', nArr4, dArr4)
          configArr.push({
            type: 'combo',
            original: orginHid,
            skey: 'none',
            key: 0x0a010000,
            key2: 0,
            index: index === 0 ? undefined : index
          })
        } else {
          console.error('matrix 未知类型:', nArr4)
        }
      }
    }
    return configArr
  }



  //////
  buffToMacroEvents = (macroBuff: Buffer) => {
    console.log('读出来的宏', macroBuff)
    const macroEvents: MacroEvent[] = []
    const repeatConut = macroBuff.readUInt16LE(0)
    let index = 2
    let tBuff = macroBuff.slice(index, index + 4)
    index += 4
    while (index < macroBuff.length) {
      //console.log(tBuff, index, macroBuff.length)
      if (tBuff[0] === 0xf9) {//指针移动
        /*v1
                  0x00 0xf9 [   0x00 0x00  ]
                  Y    X    [  delay       ]
        */
        /*v2
                  xy:
                  
                  delay<127
                  
                  0xf9  | delay | x | y
                  
                  delay>= 127
                  
                  0xf9 | 0 | x | y | delay_L | delay_H
  
        */
        macroEvents.push({
          type: 'mouse_move',
          dx: tBuff[2],
          dy: tBuff[3],
        })
        let delay = 0
        if (tBuff[1] !== 0) {
          delay = tBuff[1] >> 1
        } else {
          const t = macroBuff.slice(index, index + 2)
          index += 2
          delay = t.readUInt16LE(0)
        }
        macroEvents.push({
          type: 'delay',
          value: delay
        })
        // const t = macroBuff.slice(index, index + 4)
        // index += 4

        // macroEvents.push({
        //   type: 'mouse_move',
        //   dy: t.readInt8(0),
        //   dx: t.readInt8(1),
        // })
        // const delay = t.readUInt16LE(2)
        // macroEvents.push({
        //   type: 'delay',
        //   value: delay
        // })
      } else {//按键
        if (tBuff[0] <= 0xef && tBuff[0] >= 0x04) {//键盘
          macroEvents.push({
            type: 'keyboard',
            action: getBit(tBuff[1], 7) === 0 ? 'up' : 'down',
            value: tBuff[0]
          })
        } else {
          const mk = valueForKey(mouseKeyTable, [0x01, 0, tBuff[0], 0])
          if (mk !== undefined) {
            macroEvents.push({
              type: 'mouse_button',
              action: getBit(tBuff[1], 7) === 0 ? 'up' : 'down',
              value: Number(mk)
            })
          }
        }
        let delay = 0
        if ((tBuff[1] & 0x7f) > 1) {

          delay = tBuff[1] & 0x7f
          index -= 2

        } else {
          delay = tBuff.readUInt16LE(2)
        }
        macroEvents.push({
          type: 'delay',
          value: delay
        })

      }




      tBuff = macroBuff.slice(index, index + 4)
      if (equals(tBuff, Buffer.from([0, 0, 0, 0]))) break
      index += 4


    }
    // const t = macroEvents[macroEvents.length - 1]
    // if (t.type === 'delay' && t.value === 0) {
    //   macroEvents.pop()
    // }
    //console.log('@@@@@', macroEvents.filter(v => !(v.type === 'delay' && v.value === 0)))
    return {
      macroEvents: macroEvents.filter(v => !(v.type === 'delay' && v.value === 0)),
      repeatCount: repeatConut
    }
  }


  findHidWithIndexInMatrix = (index: number) => {


    if (this.defaultMatrix[index * 4] === 0x0a && this.defaultMatrix[index * 4 + 1] === 0x01 && this.defaultMatrix[index * 4 + 2] === 0 && this.defaultMatrix[index * 4 + 3] === 0) {
      return 0x0a010000
    }

    return this.defaultMatrix[index * 4 + 2]
  }
  findIndexInDefaultMatrix = (hid: number, findIndex?: number) => {
    let currentFindeIndex = 0
    if (hid === 0x0a010000) {//fn 特殊处理
      let index = 0
      for (let i = 0; i < this.defaultMatrix.length; i += 4) {
        const buf = Buffer.from(this.defaultMatrix.slice(i, i + 4))
        if (hid === buf.readUInt32BE()) {
          if (findIndex === undefined || findIndex == currentFindeIndex) {
            return index
          } else {
            currentFindeIndex++
          }

        }
        index++
      }
    }
    let index = 0
    for (let i = 0; i < this.defaultMatrix.length; i += 4) {
      if (hid === this.defaultMatrix[i + 2]) {
        if (findIndex === undefined || findIndex == currentFindeIndex) {
          return index
        } else {
          currentFindeIndex++
        }

      }
      index++
    }
    return undefined
  }

  changeAllConfig = (changeArr: {
    changeArr: number[],
    orginHid: number,
    index?: number
  }[]) => {
    let res = [...this.defaultMatrix]
    changeArr.forEach(v => {
      const t = this.changeMatrix(v.orginHid, v.changeArr, res, v.index)
      if (t !== undefined) res = t
    })
    return res
  }

  changeMatrix = (
    orginHid: number,
    changeArr: Array<number>,
    currentMatrix: Array<number>,
    index?: number
  ) => {
    const copyMatrix = [...currentMatrix]
    let i = 2
    let isExist = false
    let searchCount = 0
    for (; i < this.defaultMatrix.length; i += 4) {
      //判断fn
      if (orginHid === 0x0a010000) {

        //改建为fn

        if (equals(this.defaultMatrix.slice(i - 2, i + 2), [0x0a, 0x01, 0, 0])) {
          if (index === undefined || searchCount === index) {
            isExist = true
            break
          } else {
            searchCount++
            continue
          }
        }
      }

      if (orginHid === this.defaultMatrix[i]) {
        if (index === undefined || searchCount === index) {
          isExist = true
          break
        } else {
          searchCount++
          continue
        }
      }
    }

    if (!isExist) return undefined

    copyMatrix[i - 1 - 1] = changeArr[0]
    copyMatrix[i - 1] = changeArr[1]
    copyMatrix[i] = changeArr[2]
    copyMatrix[i + 1] = changeArr[3]
    return copyMatrix
  }
  send64 = async (arr: number[]) => {
    //console.log(arr.concat(new Array(64 - arr.length)).length)
    let sendBuf = Buffer.from(arr.concat(new Array(64 - arr.length)))
    await this.writeFeatureCmd(sendBuf, 0)
  }
  upgrade = async (filePath: string, progressCallBack: (v: number) => void) => {

    await this.send64([0xAA, 0x55, 0xA5, 0x5A, 0xFF, 0x00, 0x33, 0xCC, 0x52])

    await this.send64([0x01, 0xAA, 0x55])

    const r1 = await this.readFeatureCmd()
    console.log(r1)

    await this.send64([0x03, 0xAA, 0x55])

    await this.send64([0x05, 0xAA, 0x55, 0x00, 0, 0, 0, 0, 0, 0x04])

    const r2 = await this.readFeatureCmd()
    console.log(r2)
    const fBuf = fs.readFileSync(filePath)
    console.log(fBuf.slice(0, 100))
    console.log('升级文件大小：', fBuf.length / 1024 + 'kb')
    for (let i = 0; i < fBuf.length; i += 64) {
      let p: Buffer
      if (i + 64 > fBuf.length) {
        p = fBuf.slice(i)
      } else {
        p = fBuf.slice(i, 64 + i)
      }
      progressCallBack(i / fBuf.length)
      //console.log(i, p)
      await this.send64([...p])
    }
    const res = await this.readFeatureCmd()
    console.log('升级结果', res)
    await this.send64([0x07, 0xAA, 0x55, 0, 0, 0, 0, 0, 0, 0xFF])
    progressCallBack(1)
    return true

  }
}




const specialFunTablectionMap = {
  上一曲: [0x03, 0x00, 0xb6, 0x00],
  下一曲: [0x03, 0x00, 0xb5, 0x00],
  停止: [3, 0, 0xb7, 0],
  '播放/暂停': [3, 0, 0xcd, 0],
  播放器: [3, 0, 0x83, 1],
  火力: [],
  狙击键: [],
  静音: [3, 0, 0xe2, 0],
  音量减: [3, 0, 0xea, 0],
  音量大: [3, 0, 0xe9, 0],
}


const mouseKeyTable: { [key in number]: Array<number> } = {
  [MouseKey.Left]: [0x01, 0x00, 0xf0, 0x00],
  [MouseKey.Right]: [0x01, 0x00, 0xf1, 0x00],
  [MouseKey.Middle]: [0x01, 0x00, 0xf2, 0x00],
  [MouseKey.Forward]: [0x01, 0x00, 0xf3, 0x00],
  [MouseKey.Back]: [0x01, 0x00, 0xf4, 0x00],
  [MouseKey.WheelLeft]: [0x01, 0x00, 0xf5, 0x00],
  [MouseKey.WheelRight]: [0x01, 0x00, 0xf6, 0x00],
  [MouseKey.WheelForward]: [0x01, 0x00, 0xf7, 0x00],
  [MouseKey.WheelBack]: [0x01, 0x00, 0xf8, 0x00],
  [MouseKey.Dpi]: [],
  [MouseKey.Key_1]: [],
  [MouseKey.Key_2]: [],
}

const skeyToHidTable: { [key in SpecialKey]: number } = {
  none: 0x00,
  alt: 226,
  ctrl: 224,
  shift: 0xe1,
  win: 227,
}




export const test = async () => {
  // console.log(
  //   'valueForKey:::  ',
  //   typeof valueForKey(mouseKeyTable, [0x01, 0x00, 0xf0, 0x00])
  // )
  // //console.log(await DeviceType.find())
  // const dev = await DeviceType.findOne({ where: { pid: 0x7044, vid: 0x0c45 } })
  // if (dev === undefined) throw '数据库里没这个设备'
  // const dk2017 = new Dk2017(dev)
  // console.log('open dk2017', await dk2017.open())

  // console.log('set report rate ', await dk2017.setReportRate(1000, 0))
  // console.log('get report rate ', await dk2017.getReportRate(0))

  // // console.log('firmware version', await dk2017.getFirmwareVersion())
  // // console.log('set current profile ', await dk2017.setCurrentProfile(1))
  // // console.log('get current profile ', await dk2017.getCurrentProfile())
  // // console.log('set keyboard option ', await dk2017.setKeyboardOption({
  // //     winKeyAppKeyLockControl: true,
  // //     keyboardLockControl: true,
  // //     wasdKeyAndArrowKeyExchange: false,
  // //     winKeyAndFnKeyExchange: true,
  // //     repeateKey: true
  // // }, 0))
  // // console.log('get keyboard option ', await dk2017.getKeyboardOption(0))
  // // console.log('set lightsetting ', await dk2017.setLightSetting({
  // //     type: 'LightWave',
  // //     speed: 1,//0~5,
  // //     option: 'right'
  // // }))
  // // console.log('get LightSetting ', await dk2017.getLightSetting())

  // console.log('set mode ', await dk2017.setMode('gaming', 0))
  // // console.log('get mode ', await dk2017.getMode(0))

  // //console.log('set key matrix', await dk2017.setKeyMatrix(0, { type: 'forbidden', original: 41 }))

  // // console.log('set key matrix', await dk2017.setKeyMatrix(0, {
  // //     type: 'ConfigMacro',
  // //     original: 9,//f
  // //     macro: [
  // //         { type: 'keyboard', action: 'down', value: 4 },
  // //         { type: 'delay', value: 0.5 },
  // //         { type: 'delay', value: 0.5 },
  // //         { type: 'keyboard', action: 'up', value: 4 },
  // //         { type: 'keyboard', action: 'down', value: 4 },
  // //         { type: 'delay', value: 0.5 },
  // //         { type: 'keyboard', action: 'up', value: 4 }],
  // //     macroType: 'repeat_times',
  // //     repeatCount: 10
  // // }))
  // console.log(
  //   'set key matrix',
  //   await dk2017.setKeyMatrix({
  //     type: 'ConfigMacro',
  //     original: 41, //esc
  //     macro: [
  //       { type: 'keyboard', action: 'down', value: 5 },
  //       { type: 'delay', value: 0.5 },
  //       { type: 'delay', value: 0.5 },
  //       { type: 'keyboard', action: 'up', value: 5 },
  //       { type: 'keyboard', action: 'down', value: 5 },
  //       { type: 'delay', value: 0.5 },
  //       { type: 'keyboard', action: 'up', value: 5 },
  //     ],
  //     macroType: 'repeat_times',
  //     repeatCount: 10,
  //   })
  // )
  // console.log(
  //   'set key matrix',
  //   await dk2017.setKeyMatrix({
  //     type: 'combo',
  //     skey: 'none',
  //     key: 91,
  //     key2: 0,
  //     original: 0x0a010000,
  //   })
  // )

  // console.log('getKeyMatrix  ', await dk2017.getKeyMatrix(0))
  //console.log('getMacro  ', await dk2017.getMacro())
  // console.log('setLightPic   ', await dk2017.setLightPic([4]))
  // console.log('getLightPic   ', await dk2017.getLightPic())

  //console.log('setReSet  ', await dk2017.setReSet())
  // setTimeout(async () => {
  //     console.log(await dk2017.getKeyMatrix(0))
  // }, 50);
}
