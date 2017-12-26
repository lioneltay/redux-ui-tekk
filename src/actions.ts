const PREFIX = "@@redux-ui-tekk__"

const actionName = name => `${PREFIX}${name}`

export const UPDATE_STATE = actionName("UPDATE_STATE")
export const MOUNT_COMPONENT = actionName("MOUNT_COMPONENT")
export const UNMOUNT_COMPONENT = actionName("UNMOUNT_COMPONENT")

interface UpdateState {
  componentPath: string[]
  state: object
}
export const updateState = ({ componentPath, state }: UpdateState) => ({
  type: UPDATE_STATE,
  payload: { componentPath, state },
})

export const mountComponent = ({ componentPath, state }: UpdateState) => ({
  type: MOUNT_COMPONENT,
  payload: { componentPath, state },
})

interface UnmountComponent {
  componentPath: string[]
}
export const unmountComponent = ({ componentPath }: UnmountComponent) => ({
  type: UNMOUNT_COMPONENT,
  payload: { componentPath },
})
