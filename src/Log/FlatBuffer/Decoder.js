/* @flow */

import type { Encoder, Decoder, ChangeList } from "../../Log"
import * as Log from "../../Log"
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

export const decode: Decoder<Uint8Array> = (data: Uint8Array) => <x>(
  changeLog: Log.ChangeLog<x>
): Log.ChangeLog<x> | Log.DecoderError => {
  const buffer = new flatbuffers.ByteBuffer(data)
  const table = new ChangeLog.Table()
  ChangeLog.Table.getRootAsChangeLog(buffer, table)
  return ChangeLog.decode(table, changeLog)
}
