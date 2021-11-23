import * as ref from 'ref-napi'
import * as ffi from 'ffi-napi'
import StructType = require('ref-struct-napi')
import ArrayType = require('ref-array-napi')
import HIDDLL from './hid32.dll'


import * as path from 'path'

type Ptr = { isNull: () => boolean }




const charArr125 = ArrayType('char', 125)

const HidDevDetail = StructType({
    'VendorID': 'ushort',
    'ProductID': 'ushort',
    'VersionNumber': 'ushort',
    'DevicePath': charArr125,
    'DeviceName': charArr125,
    'usage': 'ushort',
    'usagePage': 'ushort',
    'featureReportByteLength': 'ushort'
})

const HidDevDetailArray = ArrayType(HidDevDetail)

const ArrayPtr = ref.refType(HidDevDetailArray)

let hidLib: any





export namespace hid_win {

    export const init = () => {

        hidLib = ffi.Library(path.join(__dirname, HIDDLL), {

            // zhegemeiyou
            'getSystemHid': ['bool', [ArrayPtr, 'ushort', 'ushort *']],

            'initDevice': ['void *', ['ushort', 'ushort', 'ushort', 'ushort']],

            'initDevice2': ['void *', ['ushort', 'ushort', 'ushort', 'ushort', 'ushort']],

            'initDevice3': ['void *', ['string']],

            'initDevice4': ['void *', ['string']],

            'destroyDevice': ['bool', ['void *']],

            'sendFeature': ['bool', ['void *', 'byte *', 'uint']],

            'readFeature': ['bool', ['void *', 'byte *', 'uint *']],


            'sendFeature1': ['bool', ['void *', 'byte *', 'uint']],

            'readFeature1': ['bool', ['void *', 'byte *', 'uint']],

            'writeData': ['bool', ['void *', 'byte *', 'uint', 'uint *']],

            'readData': ['bool', ['void *', 'byte *', 'uint', 'uint *']],

            'sendOutputReport': ['bool', ['void *', 'ushort', 'byte *', 'uint']],

            'readInputReport': ['bool', ['void *', 'ushort', 'byte *', 'uint']]
        })
        return hid_win
    }
    export type hid_win_DeviceType = {
        vid: number
        pid: number
        versionNumber: number
        DevicePath: string
        DeviceName: string
        usage: number
        usagePage: number
        featureReportByteLength: number
    }

    export const getSystemHid = async () => new Promise<Array<hid_win_DeviceType>>((resolve, reject) => {

        const outNumber = ref.alloc('ushort')
        const kAllocNumber = 52
        const allocBuffer = Buffer.alloc(HidDevDetail.size * kAllocNumber).fill(0)
        const hArray = ref.alloc(ArrayType(HidDevDetail), allocBuffer)
        hidLib.getSystemHid.async(hArray, kAllocNumber, outNumber, (err: Error, res: boolean) => {
            if (err) { reject(err) }
            const t = ref.deref(hArray)
            const tmpCharArr = ArrayType('char')
            const resArr: Array<hid_win_DeviceType> = new Array()
            for (let i = 0; i < ref.deref(outNumber); i++) {
                const tDevicePath = tmpCharArr.untilZeros(t[i].DevicePath.buffer).buffer.toString()
                const tDeviceName = tmpCharArr.untilZeros(t[i].DeviceName.buffer).buffer.toString()

                const dev: hid_win_DeviceType = {
                    vid: t[i].VendorID,
                    pid: t[i].ProductID,
                    versionNumber: t[i].VersionNumber,
                    DevicePath: tDevicePath,
                    DeviceName: tDeviceName,
                    usage: t[i].usage,
                    usagePage: t[i].usagePage,
                    featureReportByteLength: t[i].featureReportByteLength
                }
                resArr.push(dev)
            }

            resolve(resArr)

        })
    })

    export const openHidDevice = async (
        vid: number,
        pid: number,
        usage: number,
        usagePage: number
    ) => new Promise<Ptr>((resolve, reject) => {
        hidLib.initDevice.async(
            vid, pid, usage, usagePage,
            (err: Error, res: any) => {
                if (err) { reject(err) }

                resolve(res)
            })
    })

    export const openHidDevice2 = async (
        vid: number,
        pid: number,
        usage: number,
        usagePage: number,
        featureReportByteLength: number,
    ) => new Promise<Ptr>((resolve, reject) => {
        hidLib.initDevice2.async(
            vid, pid, usage, usagePage, featureReportByteLength,
            (err: Error, res: any) => {
                if (err) { reject(err) }

                resolve(res)
            })
    })

    export const openHidDevice3 = async (path: string) => new Promise<Ptr>((resolve, reject) => {
        //const pathBuf = Buffer.alloc()
        hidLib.initDevice3.async(
            path,
            (err: Error, res: any) => {
                if (err) { reject(err) }

                resolve(res)
            })
    })

    export const openHidDevice4 = async (path: string) => new Promise<Ptr>((resolve, reject) => {
        //const pathBuf = Buffer.alloc()
        hidLib.initDevice4.async(
            path,
            (err: Error, res: any) => {
                if (err) { reject(err) }

                resolve(res)
            })
    })

    export const destroyDevice = async (p: Ptr) => new Promise<boolean>((resolve, reject) => {
        hidLib.destroyDevice.async(
            p,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }

                resolve(res)
            })
    })

    export const writeData = async (
        p: Ptr,
        buf: Buffer,
    ) => new Promise<boolean>((resolve, reject) => {
        const actualSizeBuf: Buffer = Buffer.alloc(4).fill(0)
        //补一个0 // 可能协议是这样的?
        buf = Buffer.from([0x00, ...buf])
        //console.log(buf)
        hidLib.writeData.async(
            p, buf, buf.length, actualSizeBuf,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                const actualSize = actualSizeBuf.readUInt32LE(0)
                if (actualSize !== buf.length) {
                    console.log('实际写入 不相符', actualSize)
                }
                resolve(res)
            })
    })

    export const readData = async (
        p: Ptr,
    ) => new Promise<Buffer | undefined>((resolve, reject) => {
        const buf = Buffer.alloc(2000).fill(0)

        const readSizeBuf = Buffer.alloc(4).fill(0)
        hidLib.readData.async(
            p, buf, buf.length, readSizeBuf,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                if (!res) resolve(undefined)
                //多返回了一个0//可能协议就是这样的?
                resolve(buf.slice(1, readSizeBuf.readUInt32LE(0)))
            })
    })
    export const sendFeature = async (
        p: Ptr,
        buf: Buffer,
    ) => new Promise<boolean>((resolve, reject) => {
        hidLib.sendFeature.async(
            p, buf, buf.length,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                if (!res) resolve(false)
                resolve(res)
            })
    })

    export const readFeature = async (
        p: Ptr,
    ) => new Promise<Buffer | undefined>((resolve, reject) => {
        const buf = Buffer.alloc(2000).fill(0)
        const uintBuf = Buffer.alloc(4).fill(0)
        hidLib.readFeature.async(
            p, buf, uintBuf,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                if (!res) resolve(undefined)
                resolve(buf.slice(0, uintBuf.readInt32LE(0)))
            })
    })

    export const sendFeature1 = async (
        p: Ptr,
        buf: Buffer,
    ) => new Promise<boolean>((resolve, reject) => {
        hidLib.sendFeature1.async(
            p, Buffer.from([0, ...buf]), buf.length + 1,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                if (!res) resolve(false)
                resolve(res)
            })
    })
    export const readFeature1 = async (
        p: Ptr,
    ) => new Promise<Buffer | undefined>((resolve, reject) => {
        const buf = Buffer.alloc(65).fill(0)
        hidLib.readFeature1.async(
            p, buf, buf.length,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                if (!res) resolve(undefined)
                resolve(buf.slice(1, buf.length))
            })
    })
    export const sendOutputReport = async (
        p: Ptr,
        reportID: number,
        buf: Buffer,
    ) => new Promise<boolean>((resolve, reject) => {
        hidLib.sendOutputReport.async(
            p, reportID, buf, buf.length,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                if (!res) resolve(false)
                resolve(res)
            })
    })

    export const readInputReport = async (
        p: Ptr,
        reportID: number
    ) => new Promise<Buffer | undefined>((resolve, reject) => {
        const buf = Buffer.alloc(2000).fill(0)
        hidLib.readInputReport.async(
            p, reportID, buf, buf.length,
            (err: Error, res: boolean) => {
                if (err) { reject(err) }
                if (!res) resolve(undefined)
                resolve(buf)
            })
    })




    export const test = async () => {
        const arr = await getSystemHid()
        console.log(arr)
        arr.forEach(async (dev) => {

            const res = await openHidDevice(
                dev.vid,
                dev.pid,
                dev.usage,
                dev.usagePage,
            )
            console.log(res.isNull())
            const des = await destroyDevice(res)
            console.log(des)
        })


        //const handle = await openHidDevice(0x24ae, 0x4219, 0x01, 0xff01)

        // await sendFeature(handle, Buffer.from([0x8c, 0x01]), 2)

        // const buf = await readFeature(handle)

        // console.log(buf)

    }

}
