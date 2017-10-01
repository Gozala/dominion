/* @flow */

import type { Encoder, Decode, Encode, ChangeList, Result } from "../Log"
import { ok, error } from "result.flow"
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.stashNextSibling(buffer, this.address)
  }
}

class DiscardStashed {
  kind: "DiscardStashed" = "DiscardStashed"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.discardStashedNode(buffer, this.address)
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.assignProperty(buffer, this.name, this.value)
  }
}

class DeleteProperty {
  kind: "DeleteProperty" = "DeleteProperty"
  name: string
  constructor(name: string) {
    this.name = name
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.deleteProperty(buffer, this.name)
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.setStyleRule(buffer, this.name, this.value)
  }
}

class RemoveStyleRule {
  kind: "RemoveStyleRule" = "RemoveStyleRule"
  name: string
  constructor(name: string) {
    this.name = name
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.removeStyleRule(buffer, this.name)
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.setStyleRule(buffer, this.name, this.value)
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    const { namespaceURI, name } = this
    if (namespaceURI == null) {
      return changeLog.removeAttribute(buffer, name)
    } else {
      return changeLog.removeAttributeNS(buffer, namespaceURI, name)
    }
  }
}

class InsertText {
  kind: "InsertText" = "InsertText"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.insertText(buffer, this.data)
  }
}

class InsertComment {
  kind: "InsertComment" = "InsertComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.insertComment(buffer, this.data)
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    const { namespaceURI, localName } = this
    if (namespaceURI == null) {
      return changeLog.insertElement(buffer, localName)
    } else {
      return changeLog.insertElementNS(buffer, namespaceURI, localName)
    }
  }
}

class InsertStashedNode {
  kind: "InsertStashedNode" = "InsertStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.insertStashedNode(buffer, this.address)
  }
}

class ReplaceWithText {
  kind: "ReplaceWithText" = "ReplaceWithText"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.replaceWithText(buffer, this.data)
  }
}

class ReplaceWithComment {
  kind: "ReplaceWithComment" = "ReplaceWithComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.replaceWithComment(buffer, this.data)
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    const { namespaceURI, name } = this
    if (namespaceURI == null) {
      return changeLog.replaceWithElement(buffer, name)
    } else {
      return changeLog.replaceWithElementNS(buffer, namespaceURI, name)
    }
  }
}

class ReplaceWithStashedNode {
  kind: "ReplaceWithStashedNode" = "ReplaceWithStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.replaceWithStashedNode(buffer, this.address)
  }
}

class SetTextData {
  kind: "SetTextData" = "SetTextData"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.setTextData(buffer, this.data)
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
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.editTextData(
      buffer,
      this.start,
      this.end,
      this.prefix,
      this.suffix
    )
  }
}

class SelectChildren {
  kind: "SelectChildren" = "SelectChildren"
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.selectChildren(buffer)
  }
}

class SelectSibling {
  kind: "SelectSibling" = "SelectSibling"
  offset: number
  constructor(offset: number) {
    this.offset = offset
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.selectSibling(buffer, this.offset)
  }
}

class SelectParent {
  kind: "SelectParent" = "SelectParent"
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.selectParent(buffer)
  }
}

class RemoveNextSibling {
  kind: "RemoveNextSibling" = "RemoveNextSibling"
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.removeNextSibling(buffer)
  }
}

const push = <a>(x: a, xs: a[]): a[] => (xs.push(x), xs)

class JSONLog implements Encoder<Op[]> {
  isError = false

  selectChildren(log: Op[]): Op[] {
    return push(new SelectChildren(), log)
  }
  selectSibling(log: Op[], offset: number): Op[] {
    return push(new SelectSibling(offset), log)
  }
  selectParent(log: Op[]): Op[] {
    return push(new SelectParent(), log)
  }
  removeNextSibling(log: Op[]): Op[] {
    return push(new RemoveNextSibling(), log)
  }

  insertText(log: Op[], text: string): Op[] {
    return push(new InsertText(text), log)
  }
  insertComment(log: Op[], text: string): Op[] {
    return push(new InsertComment(text), log)
  }
  insertElement(log: Op[], name: string): Op[] {
    return push(new InsertElement(null, name), log)
  }
  insertElementNS(log: Op[], namespaceURI: string, name: string): Op[] {
    return push(new InsertElement(namespaceURI, name), log)
  }
  insertStashedNode(log: Op[], address: number): Op[] {
    return push(new InsertStashedNode(address), log)
  }

  replaceWithText(log: Op[], text: string): Op[] {
    return push(new ReplaceWithText(text), log)
  }
  replaceWithComment(log: Op[], text: string): Op[] {
    return push(new ReplaceWithComment(text), log)
  }
  replaceWithElement(log: Op[], name: string): Op[] {
    return push(new ReplaceWithElement(null, name), log)
  }
  replaceWithElementNS(log: Op[], namespaceURI: string, name: string): Op[] {
    return push(new ReplaceWithElement(namespaceURI, name), log)
  }
  replaceWithStashedNode(log: Op[], address: number): Op[] {
    return push(new ReplaceWithStashedNode(address), log)
  }
  editTextData(
    log: Op[],
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Op[] {
    return push(new EditTextData(start, end, prefix, suffix), log)
  }
  setTextData(log: Op[], text: string): Op[] {
    return push(new SetTextData(text), log)
  }
  setAttribute(log: Op[], name: string, value: string): Op[] {
    return push(new SetAttribute(null, name, value), log)
  }
  removeAttribute(log: Op[], name: string): Op[] {
    return push(new RemoveAttribute(null, name), log)
  }
  setAttributeNS(
    log: Op[],
    namespaceURI: string,
    name: string,
    value: string
  ): Op[] {
    return push(new SetAttribute(namespaceURI, name, value), log)
  }
  removeAttributeNS(log: Op[], namespaceURI: string, name: string): Op[] {
    return push(new RemoveAttribute(namespaceURI, name), log)
  }
  assignProperty(
    log: Op[],
    name: string,
    value: string | number | boolean | null
  ): Op[] {
    return push(new AssignProperty(name, value), log)
  }
  deleteProperty(log: Op[], name: string): Op[] {
    return push(new DeleteProperty(name), log)
  }
  setStyleRule(log: Op[], name: string, value: string): Op[] {
    return push(new SetStyleRule(name, value), log)
  }
  removeStyleRule(log: Op[], name: string): Op[] {
    return push(new RemoveStyleRule(name), log)
  }

  stashNextSibling(log: Op[], address: number): Op[] {
    return push(new StashNextSibling(address), log)
  }
  discardStashedNode(log: Op[], address: number): Op[] {
    return push(new DiscardStashed(address), log)
  }
}

const changeLog = new JSONLog()

class JSONDecoder {
  log: Op[]
  constructor(log: Op[]) {
    this.log = log
  }
  encode<x>(changeLog: Encoder<x>, buffer: x): x {
    for (let op of this.log) {
      buffer = op.decode(changeLog, buffer)
    }
    return buffer
  }
}

export const decode: Decode<Op[]> = (log: Op[]) => new JSONDecoder(log)

export const encode: Encode<Op[]> = (changeList: ChangeList): Result<Op[]> =>
  changeList.encode(changeLog, [])
