# redux-ui-tekk

## Quick Start

```typescript
import React, { Component } from "react"
import { ui } from "redux-ui-tekk"

const ParentComponent = ui({
  initialState: {
    parentValue: "parentValue",
  },
  selector: (uiState, props, wholeState) => ({
    parentValue: uiState.parentValue,
    childValue: uiState.childvalue, // Not accessible by parent
  }),
})(({ parentValue, childValue }) => (
  <div>
    <h2>Parent Component</h2>
    <pre>{parentValue}</pre>
    <pre>{childValue}</pre>
    <ChildComponent />
  </div>
))

const ChildComponent = ui({
  initialState: {
    childValue: "childValue",
  },
  selector: (uiState, props, wholeState) => ({
    parentValue: uiState.parentValue,
    childValue: uiState.childvalue,
  }),
})(({ childValue, parentValue }) => (
  <div>
    <h2>Child Component</h2>
    <pre>{parentValue}</pre>
    <pre>{childValue}</pre>
  </div>
))

export default class Demo extends Component {
  render() {
    return (
      <div>
        <h1>Demo</h1>
        <ParentComponent />
      </div>
    )
  }
}
```

## Installation

```
npm install --save redux-ui-tekk
```

## Overview

The aim is to provide a simple and flexible way to model ui state.

## Recipes

* removing the use of setState (replace setState with updateState, replace state constructor with initialState configuration)
* Modal Component (using the reducer configuration)
* Meaningful demo
* Show that ui state managent can replace setState, and allows easy lifting of state
  * common pattern to lift state into parent components when many siblings need to access the same state
  * using setState require the parent component to become a class component and be aware of the additional state that it needs to pass down to its children even if it doesn't use the state itself
  * uiState simply requires you to move the state declaration to the parent component. The parent component need not be aware of the change

## API

### ui(config: UIConfig)(Comp: ReactComponent): ReactComponent

#### options

```typescript
interface UIConfig {
  key?: string
  initialState?: object
  selector?(state: any, props?: any, wholeState?: any): any
  reducer?: { [key: string]: Reducer }
}
```

### reducer

The reducer that manages all the ui state.

```typescript
import { reducer as uiReducer } from "redux-ui-tekk"
import { combineReducers } from "redux"

const reducer = combineReducers({
  ui: uiReducer,

  otherState: otherStateReducer,
  // ...whatever your heart desires
})
```

### uiMiddleware

Add this middleware to enable the reducer configuration property of ui().

It works by maintaining a map of component reducers and dispatching additional actions when a reducer whenever a reducer returns a non null result.

```typescript
import { createStore, combineReducers, applyMiddleware } from "redux"
import { reducer as uiReducer, uiMiddleware } from "redux-ui-tekk"

const reducer = combineReducers({
  ui: uiReducer,

  otherState: otherStateReducer,
  // ...whatever your heart desires
})

const store = createStore(reducer, applyMiddleware(uiMiddleware))
```
