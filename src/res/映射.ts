//http://hp.vector.co.jp/authors/VA003720/lpproj/others/kbdjpn.htm
/*
arr = [...document.querySelector('table').children[0].children].slice(2).map(
    v => {
        let len = v.children.length
        return {
            'value': v.children[1].innerText,
            'scanCode': Number('0x' +v.children[len - 5].innerText.split(' / ')[0]),
            'hidCode': Number('0x' +v.children[len - 1].innerText),
        }
    }
)

JSON.stringify(arr, null, 4)
*/
const j = [
    {
        'value': '`',
        'scanCode': 41,
        'hidCode': 53
    },
    {
        'value': '1',
        'scanCode': 2,
        'hidCode': 30
    },
    {
        'value': '2',
        'scanCode': 3,
        'hidCode': 31
    },
    {
        'value': '3',
        'scanCode': 4,
        'hidCode': 32
    },
    {
        'value': '4',
        'scanCode': 5,
        'hidCode': 33
    },
    {
        'value': '5',
        'scanCode': 6,
        'hidCode': 34
    },
    {
        'value': '6',
        'scanCode': 7,
        'hidCode': 35
    },
    {
        'value': '7',
        'scanCode': 8,
        'hidCode': 36
    },
    {
        'value': '8',
        'scanCode': 9,
        'hidCode': 37
    },
    {
        'value': '9',
        'scanCode': 10,
        'hidCode': 38
    },
    {
        'value': '0',
        'scanCode': 11,
        'hidCode': 39
    },
    {
        'value': '-',
        'scanCode': 12,
        'hidCode': 45
    },
    {
        'value': '=',
        'scanCode': 13,
        'hidCode': 46
    },
    {
        'value': '__¥',
        'scanCode': 125,
        'hidCode': 137
    },
    {
        'value': 'BackSpace',
        'scanCode': 14,
        'hidCode': 42
    },
    {
        'value': 'Tab',
        'scanCode': 15,
        'hidCode': 43
    },
    {
        'value': 'Q',
        'scanCode': 16,
        'hidCode': 20
    },
    {
        'value': 'W',
        'scanCode': 17,
        'hidCode': 26
    },
    {
        'value': 'E',
        'scanCode': 18,
        'hidCode': 8
    },
    {
        'value': 'R',
        'scanCode': 19,
        'hidCode': 21
    },
    {
        'value': 'T',
        'scanCode': 20,
        'hidCode': 23
    },
    {
        'value': 'Y',
        'scanCode': 21,
        'hidCode': 28
    },
    {
        'value': 'U',
        'scanCode': 22,
        'hidCode': 24
    },
    {
        'value': 'I',
        'scanCode': 23,
        'hidCode': 12
    },
    {
        'value': 'O',
        'scanCode': 24,
        'hidCode': 18
    },
    {
        'value': 'P',
        'scanCode': 25,
        'hidCode': 19
    },
    {
        'value': '[',
        'scanCode': 26,
        'hidCode': 47
    },
    {
        'value': ']',
        'scanCode': 27,
        'hidCode': 48
    },
    {
        'value': '\\',
        'scanCode': 43,
        'hidCode': 49
    },
    {
        'value': 'Caps Lock',
        'scanCode': 58,
        'hidCode': 57
    },
    {
        'value': 'A',
        'scanCode': 30,
        'hidCode': 4
    },
    {
        'value': 'S',
        'scanCode': 31,
        'hidCode': 22
    },
    {
        'value': 'D',
        'scanCode': 32,
        'hidCode': 7
    },
    {
        'value': 'F',
        'scanCode': 33,
        'hidCode': 9
    },
    {
        'value': 'G',
        'scanCode': 34,
        'hidCode': 10
    },
    {
        'value': 'H',
        'scanCode': 35,
        'hidCode': 11
    },
    {
        'value': 'J',
        'scanCode': 36,
        'hidCode': 13
    },
    {
        'value': 'K',
        'scanCode': 37,
        'hidCode': 14
    },
    {
        'value': 'L',
        'scanCode': 38,
        'hidCode': 15
    },
    {
        'value': ';',
        'scanCode': 39,
        'hidCode': 51
    },
    {
        'value': '\'',
        'scanCode': 40,
        'hidCode': 52
    },
    {
        'value': '__]',
        'scanCode': 43,
        'hidCode': 50
    },
    {
        'value': 'Enter',
        'scanCode': 28,
        'hidCode': 40
    },
    {
        'value': 'Shift',
        'scanCode': 42,
        'hidCode': 0xe1
    },
    {
        'value': '_\\',
        'scanCode': 86,
        'hidCode': 100
    },
    {
        'value': 'Z',
        'scanCode': 44,
        'hidCode': 29
    },
    {
        'value': 'X',
        'scanCode': 45,
        'hidCode': 27
    },
    {
        'value': 'C',
        'scanCode': 46,
        'hidCode': 6
    },
    {
        'value': 'V',
        'scanCode': 47,
        'hidCode': 25
    },
    {
        'value': 'B',
        'scanCode': 48,
        'hidCode': 5
    },
    {
        'value': 'N',
        'scanCode': 49,
        'hidCode': 17
    },
    {
        'value': 'M',
        'scanCode': 50,
        'hidCode': 16
    },
    {
        'value': ',',
        'scanCode': 51,
        'hidCode': 54
    },
    {
        'value': '.',
        'scanCode': 52,
        'hidCode': 55
    },
    {
        'value': '/',
        'scanCode': 53,
        'hidCode': 56
    },
    {
        'value': '__\\',
        'scanCode': 115,
        'hidCode': 135
    },
    {
        'value': 'r_Shift',
        'scanCode': 54,
        'hidCode': 229
    },
    {
        'value': 'Ctrl',
        'scanCode': 29,
        'hidCode': 224
    },
    {
        'value': 'Alt',
        'scanCode': 56,
        'hidCode': 226
    },
    {
        'value': '(space)',
        'scanCode': 57,
        'hidCode': 44
    },
    {
        'value': 'r_Alt',
        'scanCode': 0xe38,
        'hidCode': 230
    },
    {
        'value': 'r_Ctrl',
        'scanCode': 0xe1d,
        'hidCode': 228
    },
    {
        'value': 'Insert',
        'scanCode': 0xee52,
        'hidCode': 73
    },
    {
        'value': 'Delete',
        'scanCode': 0xee53,
        'hidCode': 76
    },
    {
        'value': '←',
        'scanCode': 0xee4B,
        'hidCode': 80
    },
    {
        'value': 'Home',
        'scanCode': 0xee47,
        'hidCode': 74
    },
    {
        'value': 'End',
        'scanCode': 0xee4f,
        'hidCode': 77
    },
    {
        'value': '↑',
        'scanCode': 0xee48,
        'hidCode': 82
    },
    {
        'value': '↓',
        'scanCode': 0xee50,
        'hidCode': 81
    },
    {
        'value': 'Page\nUp',
        'scanCode': 0xee49,
        'hidCode': 75
    },
    {
        'value': 'Page\nDown',
        'scanCode': 0xee51,
        'hidCode': 78
    },
    {
        'value': '→',
        'scanCode': 0xee4d,
        'hidCode': 79
    },
    {
        'value': 'Num\nLock',
        'scanCode': 69,
        'hidCode': 83
    },
    {
        'value': 'num_7',
        'scanCode': 71,
        'hidCode': 95
    },
    {
        'value': 'num_Home',
        'scanCode': 3655,
        'hidCode': 0x4A
    },
    {
        'value': 'num_4',
        'scanCode': 75,
        'hidCode': 92
    },
    {
        'value': 'num_←',
        'scanCode': 57419,
        'hidCode': 0x50
    },
    {
        'value': 'num_1',
        'scanCode': 79,
        'hidCode': 89
    },
    {
        'value': 'num_End',
        'scanCode': 3663,
        'hidCode': 0x4D
    },
    {
        'value': 'num_/',
        'scanCode': 0xe35,
        'hidCode': 84
    },
    {
        'value': 'num_8',
        'scanCode': 72,
        'hidCode': 96
    },
    {
        'value': 'num_↑',
        'scanCode': 57416,
        'hidCode': 0x52
    },
    {
        'value': 'num_5',
        'scanCode': 76,
        'hidCode': 93
    },
    {
        'value': 'num_2',
        'scanCode': 80,
        'hidCode': 90
    },
    {
        'value': 'num_↓',
        'scanCode': 57424,
        'hidCode': 0x51
    },
    {
        'value': 'num_0',
        'scanCode': 82,
        'hidCode': 98
    },
    {
        'value': 'num_*',
        'scanCode': 55,
        'hidCode': 85
    },
    {
        'value': 'num_9',
        'scanCode': 73,
        'hidCode': 97
    },
    {
        'value': 'num_Pgup',
        'scanCode': 3657,
        'hidCode': 0x4B
    },
    {
        'value': 'num_6',
        'scanCode': 77,
        'hidCode': 94
    },
    {
        'value': 'num_→',
        'scanCode': 57421,
        'hidCode': 0x4F
    },
    {
        'value': 'num_3',
        'scanCode': 81,
        'hidCode': 91
    },
    {
        'value': 'num_Pgdn',
        'scanCode': 3665,
        'hidCode': 0x4E
    },
    {
        'value': 'num_.',
        'scanCode': 83,
        'hidCode': 99
    },
    {
        'value': 'num_-',
        'scanCode': 74,
        'hidCode': 86
    },
    {
        'value': 'num_+',
        'scanCode': 78,
        'hidCode': 87
    },
    {
        'value': 'num_Enter',
        'scanCode': 0xe1c,
        'hidCode': 88
    },
    {
        'value': 'Esc',
        'scanCode': 1,
        'hidCode': 41
    },
    {
        'value': 'F1',
        'scanCode': 59,
        'hidCode': 58
    },
    {
        'value': 'F2',
        'scanCode': 60,
        'hidCode': 59
    },
    {
        'value': 'F3',
        'scanCode': 61,
        'hidCode': 60
    },
    {
        'value': 'F4',
        'scanCode': 62,
        'hidCode': 61
    },
    {
        'value': 'F5',
        'scanCode': 63,
        'hidCode': 62
    },
    {
        'value': 'F6',
        'scanCode': 64,
        'hidCode': 63
    },
    {
        'value': 'F7',
        'scanCode': 65,
        'hidCode': 64
    },
    {
        'value': 'F8',
        'scanCode': 66,
        'hidCode': 65
    },
    {
        'value': 'F9',
        'scanCode': 67,
        'hidCode': 66
    },
    {
        'value': 'F10',
        'scanCode': 68,
        'hidCode': 67
    },
    {
        'value': 'F11',
        'scanCode': 87,
        'hidCode': 68
    },
    {
        'value': 'F12',
        'scanCode': 88,
        'hidCode': 69
    },
    {
        'value': 'Print\nScreen',
        'scanCode': 0xe37,
        'hidCode': 70
    },
    {
        'value': 'Scroll\nLock',
        'scanCode': 70,
        'hidCode': 71
    },
    {
        'value': 'Pause',
        'scanCode': 3653,
        'hidCode': 72
    },
    {
        'value': 'Win',
        'scanCode': 0xe5b,
        'hidCode': 227
    },
    {
        'value': 'r_Win',
        'scanCode': 0xe5c,
        'hidCode': 231
    },
    {
        'value': '(Application)',
        'scanCode': null,
        'hidCode': 101
    },
    {
        'value': '',
        'scanCode': 123,
        'hidCode': 139
    },
    {
        'value': '',
        'scanCode': 121,
        'hidCode': 138
    },
    {
        'value': '',
        'scanCode': 112,
        'hidCode': 136
    },
    {
        'value': 'fn',
        'scanCode': 0,
        'hidCode': 0x0a010000
    },
    {
        'value': '',
        'scanCode': -1,
        'hidCode': -1
    }
]

export namespace HidMapping {

    export const scanCodeMapHIDCode = (sc: number | undefined) => {
        if (sc === undefined) return undefined
        const obj = j.find(v => v.scanCode === sc)
        if (obj === undefined) return undefined
        //console.log('#######', obj)
        return obj.hidCode
    }

    export const hidCodeMapKeyName = (hid: number) => {
        const obj = j.find(v => v.hidCode === hid)
        if (obj === undefined) return undefined
        return obj.value
    }
}