/* @flow */

import type { Encode, Decode, Encoder, ChangeList, Result } from "../../Log"
import type { Builder, ByteBuffer } from "flatbuffers"
import type { OpType, Op } from "./Op"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import { type change } from "./Change"
import { ok, error } from "result.flow"
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

export default class FlatBufferEncoder {
  builder: Builder
  log: change[]
  constructor(builder: Builder, log: change[]) {
    this.reset(builder, log)
  }
  reset(builder: Builder, log: change[]): FlatBufferEncoder {
    this.builder = builder
    this.log = log

    return this
  }
  change(opType: OpType, opOffset: Op): FlatBufferEncoder {
    return this.reset(
      this.builder,
      push(Change.encode(this.builder, opType, opOffset), this.log)
    )
  }
  static toUint8Array({ builder, log }: FlatBufferEncoder): Uint8Array {
    builder.finish(Changes.encode(builder, log))
    return builder.asUint8Array()
  }

  static encoder(size: number = 1024): FlatBufferEncoder {
    return new FlatBufferEncoder(new flatbuffers.Builder(size), [])
  }
  static selectChildren(state: FlatBufferEncoder): FlatBufferEncoder {
    return state.change(
      SelectChildren.opType,
      SelectChildren.encode(state.builder)
    )
  }
  static selectSibling(
    state: FlatBufferEncoder,
    offset: number
  ): FlatBufferEncoder {
    return state.change(
      SelectSibling.opType,
      SelectSibling.encode(state.builder, offset)
    )
  }
  static selectParent(state: FlatBufferEncoder): FlatBufferEncoder {
    return state.change(SelectParent.opType, SelectParent.encode(state.builder))
  }
  static removeNextSibling(state: FlatBufferEncoder): FlatBufferEncoder {
    return state.change(
      RemoveNextSibling.opType,
      RemoveNextSibling.encode(state.builder)
    )
  }

  static insertText(state: FlatBufferEncoder, data: string): FlatBufferEncoder {
    return state.change(
      InsertText.opType,
      InsertText.encode(state.builder, data)
    )
  }
  static insertComment(
    state: FlatBufferEncoder,
    data: string
  ): FlatBufferEncoder {
    return state.change(
      InsertComment.opType,
      InsertComment.encode(state.builder, data)
    )
  }
  static insertElement(
    state: FlatBufferEncoder,
    localName: string
  ): FlatBufferEncoder {
    return state.change(
      InsertElement.opType,
      InsertElement.encode(state.builder, null, localName)
    )
  }
  static insertElementNS(
    state: FlatBufferEncoder,
    namespaceURI: string,
    localName: string
  ): FlatBufferEncoder {
    return state.change(
      InsertElement.opType,
      InsertElement.encode(state.builder, namespaceURI, localName)
    )
  }
  static insertStashedNode(
    state: FlatBufferEncoder,
    address: number
  ): FlatBufferEncoder {
    return state.change(
      InsertStashedNode.opType,
      InsertStashedNode.encode(state.builder, address)
    )
  }

  static replaceWithText(
    state: FlatBufferEncoder,
    data: string
  ): FlatBufferEncoder {
    return state.change(
      ReplaceWithText.opType,
      ReplaceWithText.encode(state.builder, data)
    )
  }
  static replaceWithComment(
    state: FlatBufferEncoder,
    data: string
  ): FlatBufferEncoder {
    return state.change(
      ReplaceWithComment.opType,
      ReplaceWithComment.encode(state.builder, data)
    )
  }
  static replaceWithElement(
    state: FlatBufferEncoder,
    localName: string
  ): FlatBufferEncoder {
    return state.change(
      ReplaceWithElement.opType,
      ReplaceWithElement.encode(state.builder, null, localName)
    )
  }
  static replaceWithElementNS(
    state: FlatBufferEncoder,
    namespaceURI: string,
    localName: string
  ): FlatBufferEncoder {
    return state.change(
      ReplaceWithElement.opType,
      ReplaceWithElement.encode(state.builder, namespaceURI, localName)
    )
  }
  static replaceWithStashedNode(
    state: FlatBufferEncoder,
    address: number
  ): FlatBufferEncoder {
    return state.change(
      ReplaceWithStashedNode.opType,
      ReplaceWithStashedNode.encode(state.builder, address)
    )
  }

  static editTextData(
    state: FlatBufferEncoder,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): FlatBufferEncoder {
    return state.change(
      EditTextData.opType,
      EditTextData.encode(state.builder, start, end, prefix, suffix)
    )
  }
  static setTextData(
    state: FlatBufferEncoder,
    data: string
  ): FlatBufferEncoder {
    return state.change(
      SetTextData.opType,
      SetTextData.encode(state.builder, data)
    )
  }
  static setAttribute(
    state: FlatBufferEncoder,
    name: string,
    value: string
  ): FlatBufferEncoder {
    return state.change(
      SetAttribute.opType,
      SetAttribute.encode(state.builder, null, name, value)
    )
  }
  static removeAttribute(
    state: FlatBufferEncoder,
    name: string
  ): FlatBufferEncoder {
    return state.change(
      RemoveAttribute.opType,
      RemoveAttribute.encode(state.builder, null, name)
    )
  }
  static setAttributeNS(
    state: FlatBufferEncoder,
    namespaceURI: string,
    name: string,
    value: string
  ): FlatBufferEncoder {
    return state.change(
      SetAttribute.opType,
      SetAttribute.encode(state.builder, namespaceURI, name, value)
    )
  }
  static removeAttributeNS(
    state: FlatBufferEncoder,
    namespaceURI: string,
    name: string
  ): FlatBufferEncoder {
    return state.change(
      RemoveAttribute.opType,
      RemoveAttribute.encode(state.builder, namespaceURI, name)
    )
  }
  static assignProperty(
    state: FlatBufferEncoder,
    name: string,
    value: string | number | boolean | null
  ): FlatBufferEncoder {
    switch (typeof value) {
      case "string": {
        return state.change(
          AssignStringProperty.opType,
          AssignStringProperty.encode(state.builder, name, value)
        )
      }
      case "number": {
        return state.change(
          AssignNumberProperty.opType,
          AssignNumberProperty.encode(state.builder, name, value)
        )
      }
      case "boolean": {
        return state.change(
          AssignBooleanProperty.opType,
          AssignBooleanProperty.encode(state.builder, name, value)
        )
      }
      default: {
        if (value === null) {
          return state.change(
            AssignNullProperty.opType,
            AssignNullProperty.encode(state.builder, name, value)
          )
        } else {
          return unreachable(value)
        }
      }
    }
  }
  static deleteProperty(
    state: FlatBufferEncoder,
    name: string
  ): FlatBufferEncoder {
    return state.change(
      DeleteProperty.opType,
      DeleteProperty.encode(state.builder, name)
    )
  }
  static setStyleRule(state: FlatBufferEncoder, name: string, value: string) {
    return state.change(
      SetStyleRule.opType,
      SetStyleRule.encode(state.builder, name, value)
    )
  }
  static removeStyleRule(state: FlatBufferEncoder, name: string) {
    return state.change(
      RemoveStyleRule.opType,
      RemoveStyleRule.encode(state.builder, name)
    )
  }

  static stashNextSibling(
    state: FlatBufferEncoder,
    address
  ): FlatBufferEncoder {
    return state.change(
      StashNextSibling.opType,
      StashNextSibling.encode(state.builder, address)
    )
  }
  static discardStashedNode(
    state: FlatBufferEncoder,
    address: number
  ): FlatBufferEncoder {
    return state.change(
      DiscardStashed.opType,
      DiscardStashed.encode(state.builder, address)
    )
  }

  static encode(changeList: ChangeList): Result<Uint8Array> {
    const result = changeList.encode(
      FlatBufferEncoder,
      FlatBufferEncoder.encoder()
    )
    if (result instanceof FlatBufferEncoder) {
      return FlatBufferEncoder.toUint8Array(result)
    } else {
      return result
    }
  }
}
