import { USBDevice } from '../usb/USBDevice'
import { equals } from 'ramda'
import R = require('ramda')
import { MouseInterface } from './MouseInterface'


export class V25s extends USBDevice implements MouseInterface {
    //0x24ae, 0x4219, 0x01, 0xff01
    // constructor() {
    //     super({
    //         vid: 0x24ae,
    //         pid: 0x4219,
    //         usage: 0x01,
    //         usagePage: 0xff01
    //     })
    // }
    upgrade = async () => {
        return true
    }
    checkMacroLenthIsFull = () => true
    getLogoLightSetting = async (): Promise<LightSetting> => ({ type: 'LightOff' })
    setLogoLightSetting = async (t: LightSetting) => true
    type: 'mouse' = 'mouse'
    setReSet = async () => { return false }
    async getFirmwareVersion() {
        const b = Buffer.alloc(8)
        b[0] = 0x80
        const buf = await this.commomFeature(b)
        return buf?.readUInt16BE(1)
    }
    setReportRate = async (rate: 500 | 250 | 125 | 1000) => {
        let num
        switch (rate) {
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
        const b = Buffer.alloc(8)
        b[0] = 0x01
        b[1] = num
        const res = await this.commomFeature(b)
        if (res === undefined) return false
        return true
    }

    async getReportRate() {
        const buf = await this.commomFeature(Buffer.from([0x81]))
        const num = buf?.readUInt8(1)
        switch (num) {
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
    async setDPI(dpiArr: Array<number>) {//200 - 5000 //7个档位

        await this.writeFeatureCmd(Buffer.from([0x11, 0x01, 0x07, 0x10, 0, 0, 0, 0]))

        const hexDpiArr = []

        for (let i = 0; i < 7; i++) {
            if ((dpiArr.length < 7) && (dpiArr.length === i))
                hexDpiArr.push(0xff)
            else
                hexDpiArr.push(Math.floor((dpiArr[i] - 100) / 100))
        }
        //hexDpiArr.unshift(0)
        const emptyArr = new Array(32 - hexDpiArr.length)
        const buf = Buffer.from(hexDpiArr.concat(emptyArr))
        //console.log(buf, buf.length)
        const res = await this.writeDataCmd(buf)
        if (res === undefined) return false
        return true
    }
    async getDpi() {
        await this.writeFeatureCmd(Buffer.from([0x91, 0x01]))
        await this.readFeatureCmd()
        const buf = await this.readDataCmd()
        if (buf) {
            const arr = [...buf]

            return arr.map(v => v === 0 ? 0 : v * 100 + 100).slice(0, 7)
        } else {
            return undefined
        }
    }

    async getCurrentDpi() {
        const buf = await this.commomFeature(Buffer.from([0x8b, 0x01]))
        if (buf === undefined) return undefined

        return {
            dpiValue: buf.readUInt8(2) * 100 + 100,
            dpiNum: buf.readUInt8(3)
        }
    }
    async setLightSetting(lightSet: LightSetting) {
        let isSuccess = false
        switch (lightSet.type) {
            case 'LightSpectrumCycle':
                isSuccess = await this.writeFeatureCmd(Buffer.from([0x0d, 0x01, 0x04, 0x0a, 0x02]))
                break
            case 'LightAPMBreatheCycle':
                isSuccess = await this.writeFeatureCmd(Buffer.from([0x0d, 0x01, 0x03, 0x02, 0x03]))
                break
            case 'LightOff':
                isSuccess = await this.writeFeatureCmd(Buffer.from([0x0d, 0x01]))
                break
            case 'LightBreath':
                isSuccess = await this.writeFeatureCmd(Buffer.from([0x0d, 0x01, 0x02, lightSet.speed, 0x01]))
                break
            case 'LightAlwaysOn':
                isSuccess = await this.writeFeatureCmd(Buffer.from([0x0d, 0x01, 0x01, lightSet.value, 0x01]))
                break
            case 'LightDreamColorChange':
                if (lightSet.option === 'certain') isSuccess = false
                isSuccess = await this.writeFeatureCmd(Buffer.from([0x0d, 0x01, 0x05, lightSet.speed, 0]))
                break
            default:
                isSuccess = false
                break
        }
        if (!isSuccess) return false
        if (lightSet.type === 'LightAlwaysOn' || lightSet.type === 'LightBreath') {
            const r = (lightSet.rgb & 0xff0000) >> 16
            const g = (lightSet.rgb & 0x00ff00) >> 8
            const b = (lightSet.rgb & 0x0000ff)
            console.log('*** ', lightSet.rgb.toString(16), r.toString(16), g.toString(16), b.toString(16))
            return await this.writeFeatureCmd(Buffer.from([0x0c, 0x01, g, r, b]))
        }
        return true
    }

    async getLightSetting(): Promise<LightSetting | undefined> {
        const ledEffect = await this.commomFeature(Buffer.from([0x8d, 0x01]))
        let lightSetting: LightSetting
        if (ledEffect === undefined) return undefined

        switch (ledEffect[2]) {
            case 0:
                lightSetting = { type: 'LightOff' }
                break
            case 1:
                lightSetting = {
                    type: 'LightAlwaysOn',
                    value: ledEffect[3],
                    rgb: 0
                }
                break
            case 2:
                lightSetting = {
                    type: 'LightBreath',
                    speed: ledEffect[3],
                    rgb: 0
                }
                break
            case 3:
                lightSetting = {
                    type: 'LightAPMBreatheCycle',
                }
                break
            case 4:
                lightSetting = {
                    type: 'LightSpectrumCycle'
                }
                break
            case 5:
                if (ledEffect[3] !== 1 && ledEffect[3] !== 2 && ledEffect[3] !== 3) return undefined
                else
                    lightSetting = {
                        type: 'LightDreamColorChange',
                        speed: ledEffect[3],
                        option: ledEffect[4] === 0 ? 'metabolic' : 'certain',
                        rgb: [0]

                    }
                break
            default:

                return undefined
        }
        if (lightSetting.type === 'LightAlwaysOn' || lightSetting.type === 'LightBreath') {
            const rgbBuf = await this.commomFeature(Buffer.from([0x8c, 0x01]))
            if (rgbBuf === undefined) return undefined
            const r = rgbBuf[3]
            const g = rgbBuf[2]
            const b = rgbBuf[4]

            lightSetting.rgb = (r << 16) | (g << 8) | (b)
        }

        return lightSetting

    }

    async setKeyConfig(config: ConfigValue[]) {


        let leftCode: number[] = mapOrginMouseKeyToArr(MouseKey.Left)
        let rightCode: number[] = mapOrginMouseKeyToArr(MouseKey.Right)
        let midCode: number[] = mapOrginMouseKeyToArr(MouseKey.Middle)
        let dpiCode: number[] = mapOrginMouseKeyToArr(MouseKey.Dpi)
        let backCode: number[] = mapOrginMouseKeyToArr(MouseKey.Back)
        let forwardCode: number[] = mapOrginMouseKeyToArr(MouseKey.Forward)
        let wheelForwardCode: number[] = mapOrginMouseKeyToArr(MouseKey.WheelForward)
        let wheelbackCode: number[] = mapOrginMouseKeyToArr(MouseKey.WheelBack)

        const setMouseCode = (original: MouseKey, changeCode: Array<number>) => {
            switch (original) {
                case MouseKey.Left:
                    leftCode = changeCode
                    break
                case MouseKey.Right:
                    rightCode = changeCode
                    break
                case MouseKey.Middle:
                    midCode = changeCode
                    break
                case MouseKey.Dpi:
                    dpiCode = changeCode
                    break
                case MouseKey.Forward:
                    forwardCode = changeCode
                    break
                case MouseKey.Back:
                    backCode = changeCode
                    break
                case MouseKey.WheelBack:
                    wheelbackCode = changeCode
                    break
                case MouseKey.WheelForward:
                    wheelForwardCode = changeCode
                    break
                default:
                    break;
            }
        }
        //先处理宏
        const macroArr = config.filter(v => v.type === 'ConfigMacro')
        if (macroArr.length > 6) throw Error('宏最多有六个')
        //
        const macroIndexMap = new Map<MouseKey, { code: Buffer, length: number, index: number }>()
        for (let i = 0; i < macroArr.length; i++) {
            const macro = macroArr[i]
            if (macro.type !== 'ConfigMacro') continue

            const { codeBuf, length } = macroEventToCode(macro)

            macroIndexMap.set(macro.original as number, {
                code: codeBuf,
                length: length,
                index: i + 1
            })
        }

        if (! await this.writeFeatureCmd(Buffer.from([0x12, 0x01, 0x00, 0x40])))
            return false

        config.forEach(v => {
            if (v.type === 'ConfigMacro') {
                const r = macroIndexMap.get(v.original as number)
                if (r === undefined) throw Error('macroIndexMap Errr')
                setMouseCode(v.original as number, [0x09, 0, r.index, 0])
                return
            }
            let changeCode: number[] | undefined
            changeCode = handleConfig(v)
            if (changeCode === undefined) return
            setMouseCode(v.original as number, changeCode)
        })
        console.log(leftCode.concat(rightCode, midCode, dpiCode, backCode, forwardCode, new Array(8).fill(0)).length)
        const res1 = await this.writeDataCmd(Buffer.from(leftCode.concat(rightCode, midCode, dpiCode, backCode, forwardCode, new Array(8).fill(0))))
        const res2 = await this.writeDataCmd(Buffer.from(new Array(24).fill(0).concat(wheelForwardCode, wheelbackCode)))
        if (!(res1 && res2)) return false


        for (let value of macroIndexMap.values()) {
            const res1 = await this.writeFeatureCmd(Buffer.from([0x13, 1, value.index, 0, 2]))
            if (res1 === false) return false
            for (let i = 0; i < 32; i++) {
                const buf = value.code.slice(i * 32, i * 32 + 32)
                //console.log('i = ', i, buf, value.code)
                const res2 = await this.writeDataCmd(buf)
                if (res2 === false) return false
            }
        }
        return true
    }

    async getKeyConfig() {

        if (!await this.commomFeature(Buffer.from([0x92, 0x01]))) return undefined

        const buf = await this.readDataCmd()

        if (buf === undefined) return undefined

        const leftCode = buf.slice(0, 4)
        const rightCode = buf.slice(4, 8)
        const midCode = buf.slice(8, 12)
        const dpiCode = buf.slice(12, 16)
        const backCode = buf.slice(16, 20)
        const forwardCode = buf.slice(20, 24)
        const wheelForwardCode = buf.slice(buf.length - 8, buf.length - 8 + 4)
        const wheelbackCode = buf.slice(buf.length - 4, buf.length)

        const configArr: ConfigValue[] = []
        const c1 = codeToConfig(MouseKey.Left, leftCode)
        if (c1) configArr.push(c1)
        const c2 = codeToConfig(MouseKey.Right, rightCode)
        if (c2) configArr.push(c2)
        const c3 = codeToConfig(MouseKey.Middle, midCode)
        if (c3) configArr.push(c3)
        const c4 = codeToConfig(MouseKey.Dpi, dpiCode)
        if (c4) configArr.push(c4)
        const c5 = codeToConfig(MouseKey.Back, backCode)
        if (c5) configArr.push(c5)
        const c6 = codeToConfig(MouseKey.Forward, forwardCode)
        if (c6) configArr.push(c6)
        const c7 = codeToConfig(MouseKey.WheelForward, wheelForwardCode)
        if (c7) configArr.push(c7)
        const c8 = codeToConfig(MouseKey.WheelBack, wheelbackCode)
        if (c8) configArr.push(c8)
        //宏读取固件错误
        /*
                for (let i = 0; i < configArr.length; i++) {
                    const config = configArr[i]
                    if (config.type === 'ConfigMacro') {
                        const res1 = await this.commomFeature(Buffer.from([0x93, config.repeatCount,0,0,0,0,0,0]))//magic:repeatCount 用来代替macroindex 懒得再弄一个type了
                        if (res1 === undefined) throw Error('获取宏feature 失败')
                        let res2: Buffer = Buffer.alloc(0)
                        for (let i = 0; i < 32; i++) {
                            const buf = await this.readDataCmd()
                            if (buf === undefined) throw Error('buf === undefine i = ' + i)
                            res2 = Buffer.concat([res2, buf])
                        }
        
                        if (res2 === undefined) throw Error('readData undefine失败')
                        console.log('!!!', res2)
                        const res3 = codeToConfigMacro(res2, config.original)
                        if (res3 === undefined) throw Error('codeToConfigMacro undefine')
                        config.macro = res3.macro
                        config.macroType = res3.macroType
                        config.repeatCount = res3.repeatCount
        
                    }
                }
                */

        return configArr

    }

}
const codeToConfigMacro = (mBuf: Buffer, original: MouseKey) => {
    const res: ConfigMacro = {
        type: 'ConfigMacro',
        original: original,
        macroType: 'touch_repeat',
        repeatCount: 0,
        macro: []
    }
    const macroType = mBuf.readUInt16BE(0)
    if (macroType === 0) throw Error('macroType prase errr')
    if (macroType <= 0xfffd) {
        res.macroType = 'repeat_times'
        res.repeatCount = macroType
    }
    if (macroType === 0xfffe) {
        res.macroType = 'on_off'
    }
    if (macroType === 0xffff) {
        res.macroType = 'touch_repeat'
    }
    let readFlag = 2

    while (readFlag < mBuf.length) {
        if (readFlag + 2 < mBuf.length) throw Error('readFlag Length Err')
        const item = mBuf.readUInt16BE(readFlag)
        readFlag += 2
        if (item === 0) return res
        if (item <= 4) {
            let deltTime = 0//ms
            switch (item) {
                case 1:
                    deltTime = 10
                    break
                case 2: deltTime = 20
                    break
                case 3: deltTime = 50
                    break
                case 4: deltTime = 100
                default:
                    break;
            }
            const delayTime = mBuf.readUInt16BE(readFlag) * deltTime / 1000
            readFlag += 2
            res.macro.push({
                type: 'delay', value: delayTime
            })
            continue
        }
        if (item <= 8) {
            const move: MouseMove = {
                type: 'mouse_move',
                dx: 0,
                dy: 0
            }
            const moveValue = mBuf.readUInt16BE(readFlag)
            readFlag += 2
            switch (item) {
                case 5:
                    move.dx += moveValue
                    break
                case 6:
                    move.dx -= moveValue
                    break
                case 7:
                    move.dy += moveValue
                    break
                case 8:
                    move.dy -= moveValue
                    break
                default:
                    break;
            }
            res.macro.push(move)
        } else {
            const attr = mBuf[readFlag - 2]
            const hid = mBuf[readFlag - 1]
            const action = ((attr & 0b10000000) >> 7) === 0 ? 'down' : 'up'
            if (hid <= 0xf4 && hid > 0xf0) {
                const v = mapCodeToOrginMouseKey([0x01, 0x00, hid, 0x00])
                if (v === undefined) throw Error('nerver')
                res.macro.push({
                    type: 'mouse_button',
                    action: action,
                    value: v as number
                })
            } else {
                res.macro.push({
                    type: 'keyboard',
                    action: action,
                    value: hid
                })
            }

            res.macro.push({
                type: 'delay',
                value: ((attr & 0b01111111) - 1) * 10 / 1000
            })
        }
    }
    return undefined

}
const macroEventToCode = (m: ConfigMacro) => {
    const codeBuf = Buffer.alloc(1024)
    let bufIndex = 0
    switch (m.macroType) {
        case 'repeat_times':
            if (m.repeatCount > 0xfffd) m.repeatCount = 0xfffd
            codeBuf.writeUInt16BE(m.repeatCount, 0)
            break
        case 'on_off':
            codeBuf[0] = 0xff
            codeBuf[1] = 0xfe
            break
        case 'touch_repeat':
            codeBuf[0] = 0xff
            codeBuf[1] = 0xff
            break
        default:
            break
    }
    bufIndex = 2

    const trimMacroEvent = () => {
        let tempDeley: Delay | undefined = undefined
        const trimArr: Array<MacroEvent> = []
        m.macro.forEach(v => {
            if (v.type === 'delay') {
                if (tempDeley === undefined)
                    tempDeley = v
                else {
                    tempDeley.value += v.value
                    if (tempDeley.value > 6553) tempDeley.value = 6553
                }
            } else {
                if (tempDeley !== undefined) trimArr.push(tempDeley)
                tempDeley = undefined
                trimArr.push(v)
            }
        })
        return trimArr
    }
    const delayToBuf = (delayTime: number) => {
        const delayBuf = Buffer.alloc(4)

        let sc = 0
        let c = 0
        if (delayTime <= 655) {
            sc = 0x01
            c = Math.floor(delayTime / 10)
        } else if (delayTime <= 1310) {
            sc = 0x02
            c = Math.floor(delayTime / 20)
        } else if (delayTime <= 3276) {
            sc = 0x03
            c = Math.floor(delayTime / 50)
        } else if (delayTime <= 6553) {
            sc = 0x04
            c = Math.floor(delayTime / 100)
        }
        delayBuf.writeUInt8(sc, 1)
        delayBuf.writeUInt16BE(c, 2)
        return delayBuf
    }
    const getBuf = (event: MacroEvent | undefined, delay: Delay) => {
        if (event === undefined) return delayToBuf(delay.value)
        if (event.type === 'delay') throw ' evnet 类型不能是delay'

        let x = delay.value * 1000 / 10 + 1

        if (event.type === 'keyboard' || event.type === 'mouse_button') {
            const isTouch = event.action === 'down' ? 0 : 1
            const attr = (isTouch << 7) | (x > 0x7f ? 0 : x)
            const eventBuf = Buffer.alloc(2)
            eventBuf.writeUInt8(attr, 0)
            if (event.type === 'keyboard') eventBuf.writeUInt8(event.value, 1)
            if (event.type === 'mouse_button') eventBuf.writeUInt8(mapOrginMouseKeyToArr(event.value as number)[2], 1)
            console.log('attr ', attr, x > 0x7f, x, isTouch << 7)
            if (x > 0x7f) return Buffer.from([...delayToBuf(delay.value), ...eventBuf])
            return eventBuf
        }
        if (event.type === 'mouse_move') {
            const eventMoveBuf = Buffer.alloc(8)
            if (event.dx > 0x7fff) event.dx = 0x7fff
            if (event.dy > 0x7fff) event.dy = 0x7fff
            eventMoveBuf.writeUInt8((event.dx >= 0 ? 5 : 6), 1)
            eventMoveBuf.writeUInt16BE(Math.abs(event.dx), 2)
            eventMoveBuf.writeUInt8((event.dy >= 0 ? 7 : 8), 6)
            eventMoveBuf.writeUInt16BE(Math.abs(event.dy), 2)
            return Buffer.from([...delayToBuf(delay.value), ...eventMoveBuf])
        }
        return Buffer.alloc(0)
    }
    const trimMacroArr = trimMacroEvent()

    if (trimMacroArr[0].type === 'delay') {
        const buf = getBuf(undefined, trimMacroArr[0])
        buf.copy(codeBuf, bufIndex)
        bufIndex += buf.length

        trimMacroArr.shift()
    }
    //console.log(trimMacroArr, m.macro)
    const writeBuf = (buf: Buffer) => {
        buf.copy(codeBuf, bufIndex)
        bufIndex += buf.length
    }
    const delay0: Delay = { type: 'delay', value: 0 }
    for (let i = 0; i < trimMacroArr.length;) {

        const cur = trimMacroArr[i]
        const next = trimMacroArr[i + 1]

        if (cur.type === 'delay') {
            writeBuf(getBuf(undefined, cur))
            i++
            continue
        }
        if (next === undefined) {
            writeBuf(getBuf(cur, delay0))
            i++
            continue
        }
        if (next.type === 'delay') {
            writeBuf(getBuf(cur, next))
            i += 2
            continue
        } else {
            writeBuf(getBuf(cur, delay0))
            i += 1
            continue
        }
        ///

    }


    if (bufIndex > 512) throw Error('宏超长 最长只能512 byte')
    return { codeBuf, length: bufIndex }
}

const codeToConfig = (original: MouseKey, codeBuf: Buffer): ConfigValue | undefined => {
    const code = [...codeBuf]
    //console.log(code)
    const omk = mapCodeToOrginMouseKey(code)//按键改按键
    if (omk !== undefined) {
        //console.log('omk @@@ ', omk, original, omk == original)
        if (omk == original) return undefined
        return {
            type: 'ConfigChangeToMouseBtn',
            original: original,
            key: omk as number
        }
    }
    const sf = mapCodeToSpecialFunction(code)//特殊功能
    if (sf !== undefined) {
        return {
            type: 'ConfigFunction',
            original: original,
            key: sf
        }
    }
    if (code[0] === 7) {//禁用
        return {
            type: 'forbidden',
            original: original
        }
    }

    if (code[0] === 0)//组合
    {
        let skey: SpecialKey
        switch (code[2]) {
            case 0:
                skey = 'none'
                break
            case 1:
                skey = 'ctrl'
                break
            case 4:
                skey = 'alt'
                break
            case 2:
                skey = 'shift'
                break
            case 8:
                skey = 'win'
                break

            default:
                return undefined
        }
        return {
            type: 'combo',
            original: original,
            skey: skey,
            key: code[3],
            key2: 0
        }
    }
    if (code[0] === 9) {
        //宏 , todo
        return {
            type: 'ConfigMacro',
            original: original,
            macroType: 'touch_repeat',
            repeatCount: code[2],//magic 懒得再弄个type 了 
            macro: [],
        }
    }
    return undefined
}

const handleConfig = (config: ConfigValue) => {
    let change: number[] | undefined = undefined
    switch (config.type) {
        case 'ConfigChangeToMouseBtn':
            change = handleChangeToMouseBtn(config)
            break
        case 'ConfigFunction':
            change = hanldeConfigFunction(config)
            break
        case 'combo':
            change = handleCombo(config)
            break
        case 'forbidden':
            change = handleForbidden(config)
            break
        case 'ConfigMacro':
            //todo
            //change = [...macroEventToCode(config)]
            break
        default:
            break;
    }
    return change
}

const handleForbidden = (config: ConfigValue) => {
    if (config.type !== 'forbidden') return undefined
    return [0x07, 0x00, 0x00, 0x00]
}

const handleCombo = (config: ConfigValue) => {
    if (config.type !== 'combo') return undefined
    const arr = new Array(4).fill(0)
    switch (config.skey) {
        case 'alt':
            arr[1] = 0x04
            break
        case 'ctrl':
            arr[1] = 0x01
            break
        case 'shift':
            arr[1] = 0x02
            break
        case 'win':
            arr[1] = 0x08
            break
        default:
            break;
    }
    arr[2] = config.key
    return arr
}



enum MouseKey {
    Left = -1000,
    Right,
    Middle,
    Dpi,
    Forward,
    Back,
    WheelForward,
    WheelBack,
    WheelLeft,
    WheelRight,
    Key_1,
    Key_2,
}
const mapOrginMouseKey: { [key in number]: Array<number> | undefined } = {
    [MouseKey.Left]: [0x01, 0x00, 0xf0, 0x00],
    [MouseKey.Right]: [0x01, 0x00, 0xf1, 0x00],
    [MouseKey.Middle]: [0x01, 0x00, 0xf2, 0x00],
    [MouseKey.Dpi]: [0x07, 0x00, 0x03, 0x00],
    [MouseKey.Back]: [0x01, 0x00, 0xf3, 0x00],
    [MouseKey.Forward]: [0x01, 0x00, 0xf4, 0x00],
    [MouseKey.WheelForward]: [0x04, 0x00, 0x01, 0x00],
    [MouseKey.WheelBack]: [0x04, 0x00, 0x02, 0x00],
    [MouseKey.Key_1]: undefined,
    [MouseKey.Key_2]: undefined
}


const mapCodeToOrginMouseKey = (a: Array<number>): MouseKey | undefined => {
    const res = R.keys(mapOrginMouseKey).find(v => equals(mapOrginMouseKey[v], a))
    return res
}



const mapOrginMouseKeyToArr = (o: MouseKey): Array<number> => {
    const res = mapOrginMouseKey[o]
    if (res === undefined) throw Error('获取原始按键码错误,没有这个按键')
    return res
}
const handleChangeToMouseBtn = (config: ConfigValue) => {
    if (config.type !== 'ConfigChangeToMouseBtn') return undefined
    return mapOrginMouseKeyToArr(config.key as number)
}

const specialFunctionMap: { [key in SpecialFuntion]: Array<number> } = {
    '上一曲': [0x03, 0x00, 0xb6, 0x00],
    '下一曲': [0x03, 0x00, 0xb5, 0x00],
    '停止': [3, 0, 0xb7, 0],
    '播放/暂停': [3, 0, 0xcd, 0],
    '播放器': [3, 0, 0x83, 1],
    '火力': [0x0a, 0xf0, 0x18, 2],
    '狙击键': [7, 0, 4, 5],
    '静音': [3, 0, 0xe2, 0],
    '音量减': [3, 0, 0xea, 0],
    '音量大': [3, 0, 0xe9, 0]
}
const mapCodeToSpecialFunction = (a: Array<number>): SpecialFuntion | undefined => {
    const res = R.keys(specialFunctionMap).find(v => equals(specialFunctionMap[v], a))
    return res
}
const hanldeConfigFunction = (config: ConfigValue) => {
    if (config.type !== 'ConfigFunction') return undefined
    return specialFunctionMap[config.key]
}