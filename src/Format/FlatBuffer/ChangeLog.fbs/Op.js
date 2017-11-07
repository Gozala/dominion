/* @flow */

import { flatbuffers } from "flatbuffers"
import type { Builder, Offset } from "flatbuffers"
import type { Encoder, EventDecoder } from "../../../Log"
import * as FBS from "./ChangeLog.js"
import Decoder from "../Decoder.fbs.js"
import { DecoderError, FieldError } from "../Error"

export type OpType = FBS.Op
const opType = FBS.op
export opaque type Op: Offset = Offset

export class AssignBooleanProperty extends FBS.AssignBooleanProperty {
  static opType = opType.AssignBooleanProperty
  opType: typeof opType.AssignBooleanProperty = opType.AssignBooleanProperty
  static encode(builder: Builder, name: string, value: boolean): Op {
    const nameOffset = builder.createString(name)
    AssignBooleanProperty.startAssignBooleanProperty(builder)
    AssignBooleanProperty.addName(builder, nameOffset)
    AssignBooleanProperty.addValue(builder, value)
    return AssignBooleanProperty.endAssignBooleanProperty(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", AssignBooleanProperty)
    } else {
      return changeLog.assignProperty(buffer, name, this.value())
    }
  }
}

export class AssignNullProperty extends FBS.AssignNullProperty {
  static opType = opType.AssignNullProperty
  opType: typeof opType.AssignNullProperty = opType.AssignNullProperty
  static encode(builder: Builder, name: string, value: null = null): Op {
    const nameOffset = builder.createString(name)
    AssignNullProperty.startAssignNullProperty(builder)
    AssignNullProperty.addName(builder, nameOffset)
    return AssignNullProperty.endAssignNullProperty(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", AssignNullProperty)
    } else {
      return changeLog.assignProperty(buffer, name, null)
    }
  }
}

export class AssignNumberProperty extends FBS.AssignNumberProperty {
  static opType = opType.AssignNumberProperty
  opType: typeof opType.AssignNumberProperty = opType.AssignNumberProperty
  static encode(builder: Builder, name: string, value: number): Op {
    const nameOffset = builder.createString(name)
    AssignNumberProperty.startAssignNumberProperty(builder)
    AssignNumberProperty.addName(builder, nameOffset)
    AssignNumberProperty.addValue(builder, value)
    return AssignNumberProperty.endAssignNumberProperty(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", AssignNumberProperty)
    } else {
      return changeLog.assignProperty(buffer, name, this.value())
    }
  }
}

export class AssignStringProperty extends FBS.AssignStringProperty {
  static opType = opType.AssignStringProperty
  opType: typeof opType.AssignStringProperty = opType.AssignStringProperty
  static encode(builder: Builder, name: string, value: string): Op {
    const nameOffset = builder.createString(name)
    const valueOffset = builder.createString(value)
    AssignStringProperty.startAssignStringProperty(builder)
    AssignStringProperty.addName(builder, nameOffset)
    AssignStringProperty.addValue(builder, valueOffset)
    return AssignStringProperty.endAssignStringProperty(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", AssignStringProperty)
    } else {
      return changeLog.assignProperty(buffer, name, this.value())
    }
  }
}

export class DeleteProperty extends FBS.DeleteProperty {
  static opType = opType.DeleteProperty
  opType: typeof opType.DeleteProperty = opType.DeleteProperty
  static encode(builder: Builder, name: string): Op {
    const nameOffset = builder.createString(name)
    DeleteProperty.startDeleteProperty(builder)
    DeleteProperty.addName(builder, nameOffset)
    return DeleteProperty.endDeleteProperty(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", DeleteProperty)
    } else {
      return changeLog.deleteProperty(buffer, name)
    }
  }
}

export class AddEventListener extends FBS.AddEventListener {
  static opType = opType.AddEventListener
  opType: typeof opType.AddEventListener = opType.AddEventListener
  static encode(
    builder: Builder,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ): Op {
    const typeOffset = builder.createString(type)
    const decoderOffset = Decoder.encode(builder, decoder)

    AddEventListener.startAddEventListener(builder)
    AddEventListener.addType(builder, typeOffset)
    AddEventListener.addDecoderType(builder, Decoder.typeOf(decoder))
    AddEventListener.addDecoder(builder, decoderOffset)
    AddEventListener.addCapture(builder, capture)

    return AddEventListener.endAddEventListener(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const capture = this.capture()
    const type = this.type()
    if (type == null) {
      return new FieldError("type", AddEventListener)
    }
    const decoder = Decoder.decode(this)
    if (decoder instanceof DecoderError) {
      return new FieldError("decoder", AddEventListener)
    } else {
      return changeLog.addEventDecoder(buffer, type, decoder, capture)
    }
  }
}

export class RemoveEventListener extends FBS.RemoveEventListener {
  static opType = opType.RemoveEventListener
  opType: typeof opType.RemoveEventListener = opType.RemoveEventListener
  static encode(
    builder: Builder,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ): Op {
    const typeOffset = builder.createString(type)
    const decoderOffset = Decoder.encode(builder, decoder)

    RemoveEventListener.startRemoveEventListener(builder)
    RemoveEventListener.addType(builder, typeOffset)
    RemoveEventListener.addDecoderType(builder, Decoder.typeOf(decoder))
    RemoveEventListener.addDecoder(builder, decoderOffset)
    RemoveEventListener.addCapture(builder, capture)

    return RemoveEventListener.endRemoveEventListener(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const capture = this.capture()
    const type = this.type()
    if (type == null) {
      return new FieldError("type", RemoveEventListener)
    }

    const decoder = Decoder.decode(this)
    if (decoder instanceof DecoderError) {
      return new FieldError("decoder", RemoveEventListener)
    } else {
      return changeLog.removeEventDecoder(buffer, type, decoder, capture)
    }
  }
}

export class DiscardStashed extends FBS.DiscardStashed {
  static opType = opType.DiscardStashed
  opType: typeof opType.DiscardStashed = opType.DiscardStashed
  static encode(builder: Builder, address: number): Op {
    DiscardStashed.startDiscardStashed(builder)
    DiscardStashed.addAddress(builder, address)
    return DiscardStashed.endDiscardStashed(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.discardStashedNode(buffer, this.address())
  }
}

export class ShiftSiblings extends FBS.ShiftSiblings {
  static opType = opType.ShiftSiblings
  opType: typeof opType.ShiftSiblings = opType.ShiftSiblings
  static encode(builder: Builder, count: number): Op {
    ShiftSiblings.startShiftSiblings(builder)
    ShiftSiblings.addCount(builder, count)
    return ShiftSiblings.endShiftSiblings(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.shiftSiblings(buffer, this.count())
  }
}

export class EditTextData extends FBS.EditTextData {
  static opType = opType.EditTextData
  opType: typeof opType.EditTextData = opType.EditTextData
  static encode(
    builder: Builder,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Op {
    const prefixOffset = builder.createString(prefix)
    const suffixOffset = builder.createString(suffix)
    EditTextData.startEditTextData(builder)
    EditTextData.addStart(builder, start)
    EditTextData.addEnd(builder, end)
    EditTextData.addPrefix(builder, prefixOffset)
    EditTextData.addSuffix(builder, suffixOffset)
    return EditTextData.endEditTextData(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<EditTextData> {
    const prefix = this.prefix()
    if (prefix == null) {
      return new FieldError("prefix", EditTextData)
    }

    const suffix = this.suffix()
    if (suffix == null) {
      return new FieldError("suffix", EditTextData)
    }

    return changeLog.editTextData(
      buffer,
      this.start(),
      this.end(),
      prefix,
      suffix
    )
  }
}

export class InsertComment extends FBS.InsertComment {
  static opType = opType.InsertComment
  opType: typeof opType.InsertComment = opType.InsertComment
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    InsertComment.startInsertComment(builder)
    InsertComment.addData(builder, dataOffset)
    return InsertComment.endInsertComment(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<InsertComment> {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", InsertComment)
    } else {
      return changeLog.insertComment(buffer, data)
    }
  }
}

export class InsertElement extends FBS.InsertElement {
  static opType = opType.InsertElement
  opType: typeof opType.InsertElement = opType.InsertElement
  static encode(
    builder: Builder,
    namespaceURI: ?string,
    localName: string
  ): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const localNameOffset = builder.createString(localName)
    InsertElement.startInsertElement(builder)
    if (namespaceURIOffset != null) {
      InsertElement.addNamespaceURI(builder, namespaceURIOffset)
    }
    InsertElement.addLocalName(builder, localNameOffset)
    return InsertElement.endInsertElement(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const localName = this.localName()
    if (localName == null) {
      return new FieldError("localName", InsertElement)
    }

    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return changeLog.insertElement(buffer, localName)
    } else {
      return changeLog.insertElementNS(buffer, namespaceURI, localName)
    }
  }
}

export class InsertStashedNode extends FBS.InsertStashedNode {
  static opType = opType.InsertStashedNode
  opType: typeof opType.InsertStashedNode = opType.InsertStashedNode
  static encode(builder: Builder, address: number): Op {
    InsertStashedNode.startInsertStashedNode(builder)
    InsertStashedNode.addAddress(builder, address)
    return InsertStashedNode.endInsertStashedNode(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.insertStashedNode(buffer, this.address())
  }
}

export class InsertText extends FBS.InsertText {
  static opType = opType.InsertText
  opType: typeof opType.InsertText = opType.InsertText
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    InsertText.startInsertText(builder)
    InsertText.addData(builder, dataOffset)
    return InsertText.endInsertText(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", InsertText)
    } else {
      return changeLog.insertText(buffer, data)
    }
  }
}

export class RemoveAttribute extends FBS.RemoveAttribute {
  static opType = opType.RemoveAttribute
  opType: typeof opType.RemoveAttribute = opType.RemoveAttribute
  static encode(builder: Builder, namespaceURI: ?string, name: string): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const nameOffset = builder.createString(name)
    RemoveAttribute.startRemoveAttribute(builder)
    if (namespaceURIOffset != null) {
      RemoveAttribute.addNamespaceURI(builder, namespaceURIOffset)
    }
    RemoveAttribute.addName(builder, nameOffset)

    return RemoveAttribute.endRemoveAttribute(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", RemoveAttribute)
    }
    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return changeLog.removeAttribute(buffer, name)
    } else {
      return changeLog.removeAttributeNS(buffer, namespaceURI, name)
    }
  }
}

export class RemoveNextSibling extends FBS.RemoveNextSibling {
  static opType = opType.RemoveNextSibling
  opType: typeof opType.RemoveNextSibling = opType.RemoveNextSibling
  static encode(builder: Builder): Op {
    RemoveNextSibling.startRemoveNextSibling(builder)
    return RemoveNextSibling.endRemoveNextSibling(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.removeNextSibling(buffer)
  }
}

export class RemoveStyleRule extends FBS.RemoveStyleRule {
  static opType = opType.RemoveStyleRule
  opType: typeof opType.RemoveStyleRule = opType.RemoveStyleRule
  static encode(builder: Builder, name: string): Op {
    const nameOffset = builder.createString(name)
    RemoveStyleRule.startRemoveStyleRule(builder)
    RemoveStyleRule.addName(builder, nameOffset)
    return RemoveStyleRule.endRemoveStyleRule(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", RemoveStyleRule)
    } else {
      return changeLog.removeStyleRule(buffer, name)
    }
  }
}

export class ReplaceWithComment extends FBS.ReplaceWithComment {
  static opType = opType.ReplaceWithComment
  opType: typeof opType.ReplaceWithComment = opType.ReplaceWithComment
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    ReplaceWithComment.startReplaceWithComment(builder)
    ReplaceWithComment.addData(builder, dataOffset)
    return ReplaceWithComment.endReplaceWithComment(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", ReplaceWithComment)
    } else {
      return changeLog.replaceWithComment(buffer, data)
    }
  }
}

export class ReplaceWithElement extends FBS.ReplaceWithElement {
  static opType = opType.ReplaceWithElement
  opType: typeof opType.ReplaceWithElement = opType.ReplaceWithElement
  static encode(
    builder: Builder,
    namespaceURI: ?string,
    localName: string
  ): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const localNameOffset = builder.createString(localName)
    ReplaceWithElement.startReplaceWithElement(builder)
    if (namespaceURIOffset != null) {
      ReplaceWithElement.addNamespaceURI(builder, namespaceURIOffset)
    }
    ReplaceWithElement.addLocalName(builder, localNameOffset)
    return ReplaceWithElement.endReplaceWithElement(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const localName = this.localName()
    if (localName == null) {
      return new FieldError("localName", ReplaceWithElement)
    }

    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return changeLog.replaceWithElement(buffer, localName)
    } else {
      return changeLog.replaceWithElementNS(buffer, namespaceURI, localName)
    }
  }
}

export class ReplaceWithStashedNode extends FBS.ReplaceWithStashedNode {
  static opType = opType.ReplaceWithStashedNode
  opType: typeof opType.ReplaceWithStashedNode = opType.ReplaceWithStashedNode
  static encode(builder: Builder, address: number): Op {
    ReplaceWithStashedNode.startReplaceWithStashedNode(builder)
    ReplaceWithStashedNode.addAddress(builder, address)
    return ReplaceWithStashedNode.endReplaceWithStashedNode(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.replaceWithStashedNode(buffer, this.address())
  }
}

export class ReplaceWithText extends FBS.ReplaceWithText {
  static opType = opType.ReplaceWithText
  opType: typeof opType.ReplaceWithText = opType.ReplaceWithText
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    ReplaceWithText.startReplaceWithText(builder)
    ReplaceWithText.addData(builder, dataOffset)
    return ReplaceWithText.endReplaceWithText(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", ReplaceWithText)
    } else {
      return changeLog.replaceWithText(buffer, data)
    }
  }
}

export class SelectChildren extends FBS.SelectChildren {
  static opType = opType.SelectChildren
  opType: typeof opType.SelectChildren = opType.SelectChildren
  static encode(builder: Builder): Op {
    SelectChildren.startSelectChildren(builder)
    return SelectChildren.endSelectChildren(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.selectChildren(buffer)
  }
}

export class SelectParent extends FBS.SelectParent {
  static opType = opType.SelectParent
  opType: typeof opType.SelectParent = opType.SelectParent
  static encode(builder: Builder): Op {
    SelectParent.startSelectParent(builder)
    return SelectParent.endSelectParent(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.selectParent(buffer)
  }
}

export class SelectSibling extends FBS.SelectSibling {
  static opType = opType.SelectSibling
  opType: typeof opType.SelectSibling = opType.SelectSibling
  static encode(builder: Builder, n: number): Op {
    SelectSibling.startSelectSibling(builder)
    SelectSibling.addOffset(builder, n)
    return SelectSibling.endSelectSibling(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x {
    return changeLog.selectSibling(buffer, this.offset())
  }
}

export class SetAttribute extends FBS.SetAttribute {
  static opType = opType.SetAttribute
  opType: typeof opType.SetAttribute = opType.SetAttribute
  static encode(
    builder: Builder,
    namespaceURI: ?string,
    name: string,
    value: string
  ): Op {
    const namespaceURIOffset =
      namespaceURI == null ? null : builder.createString(namespaceURI)
    const nameOffset = builder.createString(name)
    const valueOffset = builder.createString(value)
    SetAttribute.startSetAttribute(builder)
    if (namespaceURIOffset != null) {
      SetAttribute.addNamespaceURI(builder, namespaceURIOffset)
    }
    SetAttribute.addName(builder, nameOffset)
    SetAttribute.addValue(builder, valueOffset)

    return SetAttribute.endSetAttribute(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", SetAttribute)
    }
    const value = this.value()
    if (value == null) {
      return new FieldError("value", SetAttribute)
    }
    const namespaceURI = this.namespaceURI()
    if (namespaceURI == null) {
      return changeLog.setAttribute(buffer, name, value)
    } else {
      return changeLog.setAttributeNS(buffer, namespaceURI, name, value)
    }
  }
}

export class SetStyleRule extends FBS.SetStyleRule {
  static opType = opType.SetStyleRule
  opType: typeof opType.SetStyleRule = opType.SetStyleRule
  static encode(builder: Builder, name: string, value: string): Op {
    const nameOffset = builder.createString(name)
    const valueOffset = builder.createString(value)

    SetStyleRule.startSetStyleRule(builder)
    SetStyleRule.addName(builder, nameOffset)
    SetStyleRule.addValue(builder, valueOffset)

    return SetStyleRule.endSetStyleRule(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const name = this.name()
    if (name == null) {
      return new FieldError("name", SetStyleRule)
    }

    const value = this.value()
    if (value == null) {
      return new FieldError("value", SetStyleRule)
    }

    return changeLog.setStyleRule(buffer, name, value)
  }
}

export class SetTextData extends FBS.SetTextData {
  static opType = opType.SetTextData
  opType: typeof opType.SetTextData = opType.SetTextData
  static encode(builder: Builder, data: string): Op {
    const dataOffset = builder.createString(data)
    SetTextData.startSetTextData(builder)
    SetTextData.addData(builder, dataOffset)
    return SetTextData.endSetTextData(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    const data = this.data()
    if (data == null) {
      return new FieldError("data", SetTextData)
    } else {
      return changeLog.setTextData(buffer, data)
    }
  }
}

export class StashNextSibling extends FBS.StashNextSibling {
  static opType = opType.StashNextSibling
  opType: typeof opType.StashNextSibling = opType.StashNextSibling
  static encode(builder: Builder, address: number): Op {
    StashNextSibling.startStashNextSibling(builder)
    StashNextSibling.addAddress(builder, address)
    return StashNextSibling.endStashNextSibling(builder)
  }
  decode<x>(changeLog: Encoder<x>, buffer: x): x | FieldError<self> {
    return changeLog.stashNextSibling(buffer, this.address())
  }
}

export type OpVariant =
  | AssignBooleanProperty
  | AssignNullProperty
  | AssignNumberProperty
  | AssignStringProperty
  | DeleteProperty
  | DiscardStashed
  | EditTextData
  | InsertComment
  | InsertElement
  | InsertStashedNode
  | InsertText
  | RemoveAttribute
  | RemoveNextSibling
  | RemoveStyleRule
  | ReplaceWithComment
  | ReplaceWithElement
  | ReplaceWithStashedNode
  | ReplaceWithText
  | SelectChildren
  | SelectParent
  | SelectSibling
  | SetAttribute
  | SetStyleRule
  | SetTextData
  | StashNextSibling
  | ShiftSiblings
