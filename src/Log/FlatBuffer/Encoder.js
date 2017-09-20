/* @flow */

import type { Encoder, Decoder } from "../../Log"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import type { Builder, ByteBuffer } from "flatbuffers"
import { Change, type change } from "./Change"
import { ChangeLog } from "./ChangeLog"
import type { OpType, Op } from "./Op"

import {
  DecoderError,
  AssignBooleanProperty,
  AssignNullProperty,
  AssignNumberProperty,
  AssignStringProperty,
  DeleteProperty,
  DiscardStashed,
  EditTextData,
  InsertComment,
  InsertElement,
  InsertStashedNode,
  InsertText,
  RemoveAttribute,
  RemoveNextSibling,
  RemoveStyleRule,
  ReplaceWithComment,
  ReplaceWithElement,
  ReplaceWithStashedNode,
  ReplaceWithText,
  SelectChildren,
  SelectParent,
  SelectSibling,
  SetAttribute,
  SetStyleRule,
  SetTextData,
  StashNextSibling
} from "./Op"

type Navigate = "SelectParent" | "SelectChildren" | number

const push = <a>(item: a, items: a[]): a[] => (items.push(item), items)

const selectSibling = (builder: Builder, index: number): change =>
  Change.encode(
    builder,
    SelectSibling.opType,
    SelectSibling.encode(builder, index)
  )

const selectChildren = (builder: Builder): change =>
  Change.encode(builder, SelectChildren.opType, SelectChildren.encode(builder))

const selectParent = (builder: Builder): change =>
  Change.encode(builder, SelectParent.opType, SelectParent.encode(builder))

class LogEncoder implements Encoder<Uint8Array> {
  address: number
  builder: Builder
  log: Array<change>
  navigationLog: Array<Navigate>
  constructor(
    address: number,
    builder: Builder,
    log: Array<change>,
    navigationLog: Array<Navigate>
  ) {
    this.reset(address, builder, log, navigationLog)
  }
  reset(
    address: number,
    builder: Builder,
    log: Array<change>,
    navigationLog: Array<Navigate>
  ): self {
    this.address = address
    this.builder = builder
    this.log = log
    this.navigationLog = navigationLog

    return this
  }

  update(change: change, address: number = this.address): self {
    const { navigationLog, builder } = this
    let { log } = this

    const count = navigationLog.length
    let index = 0
    let position = 0
    while (index < count) {
      const op = navigationLog[index++]
      switch (op) {
        case "SelectChildren": {
          if (position > 0) {
            log = push(selectSibling(builder, position), log)
            position = 0
          }
          log = push(selectChildren(builder), log)
          break
        }
        case "SelectParent": {
          log = push(selectParent(builder), log)
          break
        }
        default: {
          position += op
          break
        }
      }
    }

    if (position > 0) {
      log = push(selectSibling(builder, position), log)
    }

    return this.reset(this.address, builder, push(change, log), [])
  }
  change(opType: OpType, opOffset: Op, address: number = this.address): self {
    return this.update(Change.encode(this.builder, opType, opOffset), address)
  }
  navigate(op: Navigate): self {
    return this.reset(
      this.address,
      this.builder,
      this.log,
      push(op, this.navigationLog)
    )
  }

  selectChildren(): self {
    return this.navigate("SelectChildren")
  }
  selectSibling(offset: number): self {
    return this.navigate(offset)
  }
  selectParent(): self {
    return this.navigate("SelectParent")
  }
  removeNextSibling(): self {
    return this.change(
      RemoveNextSibling.opType,
      RemoveNextSibling.encode(this.builder)
    )
  }

  insertText(data: string): self {
    return this.change(InsertText.opType, InsertText.encode(this.builder, data))
  }
  insertComment(data: string): self {
    return this.change(
      InsertComment.opType,
      InsertComment.encode(this.builder, data)
    )
  }
  insertElement(localName: string): self {
    return this.change(
      InsertElement.opType,
      InsertElement.encode(this.builder, null, localName)
    )
  }
  insertElementNS(namespaceURI: string, localName: string): self {
    return this.change(
      InsertElement.opType,
      InsertElement.encode(this.builder, namespaceURI, localName)
    )
  }
  insertStashedNode(address: number): self {
    return this.change(
      InsertStashedNode.opType,
      InsertStashedNode.encode(this.builder, address)
    )
  }

  replaceWithText(data: string): self {
    return this.change(
      ReplaceWithText.opType,
      ReplaceWithText.encode(this.builder, data)
    )
  }
  replaceWithComment(data: string): self {
    return this.change(
      ReplaceWithComment.opType,
      ReplaceWithComment.encode(this.builder, data)
    )
  }
  replaceWithElement(localName: string): self {
    return this.change(
      ReplaceWithElement.opType,
      ReplaceWithElement.encode(this.builder, null, localName)
    )
  }
  replaceWithElementNS(namespaceURI: string, localName: string): self {
    return this.change(
      ReplaceWithElement.opType,
      ReplaceWithElement.encode(this.builder, namespaceURI, localName)
    )
  }
  replaceWithStashedNode(address: number): self {
    return this.change(
      ReplaceWithStashedNode.opType,
      ReplaceWithStashedNode.encode(this.builder, address)
    )
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): self {
    return this.change(
      EditTextData.opType,
      EditTextData.encode(this.builder, start, end, prefix, suffix)
    )
  }
  setTextData(data: string): self {
    return this.change(
      SetTextData.opType,
      SetTextData.encode(this.builder, data)
    )
  }
  setAttribute(name: string, value: string): self {
    return this.change(
      SetAttribute.opType,
      SetAttribute.encode(this.builder, null, name, value)
    )
  }
  removeAttribute(name: string): self {
    return this.change(
      RemoveAttribute.opType,
      RemoveAttribute.encode(this.builder, null, name)
    )
  }
  setAttributeNS(namespaceURI: string, name: string, value: string): self {
    return this.change(
      SetAttribute.opType,
      SetAttribute.encode(this.builder, namespaceURI, name, value)
    )
  }
  removeAttributeNS(namespaceURI: string, name: string): self {
    return this.change(
      RemoveAttribute.opType,
      RemoveAttribute.encode(this.builder, namespaceURI, name)
    )
  }
  assignProperty(name: string, value: string | number | boolean | null): self {
    switch (typeof value) {
      case "string": {
        return this.change(
          AssignStringProperty.opType,
          AssignStringProperty.encode(this.builder, name, value)
        )
      }
      case "number": {
        return this.change(
          AssignNumberProperty.opType,
          AssignNumberProperty.encode(this.builder, name, value)
        )
      }
      case "boolean": {
        return this.change(
          AssignBooleanProperty.opType,
          AssignBooleanProperty.encode(this.builder, name, value)
        )
      }
      default: {
        if (value === null) {
          return this.change(
            AssignNullProperty.opType,
            AssignNullProperty.encode(this.builder, name, value)
          )
        } else {
          return unreachable(value)
        }
      }
    }
  }
  deleteProperty(name: string): self {
    return this.change(
      DeleteProperty.opType,
      DeleteProperty.encode(this.builder, name)
    )
  }
  setStyleRule(name: string, value: string) {
    return this.change(
      SetStyleRule.opType,
      SetStyleRule.encode(this.builder, name, value)
    )
  }
  removeStyleRule(name: string) {
    return this.change(
      RemoveStyleRule.opType,
      RemoveStyleRule.encode(this.builder, name)
    )
  }

  stashNextSibling(address): self {
    return this.change(
      StashNextSibling.opType,
      StashNextSibling.encode(this.builder, address),
      address + 1
    )
  }
  discardStashedNode(address: number): self {
    return this.change(
      DiscardStashed.opType,
      DiscardStashed.encode(this.builder, address)
    )
  }

  encode(): Uint8Array {
    const { builder, log } = this
    builder.finish(ChangeLog.encode(builder, log))
    return builder.asUint8Array()
  }
}

export const encoder = (): Encoder<Uint8Array> =>
  new LogEncoder(1, new flatbuffers.Builder(1024), [], [])
