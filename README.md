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

## Overview

## Exports

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

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(uiMiddleware))
)
```
