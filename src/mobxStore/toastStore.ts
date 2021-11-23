import { observable, action, autorun, computed } from 'mobx'
import { BaseStore } from './baseStore'


export class ToastStore extends BaseStore {
    constructor() {
        super()
        //autorun(() => console.log('SSTTTTAAAATTT', this.state, this.errMsg))
    }
    @observable state: 'bussy' | 'idle' = 'idle'
    @observable errMsg = ''

    @observable errType: 'error' | 'info' = 'error'

    @action.bound
    closeErr() {
        this.errMsg = ''
    }
    @action.bound
    setInfo(str: string) {
        this.errType = 'info'
        this.errMsg = str
    }
    @action.bound
    setErr(str: string) {
        this.errType = 'error'
        this.errMsg = str
    }
    @action.bound
    setState(s: 'bussy' | 'idle' = 'idle') {
        this.state = s
    }
    @computed
    get isError() {
        return this.errType === 'error' && this.errMsg !== ''
    }
}
