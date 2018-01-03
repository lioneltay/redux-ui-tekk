import { Reducer } from "./types"
import React, { Component, ReactElement } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import * as R from "ramda"
import { pure } from "recompose"

import { mountComponent, unmountComponent, updateState } from "./actions"
import {
  getAccessibleState,
  getStateAtPath,
  callIfFunc,
  noop,
  generateKey,
} from "./helpers"

export interface UIProps {
  uiState: object
  wholeState: object
  mountComponent(object: any): void
  unmountComponent(componentPath: string[]): void
  updateState: any
  dispatch(action: object): any
}

interface UIConfig {
  key?: any
  initialState?: object
  selector?(state: any, props?: any, wholeState?: any): any
  reducer?: { [key: string]: Reducer }
}

const defaultConfig = {
  initialState: {},
  selector: noop,
}

const ui = ({
  key,
  initialState = {},
  selector = noop,
  reducer,
}: UIConfig = defaultConfig) => (Comp: Component) => {
  const EnhancedComp = pure(Comp)

  @connect(
    (state: object) => ({
      wholeState: state || {},
      uiState: state.ui || {},
    }),
    dispatch => ({
      mountComponent: (options: any) => dispatch(mountComponent(options)),
      unmountComponent: (options: any) => dispatch(unmountComponent(options)),
      updateState: (options: any) => dispatch(updateState(options)),
      dispatch,
    })
  )
  class UI extends Component<UIProps, object> {
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

    constructor(props: UIProps, context: object) {
      super(props, context)

      this.key = key
        ? typeof key === "function" ? key(props) : key
        : generateKey(Comp)
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
      this.props.unmountComponent({ componentPath: this.componentPath })
    }

    updateState = (state: object) => {
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

      return selector(
        localState,
        this.props,
        R.merge(this.props.wholeState, { __uiState: localState })
      )
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
