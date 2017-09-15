/* @flow */

import type { Builder, Offset } from "flatbuffers"
import type { Op, OpType } from "./Op"
import { opType } from "./Op"
import { Change as FBSChange, ChangeLog } from "../../DOM/DOM.fbs.ts.js"
import * as op from "./Op"

export opaque type Change: Offset = number

export const changeLog = (builder: Builder, changes: Change[]): number => {
  const logOffset = ChangeLog.createLogVector(builder, (changes: Offset[]))
  ChangeLog.startChangeLog(builder)
  if (logOffset != null) {
    ChangeLog.addLog(builder, logOffset)
  }
  return ChangeLog.endChangeLog(builder)
}

export const change = (
  builder: Builder,
  opType: OpType,
  opOffset: Op
): Change => {
  FBSChange.startChange(builder)
  FBSChange.addOp(builder, opOffset)
  FBSChange.addOpType(builder, opType)
  return FBSChange.endChange(builder)
}

export const selectSibling = (builder: Builder, n: number): Change =>
  change(builder, opType.SelectSibling, op.selectSibling(builder, n))

export const selectChildren = (builder: Builder): Change =>
  change(builder, opType.SelectChildren, op.selectChildren(builder))

export const selectParent = (builder: Builder): Change =>
  change(builder, opType.SelectParent, op.selectParent(builder))

export const removeNextSibling = (builder: Builder): Change =>
  change(builder, opType.RemoveNextSibling, op.removeNextSibling(builder))

export const insertText = (builder: Builder, data: string): Change =>
  change(builder, opType.InsertText, op.insertText(builder, data))

export const insertComment = (builder: Builder, data: string): Change =>
  change(builder, opType.InsertComment, op.insertComment(builder, data))

export const insertElement = (builder: Builder, localName: string): Change =>
  change(builder, opType.InsertElement, op.insertElement(builder, localName))

export const insertElementNS = (
  builder: Builder,
  namespaceURI: string,
  localName: string
): Change =>
  change(
    builder,
    opType.InsertElement,
    op.insertElementNS(builder, namespaceURI, localName)
  )

export const insertStashedNode = (builder: Builder, address: number): Change =>
  change(
    builder,
    opType.InsertStashedNode,
    op.insertStashedNode(builder, address)
  )

export const replaceWithText = (builder: Builder, data: string): Change =>
  change(builder, opType.ReplaceWithText, op.replaceWithText(builder, data))

export const replaceWithComment = (builder: Builder, data: string): Change =>
  change(
    builder,
    opType.ReplaceWithComment,
    op.replaceWithComment(builder, data)
  )

export const replaceWithElement = (
  builder: Builder,
  localName: string
): Change =>
  change(
    builder,
    opType.ReplaceWithElement,
    op.replaceWithElement(builder, localName)
  )

export const replaceWithElementNS = (
  builder: Builder,
  namespaceURI: string,
  localName: string
): Change =>
  change(
    builder,
    opType.ReplaceWithElement,
    op.replaceWithElementNS(builder, namespaceURI, localName)
  )

export const replaceWithStashedNode = (
  builder: Builder,
  address: number
): Change =>
  change(
    builder,
    opType.ReplaceWithStashedNode,
    op.replaceWithStashedNode(builder, address)
  )

export const editTextData = (
  builder: Builder,
  start: number,
  end: number,
  prefix: string,
  suffix: string
): Change =>
  change(
    builder,
    opType.EditTextData,
    op.editTextData(builder, start, end, prefix, suffix)
  )

export const setTextData = (builder: Builder, data: string): Change =>
  change(builder, opType.SetTextData, op.setTextData(builder, data))

export const setAttribute = (
  builder: Builder,
  name: string,
  value: string
): Change =>
  change(builder, opType.SetAttribute, op.setAttribute(builder, name, value))

export const removeAttribute = (builder: Builder, name: string): Change =>
  change(builder, opType.RemoveAttribute, op.removeAttribute(builder, name))

export const setAttributeNS = (
  builder: Builder,
  namespaceURI: string,
  name: string,
  value: string
): Change =>
  change(
    builder,
    opType.SetAttribute,
    op.setAttributeNS(builder, namespaceURI, name, value)
  )

export const removeAttributeNS = (
  builder: Builder,
  namespaceURI: string,
  name: string
): Change =>
  change(
    builder,
    opType.RemoveAttribute,
    op.removeAttributeNS(builder, namespaceURI, name)
  )

export const assignStringProperty = (
  builder: Builder,
  name: string,
  value: string
): Change =>
  change(
    builder,
    opType.AssignStringProperty,
    op.assignStringProperty(builder, name, value)
  )

export const assignNumberProperty = (
  builder: Builder,
  name: string,
  value: number
): Change =>
  change(
    builder,
    opType.AssignNumberProperty,
    op.assignNumberProperty(builder, name, value)
  )

export const assignBooleanProperty = (
  builder: Builder,
  name: string,
  value: boolean
): Change =>
  change(
    builder,
    opType.AssignBooleanProperty,
    op.assignBooleanProperty(builder, name, value)
  )

export const assignNullProperty = (
  builder: Builder,
  name: string,
  value: null = null
): Change =>
  change(
    builder,
    opType.AssignNullProperty,
    op.assignNullProperty(builder, name, value)
  )

export const deleteProperty = (builder: Builder, name: string): Change =>
  change(builder, opType.DeleteProperty, op.deleteProperty(builder, name))

export const setStyleRule = (
  builder: Builder,
  name: string,
  value: string
): Change =>
  change(builder, opType.SetStyleRule, op.setStyleRule(builder, name, value))

export const removeStyleRule = (builder: Builder, name: string): Change =>
  change(builder, opType.RemoveStyleRule, op.removeStyleRule(builder, name))

export const stashNextSibling = (builder: Builder, address: number): Change =>
  change(
    builder,
    opType.StashNextSibling,
    op.stashNextSibling(builder, address)
  )

export const discardStashedNode = (builder: Builder, address: number): Change =>
  change(
    builder,
    opType.DiscardStashed,
    op.discardStashedNode(builder, address)
  )
