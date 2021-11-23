import { Layout } from '../../supportDev'
export const rongyuanMusicNoPicValueLayout: Layout = {
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
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightWave',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                options: ['right', 'left'],
            },
            {
                type: 'LightRipple',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true,
                options: ['full', 'single'],
            },
            {
                type: 'LightRaindrop',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightSnake',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                options: ['z', 'return'],
                rgb: true
            },
            {
                type: 'LightPressAction',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                //options: ['onToOff', 'offToOn'],
                rgb: true
            },
            {
                type: 'LightConverage',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
                rgb: true
            },
            {
                type: 'LightNeon',
                maxValue: 6,
                minValue: 0,
                maxSpeed: 5,
                minSpeed: 0,
            },
            {
                type: 'LightMusicFollow',
                options: ['upright', 'separate', 'intersect'],
            }
        ]
    },
    reportRate: [125, 250, 500, 1000]
}