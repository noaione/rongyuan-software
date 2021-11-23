
import { action, observable, autorun, reaction, IReactionDisposer, } from 'mobx'
import { DBService, downloadDevUpgradeFile, getCurrentUser, webService } from '../sdk/WebService'
import { Config, DeviceType } from '../sdk/DB'
import { BaseStore } from './baseStore'
import { mobxStore } from './store'
import { res } from '../res'
import { sleep } from '../unitys/timeFunc'






const kLoadingMessage = 'reading...'

export class DeviceStore extends BaseStore {
    static lightNameMap: { [key: string]: string } = {
        'LightOff': res.text.关闭(),
        'LightAlwaysOn': res.text.常亮(),
        'LightBreath': res.text.呼吸(),
        'LightWave': res.text.光波(),
        'LightRipple': res.text.涟漪(),
        'LightRaindrop': res.text.雨滴(),
        'LightSnake': res.text.蛇形(),
        'LightPressAction': res.text.跟随(),
        'LightConverage': res.text.聚合(),
        'LightNeon': res.text.霓虹(),
        'LightUserPicture': res.text.自定义(),
        'LightSingleRipple': res.text.激光(),
        'LightSineWave': res.text.正玄波(),
        'LightRoundRipple': res.text.烟花(),
        'LightMusicFollow': res.text.音乐律动(),

        'LightKaleidoscope': res.text.万花筒(),
        'LightLineWave': res.text.线性波浪(),
        'LightObliqueWave': res.text.斜波(),
        'LightGreedySnake': res.text.贪吃蛇(),
        'LightStarry': res.text.星空(),
        'LightWaterFall': res.text.瀑布(),
        'LightRingWaterFall': res.text.环形瀑布(),
    }
    constructor() {
        super()
        //音乐律动
        // if (light.type === 'LightMusicFollow') {
        //     mobxStore.musicFollowStore.start()
        //     this.musicReaction = reaction(() => mobxStore.musicFollowStore.musicDataArray, (v,r) => {
        //         this.setMusicFollow(v)
        //     })
        // } else {
        //     if (this.musicReaction !== undefined) {
        //         this.musicReaction
        //     }

        // }
        // autorun(() => console.error(this.currentConfig))
        reaction(() => this.currentConfig.light, async (v) => {
            if (this.musicReaction) {
                this.musicReaction()
                this.musicReaction = undefined
            }
            if (v?.type === 'LightMusicFollow') {
                mobxStore.musicFollowStore.start()
                this.musicReaction = reaction(() => mobxStore.musicFollowStore.musicDataArray, (v) => {
                    this.setMusicFollow(v)
                })
            } else {
                mobxStore.musicFollowStore.stop()

            }
        })

        DBService.deviceListChangeSubject.subscribe(v => {
            //console.log('@@@@@@@@@@@@', v)
            this.refresh()
        })
    }
    private musicReaction: IReactionDisposer | undefined
    @observable
    deviceArr = DBService.getDeviceInstanceArr()
    @observable
    currentSelectIndex = DBService.getDeviceSelectIndex()
    @observable
    currentDev = DBService.getCurrentDev()
    @observable
    currentConfig = new Config()
    @observable
    currentProfile = 0

    @observable
    currentDevVersion = kLoadingMessage

    @action.bound
    private loadCurrentConfig() {
        this.currentConfig.name = 'loading'
        return new Promise<void>(async resolve => {
            if (this.currentDev?.deviceType.name === 'help') {
                resolve()
                return
            }
            await this.getCurrentProfile()
            this.doAsync(DBService.loadCurrentConfig, (v) => {
                this.doAsync(DBService.devToConfig, async (dv) => {
                    //console.log('DDDDDVVVVVV', dv)
                    if (dv === undefined) {
                        console.log('设备状态读不出')
                        this.creatNewConfigToCurrentAndSave('default', '')
                        resolve()
                        return
                    }


                    if (v === undefined || !DBService.checkConfigValueEqual(v, dv)) {
                        //
                        console.log('当前状态与设备状态不同')
                        // console.log('数据库的值:', v?.value)
                        // console.log('设备里的值:', dv?.value)
                        console.log('查找数据里有没有相同的')
                        const sameConfig = await DBService.findSameConfig(dv)
                        if (sameConfig === undefined) {
                            console.log('没有找到相同的配置')
                            this.currentConfig = dv
                            this.currentConfig.name = this.currentDev?.deviceType.displayName
                            this.currentConfig.category = ''
                            this.saveCurrentConfig().then(() => {
                                console.log('NNNAAAAMMEEEEE', this.currentConfig.name)
                                console.log('将设备状态作为当前状态', this.currentConfig.localId)
                                this.doAsync(DBService.setCurrentConfig, v => { }, this.currentConfig)
                                mobxStore.configStore.getConfigListFormDB()
                            })
                        } else {
                            console.log('找到相同的配置')
                            this.currentConfig = sameConfig
                        }






                        resolve()
                        return
                    }
                    this.currentConfig = v
                    resolve()
                })
            })
        })

    }


    @action.bound
    private refresh() {
        this.currentDev = DBService.getCurrentDev()
        //console.log('REFRESHHHHHHH', this.currentDev?.type)
        if (this.currentDev !== undefined && this.currentConfig.name === undefined) {
            this.getCurrentProfile().then(v => this.loadCurrentConfig().then(v => mobxStore.configStore.getConfigListFormDB()))
        }
        this.deviceArr = DBService.getDeviceInstanceArr()
        this.currentSelectIndex = DBService.getDeviceSelectIndex()
        if (this.deviceArr.length === 0) this.currentConfig = new Config()

        //
        //console.log('!!!!!!!!!!', this.currentDev?.deviceType)
        if (this.currentDev?.deviceType.version) {
            this.currentDevVersion = this.currentDev?.deviceType.version
            if (this.currentDev?.deviceType.severVersion) {
                mobxStore.upgradeStore.setDevNeedUpgrade(Number(this.currentDev?.deviceType.version) < Number(this.currentDev?.deviceType.severVersion))
            }
        }


    }

    @action.bound
    setCurrentSelectIndex(index: number) {
        DBService.setDeviceSelectIndex(index)
        this.currentConfig = new Config()
        this.refresh()
    }




    @action.bound
    writeCurrentConfigToDev() {
        this.doAsync(DBService.configToDev, () => {
        }, this.currentConfig)
    }

    @action.bound
    checkDev() {
        if (this.currentDev === undefined) {

            mobxStore.toastStore.setErr(res.text.当前未检测到设备())
            return false
        }
        return true
    }
    @action.bound
    async getCurrentProfile() {
        if (!this.checkDev()) return
        return this.doAsync(this.currentDev!.getCurrentProfile, async (v) => {
            if (v) {
                this.currentProfile = this.currentDev!.currentProfile
            }
        })
    }
    @action.bound
    async setCurrentProfile(p: number) {
        if (!this.checkDev()) return
        return this.doAsync(this.currentDev!.setCurrentProfile, async (v) => {
            if (v) {
                this.currentProfile = this.currentDev!.currentProfile
                this.loadCurrentConfig()
            }
        }, p)
    }

    @action.bound
    setMusicFollow(uint8arr: Uint8Array) {
        if (!this.checkDev()) return
        if (this.currentDev?.type !== 'keyboard') return
        this.currentDev.setMusicFollow(uint8arr)
    }
    @action.bound
    getDevVersion() {
        if (!this.checkDev()) return
        this.currentDevVersion = kLoadingMessage
        this.doAsync(this.currentDev!.getFirmwareVersion, async (v) => {
            //console.log('VVVVVVVVV', v)
            if (v === undefined) return
            this.currentDevVersion = v.toString()
            const tDT = await DeviceType.findOne(this.currentDev?.deviceType.id)//防止救援升级魔改
            if (tDT === undefined) return
            tDT.version = v.toString()
            await tDT.save()
            this.saveCurrentConfig()
        })
    }
    @action.bound
    setReportRate(rate: 1000 | 500 | 250 | 125) {
        if (!this.checkDev()) return
        this.doAsync(this.currentDev!.setReportRate, (p) => {
            if (p) {
                this.currentConfig.reportRate = rate
                this.saveCurrentConfig()
            }

        }, rate)
    }
    @action.bound
    async setLightSetting(light: LightSetting) {
        //console.log('ligth', light)
        if (!this.checkDev()) return
        this.doAsync(this.currentDev!.setLightSetting, async (p) => {
            if (p) {
                this.currentConfig.light = light
                this.saveCurrentConfig()

                if (light.type === 'LightUserPicture' && light.option !== undefined) {
                    await sleep(200)
                    this.getLightPic()
                }
            }

        }, light)
    }
    @action.bound
    setLogoLightSetting(light: LightSetting) {
        if (!this.checkDev()) return
        if (this.currentDev?.type !== 'mouse') return
        this.doAsync(this.currentDev.setLogoLightSetting, (p) => {
            if (p) {
                console.error(this.currentConfig)
                this.currentConfig.light = light
                this.saveCurrentConfig()
            }
        }, light)
    }

    @action.bound
    getLightPic() {
        if (!this.checkDev()) return
        if (this.currentDev?.type !== 'keyboard') return

        this.doAsync(this.currentDev.getLightPic, (v) => {
            console.error('!!!!!!!!!!!!!!', v)
            if (v) {
                this.currentConfig.lightPic = v
                this.saveCurrentConfig()
            }
        })
    }
    @action.bound
    setLightPic(pic: UserPicItem[]) {
        //console.log(pic)
        if (!this.checkDev()) return
        if (this.currentDev?.type !== 'keyboard') return
        this.doAsync(this.currentDev.setLightPic, v => {
            if (v) {
                this.currentConfig.lightPic = pic
                this.saveCurrentConfig()
            }
        }, pic)
    }

    @action.bound
    setKeyConfig(configValue: ConfigValue) {
        if (!this.checkDev()) return
        if (this.currentDev === undefined) {
            return
        }
        // console.error('configValueconfigValueconfigValueconfigValueconfigValue:', configValue)
        // console.error('this.currentConfig.value', this.currentConfig.value, configValue)
        const tmpCur = this.currentConfig.value === undefined ? [configValue] : [...this.currentConfig.value]
        const ts = tmpCur.find(v => v.original === configValue.original && v.index === configValue.index)
        if (ts !== undefined)
            tmpCur.splice(tmpCur.indexOf(ts), 1)

        tmpCur.push(configValue)
        //console.log('tmpCurtmpCurtmpCurtmpCur',tmpCur)
        //console.log('TTTTMMMMMPPPPPPPVVVVVCCCCUUT', tmpCur, this.currentConfig.value)
        this.doAsync(this.currentDev.setKeyConfig, (p) => {
            if (p) {

                //console.log('configValue!!!!',configValue)
                if (configValue.type === 'combo' &&
                    configValue.original === configValue.key &&
                    configValue.skey === 'none' &&
                    configValue.key2 === 0
                ) {//恢复默认设置
                    const ts = tmpCur.find(v => v.original === configValue.original && v.index === configValue.index)
                    if (ts !== undefined)
                        tmpCur.splice(tmpCur.indexOf(ts), 1)
                    //console.log('!!!!!!',this.currentConfig.value)

                }
                //console.log('????????????????', tmpCur, this.currentConfig.value)
                this.currentConfig.value = tmpCur
                //console.log('@@@@@@@@@@@@@@',this.currentConfig.value)
                //console.log('PPPPPP',p,configValue,this.currentConfig.value)
                this.saveCurrentConfig().then(v => {
                    //console.log('###########',this.currentConfig.value)
                })
            }
        }, tmpCur)
    }

    /*  @action.bound
      setKeyConfig(configValues: ConfigValue[]) {
          if (!this.checkDev()) return
          if (this.currentDev === undefined || this.currentDev.type !== 'mouse') {
              return
          }
          this.doAsync(this.currentDev.setKeyConfig, (p) => {
              if (p) {
                  this.currentConfig.value = configValues
                  this.saveCurrentConfig()
              }
          }, configValues)
      }*/

    @action.bound
    async setReset() {
        if (!this.checkDev()) return
        mobxStore.musicFollowStore.stop()
        this.doAsync(this.currentDev!.setReSet, (v) => {
            if (v) {
                this.loadCurrentConfig()
            }
        })
    }

    @action.bound
    setDpi(dpi: number[]) {
        if (!this.checkDev()) return
        if (this.currentDev === undefined || this.currentDev.type !== 'mouse') {
            return
        }
        this.doAsync(this.currentDev.setDPI, (p) => {
            if (p) {
                this.currentConfig.dpi = dpi
                this.saveCurrentConfig()
            }
        }, dpi)
    }

    @action.bound
    private saveCurrentConfig() {
        return new Promise<void>(resolve => {
            const tmp = this.currentConfig
            this.currentConfig = new Config()
            Object.assign(this.currentConfig, tmp)
            //console.error('!!!!!!!!!!!!!!!!!', this.currentConfig)
            this.doAsync(DBService.saveConfig, (v) => { resolve() }, this.currentConfig)
        })
    }

    @action.bound
    setCurrentConfig(config: Config) {
        this.currentConfig = config

        this.doAsync(DBService.setCurrentConfig, (v) => {
            this.writeCurrentConfigToDev()
        }, this.currentConfig)
    }
    //临时方案
    @action.bound
    renameCurrentConfig(config: Config) {

        this.currentConfig.name = config.name
        this.saveCurrentConfig()
    }

    @action.bound
    creatNewConfigToCurrentAndSave(name: string, category: string) {
        const config = new Config()
        config.name = name
        config.category = category
        config.reportRate = 500
        config.value = []
        config.light = {
            type: "LightAlwaysOn",
            value: 1,
            rgb: 16729454
        }
        this.currentConfig = config

        this.doAsync(DBService.saveConfig, (v) => {
            mobxStore.configStore.getConfigListFormDB()
            this.writeCurrentConfigToDev()
        }, this.currentConfig)
    }

    ///
    @observable userDevList: DeviceType[] = []
    @action.bound
    getUserDevList() {
        this.doAsync(getCurrentUser, (v) => {

            if (v !== undefined && v.deviceTypes !== undefined)
                this.userDevList = [...v?.deviceTypes]
        })
    }



    commonHandleErr = (err: any) => {

        mobxStore.toastStore.setErr(err)
    }
    commonHandleSuccess = (v: any) => {
        if (typeof v === 'boolean' && v === false) {
            mobxStore.toastStore.setErr(res.text.读取设备错误())
        }
    }
}


