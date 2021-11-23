import React, { useState, Fragment, useEffect } from 'react'

import { dj } from '../../../dj'
import { Macro } from '../../../sdk/DB'
import { Share } from '../../utils/Share'
import { useStore } from '../../../mobxStore/store'
import { useObserver } from 'mobx-react-lite'
import { autorun } from 'mobx'
import { DBService } from '../../../sdk/WebService'
import { res } from '../../../res'
import { blockCloud } from '../../../appConfig'

export const TreeView = () => {
  const [state, setState] = useState({})

  const [shareMacro, setShareMacro] = useState<Macro | undefined>(undefined)

  const { macroStore, pageStore, shareStore } = useStore()

  const onRenameMacro = async (macro: Macro) => {
    if (rename.name === '') {
      setRename({ id: '', name: '' })
      return
    }

    if (macro.name !== rename.name) {
      macroStore.renameMacro(macro, rename.name)
    }

    setRename({ id: '', name: '' })
  }

  const onRenameFolder = async (folderStruct: DBService.MacroFolder) => {
    if (rename.name === '') {
      setRename({ id: '', name: '' })
      return
    }

    macroStore.renameFolder(folderStruct, rename.name)

    setRename({ id: '', name: '' })
  }

  const updateOutsideData = (macro: Macro) => {
    // macroStore.setCurrentMacroArr([])

    if (macro.localId === macroStore.currentSelectMacro?.localId) {
      macroStore.recodingState === 'recording' && macroStore.stoptHook()
      return
    }

    macroStore.setCurrentRecMacroArr(
      macro.value ? macro.value.macro.slice() : []
    )
    macroStore.setMacroType(macro.value ? macro.value.macroType : 'on_off')
    macroStore.setRepeatTimes(macro.value ? macro.value.repeatCount : 1)

    macroStore.setCurrentSelectMacro(macro)

    macroStore.recodingState === 'recording' && macroStore.stoptHook()
  }

  const onShareMacro = (macro: Macro) => {
    setShareMacro(macro)
  }

  //设置 rename 的状态
  const [rename, setRename] = useState({ id: '', name: '' })

  useEffect(
    () =>
      autorun(() => {
        macroStore.refreshMacroList()
      }),
    []
  )

  const onDelteMacro = (macro: Macro) => {
    if (macroStore.currentSelectMacro?.localId === macro.localId)
      macroStore.setCurrentRecMacroArr([])
    macroStore.deleteMacro(macro)
  }

  return useObserver(() => (
    <Fragment>
      <dj.ContextMenuView
        w={301}
        h={480}
        y={25}
        id={'-1'}
        onNewMacro={() => macroStore.newMacro(macroStore.macroList)}
        onNewFolder={() => {
          macroStore.newFolder(macroStore.macroList)
        }}>
        <dj.View form={'Border'}>
          <dj.FlexView
            flexDirection={'column'}
            justifyContent={'space-between'}>
            <dj.View relative h={32} form={'MacroBackground'}>
              {!blockCloud && <dj.Button
                w={70}
                h={18}
                y={7}
                text={res.string.热门}
                mode={'Bluer'}
                clickHandle={() => {
                  pageStore.setPageIndex(3)
                  shareStore.setCurrentShareListType('macro')
                  shareStore.setShareListPage('macro','count')
                }}
              />}
              <dj.FlexView
                w={82}
                h={14}
                x={191}
                y={9}
                justifyContent={'space-between'}>
                <dj.Button
                  relative
                  w={14}
                  h={14}
                  img={{ src: res.img.new_macro }}
                  clickHandle={() => macroStore.newMacro(macroStore.macroList)}
                />
                <dj.Button
                  relative
                  w={14}
                  h={14}
                  img={{ src: res.img.new_folder }}
                  clickHandle={() => {
                    macroStore.newFolder(macroStore.macroList)
                  }}
                />
                <dj.Button
                  relative
                  w={14}
                  h={14}
                  img={{ src: res.img.folder_close }}
                  clickHandle={() => {
                    setState({})
                  }}
                />
              </dj.FlexView>
            </dj.View>
            <dj.TreeView
              relative
              options={macroStore.macroList}
              selectedOptions={state}
              onChange={setState}
              clickId={
                macroStore.currentSelectMacro?.localId
                  ? macroStore.currentSelectMacro.localId
                  : 0
              }
              contextMenu={{
                onRenameMacro: onRenameMacro,
                onRenameFolder: onRenameFolder,
                onNewMacro: macroStore.newMacro,
                onNewFolder: macroStore.newFolder,
                onDelete: onDelteMacro,
                onDeleteUnderFolder: macroStore.deleteFolder,
                updateOutsideData: updateOutsideData,
                onShareMacro: onShareMacro,
                onSetRenameState: (id: string, name: string) =>
                  setRename({ id: id, name: name }),
                renameState: rename,
              }}
            />
          </dj.FlexView>
        </dj.View>
      </dj.ContextMenuView>
      {shareMacro !== undefined && (
        <Fragment>
          <dj.View w={1200} h={730} x={-264} y={-101} form={'背景页'}>
            {' '}
          </dj.View>
          <dj.View w={1200} h={730} x={-264} y={-101}>
            <Share
              type={'Macro'}
              macro={shareMacro}
              close={() => setShareMacro(undefined)}
            />
          </dj.View>
        </Fragment>
      )}
    </Fragment>
  ))
}
