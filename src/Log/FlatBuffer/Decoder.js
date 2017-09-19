/* @flow */

import type { Encoder, Decoder, Log } from "../../Log"
import unreachable from "unreachable"
import { flatbuffers } from "flatbuffers"
import type { Builder, ByteBuffer } from "flatbuffers"
import { Change } from "./Change"
import { ChangeLog } from "./ChangeLog"
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

export const decoder = (data: Uint8Array): Decoder => {
  const buffer = new flatbuffers.ByteBuffer(data)
  const changeLog = new ChangeLog()
  ChangeLog.getRootAsChangeLog(buffer, changeLog)
  return changeLog
}
