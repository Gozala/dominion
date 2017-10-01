/* @flow */

import type {
  Encoder,
  ChangeLog,
  ChangeList,
  DecoderError,
  Result
} from "../Log"
import { ok, error } from "result.flow"
import { nodeType } from "../DOM/Node"
import unreachable from "unreachable"

const empty = Object.freeze([])

const ELEMENT_NODE = 1
const TEXT_NODE = 3
const COMMENT_NODE = 8

const insertNode = (
  target: Node,
  childrenSelected: boolean,
  node: Node
): Node => {
  if (childrenSelected) {
    return target.insertBefore(node, target.firstChild)
  } else {
    const parent = target.parentNode
    if (parent == null) {
      throw Error("Inavalid state. Unable to add a sibling to an orphand node")
    }

    return parent.insertBefore(node, target.nextSibling)
  }
}

const removeNode = (target: Node): Node => {
  const parent = target.parentNode
  if (parent == null) {
    throw Error("Unable to remove orphand node")
  } else {
    return parent.removeChild(target)
  }
}

const replaceNode = (
  target: Node,
  childrenSelected: boolean,
  node: Node
): Node => {
  if (childrenSelected) {
    throw Error(
      "Invalid state. Unable to replace node when children are seleted"
    )
  }
  const parent = target.parentNode
  if (parent == null) {
    throw Error("Ivarid state. Unable to replace an orphand node")
  }

  return parent.replaceChild(node, target)
}

const getTextDataUpdateTarget = (
  selectChildren: boolean,
  target: Node
): Text | Comment => {
  if (selectChildren) {
    throw Error("Unable to edit text data when children are selected")
  }
  switch (target.nodeType) {
    case TEXT_NODE:
      return (target: any)
    case COMMENT_NODE: {
      return (target: any)
    }
    default: {
      throw Error(
        "Unable to edit text data as neither Text nor Comment node is selected"
      )
    }
  }
}

const getUpdateTargetElement = (
  selectChildren: boolean,
  target: Node
): Element => {
  if (selectChildren) {
    throw new Error("Unable to update node when children are selected.")
  } else if (target.nodeType === ELEMENT_NODE) {
    return (target: any)
  } else {
    throw new Error(
      "Unable to update element when text or comment node is selected"
    )
  }
}

const getTargetStyle = (
  selectChildren: boolean,
  target: Node
): CSSStyleDeclaration => {
  if (selectChildren) {
    throw new Error("Unable to update node when children are selected.")
  } else if (target.style) {
    return (target: any).style
  } else {
    throw new Error("Target node does not support styling")
  }
}

const getStashedNode = (stash: { [number]: Node }, address: number): Node => {
  const node = stash[address]
  if (node == null) {
    throw Error(`Unable to find stashed node with address #${address}`)
  } else {
    return node
  }
}

type Stash = { [number]: Node }

class State {
  target: Node
  childrenSelected: boolean
  stash: Stash
  constructor(target: Node, childrenSelected: boolean, stash: Stash) {
    this.target = target
    this.childrenSelected = childrenSelected
    this.stash = stash
  }
}

class DOMPatcher implements ChangeLog<State> {
  isError = false
  // reset(target: Node, childrenSelected: boolean, stash: Stash): State {
  //   state.target = target
  //   state.childrenSelected = childrenSelected
  //   state.stash = stash
  //   return state
  // }

  selectChildren(state: State): State {
    console.log(`Patch: Select children`)
    if (state.childrenSelected) {
      throw Error(
        "Inavlid state: Unable to select children as they are already selected"
      )
    } else {
      state.childrenSelected = true
      return state
    }
  }
  selectSibling(state: State, offset: number): State {
    console.log(`Patch: select sibling ${offset}`)
    const { target, childrenSelected } = state
    let select = null
    if (childrenSelected) {
      state.childrenSelected = false
      select = target.childNodes[offset - 1]
    } else {
      select = target
      while (select && offset--) {
        select = target.nextSibling
      }
    }

    if (select == null) {
      throw Error(
        "sibling selection has failed, sibling being selected does not exist"
      )
    } else {
      state.target = select
      state.childrenSelected = false
      return state
    }
  }
  selectParent(state: State): State {
    console.log("select parent")
    if (state.childrenSelected) {
      state.childrenSelected = false
      return state
    } else {
      const target = state.target.parentNode
      if (target == null) {
        throw Error("Can not select parent of orphand node")
      } else {
        state.target = target
        return state
      }
    }
  }
  removeNextSibling(state: State): State {
    console.log("remove next sibling")
    const next = state.childrenSelected
      ? state.target.firstChild
      : state.target.nextSibling

    if (next == null) {
      throw Error("Can not remove next sibling as it does not exist")
    } else {
      state.target.removeChild(next)
      return state
    }
  }

  insertText(state: State, data: string): State {
    console.log("insert text", data)
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createTextNode(data)
    )
    return state
  }
  insertComment(state: State, data: string): State {
    console.log("insert comment", data)
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createComment(data)
    )
    return state
  }
  insertElement(state: State, localName: string): State {
    console.log(`insert element <${localName}/>`)
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElement(localName)
    )
    return state
  }
  insertElementNS(
    state: State,
    namespaceURI: string,
    localName: string
  ): State {
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElementNS(namespaceURI, localName)
    )
    return state
  }
  insertStashedNode(state: State, address: number): State {
    insertNode(
      state.target,
      state.childrenSelected,
      getStashedNode(state.stash, address)
    )
    return state
  }

  replaceWithText(state: State, data: string): State {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createTextNode(data)
    )
    return state
  }
  replaceWithComment(state: State, data: string): State {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createComment(data)
    )
    return state
  }
  replaceWithElement(state: State, localName: string): State {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElement(localName)
    )
    return state
  }
  replaceWithElementNS(
    state: State,
    namespaceURI: string,
    localName: string
  ): State {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElementNS(namespaceURI, localName)
    )
    return state
  }
  replaceWithStashedNode(state: State, address: number): State {
    const node = state.stash[address]
    if (node == null) {
      throw Error(`Unable to find stashed node with address #${address}`)
    }
    replaceNode(state.target, state.childrenSelected, node)
    return state
  }

  editTextData(
    state: State,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): State {
    const node = getTextDataUpdateTarget(state.childrenSelected, state.target)
    const { data } = node
    const content = data.substring(start, data.length - end)
    node.data = `${prefix}${content}${suffix}`
    return state
  }
  setTextData(state: State, data: string): State {
    const node = getTextDataUpdateTarget(state.childrenSelected, state.target)
    node.data = data
    return state
  }
  setAttribute(state: State, name: string, value: string): State {
    console.log(`Patch: Set attribute ${name}="${value}"`)
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.setAttribute(name, value)
    return state
  }
  removeAttribute(state: State, name: string): State {
    console.log(`Patch: Remove attribute ${name}`)
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.removeAttribute(name)
    return state
  }
  setAttributeNS(
    state: State,
    namespaceURI: string,
    name: string,
    value: string
  ): State {
    console.log(`Patch: Set attribute NS ${namespaceURI} ${name}="${value}"`)
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.setAttributeNS(namespaceURI, name, value)
    return state
  }
  removeAttributeNS(state: State, namespaceURI: string, name: string): State {
    console.log(`Patch: Remove attribute NS ${namespaceURI} ${name}`)
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.removeAttributeNS(namespaceURI, name)
    return state
  }
  assignProperty(
    state: State,
    name: string,
    value: string | number | boolean | null
  ): State {
    console.log(`Patch: Assign property ${name}=${JSON.stringify(value)}`)
    const node: Object = getUpdateTargetElement(
      state.childrenSelected,
      state.target
    )
    node[name] = value
    return state
  }
  deleteProperty(state: State, name: string): State {
    console.log(`Patch: Delete property ${name}`)
    const node: Object = getUpdateTargetElement(
      state.childrenSelected,
      state.target
    )
    delete node[name]
    return state
  }
  setStyleRule(state: State, name: string, value: string) {
    console.log(`Patch: Style style.${name}="${value}"`)
    const style = getTargetStyle(state.childrenSelected, state.target)
    style[(name: any)] = value
    return state
  }
  removeStyleRule(state: State, name: string) {
    console.log(`Patch: Remove style rule ${name}`)
    const style = getTargetStyle(state.childrenSelected, state.target)
    delete style[(name: any)]
    return state
  }

  stashNextSibling(state: State, address: number): State {
    const next = state.childrenSelected
      ? state.target.firstChild
      : state.target.nextSibling

    if (next == null) {
      throw Error("Unable to stash next sibling as there is not one")
    } else {
      state.stash[address] = next
      removeNode(next)
      return state
    }
  }
  discardStashedNode(state: State, address: number): State {
    delete state.stash[address]
    return state
  }
}

const patcher = new DOMPatcher()

export default (target: Node): Encoder<Node> => (
  changeList: ChangeList
): Result<Node> => {
  const result = changeList.reduce(patcher, new State(target, false, {}))
  if (result instanceof State) {
    return result.target
  } else {
    return result
  }
}
