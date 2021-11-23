import { observable, action } from 'mobx'

import { BaseStore } from './baseStore'
export class KeyIsOpen extends BaseStore {
    @observable keyIsOpen:boolean = false
    @action.bound
    setIsOpen(keyIsOpen:boolean) {
        this.keyIsOpen = keyIsOpen
    }
}