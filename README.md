# redux-ui-tekk

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
