/* @flow */

import type { Encoder, Decoder } from "../Log"
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.stashNextSibling(this.address)
  }
}

class DiscardStashed {
  kind: "DiscardStashed" = "DiscardStashed"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.discardStashedNode(this.address)
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.assignProperty(this.name, this.value)
  }
}

class DeleteProperty {
  kind: "DeleteProperty" = "DeleteProperty"
  name: string
  constructor(name: string) {
    this.name = name
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.deleteProperty(this.name)
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.setStyleRule(this.name, this.value)
  }
}

class RemoveStyleRule {
  kind: "RemoveStyleRule" = "RemoveStyleRule"
  name: string
  constructor(name: string) {
    this.name = name
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.removeStyleRule(this.name)
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.setStyleRule(this.name, this.value)
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    const { namespaceURI, name } = this
    if (namespaceURI == null) {
      return encoder.removeAttribute(name)
    } else {
      return encoder.removeAttributeNS(namespaceURI, name)
    }
  }
}

class InsertText {
  kind: "InsertText" = "InsertText"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.insertText(this.data)
  }
}

class InsertComment {
  kind: "InsertComment" = "InsertComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.insertComment(this.data)
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    const { namespaceURI, localName } = this
    if (namespaceURI == null) {
      return encoder.insertElement(localName)
    } else {
      return encoder.insertElementNS(namespaceURI, localName)
    }
  }
}

class InsertStashedNode {
  kind: "InsertStashedNode" = "InsertStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.insertStashedNode(this.address)
  }
}

class ReplaceWithText {
  kind: "ReplaceWithText" = "ReplaceWithText"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.replaceWithText(this.data)
  }
}

class ReplaceWithComment {
  kind: "ReplaceWithComment" = "ReplaceWithComment"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.replaceWithComment(this.data)
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    const { namespaceURI, name } = this
    if (namespaceURI == null) {
      return encoder.replaceWithElement(name)
    } else {
      return encoder.replaceWithElementNS(namespaceURI, name)
    }
  }
}

class ReplaceWithStashedNode {
  kind: "ReplaceWithStashedNode" = "ReplaceWithStashedNode"
  address: number
  constructor(address: number) {
    this.address = address
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.replaceWithStashedNode(this.address)
  }
}

class SetTextData {
  kind: "SetTextData" = "SetTextData"
  data: string
  constructor(data: string) {
    this.data = data
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.setTextData(this.data)
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
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.editTextData(this.start, this.end, this.prefix, this.suffix)
  }
}

class SelectChildren {
  kind: "SelectChildren" = "SelectChildren"
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.selectChildren()
  }
}

class SelectSibling {
  kind: "SelectSibling" = "SelectSibling"
  offset: number
  constructor(offset: number) {
    this.offset = offset
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.selectSibling(this.offset)
  }
}

class SelectParent {
  kind: "SelectParent" = "SelectParent"
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.selectParent()
  }
}

class RemoveNextSibling {
  kind: "RemoveNextSibling" = "RemoveNextSibling"
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return encoder.removeNextSibling()
  }
}

class JSONEncoder implements Encoder<Op[]> {
  address: number = 0
  log: Op[]
  constructor(log: Op[]) {
    this.reset(log)
  }
  reset(log: Op[]): JSONEncoder {
    this.log = log

    return this
  }
  update(op: Update): JSONEncoder {
    const { log } = this
    log.push(op)
    return this.reset(log)
  }

  selectChildren(): JSONEncoder {
    return this.update(new SelectChildren())
  }
  selectSibling(offset: number): JSONEncoder {
    return this.update(new SelectSibling(offset))
  }
  selectParent(): JSONEncoder {
    return this.update(new SelectParent())
  }
  removeNextSibling(): JSONEncoder {
    return this.update(new RemoveNextSibling())
  }

  insertText(text: string): JSONEncoder {
    return this.update(new InsertText(text))
  }
  insertComment(text: string): JSONEncoder {
    return this.update(new InsertComment(text))
  }
  insertElement(name: string): JSONEncoder {
    return this.update(new InsertElement(null, name))
  }
  insertElementNS(namespaceURI: string, name: string): JSONEncoder {
    return this.update(new InsertElement(namespaceURI, name))
  }
  insertStashedNode(address: number): JSONEncoder {
    return this.update(new InsertStashedNode(address))
  }

  replaceWithText(text: string): JSONEncoder {
    return this.update(new ReplaceWithText(text))
  }
  replaceWithComment(text: string): JSONEncoder {
    return this.update(new ReplaceWithComment(text))
  }
  replaceWithElement(name: string): JSONEncoder {
    return this.update(new ReplaceWithElement(null, name))
  }
  replaceWithElementNS(namespaceURI: string, name: string): JSONEncoder {
    return this.update(new ReplaceWithElement(namespaceURI, name))
  }
  replaceWithStashedNode(address: number): JSONEncoder {
    return this.update(new ReplaceWithStashedNode(address))
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): JSONEncoder {
    return this.update(new EditTextData(start, end, prefix, suffix))
  }
  setTextData(text: string): JSONEncoder {
    return this.update(new SetTextData(text))
  }
  setAttribute(name: string, value: string): JSONEncoder {
    return this.update(new SetAttribute(null, name, value))
  }
  removeAttribute(name: string): JSONEncoder {
    return this.update(new RemoveAttribute(null, name))
  }
  setAttributeNS(
    namespaceURI: string,
    name: string,
    value: string
  ): JSONEncoder {
    return this.update(new SetAttribute(namespaceURI, name, value))
  }
  removeAttributeNS(namespaceURI: string, name: string): JSONEncoder {
    return this.update(new RemoveAttribute(namespaceURI, name))
  }
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): JSONEncoder {
    return this.update(new AssignProperty(name, value))
  }
  deleteProperty(name: string): JSONEncoder {
    return this.update(new DeleteProperty(name))
  }
  setStyleRule(name: string, value: string): JSONEncoder {
    return this.update(new SetStyleRule(name, value))
  }
  removeStyleRule(name: string): JSONEncoder {
    return this.update(new RemoveStyleRule(name))
  }

  stashNextSibling(address: number): JSONEncoder {
    return this.update(new StashNextSibling(address))
  }
  discardStashedNode(address: number): JSONEncoder {
    return this.update(new DiscardStashed(address))
  }
  encode(): Op[] {
    return this.log
  }
}

class JSONDecoder implements Decoder {
  log: Op[]
  constructor(log: Op[]) {
    this.log = log
  }
  decode<x>(encoder: Encoder<x>): Encoder<x> {
    return this.log.reduce((encoder, op) => op.decode(encoder), encoder)
  }
}

export const encoder = (): Encoder<Op[]> => new JSONEncoder([])
export const decoder = (log: Op[]): Decoder => new JSONDecoder(log)
