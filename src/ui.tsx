import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import * as R from "ramda"
import { pure } from "recompose"

import { mountComponent, unmountComponent, updateState } from "./actions"
import { getAccessibleState, getStateAtPath } from "./helpers"

const noop = () => {}

// TODO: get proper unique ids
let id = 1
const getId = () => id++
const generateKey = Comp => {
  return `${Comp.displayName || Comp.name}_Key_${getId()}`
}

const callIfFunc = R.curry(
  (vals: any[], candidate) =>
    typeof candidate === "function" ? candidate(...vals) : candidate
)

export interface UIProps {
  uiState: object
  wholeState: object
  mountComponent(object: any): void
  unmountComponent(componentPath: string[]): void
  updateState: any
  dispatch(action: object): any
}

type Reducer = (state: object, action: object) => object

interface UIConfig {
  key?: string
  initialState?: object
  selector?(state: any, props?: any, wholeState?: any): any
  reducer?: { [key: string]: Reducer }
}

const ui = (
  { key, initialState = {}, selector = noop, reducer }: UIConfig = {
    initialState: {},
    selector: noop,
  }
) => Comp => {
  const generatedKey = key || generateKey(Comp)

  const EnhancedComp = pure(Comp)

  @connect(
    state => ({
      wholeState: state || {},
      uiState: state.ui || {},
    }),
    dispatch => ({
      mountComponent: (...args) => dispatch(mountComponent(...args)),
      unmountComponent: (...args) => dispatch(unmountComponent(...args)),
      updateState: (...args) => dispatch(updateState(...args)),
      dispatch,
    })
  )
  class UI extends Component<UIProps> {
    static propTypes = {
      uiState: PropTypes.object.isRequired,
      mountComponent: PropTypes.func.isRequired,
      unmountComponent: PropTypes.func.isRequired,
      updateState: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }

    static contextTypes = {
      // Where the ui state for the parent component is mounted
      componentPath: PropTypes.array,
      store: PropTypes.object.isRequired,
    }

    static childContextTypes = {
      componentPath: PropTypes.array,
    }

    getChildContext() {
      return {
        componentPath: this.componentPath,
      }
    }

    key: string
    componentPath: string[]

    constructor(props, context) {
      super(props, context)

      this.key = generatedKey
      this.componentPath = (this.context.componentPath || []).concat(this.key)
    }

    componentWillMount() {
      const accessibleState =
        getAccessibleState(this.props.uiState, this.componentPath) || {}

      this.props.mountComponent({
        componentPath: this.componentPath,
        state: callIfFunc(
          [accessibleState, this.props, this.props.wholeState],
          initialState
        ),
        reducer,
      })
    }

    componentWillUnmount() {
      this.props.unmountComponent(this.componentPath)
    }

    updateState = state => {
      this.props.updateState({ state, componentPath: this.componentPath })
    }

    getState = () => {
      if (typeof selector !== "function") {
        return {}
      }

      const { uiState } = this.props

      const componentState = getStateAtPath(uiState, this.componentPath)
      const accessibleState = getAccessibleState(uiState, this.componentPath)

      const localState = R.merge(
        accessibleState,
        !componentState || R.isEmpty(componentState)
          ? callIfFunc([this.props, this.props.wholeState], initialState)
          : componentState
      )

      return selector(localState, this.props, this.props.wholeState)
    }

    render() {
      const { uiState, ...rest } = this.props
      const stateInitialised = !!getStateAtPath(
        this.props.uiState,
        this.componentPath
      )

      return !stateInitialised ? null : (
        <EnhancedComp
          {...rest}
          {...this.getState()}
          dispatch={this.props.dispatch}
          updateState={this.updateState}
        />
      )
    }
  }

  return UI
}

export default ui
