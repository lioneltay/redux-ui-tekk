import { UPDATE_STATE, MOUNT_COMPONENT, UNMOUNT_COMPONENT } from "./actions"
import { updateStateTree, removeStateAtPath, addStateAtPath } from "./helpers"

const initialState = {}

const reducer = (state = initialState, action) => {
  // console.log(JSON.stringify(action, null, 2))

  switch (action.type) {
    case UPDATE_STATE: {
      const { componentPath, state: componentState } = action.payload
      return updateStateTree(state, componentPath, componentState)
    }
    case MOUNT_COMPONENT: {
      const { componentPath, state: componentState } = action.payload
      return addStateAtPath(state, componentPath, componentState)
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
