import { Action } from "./types"
import { getStateAtPath } from "./helpers"
import { MOUNT_COMPONENT, UNMOUNT_COMPONENT, updateState } from "./actions"
import * as R from "ramda"

export default ({ getState, dispatch }) => (next: (action: Action) => void) => {
  const reducers = new Map()

  return (action: Action) => {
    if (action.type === MOUNT_COMPONENT) {
      const { componentPath, reducer } = action.payload
      if (reducer) {
        reducers.set(componentPath, reducer)
      }
      return next(R.dissoc("reducer", action))
    }

    if (action.type === UNMOUNT_COMPONENT) {
      const { componentPath } = action.payload
      reducers.delete(componentPath)
      return next(action)
    }

    reducers.forEach((reducer, path) => {
      const localState = getStateAtPath(getState().ui, path)
      const newLocalState = reducer(localState, action)
      return newLocalState
        ? dispatch(
            updateState({
              componentPath: path,
              state: newLocalState,
            })
          )
        : null
    })

    return next(action)
  }
}
