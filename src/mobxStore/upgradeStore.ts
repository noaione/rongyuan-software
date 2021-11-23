import { remote } from 'electron'
import { observable, action, autorun, computed } from 'mobx'
import { kAppVersion } from '../appConfig'
import { res } from '../res'
import { DeviceType } from '../sdk/DB'
import { downloadAppUpgradeFile, downloadDevUpgradeFile, ReturnMSG, webService } from '../sdk/WebService'
import { BaseStore } from './baseStore'
import { mobxStore } from './store'


export class UpgradeStore extends BaseStore {
    constructor() {
        super()
        //autorun(() => console.log('nnnnneeeeeddddd', this.upgradeProgressApp))
    }

    @observable
    appVersion = kAppVersion

    @observable
    appNeedUpgrade = false
    @observable
    devNeedUpgrade = false

    @observable
    upgradeProgressDev = 1

    @observable
    upgradeProgressApp = 1

    @action.bound
    setUpgradeProgressDev(p: number) {
        this.upgradeProgressDev = p
    }
    @action.bound
    setUpgradeProgressApp(p: number) {
        this.upgradeProgressApp = p
    }
    @action.bound
    setAppNeedUpgrade = (t: boolean) => {
        this.appNeedUpgrade = t
    }
    @action.bound
    setDevNeedUpgrade = (t: boolean) => {
        this.devNeedUpgrade = t
    }
    @computed
    get appNeedUpgrade_() {
        return this.appNeedUpgrade
    }
    @computed
    get devNeedUpgrade_() {
        return this.devNeedUpgrade
    }
    @action.bound
    async upgradeApp() {
        //console.log('@@@@@######$$$$$$')
        await this.checkVersion()
        if (this.appNeedUpgrade === false) {
            mobxStore.toastStore.setInfo(res.text.驱动已经是最新版本无需更新())
            return
        }
        this.setUpgradeProgressApp(0)
        const progress = (v: number) => {
            this.setUpgradeProgressApp(v)
        }
        this.doAsync(downloadAppUpgradeFile, () => {
            mobxStore.toastStore.setInfo(res.text.驱动升级成功将自动重启())
            setTimeout(() => {
                remote.app.relaunch()
                remote.app.quit()
            }, 4000);

        }, progress)
    }
    @action.bound
    async upgradeDev() {

        //if (this.currentDev?.deviceType.upgradeFileName === undefined || this.currentDev?.deviceType.upgradeFileName === null) {
        await this.checkVersion()
        if (this.devNeedUpgrade === false) {
            //console.log('!!!!!!!!!',res.text.固件已经是最新版本无需更新())
            mobxStore.toastStore.setInfo(res.text.固件已经是最新版本无需更新())
            return
        }
        //}
        this.setUpgradeProgressDev(0)
        const progress = (v: number) => {
            this.setUpgradeProgressDev(v)
        }
        if (mobxStore.deviceStore?.currentDev?.deviceType.id === undefined) return
        this.doAsync(downloadDevUpgradeFile, v => {

            if (v === undefined || mobxStore.deviceStore.currentDev === undefined) return
            this.doAsync(mobxStore.deviceStore.currentDev.upgrade, (v) => {
                if (v) {
                    mobxStore.deviceStore.getDevVersion()
                }
            }, v, progress)
        }, mobxStore.deviceStore?.currentDev?.deviceType.id)
    }
    appVersionV1BiggerThanV2 = (v1: string, v2: string) => {
        const v1a = v1.split('.')
        const v2a = v2.split('.')

        if (v1a.length !== v2a.length || v1a.length < 3) {
            console.log('非法版本号')
            return false
        }
        const v1Nmuber = Number(v1a[0]) * 100000 + Number(v1a[1]) * 1000 + Number(v1a[2])
        const v2Nmuber = Number(v2a[0]) * 100000 + Number(v2a[1]) * 1000 + Number(v2a[2])
        console.log('v1:', v1Nmuber, '  v2:', v2Nmuber)
        return v1Nmuber > v2Nmuber

    }
    @action.bound
    checkVersion() {
        return new Promise(reslove => {
            this.doAsync(webService.checkVersion, v => {

                if (v.errCode !== 0) return
                console.log('checkVersion:', v.data.appVersion, this.appVersion)
                if (this.appVersionV1BiggerThanV2(v.data.baseAppVersion, this.appVersion)) {
                    mobxStore.toastStore.setInfo(res.text.当前驱动版本过低请重新下载安装())
                    this.setAppNeedUpgrade(false)
                } else {
                    this.setAppNeedUpgrade(this.appVersionV1BiggerThanV2(v.data.appVersion, this.appVersion))
                }


                const version = v.data.devVersion.find(v => v.devId === mobxStore.deviceStore?.currentDev?.deviceType.id)
                if (version === undefined) {
                    //mobxStore.toastStore.setErr('该设备不在服务器中')
                    console.log('该设备不在服务器中')
                    reslove()
                    return
                }
                console.log('VERSION:', mobxStore.deviceStore.currentDevVersion, version, Number(mobxStore.deviceStore.currentDevVersion) < version.version)

                this.setDevNeedUpgrade(Number(mobxStore.deviceStore.currentDevVersion) < version.version)

                if (this.appVersionV1BiggerThanV2(version.lowestAppVersion, kAppVersion)) {
                    this.setDevNeedUpgrade(false)
                    mobxStore.toastStore.setErr(res.text.当前驱动版本过低已无法适配最新固件请更新驱动())
                    reslove()
                    return
                }

                if (mobxStore.deviceStore.currentDev === undefined) {
                    reslove()
                    return
                }
                mobxStore.deviceStore.currentDev.deviceType.severVersion = version.version.toString()
                DeviceType.find().then(v1 => {
                    //console.log(this.devNeedUpgrade)
                    v1.forEach(vv => {
                        const version1 = v.data.devVersion.find(v => v.devId === mobxStore.deviceStore.currentDev?.deviceType.id)

                        if (version1 === undefined) return
                        vv.severVersion = version1.version.toString()
                    })
                    if (!this.devNeedUpgrade) {
                        //mobxStore.toastStore.setInfo('已经是最新版本,无需更新')
                    }

                    reslove()
                })

            })
        })

    }

    commonHandleErr = (err: any) => {
        // mobxStore.toastStore.setErr(err)
        if (err.request !== undefined) {
            mobxStore.toastStore.setErr(res.text.网络连接失败())
        } else {
            mobxStore.toastStore.setErr(err)
        }
    }
    commonHandleSuccess = (v: any) => {
        if (v === undefined) return
        //if ('errCode' in v && v.errCode !== undefined) {
        const ret = v as ReturnMSG
        if (ret.errCode !== 0 && ret.errMsg !== undefined) {

            mobxStore.toastStore.setErr(ret.errCode < 0 ? res.text.网络连接失败() : ret.errMsg.toString())

        }
        //}



    }
}
