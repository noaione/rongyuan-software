import { Entity, Column, BaseEntity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import { User } from './user'
import { Macro } from './macro'
import { Config } from './config'



@Entity()
export class DeviceType extends BaseEntity {

    constructor(obj?: {
        id: number,
        vid: number,
        pid: number,
        name: string,
        type: 'mouse' | 'keyboard',//鼠标还是键盘,
        support_onboard: 0 | 1 | 2,//0 不支持 1 不支持mousemove 2 支持mousemove,
        usage: number,
        usagePage: number
        version?: string,
        layout?: Layout
        group?: string
        displayName?: string
        company?: string
        featureReportByteLength?: number
        musicSupportVersion?: number
    }) {
        super()
        Object.assign(this, obj)
        Object.assign(this, obj)
        if (this.displayName === undefined) this.displayName = this.name
    }

    @PrimaryColumn()
    id?: number


    @Column()
    vid?: number

    @Column()
    pid?: number

    @Column()
    name?: string

    @Column()
    displayName?: string

    @Column()
    type?: 'mouse' | 'keyboard'//鼠标还是键盘

    @Column()
    support_onboard?: 0 | 1 | 2 | 3//0 不支持 1 不支持mousemove 2 支持mousemove  3 支持多套板载

    @Column({ nullable: true })
    version?: string

    @Column({ nullable: true })
    severVersion?: string

    @Column()
    usage?: number

    @Column()
    usagePage?: number

    @Column({ nullable: true })
    featureReportByteLength?: number

    @Column()
    needLock: boolean = false

    @Column('simple-json', { nullable: true })
    layout?: Layout

    @Column()
    group: string = 'rongyuan'

    @Column()
    company: string = 'rongyuan'


    @ManyToMany(type => User, user => user.deviceTypes)
    users?: User[]

    @OneToMany(type => Macro, macro => macro.deviceType)
    macros?: Macro[]

    @OneToMany(type => Config, config => config.deviceType)
    configs?: Config[]


    devAddr: number | string = -1

}