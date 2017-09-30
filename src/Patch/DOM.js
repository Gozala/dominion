/* @flow */

import type { Encoder, ChangeLog } from "../Log"
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

class DOMPatcher implements ChangeLog<Node> {
  target: Node
  childrenSelected: boolean
  stash: Stash
  reset(target: Node, childrenSelected: boolean, stash: Stash): DOMPatcher {
    this.target = target
    this.childrenSelected = childrenSelected
    this.stash = stash
    return this
  }

  selectChildren(): DOMPatcher {
    console.log(`Patch: Select children`)
    if (this.childrenSelected) {
      throw Error(
        "Inavlid state: Unable to select children as they are already selected"
      )
    } else {
      this.childrenSelected = true
      return this
    }
  }
  selectSibling(offset: number): DOMPatcher {
    console.log(`Patch: select sibling ${offset}`)
    const { target, childrenSelected } = this
    let select = null
    if (childrenSelected) {
      this.childrenSelected = false
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
      this.target = select
      this.childrenSelected = false
      return this
    }
  }
  selectParent(): DOMPatcher {
    console.log("select parent")
    if (this.childrenSelected) {
      this.childrenSelected = false
      return this
    } else {
      const target = this.target.parentNode
      if (target == null) {
        throw Error("Can not select parent of orphand node")
      } else {
        this.target = target
        return this
      }
    }
  }
  removeNextSibling(): DOMPatcher {
    console.log("remove next sibling")
    const next = this.childrenSelected
      ? this.target.firstChild
      : this.target.nextSibling

    if (next == null) {
      throw Error("Can not remove next sibling as it does not exist")
    } else {
      this.target.removeChild(next)
      return this
    }
  }

  insertText(data: string): DOMPatcher {
    console.log("insert text", data)
    insertNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createTextNode(data)
    )
    return this
  }
  insertComment(data: string): DOMPatcher {
    console.log("insert comment", data)
    insertNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createComment(data)
    )
    return this
  }
  insertElement(localName: string): DOMPatcher {
    console.log(`insert element <${localName}/>`)
    insertNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createElement(localName)
    )
    return this
  }
  insertElementNS(namespaceURI: string, localName: string): DOMPatcher {
    insertNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createElementNS(namespaceURI, localName)
    )
    return this
  }
  insertStashedNode(address: number): DOMPatcher {
    insertNode(
      this.target,
      this.childrenSelected,
      getStashedNode(this.stash, address)
    )
    return this
  }

  replaceWithText(data: string): DOMPatcher {
    replaceNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createTextNode(data)
    )
    return this
  }
  replaceWithComment(data: string): DOMPatcher {
    replaceNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createComment(data)
    )
    return this
  }
  replaceWithElement(localName: string): DOMPatcher {
    replaceNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createElement(localName)
    )
    return this
  }
  replaceWithElementNS(namespaceURI: string, localName: string): DOMPatcher {
    replaceNode(
      this.target,
      this.childrenSelected,
      this.target.ownerDocument.createElementNS(namespaceURI, localName)
    )
    return this
  }
  replaceWithStashedNode(address: number): DOMPatcher {
    const node = this.stash[address]
    if (node == null) {
      throw Error(`Unable to find stashed node with address #${address}`)
    }
    replaceNode(this.target, this.childrenSelected, node)
    return this
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): DOMPatcher {
    const node = getTextDataUpdateTarget(this.childrenSelected, this.target)
    const { data } = node
    const content = data.substring(start, data.length - end)
    node.data = `${prefix}${content}${suffix}`
    return this
  }
  setTextData(data: string): DOMPatcher {
    const node = getTextDataUpdateTarget(this.childrenSelected, this.target)
    node.data = data
    return this
  }
  setAttribute(name: string, value: string): DOMPatcher {
    console.log(`Patch: Set attribute ${name}="${value}"`)
    const node = getUpdateTargetElement(this.childrenSelected, this.target)
    node.setAttribute(name, value)
    return this
  }
  removeAttribute(name: string): DOMPatcher {
    console.log(`Patch: Remove attribute ${name}`)
    const node = getUpdateTargetElement(this.childrenSelected, this.target)
    node.removeAttribute(name)
    return this
  }
  setAttributeNS(
    namespaceURI: string,
    name: string,
    value: string
  ): DOMPatcher {
    console.log(`Patch: Set attribute NS ${namespaceURI} ${name}="${value}"`)
    const node = getUpdateTargetElement(this.childrenSelected, this.target)
    node.setAttributeNS(namespaceURI, name, value)
    return this
  }
  removeAttributeNS(namespaceURI: string, name: string): DOMPatcher {
    console.log(`Patch: Remove attribute NS ${namespaceURI} ${name}`)
    const node = getUpdateTargetElement(this.childrenSelected, this.target)
    node.removeAttributeNS(namespaceURI, name)
    return this
  }
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): DOMPatcher {
    console.log(`Patch: Assign property ${name}=${JSON.stringify(value)}`)
    const node: Object = getUpdateTargetElement(
      this.childrenSelected,
      this.target
    )
    node[name] = value
    return this
  }
  deleteProperty(name: string): DOMPatcher {
    console.log(`Patch: Delete property ${name}`)
    const node: Object = getUpdateTargetElement(
      this.childrenSelected,
      this.target
    )
    delete node[name]
    return this
  }
  setStyleRule(name: string, value: string) {
    console.log(`Patch: Style style.${name}="${value}"`)
    const style = getTargetStyle(this.childrenSelected, this.target)
    style[(name: any)] = value
    return this
  }
  removeStyleRule(name: string) {
    console.log(`Patch: Remove style rule ${name}`)
    const style = getTargetStyle(this.childrenSelected, this.target)
    delete style[(name: any)]
    return this
  }

  stashNextSibling(address: number): DOMPatcher {
    const next = this.childrenSelected
      ? this.target.firstChild
      : this.target.nextSibling

    if (next == null) {
      throw Error("Unable to stash next sibling as there is not one")
    } else {
      this.stash[address] = next
      removeNode(next)
      return this
    }
  }
  discardStashedNode(address: number): DOMPatcher {
    delete this.stash[address]
    return this
  }

  toBuffer(): Node {
    return this.target
  }
}

const patcher = new DOMPatcher()

export default (target: Node): Encoder<Node> => encode =>
  encode(patcher.reset(target, false, {})).toBuffer()
