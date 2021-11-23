import React, { Fragment } from 'react'

import { TreeView } from './TreeView'
import { MacroRecordArea } from './MacroRecordArea'

export const MacroFile = () => {
  return (
    <Fragment>
      <MacroRecordArea />
      <TreeView />
    </Fragment>
  )
}
