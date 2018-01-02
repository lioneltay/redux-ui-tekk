export interface Action {
  type: string
  payload: { [key: string]: any }
}

export type State = object

export interface UIState {
  [key: string]: any
}

export type Reducer = (state: State, action: Action) => State

export type ComponentPath = string[]

export interface AnyObject {
  [key: string]: any
}
