import { DeviceType } from '../../DB'

export enum MouseKey {
    Left = -1000,
    Right,//999
    Middle,//998
    Back,//997
    Forward,//996
    Dpi,//995
    WheelForward,
    WheelBack,
    WheelLeft,
    WheelRight,
    Key_1,
    Key_2,
}

export const defaultLayout = {
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

export interface DeviceInterface {
    deviceType: DeviceType
    type: 'keyboard' | 'mouse'
    currentProfile: number
    open: () => Promise<boolean>
    destroy: () => Promise<boolean>
    getCurrentProfile: () => Promise<number | undefined>
    setCurrentProfile: (profile?: number) => Promise<boolean>
    getFirmwareVersion(): Promise<number | undefined>
    setReportRate(
        rate: 1000 | 500 | 250 | 125,
        profile?: number
    ): Promise<boolean>
    getReportRate(
        profile?: number
    ): Promise<1000 | 500 | 250 | 125 | 'err'>
    setLightSetting(lightSet: LightSetting): Promise<boolean>
    getLightSetting(): Promise<LightSetting | undefined>
    setReSet: () => Promise<boolean>
    upgrade: (filePath: string, progressCallBack: (v: number) => void) => Promise<boolean>
    checkMacroLenthIsFull: (macroArr: MacroEvent[]) => boolean

}
