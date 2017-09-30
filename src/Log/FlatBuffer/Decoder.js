/* @noflow */

import type { Encoder, Decoder } from "../../Log"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import type { Builder, ByteBuffer } from "flatbuffers"
import ChangeLog from "./ChangeLog"

import {
  type Op,
  type OpVariant,
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

class Root implements Decoder<Uint8Array> {
  decode<x>(data: Uint8Array, encoder: Encoder<x>): DecoderError | Encoder<x> {
    const buffer = new flatbuffers.ByteBuffer(data)
    const changeLog = new ChangeLog.Table()
    ChangeLog.Table.getRootAsChangeLog(buffer, changeLog)
    return ChangeLog.decode(changeLog, encoder)
  }
}

export const decoder: Decoder<Uint8Array> = new Root()
