import { actionName } from "./constants"

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

interface MountComponent {
  componentPath: string[]
  state: object
  reducer: any
}
export const mountComponent = ({
  componentPath,
  state,
  reducer,
}: MountComponent) => ({
  type: MOUNT_COMPONENT,
  payload: { componentPath, state, reducer },
})

interface UnmountComponent {
  componentPath: string[]
}
export const unmountComponent = ({ componentPath }: UnmountComponent) => ({
  type: UNMOUNT_COMPONENT,
  payload: { componentPath },
})
