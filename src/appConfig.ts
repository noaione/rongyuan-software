import * as path from 'path'
import * as url from 'url'
import version = require('../APP_VERSION.json')

const currentC_p = path.join('..', 'CurrentCompany.json')

const currentCompany = require(currentC_p) as {
    'currentCompany': string
}
const json_p = path.join('..', 'company', 'company_' + currentCompany.currentCompany, 'CONFIG.json')
const companyJson = require(json_p) as {
    'company': string,
    'displayName': string,
    'blockCloud': string
}

export const kBaseAppVersion = version.BaseAppVersion
export const kAppVersion = version.AppVersion
//export const kSeverAddr = 'http://127.0.0.1:3000/v1'

export const kSeverAddr = 'http://api.rongyuan.tech:3000/v1'


export const kCompany = companyJson['company']
export const kCompanyDisplayName = companyJson['displayName']



export const blockCloud = companyJson['blockCloud']

export const icon_p = path.join(__dirname, '..', 'company', 'company_' + kCompany, 'icon.png')
export const APP_p = path.join(__dirname, '..', 'company', 'company_' + kCompany, 'APP.png')
export const default_logo_p = path.join(__dirname, '..', 'company', 'company_' + kCompany, 'default_logo.png')
export const login_logo_p = path.join(__dirname, '..', 'company', 'company_' + kCompany, 'login_logo.png')
export const topnav_logo_p = path.join(__dirname, '..', 'company', 'company_' + kCompany, 'topnav_logo.png')

export const urlStr = (s: string) => url.pathToFileURL(s).toString()
