import { observable, action, autorun } from 'mobx'

import { BaseStore } from './baseStore'
import { mobxStore } from './store'
// LightBreath
export class LightBreathStore extends BaseStore {
    @observable BreathA = 0
    @observable key: '+' | '-' = '+'
    @action.bound
    setBreathA(){
        this.BreathA = 0
    }
    @action.bound
    setBreathInterval() {
        if (this.key === '+') {
            this.BreathA += 17
            if (this.BreathA >= 100) {
                this.key = '-'
            }
        } else if (this.key === '-') {
            this.BreathA -= 17
            if (this.BreathA <= 0) {
                this.key = '+'
            }
        }
    }
}

// LightWave
export class LightWaveStore extends BaseStore {
    // @observable waveArr = new Array()
    @observable waveAArr = new Array()
    @observable testtt = 0
    @observable key = '+'


    @action.bound
    setWaveArr(arr: Array<number>) {
        this.waveAArr = [...arr]
    }

    @action.bound
    setWaveInterval() {
        const p = mobxStore.deviceStore.currentConfig.light
        if (p !== undefined && p.type === 'LightWave' && this.waveAArr !== []) {
            for (var i = 0; i < this.waveAArr.length; i++) {
                if (p.option === 'right') {
                    this.waveAArr[i] += 10;
                    if (this.waveAArr[i] >= 360) {
                        this.waveAArr[i] = 0
                    }
                } else if (p.option === 'left') {
                    this.waveAArr[i] -= 10;
                    if (this.waveAArr[i] <= 0) {
                        this.waveAArr[i] = 360
                    }
                }
            }
        }
        // console.log(this.waveAArr)
    }
}

// LightRipple
export class LightRippleStore extends BaseStore {
    @observable ripLeftNum: number = 0
    @observable ripRightNum: number = 0
    @observable ripLength: number = 0
    @action.bound
    setRipNum(num: number, num2: number) {
        this.ripLeftNum = num
        this.ripRightNum = num
        this.ripLength = num2
        // console.log(this.ripLeftNum,this.ripLength)
    }

    @action.bound
    setRipInterval() {
        if (this.ripLeftNum !== undefined) {
            if (this.ripLeftNum <= -3) {
                this.ripLeftNum = -3
            } else { 
                this.ripLeftNum--;
            }
            if (this.ripRightNum >= this.ripLength+2) {
                this.ripRightNum = this.ripLength+2
            } else {
                this.ripRightNum++;
            }
        }
    }
}
export class LightRipFullStore extends BaseStore {
    @observable dyKey:number | undefined
    @observable dyLen:number | undefined

    @observable dxLeft:number | undefined
    @observable dxRight:number | undefined
    @observable dxLen:number | undefined
    timer: NodeJS.Timeout | undefined

    @action.bound
    setFullnum(dy:number,ylength:number,dx:number,xlength:number){
        this.dyKey = dy
        this.dyLen = ylength

        this.dxLeft = dx
        this.dxRight = dx
        this.dxLen = xlength
        // console.log(this.dxLeft,this.dxRight,this.dxLen)
    }
    @action.bound
    setFullInterval() {
        if(this.dyLen !== undefined
            && this.dxLeft !== undefined
            && this.dxRight !== undefined
            && this.dxLen !== undefined){

            if (this.dxLeft <= -5) {
                this.dxLeft = -5
            } else { 
                this.dxLeft--;
            }
            if (this.dxRight >= this.dxLen+4) {
                this.dxRight = this.dxLen+4
            } else {
                this.dxRight++;
            }
        }
    }
}


// LightSnake
// z 
export class LightSnakeZStore extends BaseStore {
    @observable zNum = -3
    @observable zLen = 0
    @action.bound
    setZLen(num:number,length:number){
        this.zNum = num
        this.zLen = length
    }
    @action.bound
    setSnakeZInterval(){
        this.zNum++
        if(this.zNum >= this.zLen){
            this.zNum = -3
        }
    }
}
export class LightSnakeRetStore extends BaseStore {
    @observable retNum = -3
    @observable retLen = 0
    @observable key: '+'|'-' = '+'
    @action.bound
    setRetLen(num:number,length:number){
        this.retNum = num
        this.retLen = length
    }
    @action.bound
    setSnakeRetInterval(){
        if(this.key === '+'){
            this.retNum++
            if(this.retNum >= this.retLen){
                this.key = '-'
            }
        }else if(this.key === '-'){
            this.retNum--
            if(this.retNum <= -3){
this.key = '+'
            }
        }
    }
}
export class LightPressStore extends BaseStore {
    @observable pressA: number = 10
    @action.bound
    setPress(num:number){
        this.pressA = num
    }
    @action.bound
    setPressInterval() {
        if(this.pressA <= 0){
            this.pressA = 0
        }else {
            this.pressA--
        }
    }
}


export class LightConverStore extends BaseStore {
    @observable conLeft = -2
    @observable conRight = 15+2
    @observable conMidNum = 0
    @observable key:1|2|3|4|5 = 1
    
    @action.bound
    setConverStatic(len:number){
        this.conLeft = -2
        this.conRight = len+2
        this.key = 1
    }
    @action.bound
    setConverInterval(){
        if(this.key === 1){
            this.conLeft++
            this.conRight--
            if(this.conLeft >= 7){
                this.key = 2
            }
        }else if(this.key === 2){
            this.conMidNum++
            if(this.conMidNum>=12){
                this.conMidNum = 0;
                this.key = 3
            }
        }
        else if(this.key === 3){
            this.conLeft--
            this.conRight++
            if(this.conLeft <= -3){
                this.key = 1
            }
        }     
    }
}

export class LightNeonStore extends BaseStore {
    @observable neonR= 0
    @observable neonG= 0
    @observable neonB= 0
    @observable neonKey= 'k1' 

    @action.bound
    setNeonRGB(){
        this.neonR= 0
        this.neonG= 0
        this.neonB= 0
        this.neonKey = 'k1'
    }
    @action.bound
    setNeonRGBInterval() {
        if(this.neonKey === 'k1'){
            this.neonR+=5
            if(this.neonR>=255){
                this.neonKey = 'k2'
            }
        } else if(this.neonKey === 'k2'){
            this.neonR-=5
            this.neonG+=5
            if(this.neonG>=255){
                this.neonKey = 'k3'
            }
        } else if(this.neonKey === 'k3'){
            this.neonG-=5
            this.neonB+=5
            if(this.neonB>=255){
                this.neonKey = 'k4'
            }
        } else if(this.neonKey === 'k4'){
            this.neonB-=5
            this.neonR+=5
            if(this.neonR>=255){
                this.neonKey = 'k2'
            }
        }
    }
}
export class LightControlStore extends BaseStore {
    @observable test = 0
    @action.bound
    setTestInterval() {

    }
}

