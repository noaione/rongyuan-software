import React, { useState, useEffect } from 'react'
import { dj } from '../../../dj'
import { Macro } from '../../../sdk/DB/entity/macro'

import { useStore } from '../../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'

export const MacroEdit = (p: {
  setMacro: (macro: Macro | undefined) => void
}) => {
  const [state, setState] = useState({})

  const { macroStore } = useStore()

  const getMacroList = (folderStruct: typeof macroStore.macroList) => {
    let macroList: typeof macroStore.macroList.macros = []

    if (folderStruct.macros.length > 0) {
      macroList = macroList.concat(folderStruct.macros)
    }

    if (folderStruct.folders.length > 0)
      folderStruct.folders.map((folder) => {
        macroList = macroList.concat(getMacroList(folder))
      })

    return macroList
  }

  const [checkState, setCheckState] = useState<{
    [key: string]: boolean
  }>({})

  const allCheckFalse: { [key: string]: boolean } = {}

  useEffect(() => {
    getMacroList(macroStore.macroList).map(
      (macro) => (allCheckFalse[macro.localId ? macro.localId : 0] = false)
    )
    setCheckState(allCheckFalse)
  }, [])
// console.error('checkState',checkState);

  return useObserver(() => (
    <dj.TreeView
      form={'可调整'}
      options={macroStore.macroList}
      selectedOptions={state}
      onChange={setState}
      clickId={-1}
      checkBoxState={{
        checkState: checkState,
        changeChecked: (id: number, macro: Macro) => {
          if (!checkState[id]) p.setMacro(macro)
          else p.setMacro(undefined)
          setCheckState({ ...allCheckFalse, [id]: !checkState[id] })
        },
      }}
    />
  ))
}
