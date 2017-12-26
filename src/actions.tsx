const PREFIX = "@@redux-ui-tekk__"

const actionName = name => `${PREFIX}${name}`

export const UPDATE_STATE = actionName("UPDATE_STATE")
export const MOUNT_COMPONENT = actionName("MOUNT_COMPONENT")
export const UNMOUNT_COMPONENT = actionName("UNMOUNT_COMPONENT")

export const updateState = ({ componentPath, state }) => ({
  type: UPDATE_STATE,
  payload: { componentPath, state },
})

export const mountComponent = ({ componentPath, state }) => ({
  type: MOUNT_COMPONENT,
  payload: { componentPath, state },
})

export const unmountComponent = ({ componentPath }) => ({
  type: UNMOUNT_COMPONENT,
  payload: { componentPath },
})
