import { DeviceType } from "../../DB"
import { USBDevice } from "../usb/USBDevice"
import { Dk2017 } from "./dk2017"
import { K68 } from "./k68"
import { KeyboardInterface } from "./KeyboardInterface"
import { MouseInterface } from "./MouseInterface"
// import { TestKeyboard } from "./testKeyboard"
import { TestMouse } from "./testMouse"
import { sleep } from "../../../unitys/timeFunc"
import { V25s } from "./v25s"
import { K84 } from "./k84"
import { kCompany } from "../../../appConfig"
import { Elite } from "./Elite"
import { K68_KL } from "./k68_kl"
import { K68_MHX } from "./k68_mhx"
import { K68Help } from "./k68Help"
import { K68_HYEKYU } from "./k68_HYEKYU"
import { K68_MG } from "./k68_mg"
import { K68_VL96 } from "./k68_vl96"
import { K68_KB61 } from "./k68_kb61"
import { K68_M68 } from "./k68_m68"
import { K68_K219 } from "./k68_k219"
import { K68_K220 } from "./k68_k220"
// import { K68_K669 } from "./k68_k669"
import { K68_VOYAGER68 } from "./k68_VOYAGER68"
import { K68_K217 } from "./k68_k217"
import { K84_2M } from "./K84_2M"
import { MAGNET } from "./k68_MAGNET"
import { K68_SK1 } from "./k68_sk1"
import { K68_LP87 } from "./k68_lp87"
import { K68_KL68DM } from "./k68_kl68DM"
import { K68_MK1 } from "./k68_mk1"
import { K68_K669_3M } from "./k68_k669_3m"
import { K84_DM } from "./k84_DM"
import { X90_3M } from "./x90_3m"


export const CreateDeviceByDeviceType = async (dtemp: DeviceType): Promise<MouseInterface | KeyboardInterface | undefined> => {
    console.log('DDDTTTTEEEMMMMPPP', dtemp)
    const res1 = await DeviceType.find({ where: { pid: dtemp.pid, vid: dtemp.vid } })

    if (res1.length === 1) {
        switch (dtemp.name) {
            case 'help':
                return new K68Help(dtemp)
            case 'v25s':
                return new V25s(dtemp)
            case 'dk2017':
                return new Dk2017(dtemp)
            case '小潘鼠标':
                return new TestMouse(dtemp)
            case 'test_dj':
                return new TestMouse(dtemp)
            default:
                return undefined
        }
    }
    await sleep(500)
    const usbDev = new USBDevice(dtemp)

    await usbDev.open()
    await sleep(1000)
    let devId: undefined | number = undefined
    let cout = 0

    const allDevs = await DeviceType.find()
    while (devId === 0 || devId === undefined) {
        await sleep(200)
        devId = await usbDev.whoAmI()
        // console.log('DDDEEEVVUUUUIIIIDDDD', devId)
        if (!allDevs.some(v => v.id === devId)) {
            devId = 0
        }
        cout++
        if (cout > 5) {
            break
        }
    }
    await usbDev.destroy()
    if (devId === 0 || devId === undefined) {

        console.log('设备id返回错误')

        return undefined
    }

    const dev = await DeviceType.findOne({
        where: {
            id: devId,
            company: kCompany
        }
    })
    console.log('DDDEEEVVV', dev, devId)

    if (dev === undefined) return undefined
    dev.devAddr = dtemp.devAddr
    switch (dev.name) {
        case 'k68':
            return new K68(dev)
        case 'dk2017':
            return new Dk2017(dev)
        case 'k84':
            return new K84(dev)
        case 'Elite':
            return new Elite(dev)
        case 'ElitePro':
            return new Elite(dev)

        case 'k68_kl':
            return new K68_KL(dev)

        case 'k68_mhx':
            return new K68_MHX(dev)
        case 'k68_HYEKYU':
            return new K68_HYEKYU(dev)
        case 'TK568':
            return new K68_MG(dev)
        case 'k68_vl96':
            return new K68_VL96(dev)
        case 'k68_kb61':
            return new K68_KB61(dev)
        case 'M68':
            return new K68_M68(dev)
        case 'K219':
            return new K68_K219(dev)
        case 'K220':
            return new K68_K220(dev)
        case 'VOYAGER68':
            return new K68_VOYAGER68(dev)
        case 'K217':
            return new K68_K217(dev)
        case 'K84_2M':
            return new K84_2M(dev)
        case 'K68_pro':
            return new K68(dev)
        case 'MAGNET':
            return new MAGNET(dev)
        case 'k68_sk1':
            return new K68_SK1(dev)
        case 'k68_lp87':
            return new K68_LP87(dev)
        case 'k68_kl68DM':
            return new K68_KL68DM(dev)
        case 'k68_mk1':
            return new K68_MK1(dev)
        case 'K669':
            return new K68_K669_3M(dev)
        case 'k84_DM':
            return new K84_DM(dev)
        case 'x90_3M':
            return new X90_3M(dev)
        default:
            return undefined
    }
}