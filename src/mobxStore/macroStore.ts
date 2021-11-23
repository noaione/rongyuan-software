import { action, observable, autorun } from 'mobx'

import { BaseStore } from './baseStore'
import { mobxStore } from './store'
import iohook = require('iohook')
import {
  IOHookEvent,
  getMacroEvents,
  cleanTime,
} from '../sdk/DriverIO/djIOHook/hookFunction'
import { DBService } from '../sdk/WebService'
import { Macro } from '../sdk/DB'
import { res } from '../res'


export class MacroStore extends BaseStore {
  @observable currentRecMacroArr: MacroEvent[] = []
  @observable currentSingleValue = 0
  @observable isFull: boolean = false
  @observable recodingState: 'stop' | 'recording' | 'singleRecording' = 'stop'
  @observable macroType: MacroRepeatType = 'touch_repeat'
  @observable repeatTimes: number = 1

  @observable macroList: DBService.MacroFolder = DBService.macrosToFolder([])

  @observable currentSelectMacro: Macro | undefined = undefined


  constructor() {
    super()
    autorun(() => console.log('currentSingleValue', this.currentSingleValue))
    //setTimeout(() => this.refreshMacroList(), 3000)

    //autorun(() => console.log('isFull', this.isFull, this.macroList.id, this.macroList.folders, this.macroList.macros))
  }
  checkIsRec = () => {
    if (this.recodingState === 'recording') {
      mobxStore.toastStore.setInfo(res.text.请先停止录制())
      return true
    }
    return false
  }
  @action.bound
  setCurrentSelectMacro(macro: Macro | undefined) {
    //console.error('Dangqian 选中', macro?.name)
    if (this.checkIsRec()) return
    //console.log('!!!!!!!!~~~')
    this.currentSelectMacro = macro
    this.repeatTimes = macro?.value?.repeatCount === undefined ? 0 : macro?.value?.repeatCount
    this.macroType = macro?.value?.macroType === undefined ? 'touch_repeat' : macro?.value?.macroType
    if (this.currentSelectMacro?.value?.macro !== undefined)
      this.setCurrentRecMacroArr(this.currentSelectMacro?.value?.macro)

    console.log('___', this.currentSelectMacro?.name)
  }
  @action.bound
  refreshMacroList() {
    this.doAsync(DBService.getMacros, v => {
      this.macroList = DBService.macrosToFolder(v)
    })
  }

  getFolderMacros = (folder: DBService.MacroFolder) => {
    const macros: Macro[] = []
    macros.push(...folder.macros)

    if (folder.folders.length > 0)
      folder.folders.forEach(v => macros.push(...this.getFolderMacros(v)))

    return macros
  }

  @action.bound
  deleteFolder(folder: DBService.MacroFolder) {
    if (this.checkIsRec()) return
    const macros = this.getFolderMacros(folder)
    if (macros.some(v => v.localId === this.currentSelectMacro?.localId)) {
      this.setCurrentSelectMacro(undefined)
      this.currentRecMacroArr = []
    }
    this.doAsync(DBService.deleteMacros, v => {
      // if (macros.some(v => v.localId === this.currentSelectMacro?.localId)) {
      //   this.setCurrentSelectMacro(undefined)
      //   this.currentRecMacroArr = []
      // }

      this.refreshMacroList()
    }, macros)

  }
  @action.bound
  deleteMacro(macro: Macro) {
    if (this.checkIsRec()) return
    this.doAsync(DBService.deleteMacro, v => {
      if (this.currentSelectMacro?.localId === macro.localId) {
        this.setCurrentSelectMacro(undefined)
        this.currentRecMacroArr = []
      }
      this.refreshMacroList()
    }, macro)
  }
  checkName = (name: string) => {
    if (name === '') {
      mobxStore.toastStore.setInfo(res.text.名称不可为空())
      return false
    }
    if (name.length > 20) {
      mobxStore.toastStore.setInfo(res.text.名称不可大于20个字符())
      return false
    }
    if (!name.split('').some(v => v != ' ')) {
      mobxStore.toastStore.setInfo(res.text.名称不可全部为空())
      return false
    }
    if (name.includes('/') || name.includes('*')) {//todo 特殊字符
      mobxStore.toastStore.setInfo(res.text.名称不可包含特殊字符())
      return false
    }
    return true
  }
  @action.bound
  renameMacro(macro: Macro, rename: string) {
    if (this.checkIsRec()) return
    if (this.checkName(rename)) {
      macro.name = rename
      this.doAsync(DBService.saveMacro, v => this.refreshMacroList(), macro)
      //    临时处理
      if (this.currentSelectMacro)
        this.currentSelectMacro.name = rename
      //console.error('!!!!!!!!!!!!!!!!!', macro.name, this.currentSelectMacro?.name)
    }
  }
  @action.bound
  renameFolder(folder: DBService.MacroFolder, rename: string) {
    if (this.checkIsRec()) return
    if (this.checkName(rename)) {
      const macros = this.getFolderMacros(folder)
      const newPath = folder.id.substring(0, folder.id.lastIndexOf(folder.name)) + rename
      //console.log('NEWPPPAATHHHHHH', newPath)

      macros.forEach(v => {

        v.category = v.category?.replace(folder.id, newPath)

      })

      //console.log(macros.map(v => v.category), folder.id)
      this.doAsync(DBService.saveMacros, v => this.refreshMacroList(), macros)
    }
  }
  @action.bound
  async saveMacro() {

    console.log('!!!!!!!!~~~~~~~~~~~~~', this.currentSelectMacro?.name)
    if (this.currentSelectMacro === undefined) {
      await this.newMacro(this.macroList)
    }

    if (this.recodingState === 'recording' || this.recodingState === 'singleRecording') {
      this.stoptHook()
    }
    if (this.currentSelectMacro?.value === undefined) return
    // await this.newMacro(this.macroList)
    console.log('%%%%%%%', this.currentRecMacroArr.map(v => v.type))
    this.currentSelectMacro.value.macro = this.currentRecMacroArr
    this.currentSelectMacro.value.macroType = this.macroType
    this.currentSelectMacro.value.repeatCount = this.repeatTimes
    this.doAsync(DBService.saveMacro, v => {
      // console.error('saveMMMMMMMMMVVVVVVV',v);

      this.refreshMacroList()
      if (v.length > 0 && this.currentSelectMacro === undefined)
        this.currentSelectMacro = v[0]
    }, this.currentSelectMacro)
  }
  newDefaultName = (names: string[], defaultName: string) => {
    let num = 1
    let numArr = names.map(v => v.split(defaultName)).filter(p => p.length > 1).map(q => q[1])
    while (true) {
      let has = false
      for (let i = 0; i < numArr.length; i++) {
        const n = Number(numArr[i])
        if (n === num) {
          has = true
        }
      }
      if (has) {
        num++
      } else {
        break;
      }
    }

    return defaultName + num
  }
  @action.bound
  newFolder(baseFolder: DBService.MacroFolder) {
    if (this.checkIsRec()) return
    const macro = new Macro()
    macro.category = baseFolder.id + this.newDefaultName(baseFolder.folders.map(v => v.name), res.text.新建文件夹_()) + '/'
    macro.name = res.text.新的宏_() + 1
    //console.log('!!!!!!', baseFolder.name, baseFolder.id, macro.category)
    macro.value = {
      original: 0,
      type: 'ConfigMacro',
      macro: [],
      macroType: this.macroType,
      repeatCount: 1,
    }
    this.doAsync(DBService.saveMacro, v => {
      this.setCurrentSelectMacro(v[0])
      this.refreshMacroList()
    }, macro)
  }
  @action.bound
  newMacro(baseFolder: DBService.MacroFolder) {
    if (this.checkIsRec()) return
    return new Promise(resolve => {
      const macro = new Macro()
      macro.category = baseFolder.id
      macro.name = this.newDefaultName(baseFolder.macros.map(v => v.name) as string[], res.text.新的宏_())
      macro.value = {
        original: 0,
        type: 'ConfigMacro',
        macro: [],
        macroType: 'touch_repeat',
        repeatCount: 1,
      }
      if (this.currentSelectMacro === undefined) {
        macro.value.macro = this.currentRecMacroArr
      }
      this.doAsync(DBService.saveMacro, v => {
        this.setCurrentSelectMacro(v[0])
        this.refreshMacroList()
        if (v.length > 0) this.currentSelectMacro = v[0];
        resolve({});
      }, macro)
    })

  }

  @action.bound
  cleanMacroArr() {
    this.setCurrentRecMacroArr([])
  }

  @action.bound
  cleanSingleValue() {
    this.currentSingleValue = 0
  }

  @action.bound
  setRepeatTimes(rt: number) {
    this.repeatTimes = rt
  }

  @action.bound
  setMacroType(mrt: MacroRepeatType) {
    //console.error('设置类型')
    //console.log('!!!!!!!!setMacroTypesetMacroTypesetMacroType')
    if (this.macroType === mrt) return
    this.macroType = mrt
    // if (this.currentSelectMacro !== undefined)
    //   this.saveMacro()
  }
  alertIsFull = () => {
    if (mobxStore.toastStore.errMsg !== res.text.宏已录满())
      mobxStore.toastStore.setInfo(res.text.宏已录满())
  }
  @action.bound
  setCurrentRecMacroArr(arr: MacroEvent[]) {
    const res = mobxStore.deviceStore.currentDev?.checkMacroLenthIsFull(arr)
    //console.log('RREEESSS', res)
    if (res === false) {
      this.currentRecMacroArr = [...arr]
      this.isFull = false
    } else {
      this.alertIsFull()
      this.isFull = true
    }
  }
  checkMacro = (macroEvent: MacroEvent) => {
    if (macroEvent.type === 'mouse_move') {
      if (Math.abs(macroEvent.dx) > 127 || Math.abs(macroEvent.dy) > 127) {
        mobxStore.toastStore.setInfo(res.text.坐标值范围应在())
        return false
      }
    }
    if (macroEvent.type === 'delay' && macroEvent.value < 0) {
      mobxStore.toastStore.setInfo(res.text.延时应该大于0())
      return false
    }
    return true
  }
  @action.bound
  addEvent(macroEvent: MacroEvent, index?: number) {
    if (!this.checkMacro(macroEvent)) return
    const tmp = [...this.currentRecMacroArr]
    if (index === undefined) tmp.push(macroEvent)
    else tmp.splice(index, 0, macroEvent)
    this.setCurrentRecMacroArr(tmp)
  }
  @action.bound
  delEvent(index: number) {
    const tmp = [...this.currentRecMacroArr]
    tmp.splice(index, 1)
    this.setCurrentRecMacroArr(tmp)
  }
  @action.bound
  changeEvent(index: number, macroEvent: MacroEvent) {
    if (!this.checkMacro(macroEvent)) return
    const tmp = [...this.currentRecMacroArr]
    tmp[index] = macroEvent
    this.setCurrentRecMacroArr(tmp)
  }
  isStarting = false
  isStoppting = false
  @action.bound
  stoptHook() {
    if (this.isStarting) return
    this.isStoppting = true
    //console.log('SSSTTTTOOOPPPP')
    this.recodingState = 'stop'
    iohook.removeAllListeners()
    iohook.unload()
    iohook.stop()
    cleanTime()
    this.isStoppting = false
  }
  @action.bound
  starHook() {
    if (this.isStoppting) return
    if (this.isFull) {
      this.alertIsFull()
      return
    }
    if (this.recodingState === 'recording') return
    if (this.recodingState === 'singleRecording') {
      this.stoptHook()
    }
    this.isStarting = true
    this.recodingState = 'recording'
    iohook.load()
    iohook.start()
    iohook.on('keyup', this.recEvent)
    iohook.on('keydown', this.recEvent)
    iohook.on('mouseup', this.recEvent)
    iohook.on('mousedown', this.recEvent)
    cleanTime()
    this.isStarting = false
  }
  @action.bound
  startSingleHook() {
    if (this.isStoppting) return
    if (this.recodingState === 'singleRecording') return
    if (this.recodingState === 'recording') this.stoptHook()
    this.recodingState = 'singleRecording'
    this.currentSingleValue = 0
    this.isStarting = true
    iohook.load()
    iohook.start()
    iohook.on('keyup', this.recSingleEvent)
    iohook.on('keydown', this.recSingleEvent)
    iohook.on('mouseup', this.recSingleEvent)
    iohook.on('mousedown', this.recSingleEvent)
    this.isStarting = false
  }
  @action.bound
  stopMouseEvent() {
    iohook.removeAllListeners('mouseup')
    iohook.removeAllListeners('mousedown')
  }
  @action.bound
  startMouseEvent() {
    if (this.recodingState === 'recording') {
      iohook.on('mouseup', this.recEvent)
      iohook.on('mousedown', this.recEvent)
    }
    if (this.recodingState === 'singleRecording') {
      iohook.on('mouseup', this.recSingleEvent)
      iohook.on('mousedown', this.recSingleEvent)
    }
  }

  recEvent = (event: IOHookEvent) => {
    // console.error('!!!!!!!!!!!!!!',event)
    const macroEvents = getMacroEvents(event)
    macroEvents.forEach((v) => this.addEvent(v))
  }

  recSingleEvent = (event: IOHookEvent) => {
    const macroEvents = getMacroEvents(event)
    macroEvents.forEach((v) => {
      if (v.type !== 'delay' && v.type !== 'mouse_move') {
        this.currentSingleValue = v.value
      }

    })
  }
}
