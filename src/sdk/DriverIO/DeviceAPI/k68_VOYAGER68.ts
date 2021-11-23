import { numToRgb, rgbToNum } from "../../../unitys/rgbNum";
import { K68 } from "./k68";
import { defaultMatrix_k68_VOYAGER68 } from "./k68_VOYAGER68Matrix";

export class K68_VOYAGER68 extends K68 {
    defaultMatrix = defaultMatrix_k68_VOYAGER68

    setLightSetting = async (lightSet: dk2017LightSetting) => {
        const b = Buffer.alloc(64)
        b[0] = 0x04

        let effect: number = 0
        let speed: number = 0
        let brightness: number = 0
        let option: number = 7

        switch (lightSet.type) {
            case 'LightOff':
                effect = 0x00
                break
            case 'LightAlwaysOn':
                effect = 0x01
                brightness = lightSet.value
                option = option<<4
                break
            case 'LightBreath':
                effect = 0x02
                speed = lightSet.speed
                option = option<<4
                break
            case 'LightNeon':
                effect = 0x03
                speed = lightSet.speed
                option = option<<4
                break
            case 'LightWave':
                effect = 0x04
                speed = lightSet.speed
                option = lightSet.option === 'right' ? 0 : 1
                option = option<<4
                break
            case 'LightRipple':
                effect = 0x05
                speed = lightSet.speed
                option = lightSet.option === 'full' ? (7 << 4) | 0 : (7 << 4) | 1
                break
            case 'LightRaindrop':
                effect = 0x06
                speed = lightSet.speed
                option = option<<4
                break
            case 'LightSnake':
                effect = 0x07
                speed = lightSet.speed
                option = lightSet.option === 'z' ? (7 << 4) | 0 : (7 << 4) | 1
                break
            case 'LightPressAction':
                effect = 0x08
                speed = lightSet.speed
                option = lightSet.option === 'onToOff' ? (7 << 4) | 0 : (7 << 4) | 1
                break
            case 'LightConverage':
                effect = 0x09
                speed = lightSet.speed
                option = option<<4
                break
            case 'LightUserPicture':
                effect = 0x0a
                option = 0
                option = option<<4
                break

            default:
                break
        }

        b[1] = effect
        b[2] = 5 - speed
        b[3] = brightness
        b[4] = option

        if ('rgb' in lightSet && lightSet.rgb !== undefined) {
            let rgbTemp = lightSet.rgb
            if (rgbTemp === 0xffffff) rgbTemp = 0xfafffa
            const rgb = numToRgb(rgbTemp)
            b[5] = rgb.r
            b[6] = rgb.g
            b[7] = rgb.b
        }
        if (lightSet.type === 'LightUserPicture') {
            b[5] = 0
            b[6] = 0xc8
            b[7] = 0xc8
        }
        //console.log(lightSet, b)
        return await this.writeFeatureCmd(b)
    }

    getLightSetting = async (): Promise<LightSetting | undefined> => {
        const rgbMap: {
            [key: number]: number
        } = {
            0: 0xff0000,
            1: 0x00ff00,
            2: 0x0000ff,
            3: 0x00ffff,
            4: 0xff00ff,
            5: 0xffff00,
            6: 0xffffff,
        }
        const b = Buffer.alloc(64)
        b[0] = 0x84
        const buf = await this.commomFeature(b)
        if (buf === undefined) return undefined
        const effect = buf[1]
        const speed = 5 - buf[2]
        const brightness = buf[3]
        const option = buf[4]
        let rgb = rgbToNum(buf[5], buf[6], buf[7])
        const optionToRgb = (op: number) => {
            if (op === 7) return
            const trgb = rgbMap[op]
            if (trgb !== undefined) rgb = trgb

        }
        if (rgb === 0xfafffa) rgb = 0xffffff
        //console.log('!!!!!', effect, option)
        switch (effect) {
            case 0:
                return {
                    type: 'LightOff',
                }
            case 1:
                optionToRgb(option)
                return {
                    type: 'LightAlwaysOn',
                    value: brightness,
                    rgb: rgb,
                }
            case 2:
                optionToRgb(option)
                return {
                    type: 'LightBreath',
                    value: 0,
                    speed: speed,
                    rgb: rgb,
                }
            case 3:
                return {
                    type: 'LightNeon',
                    value: 0,
                    speed: speed
                }
            case 4:
                return {
                    type: 'LightWave',
                    value: 0,
                    speed: speed,
                    option: option === 0 ? 'right' : 'left',
                }
            case 5:
                optionToRgb(option >> 4)
                return {
                    type: 'LightRipple',
                    value: 0,
                    speed: speed,
                    option: option === 0 ? 'full' : 'single',
                    rgb: rgb
                }
            case 6:
                optionToRgb(option)
                return {
                    type: 'LightRaindrop',
                    value: 0,
                    speed: speed,
                    rgb: rgb
                }
            case 7:
                optionToRgb(option)
                return {
                    type: 'LightSnake',
                    value: 0,
                    speed: speed,
                    option: option === 0 ? 'z' : 'return',
                    rgb: rgb
                }
            case 8:
                optionToRgb(option >> 4)
                return {
                    type: 'LightPressAction',
                    value: 0,
                    speed: speed,
                    option: option === 0 ? 'onToOff' : 'offToOn',
                    rgb: rgb
                }
            case 9:
                optionToRgb(option)
                return {
                    type: 'LightConverage',
                    value: 0,
                    speed: speed,
                    rgb: rgb
                }
            case 10:
                return {
                    type: 'LightUserPicture',
                    value: 0
                }

            default:
                return undefined
        }
    }
}