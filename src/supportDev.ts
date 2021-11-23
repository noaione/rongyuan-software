import { lightAbtX90Layout } from "./res/lightLayout/lightAbtX90Layout"
import { fulingRGBLayout, fulingRGBLayout2 } from "./res/lightLayout/lightFuLingLayout"
import { rongyuanRGBLayout4 } from "./res/lightLayout/lightLayout4"
import { rongyuanMusicLayout } from "./res/lightLayout/lightMusicLayout"
import { rongyuanMusicNoPicValueLayout } from "./res/lightLayout/lightMusicNoPicValueLayout"
import { rongyuanMusicValueLayout } from "./res/lightLayout/lightMusicValueLayout"
import { rongyuanSK1RGBLayout } from "./res/lightLayout/lightSK1Layout"

export interface Layout {
    dpi?: {
        count: number
        min: number
        max: number
        delt: number
    }
    light: {
        isRgb: boolean
        types: {
            type: string
            maxSpeed?: number
            minSpeed?: number
            maxValue?: number
            minValue?: number
            options?: string[]
            rgb?: boolean
        }[]
    }
    reportRate: number[]
}
const rongyuanRGBLayout: Layout = {
    light: {
        isRgb: true,
        types: [
            {
                type: 'LightOff',
            },
            {
                type: 'LightAlwaysOn',
                maxValue: 6,
                minValue: 0,
                rgb: true
            },
            {
                type: 'LightBreath',
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightWave',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['right', 'left'],
            },
            {
                type: 'LightRipple',
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true,
                options: ['full', 'single'],
            },
            {
                type: 'LightRaindrop',
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightSnake',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['z', 'return'],
                rgb: true
            },
            {
                type: 'LightPressAction',
                maxSpeed: 5,
                minSpeed: 0,
                //options: ['onToOff', 'offToOn'],
                rgb: true
            },
            {
                type: 'LightConverage',
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightNeon',
                maxSpeed: 5,
                minSpeed: 0,
            },
            {
                type: 'LightUserPicture'
            },
        ]
    },
    reportRate: [125, 250, 500, 1000]
}
export const MusicLightConfig = {

    type: 'LightMusicFollow',
    maxValue: 6,
    minValue: 0,
    options: ['upright', 'separate', 'intersect'],
    rgb: false


}
const rongyuanRGBLayoutKB: Layout = {
    light: {
        isRgb: true,
        types: [
            {
                type: 'LightOff',
            },
            {
                type: 'LightAlwaysOn',
                maxValue: 6,
                minValue: 0,

            },
            {
                type: 'LightBreath',
                maxSpeed: 5,
                minSpeed: 0,

            },
            {
                type: 'LightWave',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['right', 'left'],
            },
            {
                type: 'LightRipple',
                maxSpeed: 5,
                minSpeed: 0,

                options: ['full', 'single'],
            },
            {
                type: 'LightRaindrop',
                maxSpeed: 5,
                minSpeed: 0,

            },
            {
                type: 'LightSnake',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['z', 'return'],

            },
            {
                type: 'LightPressAction',
                maxSpeed: 5,
                minSpeed: 0,
                //options: ['onToOff', 'offToOn'],

            },
            {
                type: 'LightNeon',
                maxSpeed: 5,
                minSpeed: 0,
            },
        ]
    },
    reportRate: [125, 250, 500, 1000]
}
const rongyuanRGBLayout2: Layout = {
    light: {
        isRgb: true,
        types: [
            {
                type: 'LightOff',
            },
            {
                type: 'LightAlwaysOn',
                maxValue: 4,
                minValue: 0,
                rgb: true
            },
            {
                type: 'LightBreath',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightWave',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
            {
                type: 'LightRipple',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true,
            },
            {
                type: 'LightRaindrop',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightSnake',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightPressAction',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                //options: ['onToOff', 'offToOn'],
                rgb: true
            },
            {
                type: 'LightConverage',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightNeon',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
            {
                type: 'LightSingleRipple',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
            {
                type: 'LightSineWave',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
        ]
    },
    reportRate: [125, 250, 500, 1000]
}
const rongyuanRGBLayout3: Layout = {
    light: {
        isRgb: true,
        types: [
            {
                type: 'LightOff',
            },
            {
                type: 'LightAlwaysOn',
                maxValue: 4,
                minValue: 0,
                rgb: true
            },
            {
                type: 'LightBreath',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightWave',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
            {
                type: 'LightRipple',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true,
            },
            {
                type: 'LightRaindrop',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightSnake',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightPressAction',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                //options: ['onToOff', 'offToOn'],
                rgb: true
            },
            {
                type: 'LightConverage',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightNeon',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
            {
                type: 'LightSingleRipple',
                maxValue: 4,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
        ]
    },
    reportRate: [125, 250, 500, 1000]
}

const rongyuanNoRGBLayout = {
    light: {
        isRgb: false,
        types: [
            {
                type: 'LightOff',
            },
            {
                type: 'LightAlwaysOn',
                maxValue: 6,
                minValue: 0,
                rgb: true
            },
            {
                type: 'LightBreath',
                maxSpeed: 5,
                minSpeed: 0
            },
            {
                type: 'LightWave',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['right', 'left']
            },
            {
                type: 'LightRipple',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['full', 'single']
            },
            {
                type: 'LightRaindrop',
                maxSpeed: 5,
                minSpeed: 0
            },
            {
                type: 'LightSnake',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['z', 'return']
            },
            {
                type: 'LightPressAction',
                maxSpeed: 5,
                minSpeed: 0,
                options: ['onToOff', 'offToOn']
            },
            {
                type: 'LightConverage',
                maxSpeed: 5,
                minSpeed: 0
            },
            {
                type: 'LightUserPicture'
            }
        ]
    },
    reportRate: [125, 250, 500, 1000]
}
const rongyuanNoRGBLayout2 = {
    light: {
        isRgb: false,
        types: [
            {
                type: 'LightOff',
            },
            {
                type: 'LightAlwaysOn',
                maxValue: 6,
                minValue: 0,
                rgb: true
            },
            {
                type: 'LightBreath',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0
            },
            {
                type: 'LightWave',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                options: ['right', 'left']
            },
            {
                type: 'LightRipple',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                options: ['full', 'single']
            },
            {
                type: 'LightRaindrop',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0
            },
            {
                type: 'LightSnake',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                options: ['z', 'return']
            },
            {
                type: 'LightPressAction',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                options: ['onToOff', 'offToOn']
            },
            {
                type: 'LightConverage',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0
            },
            {
                type: 'LightUserPicture',
                maxValue: 6,
                minValue: 0,
            },
            {
                type: 'LightSingleRipple',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0
            },
            {
                type: 'LightRoundRipple',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0
            },
        ]
    },
    reportRate: [125, 250, 500, 1000]
}

const kRGBGroup = 'rongyuan_k_rgb'
const kNoRGBGroup = 'rongyuan_k'
export const supportDev: {
    id: number,
    vid: number,
    pid: number,
    name: string,
    type: 'mouse' | 'keyboard',//鼠标还是键盘,
    support_onboard: 0 | 1 | 2 | 3,//0 不支持 1 不支持mousemove 2 支持mousemove, 3 支持多套板载
    usage: number,
    usagePage: number
    version?: string,
    layout?: Layout
    group?: string
    displayName?: string
    company?: string
    featureReportByteLength?: number
}[] = [
        {
            id: 100,
            vid: 0x0c45,
            pid: 0x7d12,
            name: 'commom',
            displayName: '雷神KC3068',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '雷神',
            layout: rongyuanRGBLayout,
            usage: 6,
            usagePage: 1,
            featureReportByteLength: 65,
        },
        {
            id: 29,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'x90_3M',
            displayName: 'X90三模',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '阿比特',
            layout: lightAbtX90Layout
        },
        {
            id: 9,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k84_DM',
            displayName: 'VX8',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'vortexSeries',
            layout: rongyuanRGBLayout
        },
        {
            id: 43,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68_mk1',
            displayName: 'SK1',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '泰亿SK1',
            layout: rongyuanMusicNoPicValueLayout
        },
        {
            id: 35,
            vid: 0x05AC,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'K669',
            displayName: 'FL870',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            featureReportByteLength: 65,
            company: '腹灵',
            layout: fulingRGBLayout2
        },
        {
            id: 11,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68_kl68DM',
            displayName: 'VX6',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'vortexSeries',
            layout: rongyuanRGBLayout
        },
        {
            id: 10,
            vid: 0x0C45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68_lp87',
            displayName: 'LP87',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'rongyuan',
            layout: rongyuanRGBLayout
        },
        {
            id: 26,
            vid: 0x05AC,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'k68_sk1',
            displayName: 'SK1',
            support_onboard: 3,
            type: 'keyboard',
            group: kRGBGroup,
            featureReportByteLength: 65,
            company: '比乐',
            layout: rongyuanSK1RGBLayout
        },
        {
            id: 40,
            vid: 0x0C45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'MAGNET',
            displayName: 'MAGNET',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '星际堡垒',
            layout: rongyuanRGBLayout4,
        },
        {
            id: 45,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'K68_pro',
            displayName: '雷神KC3068',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '雷神',
            layout: rongyuanRGBLayout,
        },
        {
            id: 27,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'K84_2M',
            displayName: '狂麟0824',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'rongyuan',
            layout: rongyuanRGBLayout
        },
        {
            id: 6,
            vid: 0x05AC,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'K217',
            displayName: 'K217',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            featureReportByteLength: 65,
            company: 'TNT',
            layout: rongyuanRGBLayout3
        },
        // {
        //     id: 34,
        //     vid: 0x05AC,
        //     pid: 0x024F,
        //     usage: 6,
        //     usagePage: 1,
        //     name: 'K669',
        //     displayName: 'FL870',
        //     support_onboard: 2,
        //     type: 'keyboard',
        //     group: kNoRGBGroup,
        //     featureReportByteLength: 65,
        //     company: '腹灵',
        //     layout: rongyuanNoRGBLayout
        // },
        {
            id: 25,
            vid: 0x05AC,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'K220',
            displayName: 'FL980CPS',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            featureReportByteLength: 65,
            company: '腹灵',
            layout: fulingRGBLayout
        },
        {
            id: 13,
            vid: 0x05AC,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'K219',
            displayName: 'FL680',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            featureReportByteLength: 65,
            company: '腹灵',
            layout: fulingRGBLayout
        },
        {
            id: 22,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'VOYAGER68',
            displayName: 'VOYAGER68',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '泰亿',
            layout: rongyuanRGBLayout
        },
        {
            id: 24,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68_kb61',
            displayName: '跬步61',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '跬步',
            layout: rongyuanRGBLayoutKB
        },
        {
            id: 23,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68_vl96',
            displayName: '狂麟VL96',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'rongyuan',
            layout: rongyuanRGBLayout
        },
        {
            id: 19,
            vid: 0x05AC,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'TK568',
            displayName: 'TK568',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            featureReportByteLength: 65,
            company: 'rongyuan',
            layout: rongyuanRGBLayout2
        },
        {
            id: 17,
            vid: 0x05AC,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'k68_HYEKYU',
            displayName: 'HYEKYU',
            support_onboard: 2,
            type: 'keyboard',
            group: kNoRGBGroup,
            featureReportByteLength: 65,
            company: 'HYEKYU',
            layout: rongyuanNoRGBLayout2
        },
        {
            id: 7,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68_mhx',
            displayName: 'K3',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '明华鑫',
            layout: rongyuanRGBLayout
        },
        {
            id: 8,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68_kl',
            displayName: '狂麟68',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'rongyuan',
            layout: rongyuanRGBLayout
        },
        {
            id: 5,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k84',
            displayName: '狂麟0824',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'rongyuan',
            layout: rongyuanMusicLayout
        },
        {
            id: 2,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'k68',
            displayName: '雷神KC3068',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: '雷神',
            layout: rongyuanRGBLayout,
        },
        {
            id: 3,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'Elite',
            displayName: 'Elite',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'Elite',
            layout: rongyuanRGBLayout
        },
        {
            id: 4,
            vid: 0x0c45,
            pid: 0x7044,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'ElitePro',
            displayName: 'Elite Pro',
            support_onboard: 2,
            type: 'keyboard',
            group: kRGBGroup,
            company: 'Elite',
            layout: rongyuanRGBLayout
        },
        {
            id: 1,//05AC  024F
            vid: 0x05ac,
            pid: 0x024F,
            usage: 6,
            usagePage: 1,
            name: 'dk2017',
            support_onboard: 2,
            type: 'keyboard',
            group: kNoRGBGroup,
            layout: rongyuanNoRGBLayout,
            featureReportByteLength: 65,
            company: 'rongyuan',
        },
        {
            id: -1,
            vid: 1452,
            pid: 4776,
            usage: 0x01,
            usagePage: 0xff13,
            name: 'test_dj',
            displayName: '雷神KC3068',
            support_onboard: 2,
            type: 'mouse',
            group: 'rongyuan_m',
            layout: {
                dpi: {
                    count: 7,
                    max: 1000,
                    min: 0,
                    delt: 10,
                },
                ...rongyuanRGBLayout
            }
        },


        {
            id: -3,
            vid: 0x25A7,
            pid: 0x2456,
            usage: 6,
            usagePage: 1,
            name: '小潘鼠标',
            support_onboard: 0,
            type: 'mouse',
            group: 'rongyuan_m',
            company: 'rongyuan',
            layout: {
                dpi: {
                    count: 7,
                    max: 1000,
                    min: 0,
                    delt: 10,
                },
                ...rongyuanRGBLayout
            }
        },
    ]

