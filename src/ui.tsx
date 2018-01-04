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
    mounted: boolean

    constructor(props: UIProps, context: object) {
      super(props, context)

      this.mounted = false
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

    componentDidMount() {
      this.mounted = true
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

      /**
       * Although actions dispatch synchronously, actions dispatched in
       * componentWillMount will not affect the current render (unlike setState).
       * However, the store state will be updated before rendering continues.
       * So for the first render where state is initialised, we will get the
       * state directly from the store.
       */
      if (!this.mounted) {
        const initUIState = this.context.store.getState().ui

        const initAccessibleState = getAccessibleState(
          initUIState,
          this.componentPath
        )
        const initLocalState =
          callIfFunc(
            [initAccessibleState, this.props, this.props.wholeState],
            initialState
          ) || {}

        const relevantUIState = R.merge(initAccessibleState, initLocalState)

        return selector(
          relevantUIState,
          this.props,
          R.merge(this.props.wholeState, { __uiState: relevantUIState })
        )
      }

      const { uiState } = this.props

      const accessibleState =
        getAccessibleState(uiState, this.componentPath) || {}

      return selector(
        accessibleState,
        this.props,
        R.merge(this.props.wholeState, { __uiState: accessibleState })
      )
    }

    render() {
      const { uiState, ...rest } = this.props

      return (
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
