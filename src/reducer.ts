import { UPDATE_STATE, MOUNT_COMPONENT, UNMOUNT_COMPONENT } from "./actions"
import {
  updateStateTree,
  removeStateAtPath,
  addStateAtPath,
} from "./helpers/index"
import { mountComponent } from "./reducerHandlers/index"
import { Action } from "./types"

const initialState = {}

const reducer = (state: object = initialState, action: Action) => {
  switch (action.type) {
    case UPDATE_STATE: {
      const { componentPath, state: componentState } = action.payload
      return updateStateTree(state, componentPath, componentState)
    }
    case MOUNT_COMPONENT: {
      const { componentPath, state: componentState } = action.payload
      return mountComponent(state, componentPath, componentState)
    }
    case UNMOUNT_COMPONENT: {
      const { componentPath } = action.payload
      return removeStateAtPath(state, componentPath)
    }
    default: {
      return state
    }
  }
}

export default reducer
