import { observable, action } from 'mobx'
import { DeviceType } from '../sdk/DB'
import { DBService } from '../sdk/WebService'
import { BaseStore } from './baseStore'


export class HelpStore extends BaseStore {
    constructor() {
        super()
        //autorun(() => console.log('SSTTTTAAAATTT', this.state, this.errMsg))
    }
    @observable currentComanyDevList: DeviceType[] = []

    @action.bound
    async getCurrentComanyDevList() {
        this.doAsync(DBService.getCurrentComanyDevList, v => {
            this.currentComanyDevList = v
        })
    }
}
