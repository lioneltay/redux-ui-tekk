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
  (val, candidate) =>
    typeof candidate === "function" ? candidate(val) : candidate
)

export interface UIProps {
  uiState: object
  mountComponent(object: any): void
  unmountComponent(componentPath: string[]): void
  updateState: any
}

interface UIConfig {
  key?: string
  initialState: object
  selector(state: any, props?: any): any
}

const ui = (
  { key, initialState, selector }: UIConfig = {
    initialState: {},
    selector: noop,
  }
) => Comp => {
  const generatedKey = key || generateKey(Comp)

  const EnhancedComp = pure(Comp)

  @connect(
    state => ({
      uiState: state.ui || {},
    }),
    {
      mountComponent,
      unmountComponent,
      updateState,
    }
  )
  class UI extends Component<UIProps> {
    static propTypes = {
      uiState: PropTypes.object.isRequired,
      mountComponent: PropTypes.func.isRequired,
      unmountComponent: PropTypes.func.isRequired,
      updateState: PropTypes.func.isRequired,
    }

    static contextTypes = {
      // Where the ui state for the parent component is mounted
      componentPath: PropTypes.array,
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
      this.props.mountComponent({
        componentPath: this.componentPath,
        state: callIfFunc(this.props, initialState),
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
          ? callIfFunc(this.props, initialState)
          : componentState
      )

      return selector(localState, this.props)
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
          updateState={this.updateState}
        />
      )
    }
  }

  return UI
}

export default ui
