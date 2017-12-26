import React, { Component } from "react"
import ui from "../ui"
import { Provider } from "react-redux"
import { createStore, combineReducers } from "redux"
import reducer from "../reducer"
import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-15"

Enzyme.configure({ adapter: new Adapter() })

test("ui: Component always renders with state", done => {
  const store = createStore(
    combineReducers({
      ui: reducer,
    })
  )

  @ui({
    initialState: {
      value: "woot",
    },
    selector: state => ({
      value: state.value,
    }),
  })
  class Comp extends Component {
    render() {
      expect(this.props.value).toEqual("woot")
      done()
      return <div>{this.props.value}</div>
    }
  }

  Enzyme.mount(
    <Provider store={store}>
      <Comp />
    </Provider>
  )
})

// test("ui: Initial state is set before component mounts", done => {
//   const store = createStore(
//     combineReducers({
//       ui: reducer,
//     })
//   )

//   @ui({
//     initialState: {
//       stateValue: "initial value",
//     },
//     selector: state => ({
//       stateValue: state.stateValue,
//     }),
//   })
//   class Comp extends Component {
//     render() {
//       expect(this.props.stateValue).toEqual("initial value")
//       done()
//       return <div>test</div>
//     }
//   }

//   Enzyme.mount(
//     <Provider store={store}>
//       <Comp />
//     </Provider>
//   )
// })

// test("ui: Initial state [Function] is set before component mounts", done => {
//   const store = createStore(
//     combineReducers({
//       ui: reducer,
//     })
//   )

//   @ui({
//     initialState: props => ({
//       stateValue: props.value,
//     }),
//     selector: state => ({
//       stateValue: state.stateValue,
//     }),
//   })
//   class Comp extends Component {
//     render() {
//       expect(this.props.stateValue).toEqual("initialValue")
//       done()
//       return <div>test</div>
//     }
//   }

//   Enzyme.mount(
//     <Provider store={store}>
//       <Comp value="initialValue" />
//     </Provider>
//   )
// })

// test("ui: Parent state is initialised when before Child component renders", done => {
//   const store = createStore(
//     combineReducers({
//       ui: reducer,
//     })
//   )

//   @ui({
//     initialState: {
//       parent: "parent value",
//     },
//   })
//   class ParentComp extends Component {
//     render() {
//       return <ChildComp />
//     }
//   }

//   @ui({
//     initialState: {
//       child: "child value",
//     },
//     selector: state => ({
//       parent: state.parent,
//       child: state.child,
//     }),
//   })
//   class ChildComp extends Component {
//     render() {
//       expect({
//         child: this.props.child,
//         parent: this.props.parent,
//       }).toEqual({
//         child: "child value",
//         parent: "parent value",
//       })
//       done()
//       return <div>test</div>
//     }
//   }

//   Enzyme.mount(
//     <Provider store={store}>
//       <ParentComp />
//     </Provider>
//   )
// })

// test("ui: Parent state [Function] is initialised when before Child component renders", done => {
//   const store = createStore(
//     combineReducers({
//       ui: reducer,
//     })
//   )

//   @ui({
//     initialState: props => ({
//       parent: props.value,
//     }),
//   })
//   class ParentComp extends Component {
//     render() {
//       return <ChildComp />
//     }
//   }

//   @ui({
//     initialState: {
//       child: "child value",
//     },
//     selector: state => ({
//       parent: state.parent,
//       child: state.child,
//     }),
//   })
//   class ChildComp extends Component {
//     render() {
//       expect({
//         child: this.props.child,
//         parent: this.props.parent,
//       }).toEqual({
//         child: "child value",
//         parent: "parent value",
//       })
//       done()
//       return <div>test</div>
//     }
//   }

//   Enzyme.mount(
//     <Provider store={store}>
//       <ParentComp value="parent value" />
//     </Provider>
//   )
// })

// test("ui: Component only rerenders once per call to updateState", () => {
//   return expect(1).toEqual(1)
// })
