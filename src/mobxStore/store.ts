import { DeviceStore } from "./deviceStore"
import { createContext, useContext } from "react"
import { ConfigStore } from "./configStore"
import { ShareStore } from "./shareStore"
import { UserStore } from "./userStore"
import { MacroStore } from "./macroStore"
import { ToastStore } from "./toastStore"
import { PageStore } from "./pageStore"
import { ColorPickerStore } from "./colorPickerStore"
import { UpgradeStore } from "./upgradeStore"
import { HelpStore } from "./helpStroe"
import { MusicFollowStore } from "./musicFollowStore"
import { LightBreathStore, LightConverStore, LightNeonStore, LightPressStore, LightRipFullStore, LightRippleStore, LightSnakeRetStore, LightSnakeZStore, LightWaveStore } from "./lightControlStroe"
import { TextDisplay } from "./textDisplay"
import { KeyIsOpen } from "./keySettingIsOpen"


export const mobxStore = {
    deviceStore: new DeviceStore(),
    configStore: new ConfigStore(),
    shareStore: new ShareStore(),
    userStore: new UserStore(),
    macroStore: new MacroStore(),
    toastStore: new ToastStore(),
    pageStore: new PageStore(),
    colorPickerStore: new ColorPickerStore(),
    upgradeStore: new UpgradeStore(),
    helpStore: new HelpStore(),
    lightBreathStore: new LightBreathStore(),
    lightWaveStore: new LightWaveStore(),
    lightRippleStore: new LightRippleStore(),
    lightRipFullStore: new LightRipFullStore(),
    lightSnakeZStore: new LightSnakeZStore(),
    lightSnakeRetStore: new LightSnakeRetStore(),
    lightPressStore: new LightPressStore(),
    lightConverStore: new LightConverStore(),
    lightNeonStore:new LightNeonStore(),
    musicFollowStore: new MusicFollowStore(),
    textDisplay: new TextDisplay(),
    keyIsOpen: new KeyIsOpen(),
}
export const MobxStoreContext = createContext(mobxStore)
export const useStore = () => {
    return useContext(MobxStoreContext)
}