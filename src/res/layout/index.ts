import { dk2017 } from './dk2017'
import { k68 } from './k68'
import { MG912 } from './mouse'
import { MouseKey } from '../../sdk/DriverIO/DeviceAPI/DeviceInterface'
import { k84 } from './k84'
import { Elite } from './Elite'
import { k68_kl } from './k68_kl'
import { k68_mhx } from './k68_mhx'
import { k68_HYEKYU } from './k68_HYEKYU'
import { TK568 } from './TK568'
import { k68_vl96 } from './k68_vl96'
import { k68_kb61 } from './k68_kb61'
import { M68 } from './M68'
import { K219 } from './K219'
import { K220 } from './K220'
import { K669 } from './K669'
import { VOYAGER68 } from './VOYAGER68'
import { K217 } from './k217'
import { K68_pro } from './K68_pro'
import { MAGNET } from './MAGNET'
import { k68_SK1 } from './k68_sk1'
import { k68_lp87 } from './k68_lp87'
import { k68_kl68DM } from './k68_kl68DM'
import { k68_MK1 } from './k68_mk1'
import { k84_DM } from './k84_DM'
import { x90_3M } from './x90_3M'

export interface General<T> {
  [key: string]: { layout: T[]; delt: { deltX: number; deltY: number } }
}

export interface 键鼠布局 {
  x: number
  y: number
  w: number
  h: number
  mark?: string | undefined
  keyName: string
  value: number | MouseKey
  index?: number
}

export const 键鼠坐标: General<键鼠布局> = {
  dk2017: {
    layout: dk2017.layout,
    delt: { deltX: dk2017.deltX, deltY: dk2017.deltY },
  },
  k84: {
    layout: k84.layout,
    delt: { deltX: k84.deltX, deltY: k84.deltY }
  },
  default: {
    layout: k68.layout,
    delt: { deltX: k68.deltX, deltY: k68.deltY },
  },
  MG912: {
    layout: MG912.layout,
    delt: { deltX: MG912.deltX, deltY: MG912.deltY },
  },
  k68: {
    layout: k68.layout,
    delt: { deltX: k68.deltX, deltY: k68.deltY },
  },
  Elite: {
    layout: Elite.layout,
    delt: { deltX: Elite.deltX, deltY: Elite.deltY }
  },
  ElitePro: {
    layout: Elite.layout,
    delt: { deltX: Elite.deltX, deltY: Elite.deltY }
  },
  k68_kl: {
    layout: k68_kl.layout,
    delt: { deltX: k68_kl.deltX, deltY: k68_kl.deltY }
  },
  k68_mhx: {
    layout: k68_mhx.layout,
    delt: { deltX: k68_mhx.deltX, deltY: k68_mhx.deltY }
  },
  k68_HYEKYU: {
    layout: k68_HYEKYU.layout,
    delt: { deltX: k68_HYEKYU.deltX, deltY: k68_HYEKYU.deltY }
  },
  TK568: {
    layout: TK568.layout,
    delt: { deltX: TK568.deltX, deltY: TK568.deltY }
  },
  k68_vl96: {
    layout: k68_vl96.layout,
    delt: { deltX: k68_vl96.deltX, deltY: k68_vl96.deltY }
  },
  k68_kb61: {
    layout: k68_kb61.layout,
    delt: { deltX: k68_kb61.deltX, deltY: k68_kb61.deltY }
  },
  M68: {
    layout: M68.layout,
    delt: { deltX: M68.deltX, deltY: M68.deltY }
  },
  K219: {
    layout: K219.layout,
    delt: { deltX: K219.deltX, deltY: K219.deltY }
  },
  K220: {
    layout: K220.layout,
    delt: { deltX: K220.deltX, deltY: K220.deltY }
  },
  K669: {
    layout: K669.layout,
    delt: { deltX: K669.deltX, deltY: K669.deltY }
  },
  VOYAGER68: {
    layout: VOYAGER68.layout,
    delt: { deltX: VOYAGER68.deltX, deltY: VOYAGER68.deltY }
  },
  K217: {
    layout: K217.layout,
    delt: { deltX: K217.deltX, deltY: K217.deltY }
  },
  K84_2M: {
    layout: k84.layout,
    delt: { deltX: k84.deltX, deltY: k84.deltY }
  },
  K68_pro: {
    layout: K68_pro.layout,
    delt: { deltX: K68_pro.deltX, deltY: K68_pro.deltY }
  },
  MAGNET: {
    layout: MAGNET.layout,
    delt: { deltX: MAGNET.deltX, deltY: MAGNET.deltY }
  },
  k68_sk1: {
    layout: k68_SK1.layout,
    delt: { deltX: k68_SK1.deltX, deltY: k68_SK1.deltY }
  },
  k68_lp87: {
    layout: k68_lp87.layout,
    delt: { deltX: k68_lp87.deltX, deltY: k68_lp87.deltY }
  },
  k68_kl68DM: {
    layout: k68_kl68DM.layout,
    delt: { deltX: k68_kl68DM.deltX, deltY: k68_kl68DM.deltY }
  },
  k68_mk1: {
    layout: k68_MK1.layout,
    delt: { deltX: k68_MK1.deltX, deltY: k68_MK1.deltY }
  },
  k84_DM: {
    layout: k84_DM.layout,
    delt: { deltX: k84_DM.deltX, deltY: k84_DM.deltY }
  },
  x90_3M: {
    layout: x90_3M.layout,
    delt: { deltX: x90_3M.deltX, deltY: x90_3M.deltY }
  },
}
