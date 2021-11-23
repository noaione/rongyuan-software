import { observable, action } from 'mobx'

import { BaseStore } from './baseStore'
export class TextDisplay extends BaseStore {
    @observable isDis:true|false = true
    @action.bound
    setIsDis(disKey:true|false) {
        this.isDis = disKey
    }
}