/* @flow */

import type { Encoder, Decoder, ChangeLog } from "../Log"
import unreachable from "unreachable"

type Update =
  | SelectChildren
  | SelectSibling
  | SelectParent
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

type Op = Update

class StashNextSibling {
  kind: "StashNextSibling" = "StashNextSibling"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(changeLog: ChangeLog<x>): ChangeLog<x> {
    return changeLog.stashNextSibling(this.address)
  }
}

class DiscardStashed {
  kind: "DiscardStashed" = "DiscardStashed"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.discardStashedNode(this.address)
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
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.assignProperty(this.name, this.value)
  }
}

class DeleteProperty {
  kind: "DeleteProperty" = "DeleteProperty"
  name: string
  constructor(name: string) {
    this.name = name
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.deleteProperty(this.name)
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
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.setStyleRule(this.name, this.value)
  }
}

class RemoveStyleRule {
  kind: "RemoveStyleRule" = "RemoveStyleRule"
  name: string
  constructor(name: string) {
    this.name = name
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.removeStyleRule(this.name)
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
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.setStyleRule(this.name, this.value)
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
  decode<x>(changeLog: ChangeLog<x>) {
    const { namespaceURI, name } = this
    if (namespaceURI == null) {
      return changeLog.removeAttribute(name)
    } else {
      return changeLog.removeAttributeNS(namespaceURI, name)
    }
  }
}

class InsertText {
  kind: "InsertText" = "InsertText"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.insertText(this.data)
  }
}

class InsertComment {
  kind: "InsertComment" = "InsertComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.insertComment(this.data)
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
  decode<x>(changeLog: ChangeLog<x>) {
    const { namespaceURI, localName } = this
    if (namespaceURI == null) {
      return changeLog.insertElement(localName)
    } else {
      return changeLog.insertElementNS(namespaceURI, localName)
    }
  }
}

class InsertStashedNode {
  kind: "InsertStashedNode" = "InsertStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.insertStashedNode(this.address)
  }
}

class ReplaceWithText {
  kind: "ReplaceWithText" = "ReplaceWithText"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.replaceWithText(this.data)
  }
}

class ReplaceWithComment {
  kind: "ReplaceWithComment" = "ReplaceWithComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.replaceWithComment(this.data)
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
  decode<x>(changeLog: ChangeLog<x>) {
    const { namespaceURI, name } = this
    if (namespaceURI == null) {
      return changeLog.replaceWithElement(name)
    } else {
      return changeLog.replaceWithElementNS(namespaceURI, name)
    }
  }
}

class ReplaceWithStashedNode {
  kind: "ReplaceWithStashedNode" = "ReplaceWithStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.replaceWithStashedNode(this.address)
  }
}

class SetTextData {
  kind: "SetTextData" = "SetTextData"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.setTextData(this.data)
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
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.editTextData(
      this.start,
      this.end,
      this.prefix,
      this.suffix
    )
  }
}

class SelectChildren {
  kind: "SelectChildren" = "SelectChildren"
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.selectChildren()
  }
}

class SelectSibling {
  kind: "SelectSibling" = "SelectSibling"
  offset: number
  constructor(offset: number) {
    this.offset = offset
  }
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.selectSibling(this.offset)
  }
}

class SelectParent {
  kind: "SelectParent" = "SelectParent"
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.selectParent()
  }
}

class RemoveNextSibling {
  kind: "RemoveNextSibling" = "RemoveNextSibling"
  decode<x>(changeLog: ChangeLog<x>) {
    return changeLog.removeNextSibling()
  }
}

class JSONLog implements ChangeLog<Op[]> {
  address: number = 0
  log: Op[]
  constructor(log: Op[]) {
    this.reset(log)
  }
  reset(log: Op[]): JSONLog {
    this.log = log

    return this
  }
  update(op: Update): JSONLog {
    const { log } = this
    log.push(op)
    return this.reset(log)
  }

  selectChildren(): JSONLog {
    return this.update(new SelectChildren())
  }
  selectSibling(offset: number): JSONLog {
    return this.update(new SelectSibling(offset))
  }
  selectParent(): JSONLog {
    return this.update(new SelectParent())
  }
  removeNextSibling(): JSONLog {
    return this.update(new RemoveNextSibling())
  }

  insertText(text: string): JSONLog {
    return this.update(new InsertText(text))
  }
  insertComment(text: string): JSONLog {
    return this.update(new InsertComment(text))
  }
  insertElement(name: string): JSONLog {
    return this.update(new InsertElement(null, name))
  }
  insertElementNS(namespaceURI: string, name: string): JSONLog {
    return this.update(new InsertElement(namespaceURI, name))
  }
  insertStashedNode(address: number): JSONLog {
    return this.update(new InsertStashedNode(address))
  }

  replaceWithText(text: string): JSONLog {
    return this.update(new ReplaceWithText(text))
  }
  replaceWithComment(text: string): JSONLog {
    return this.update(new ReplaceWithComment(text))
  }
  replaceWithElement(name: string): JSONLog {
    return this.update(new ReplaceWithElement(null, name))
  }
  replaceWithElementNS(namespaceURI: string, name: string): JSONLog {
    return this.update(new ReplaceWithElement(namespaceURI, name))
  }
  replaceWithStashedNode(address: number): JSONLog {
    return this.update(new ReplaceWithStashedNode(address))
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): JSONLog {
    return this.update(new EditTextData(start, end, prefix, suffix))
  }
  setTextData(text: string): JSONLog {
    return this.update(new SetTextData(text))
  }
  setAttribute(name: string, value: string): JSONLog {
    return this.update(new SetAttribute(null, name, value))
  }
  removeAttribute(name: string): JSONLog {
    return this.update(new RemoveAttribute(null, name))
  }
  setAttributeNS(namespaceURI: string, name: string, value: string): JSONLog {
    return this.update(new SetAttribute(namespaceURI, name, value))
  }
  removeAttributeNS(namespaceURI: string, name: string): JSONLog {
    return this.update(new RemoveAttribute(namespaceURI, name))
  }
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): JSONLog {
    return this.update(new AssignProperty(name, value))
  }
  deleteProperty(name: string): JSONLog {
    return this.update(new DeleteProperty(name))
  }
  setStyleRule(name: string, value: string): JSONLog {
    return this.update(new SetStyleRule(name, value))
  }
  removeStyleRule(name: string): JSONLog {
    return this.update(new RemoveStyleRule(name))
  }

  stashNextSibling(address: number): JSONLog {
    return this.update(new StashNextSibling(address))
  }
  discardStashedNode(address: number): JSONLog {
    return this.update(new DiscardStashed(address))
  }
  toBuffer(): Op[] {
    return this.log
  }
}

const changeLog = new JSONLog([])

const decoder: Decoder<Op[]> = <x>(log: Op[], encode: Encoder<x>): x =>
  encode(changeLog =>
    log.reduce((changeLog, op) => op.decode(changeLog), changeLog)
  )

export const encoder: Encoder<Op[]> = encode => {
  encode(changeLog)
  return changeLog.log.splice(0)
}
