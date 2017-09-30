/* @flow */

import type { Encoder, Decoder, ChangeLog } from "../../Log"
import type { Builder, ByteBuffer } from "flatbuffers"
import type { OpType, Op } from "./Op"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import { type change } from "./Change"
import Change from "./Change"
import Changes from "./ChangeLog"

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

const push = <a>(item: a, items: a[]): a[] => (items.push(item), items)

class Log implements ChangeLog<Uint8Array> {
  builder: Builder
  log: change[]
  address: number
  reset(builder: Builder, log: Array<change>): self {
    this.builder = builder
    this.log = log

    return this
  }

  change(opType: OpType, opOffset: Op): self {
    return this.reset(
      this.builder,
      push(Change.encode(this.builder, opType, opOffset), this.log)
    )
  }

  selectChildren(): self {
    return this.change(
      SelectChildren.opType,
      SelectChildren.encode(this.builder)
    )
  }
  selectSibling(offset: number): self {
    return this.change(
      SelectSibling.opType,
      SelectSibling.encode(this.builder, offset)
    )
  }
  selectParent(): self {
    return this.change(SelectParent.opType, SelectParent.encode(this.builder))
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
      StashNextSibling.encode(this.builder, address)
    )
  }
  discardStashedNode(address: number): self {
    return this.change(
      DiscardStashed.opType,
      DiscardStashed.encode(this.builder, address)
    )
  }

  toBuffer(): Uint8Array {
    const { builder, log } = this
    builder.finish(Changes.encode(builder, log.splice(0)))
    return builder.asUint8Array()
  }
}

const changeLog = new Log()

export const encode: Encoder<Uint8Array> = encode =>
  encode(changeLog.reset(new flatbuffers.Builder(1024), [])).toBuffer()
