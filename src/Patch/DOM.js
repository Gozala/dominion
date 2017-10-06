/* @flow */

import type { Encode, Encoder, ChangeList, DecoderError, Result } from "../Log"
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

export default class DOMPatch {
  target: Node
  childrenSelected: boolean
  stash: Stash
  constructor(target: Node, childrenSelected: boolean, stash: Stash) {
    this.target = target
    this.childrenSelected = childrenSelected
    this.stash = stash
  }

  static selectChildren(state: DOMPatch): DOMPatch {
    if (state.childrenSelected) {
      throw Error(
        "Inavlid state: Unable to select children as they are already selected"
      )
    } else {
      state.childrenSelected = true
      return state
    }
  }
  static selectSibling(state: DOMPatch, offset: number): DOMPatch {
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
  static selectParent(state: DOMPatch): DOMPatch {
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
  static removeNextSibling(state: DOMPatch): DOMPatch {
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

  static insertText(state: DOMPatch, data: string): DOMPatch {
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createTextNode(data)
    )
    return state
  }
  static insertComment(state: DOMPatch, data: string): DOMPatch {
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createComment(data)
    )
    return state
  }
  static insertElement(state: DOMPatch, localName: string): DOMPatch {
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElement(localName)
    )
    return state
  }
  static insertElementNS(
    state: DOMPatch,
    namespaceURI: string,
    localName: string
  ): DOMPatch {
    insertNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElementNS(namespaceURI, localName)
    )
    return state
  }
  static insertStashedNode(state: DOMPatch, address: number): DOMPatch {
    insertNode(
      state.target,
      state.childrenSelected,
      getStashedNode(state.stash, address)
    )
    return state
  }

  static replaceWithText(state: DOMPatch, data: string): DOMPatch {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createTextNode(data)
    )
    return state
  }
  static replaceWithComment(state: DOMPatch, data: string): DOMPatch {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createComment(data)
    )
    return state
  }
  static replaceWithElement(state: DOMPatch, localName: string): DOMPatch {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElement(localName)
    )
    return state
  }
  static replaceWithElementNS(
    state: DOMPatch,
    namespaceURI: string,
    localName: string
  ): DOMPatch {
    replaceNode(
      state.target,
      state.childrenSelected,
      state.target.ownerDocument.createElementNS(namespaceURI, localName)
    )
    return state
  }
  static replaceWithStashedNode(state: DOMPatch, address: number): DOMPatch {
    const node = state.stash[address]
    if (node == null) {
      throw Error(`Unable to find stashed node with address #${address}`)
    }
    replaceNode(state.target, state.childrenSelected, node)
    return state
  }

  static editTextData(
    state: DOMPatch,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): DOMPatch {
    const node = getTextDataUpdateTarget(state.childrenSelected, state.target)
    const { data } = node
    const content = data.substring(start, data.length - end)
    node.data = `${prefix}${content}${suffix}`
    return state
  }
  static setTextData(state: DOMPatch, data: string): DOMPatch {
    const node = getTextDataUpdateTarget(state.childrenSelected, state.target)
    node.data = data
    return state
  }
  static setAttribute(state: DOMPatch, name: string, value: string): DOMPatch {
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.setAttribute(name, value)
    return state
  }
  static removeAttribute(state: DOMPatch, name: string): DOMPatch {
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.removeAttribute(name)
    return state
  }
  static setAttributeNS(
    state: DOMPatch,
    namespaceURI: string,
    name: string,
    value: string
  ): DOMPatch {
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.setAttributeNS(namespaceURI, name, value)
    return state
  }
  static removeAttributeNS(
    state: DOMPatch,
    namespaceURI: string,
    name: string
  ): DOMPatch {
    const node = getUpdateTargetElement(state.childrenSelected, state.target)
    node.removeAttributeNS(namespaceURI, name)
    return state
  }
  static assignProperty(
    state: DOMPatch,
    name: string,
    value: string | number | boolean | null
  ): DOMPatch {
    const node: Object = getUpdateTargetElement(
      state.childrenSelected,
      state.target
    )
    node[name] = value
    return state
  }
  static deleteProperty(state: DOMPatch, name: string): DOMPatch {
    const node: Object = getUpdateTargetElement(
      state.childrenSelected,
      state.target
    )
    delete node[name]
    return state
  }
  static setStyleRule(state: DOMPatch, name: string, value: string) {
    const style = getTargetStyle(state.childrenSelected, state.target)
    style[(name: any)] = value
    return state
  }
  static removeStyleRule(state: DOMPatch, name: string) {
    const style = getTargetStyle(state.childrenSelected, state.target)
    delete style[(name: any)]
    return state
  }

  static stashNextSibling(state: DOMPatch, address: number): DOMPatch {
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
  static discardStashedNode(state: DOMPatch, address: number): DOMPatch {
    delete state.stash[address]
    return state
  }

  static encode(target: Node, changeList: ChangeList): Result<Node> {
    const result = changeList.encode(DOMPatch, new DOMPatch(target, false, {}))
    if (result instanceof DOMPatch) {
      return result.target
    } else {
      return result
    }
  }

  static encoder(target: Node): Encode<Node> {
    return (changeList: ChangeList): Result<Node> =>
      DOMPatch.encode(target, changeList)
  }
}
