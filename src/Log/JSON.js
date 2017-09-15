/* @flow */

import type { Log } from "../Log"
import unreachable from "unreachable"

type Navigate = SelectChildren | SelectSibling | SelectParent
type Update =
  | InsertComment
  | InsertText
  | InsertElement
  | InsertStashedNode
  | ReplaceWithComment
  | ReplaceWithText
  | ReplaceWithElement
  | ReplaceWithStashedNode
  | RemoveNextSibling
  | SetTextData
  | EditTextData
  | SetAttribute
  | RemoveAttribute
  | AssignProperty
  | DeleteProperty
  | SetStyleRule
  | RemoveStyleRule
  | StashNextSibling
  | DiscardStashed

type Op = Version | Navigate | Update

class Version {
  kind: "Version" = "Version"
  version: string
  constructor(version: string) {
    this.version = version
  }
}

class StashNextSibling {
  kind: "StashNextSibling" = "StashNextSibling"
  address: number
  constructor(address: number) {
    this.address = address
  }
}

class DiscardStashed {
  kind: "DiscardStashed" = "DiscardStashed"
  address: number
  constructor(address: number) {
    this.address = address
  }
}

class AssignProperty {
  kind: "AssignProperty" = "AssignProperty"
  name: string
  value: string | number | boolean | null
  constructor(name: string, value: string | number | boolean | null) {
    this.name = name
    this.value = value
  }
}

class DeleteProperty {
  kind: "DeleteProperty" = "DeleteProperty"
  name: string
  constructor(name: string) {
    this.name = name
  }
}

class SetStyleRule {
  kind: "SetStyleRule" = "SetStyleRule"
  name: string
  value: string
  constructor(name: string, value: string) {
    this.name = name
    this.value = value
  }
}

class RemoveStyleRule {
  kind: "RemoveStyleRule" = "RemoveStyleRule"
  name: string
  constructor(name: string) {
    this.name = name
  }
}

class SetAttribute {
  kind: "SetAttribute" = "SetAttribute"
  name: string
  namespaceURI: null | string
  value: string
  constructor(namespaceURI: null | string, name: string, value: string) {
    this.name = name
    this.value = value
    this.namespaceURI = namespaceURI
  }
}

class RemoveAttribute {
  kind: "RemoveAttribute" = "RemoveAttribute"
  namespaceURI: null | string
  name: string
  constructor(namespaceURI: string | null, name: string) {
    this.namespaceURI = namespaceURI
    this.name = name
  }
}

class InsertText {
  kind: "InsertText" = "InsertText"
  data: string
  constructor(data: string) {
    this.data = data
  }
}

class InsertComment {
  kind: "InsertComment" = "InsertComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
}

class InsertElement {
  kind: "InsertElement" = "InsertElement"
  namespaceURI: null | string
  localName: string
  constructor(namespaceURI: null | string, localName: string) {
    this.namespaceURI = namespaceURI
    this.localName = localName
  }
}

class InsertStashedNode {
  kind: "InsertStashedNode" = "InsertStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
}

class ReplaceWithText {
  kind: "ReplaceWithText" = "ReplaceWithText"
  data: string
  constructor(data: string) {
    this.data = data
  }
}

class ReplaceWithComment {
  kind: "ReplaceWithComment" = "ReplaceWithComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
}

class ReplaceWithElement {
  kind: "ReplaceWithElement" = "ReplaceWithElement"
  namespaceURI: null | string
  name: string
  constructor(namespaceURI: null | string, name: string) {
    this.namespaceURI = namespaceURI
    this.name = name
  }
}

class ReplaceWithStashedNode {
  kind: "ReplaceWithStashedNode" = "ReplaceWithStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
}

class SetTextData {
  kind: "SetTextData" = "SetTextData"
  data: string
  constructor(data: string) {
    this.data = data
  }
}

class EditTextData {
  kind: "EditTextData" = "EditTextData"
  start: number
  end: number
  prefix: string
  suffix: string
  constructor(start: number, end: number, prefix: string, suffix: string) {
    this.start = start
    this.end = end
    this.prefix = prefix
    this.suffix = suffix
  }
}

class SelectChildren {
  kind: "SelectChildren" = "SelectChildren"
}

class SelectSibling {
  kind: "SelectSibling" = "SelectSibling"
  offset: number
  constructor(offset: number) {
    this.offset = offset
  }
}

class SelectParent {
  kind: "SelectParent" = "SelectParent"
}

class RemoveNextSibling {
  kind: "RemoveNextSibling" = "RemoveNextSibling"
}

class EmptyList<t> {
  tail: EmptyList<t>
  size: number = 0
  isEmpty: true = true
  constructor() {
    this.tail = this
  }
  push(head: t): LinkedList<t> {
    return new LinkedList(head, this)
  }
}

const empty: List<any> = new EmptyList()

class LinkedList<t> {
  head: t
  tail: EmptyList<t> | LinkedList<t>
  size: number
  isEmpty: false = false
  constructor(head: t, tail: EmptyList<t> | LinkedList<t>) {
    this.head = head
    this.tail = tail
    this.size = tail.size + 1
  }
  push(head: t): LinkedList<t> {
    return new LinkedList(head, this)
  }
}

export type List<a> = EmptyList<a> | List<a>

class JSONLog implements Log<Op[]> {
  address: number
  log: List<Op>
  navigationLog: Array<Navigate>
  constructor(address: number, log: List<Op>, navigationLog: Array<Navigate>) {
    this.reset(address, log, navigationLog)
  }
  reset(address: number, log: List<Op>, navigationLog: Array<Navigate>): self {
    this.address = address
    this.log = log
    this.navigationLog = navigationLog

    return this
  }

  fullLog(): List<Op> {
    let { log, navigationLog } = this

    for (const op of navigationLog) {
      switch (op.kind) {
        case "SelectChildren": {
          log = log.push(op)
          break
        }
        case "SelectSibling": {
          if (log.isEmpty === false) {
            const { head, tail } = log
            if (head instanceof SelectSibling) {
              log = tail.push(new SelectSibling(head.offset + op.offset))
            } else {
              log = log.push(op)
            }
          } else {
            log = log.push(op)
          }
          break
        }
        case "SelectParent": {
          if (log.isEmpty === false) {
            const { head, tail } = log
            if (head instanceof SelectChildren) {
              log = tail
            } else {
              log = log.push(op)
            }
          } else {
            log = log.push(op)
          }
          break
        }
        default:
          return unreachable(op)
      }
    }

    return log
  }
  update(op: Update): self {
    return this.reset(this.address, this.fullLog().push(op), [])
  }
  navigate(op: Navigate): self {
    return this.reset(
      this.address,
      this.log,
      (this.navigationLog.push(op), this.navigationLog)
    )
  }

  selectChildren(): self {
    return this.navigate(new SelectChildren())
  }
  selectSibling(offset: number): self {
    return this.navigate(new SelectSibling(offset))
  }
  selectParent(): self {
    return this.navigate(new SelectParent())
  }
  removeNextSibling(): self {
    return this.update(new RemoveNextSibling())
  }

  insertText(text: string): self {
    return this.update(new InsertText(text))
  }
  insertComment(text: string): self {
    return this.update(new InsertComment(text))
  }
  insertElement(name: string): self {
    return this.update(new InsertElement(null, name))
  }
  insertElementNS(namespaceURI: string, name: string): self {
    return this.update(new InsertElement(namespaceURI, name))
  }
  insertStashedNode(address: number): self {
    return this.update(new InsertStashedNode(address))
  }

  replaceWithText(text: string): self {
    return this.update(new ReplaceWithText(text))
  }
  replaceWithComment(text: string): self {
    return this.update(new ReplaceWithComment(text))
  }
  replaceWithElement(name: string): self {
    return this.update(new ReplaceWithElement(null, name))
  }
  replaceWithElementNS(namespaceURI: string, name: string): self {
    return this.update(new ReplaceWithElement(namespaceURI, name))
  }
  replaceWithStashedNode(address: number): self {
    return this.update(new ReplaceWithStashedNode(address))
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): self {
    return this.update(new EditTextData(start, end, prefix, suffix))
  }
  setTextData(text: string): self {
    return this.update(new SetTextData(text))
  }
  setAttribute(name: string, value: string): self {
    return this.update(new SetAttribute(null, name, value))
  }
  removeAttribute(name: string): self {
    return this.update(new RemoveAttribute(null, name))
  }
  setAttributeNS(namespaceURI: string, name: string, value: string): self {
    return this.update(new SetAttribute(namespaceURI, name, value))
  }
  removeAttributeNS(namespaceURI: string, name: string): self {
    return this.update(new RemoveAttribute(namespaceURI, name))
  }
  assignProperty(name: string, value: string | number | boolean | null): self {
    return this.update(new AssignProperty(name, value))
  }
  deleteProperty(name: string): self {
    return this.update(new DeleteProperty(name))
  }
  setStyleRule(name: string, value: string) {
    return this.update(new SetStyleRule(name, value))
  }
  removeStyleRule(name: string) {
    return this.update(new RemoveStyleRule(name))
  }

  stashNextSibling(): self {
    return this.reset(
      this.address + 1,
      this.log.push(new StashNextSibling(this.address)),
      this.navigationLog
    )
  }
  discardStashedNode(address: number): self {
    return this.update(new DiscardStashed(address))
  }

  format(): Op[] {
    let log = this.log
    let instructions = []
    while (log.isEmpty === false) {
      instructions.unshift(log.head)
      log = log.tail
    }
    return instructions
  }
}

export const init = (): Log<Op[]> => new JSONLog(0, empty, [])
