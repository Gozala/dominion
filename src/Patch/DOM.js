/* @flow */

import type {
  Encoder,
  Archive,
  ChangeList,
  DecoderError,
  Result,
  EventDecoder
} from "../Log"
import { ok, error } from "result.flow"
import { nodeType } from "../DOM/Node"
import unreachable from "unreachable"
import * as Decoder from "decoder.flow"

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

const replaceNode = (state: DOMPatch, node: Node): DOMPatch => {
  if (state.childrenSelected) {
    throw Error(
      "Invalid state. Unable to replace node when children are seleted"
    )
  }
  const parent = state.target.parentNode
  if (parent == null) {
    throw Error("Ivarid state. Unable to replace an orphand node")
  }

  parent.replaceChild(node, state.target)
  state.target = node
  return state
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
): CSSStyleDeclaration & { [string]: string } => {
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
  mailbox: { send: Object => void }
  reset(
    target: Node,
    childrenSelected: boolean,
    stash: Stash,
    mailbox: { send: Object => void }
  ) {
    this.target = target
    this.childrenSelected = childrenSelected
    this.stash = stash
    this.mailbox = mailbox
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
        select = select.nextSibling
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
    const { childrenSelected, target } = state
    const [parent, next] = childrenSelected
      ? [target, target.firstChild]
      : [target.parentNode, target.nextSibling]

    if (next == null) {
      throw Error("Can not remove next sibling as it does not exist")
    } else if (parent == null) {
      throw Error("Can not remove next sibling as it has not parent")
    } else {
      parent.removeChild(next)
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
    return replaceNode(state, state.target.ownerDocument.createTextNode(data))
  }
  static replaceWithComment(state: DOMPatch, data: string): DOMPatch {
    return replaceNode(state, state.target.ownerDocument.createComment(data))
  }
  static replaceWithElement(state: DOMPatch, localName: string): DOMPatch {
    return replaceNode(
      state,
      state.target.ownerDocument.createElement(localName)
    )
  }
  static replaceWithElementNS(
    state: DOMPatch,
    namespaceURI: string,
    localName: string
  ): DOMPatch {
    return replaceNode(
      state,
      state.target.ownerDocument.createElementNS(namespaceURI, localName)
    )
  }
  static replaceWithStashedNode(state: DOMPatch, address: number): DOMPatch {
    const node = state.stash[address]
    if (node == null) {
      throw Error(`Unable to find stashed node with address #${address}`)
    }
    return replaceNode(state, node)
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
  static setStyleRule(state: DOMPatch, name: string, value: string): DOMPatch {
    const style = getTargetStyle(state.childrenSelected, state.target)
    style[name] = value
    return state
  }
  static removeStyleRule(state: DOMPatch, name: string): DOMPatch {
    const style = getTargetStyle(state.childrenSelected, state.target)
    style[name] = ""
    return state
  }
  static addEventDecoder(
    state: DOMPatch,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ): DOMPatch {
    const node: Object = getUpdateTargetElement(
      state.childrenSelected,
      state.target
    )
    const host = node.DOMinion || (node.DOMinion = new DOMinion(state.mailbox))
    host.addEventDecoder(node, type, decoder, capture)
    return state
  }
  static removeEventDecoder(
    state: DOMPatch,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ): DOMPatch {
    const node: Object = getUpdateTargetElement(
      state.childrenSelected,
      state.target
    )
    const host = node.DOMinion || (node.DOMinion = new DOMinion(state.mailbox))
    host.removeEventDecoder(node, type, decoder, capture)
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

  static shiftSiblings(state: DOMPatch, count: number): DOMPatch {
    const { target, childrenSelected } = state
    let select = null
    if (childrenSelected) {
      select = target.childNodes[count]
    } else {
      let offset = count
      select = target.nextSibling
      while (select && offset--) {
        select = select.nextSibling
      }
    }

    if (select == null) {
      throw Error(`Not enough siblings ${count} to shift them`)
    } else {
      insertNode(target, childrenSelected, select)
    }
    return state
  }

  static archive<node: Node>(
    target: node,
    receive?: Object => void = DOMArchive.receive
  ): Archive<node> {
    return new DOMArchive(target, receive)
  }
}

const CAPTURING_PHASE = 1

class DOMinion {
  decoders: { string: EventDecoder }
  mailbox: { send: Object => void }
  constructor(mailbox: { send: Object => void }) {
    this.mailbox = mailbox
  }
  static handleEvent(event: Event) {
    const { currentTarget, type, eventPhase } = event
    const node: Object = currentTarget
    const host = node.DOMinion
    const capture = event.eventPhase === CAPTURING_PHASE
    if (host) {
      const hash = `${event.type}${capture ? "!" : "^"}`
      const decoder = host.decoders[hash]
      if (decoder) {
        const result = Decoder.decode(decoder, event)
        host.mailbox.send(result)
        return null
      }
    }
    currentTarget.removeEventListener(type, DOMinion.handleEvent, capture)
  }
  addEventDecoder(
    target: Node,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ) {
    const hash = `${type}${capture ? "!" : "^"}`
    this.decoders[hash] = decoder
    target.addEventListener(type, DOMinion.handleEvent, capture)
  }
  removeEventDecoder(
    target: Node,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ) {
    const hash = `${type}${capture ? "!" : "^"}`
    delete this.decoders[hash]
  }
}

class DOMArchive<node: Node> {
  static receive = message => {}
  target: node
  mailbox: { send: Object => void }
  cursor: DOMPatch = new DOMPatch()
  constructor(target: node, receive: Object => void = DOMArchive.receive) {
    this.target = target
    this.mailbox = { send: receive }
  }
  patch(changeList: ChangeList): Result<node> {
    this.cursor.reset(this.target, false, {}, this.mailbox)
    const result = changeList.encode(DOMPatch, this.cursor)
    if (result instanceof DOMPatch) {
      return this.target
    } else {
      return result
    }
  }
}
