/* @flow */

import { flatbuffers } from "flatbuffers"
import type { Builder, Offset } from "flatbuffers"
import * as FBS from "../../DOM/DOM.fbs.ts.js"

import {
  type Op as FBSOp,
  OpValue,
  AssignStringProperty,
  RemoveNextSibling,
  InsertText,
  InsertComment,
  InsertElement,
  ReplaceWithComment,
  ReplaceWithText,
  ReplaceWithElement,
  ReplaceWithStashedNode,
  InsertStashedNode,
  RemoveAttribute,
  DeleteProperty,
  AssignBooleanProperty,
  AssignNullProperty,
  AssignNumberProperty,
  SetAttribute,
  SetStyleRule,
  RemoveStyleRule,
  SelectChildren,
  SelectSibling,
  SelectParent,
  EditTextData,
  SetTextData,
  DiscardStashed,
  StashNextSibling,
  Change as FBSChange,
  ChangeLog
} from "../../DOM/DOM.fbs.ts.js"

export type OpType = FBSOp
export opaque type Op: Offset = number

export const opType = OpValue

export const selectSibling = (builder: Builder, n: number): Op => {
  SelectSibling.startSelectSibling(builder)
  SelectSibling.addOffset(builder, n)
  return SelectSibling.endSelectSibling(builder)
}

export const selectChildren = (builder: Builder): Op => {
  SelectChildren.startSelectChildren(builder)
  return SelectChildren.endSelectChildren(builder)
}

export const selectParent = (builder: Builder): Op => {
  SelectParent.startSelectParent(builder)
  return SelectParent.endSelectParent(builder)
}

export const removeNextSibling = (builder: Builder): Op => {
  RemoveNextSibling.startRemoveNextSibling(builder)
  return RemoveNextSibling.endRemoveNextSibling(builder)
}

export const insertText = (builder: Builder, data: string): Op => {
  const dataOffset = builder.createString(data)
  InsertText.startInsertText(builder)
  InsertText.addData(builder, dataOffset)
  return InsertText.endInsertText(builder)
}

export const insertComment = (builder: Builder, data: string): Op => {
  const dataOffset = builder.createString(data)
  InsertComment.startInsertComment(builder)
  InsertComment.addData(builder, dataOffset)
  return InsertComment.endInsertComment(builder)
}

export const insertElement = (builder: Builder, localName: string): Op => {
  const localNameOffset = builder.createString(localName)
  InsertElement.startInsertElement(builder)
  InsertElement.addLocalName(builder, localNameOffset)
  return InsertElement.endInsertElement(builder)
}

export const insertElementNS = (
  builder: Builder,
  namespaceURI: string,
  localName: string
): Op => {
  const localNameOffset = builder.createString(localName)
  const namespaceURIOffset = builder.createString(namespaceURI)
  InsertElement.startInsertElement(builder)
  InsertElement.addNamespaceURI(builder, namespaceURIOffset)
  InsertElement.addLocalName(builder, localNameOffset)
  return InsertElement.endInsertElement(builder)
}

export const insertStashedNode = (builder: Builder, address: number): Op => {
  InsertStashedNode.startInsertStashedNode(builder)
  InsertStashedNode.addAddress(builder, address)
  return InsertStashedNode.endInsertStashedNode(builder)
}

export const replaceWithText = (builder: Builder, data: string): Op => {
  const dataOffset = builder.createString(data)
  ReplaceWithText.startReplaceWithText(builder)
  ReplaceWithText.addData(builder, dataOffset)
  return ReplaceWithText.endReplaceWithText(builder)
}

export const replaceWithComment = (builder: Builder, data: string): Op => {
  const dataOffset = builder.createString(data)
  ReplaceWithComment.startReplaceWithComment(builder)
  ReplaceWithComment.addData(builder, dataOffset)
  return ReplaceWithComment.endReplaceWithComment(builder)
}

export const replaceWithElement = (builder: Builder, localName: string): Op => {
  const localNameOffset = builder.createString(localName)
  ReplaceWithElement.startReplaceWithElement(builder)
  ReplaceWithElement.addLocalName(builder, localNameOffset)
  return ReplaceWithElement.endReplaceWithElement(builder)
}

export const replaceWithElementNS = (
  builder: Builder,
  namespaceURI: string,
  localName: string
): Op => {
  const localNameOffset = builder.createString(localName)
  const namespaceURIOffset = builder.createString(namespaceURI)
  ReplaceWithElement.startReplaceWithElement(builder)
  ReplaceWithElement.addLocalName(builder, localNameOffset)
  ReplaceWithElement.addNamespaceURI(builder, namespaceURIOffset)
  return ReplaceWithElement.endReplaceWithElement(builder)
}

export const replaceWithStashedNode = (
  builder: Builder,
  address: number
): Op => {
  ReplaceWithStashedNode.startReplaceWithStashedNode(builder)
  ReplaceWithStashedNode.addAddress(builder, address)
  return ReplaceWithStashedNode.endReplaceWithStashedNode(builder)
}

export const editTextData = (
  builder: Builder,
  start: number,
  end: number,
  prefix: string,
  suffix: string
): Op => {
  const prefixOffset = builder.createString(prefix)
  const suffixOffset = builder.createString(suffix)
  EditTextData.startEditTextData(builder)
  EditTextData.addStart(builder, start)
  EditTextData.addEnd(builder, end)
  EditTextData.addPrefix(builder, prefixOffset)
  EditTextData.addSuffix(builder, suffixOffset)
  return EditTextData.endEditTextData(builder)
}

export const setTextData = (builder: Builder, data: string): Op => {
  const dataOffset = builder.createString(data)
  SetTextData.startSetTextData(builder)
  SetTextData.addData(builder, dataOffset)
  return SetTextData.endSetTextData(builder)
}

export const setAttribute = (
  builder: Builder,
  name: string,
  value: string
): Op => {
  const nameOffset = builder.createString(name)
  const valueOffset = builder.createString(value)
  SetAttribute.startSetAttribute(builder)
  SetAttribute.addName(builder, nameOffset)
  SetAttribute.addValue(builder, valueOffset)
  return SetAttribute.endSetAttribute(builder)
}
export const removeAttribute = (builder: Builder, name: string): Op => {
  const nameOffset = builder.createString(name)
  RemoveAttribute.startRemoveAttribute(builder)
  RemoveAttribute.addName(builder, nameOffset)

  return RemoveAttribute.endRemoveAttribute(builder)
}

export const setAttributeNS = (
  builder: Builder,
  namespaceURI: string,
  name: string,
  value: string
): Op => {
  const namespaceURIOffset = builder.createString(namespaceURI)
  const nameOffset = builder.createString(name)
  const valueOffset = builder.createString(value)
  SetAttribute.startSetAttribute(builder)
  SetAttribute.addNamespaceURI(builder, namespaceURIOffset)
  SetAttribute.addName(builder, nameOffset)
  SetAttribute.addValue(builder, valueOffset)

  return SetAttribute.endSetAttribute(builder)
}

export const removeAttributeNS = (
  builder: Builder,
  namespaceURI: string,
  name: string
): Op => {
  const namespaceURIOffset = builder.createString(namespaceURI)
  const nameOffset = builder.createString(name)
  RemoveAttribute.startRemoveAttribute(builder)
  RemoveAttribute.addNamespaceURI(builder, namespaceURIOffset)
  RemoveAttribute.addName(builder, nameOffset)

  return RemoveAttribute.endRemoveAttribute(builder)
}

export const assignStringProperty = (
  builder: Builder,
  name: string,
  value: string
): Op => {
  const nameOffset = builder.createString(name)
  const valueOffset = builder.createString(value)
  AssignStringProperty.startAssignStringProperty(builder)
  AssignStringProperty.addName(builder, nameOffset)
  AssignStringProperty.addValue(builder, valueOffset)
  return AssignStringProperty.endAssignStringProperty(builder)
}

export const assignNumberProperty = (
  builder: Builder,
  name: string,
  value: number
): Op => {
  const nameOffset = builder.createString(name)
  AssignNumberProperty.startAssignNumberProperty(builder)
  AssignNumberProperty.addName(builder, nameOffset)
  AssignNumberProperty.addValue(builder, value)
  return AssignNumberProperty.endAssignNumberProperty(builder)
}

export const assignBooleanProperty = (
  builder: Builder,
  name: string,
  value: boolean
): Op => {
  const nameOffset = builder.createString(name)
  AssignBooleanProperty.startAssignBooleanProperty(builder)
  AssignBooleanProperty.addName(builder, nameOffset)
  AssignBooleanProperty.addValue(builder, value)
  return AssignBooleanProperty.endAssignBooleanProperty(builder)
}

export const assignNullProperty = (
  builder: Builder,
  name: string,
  value: null = null
): Op => {
  const nameOffset = builder.createString(name)
  AssignNullProperty.startAssignNullProperty(builder)
  AssignNullProperty.addName(builder, nameOffset)
  return AssignNullProperty.endAssignNullProperty(builder)
}

export const deleteProperty = (builder: Builder, name: string): Op => {
  const nameOffset = builder.createString(name)
  DeleteProperty.startDeleteProperty(builder)
  DeleteProperty.addName(builder, nameOffset)
  return DeleteProperty.endDeleteProperty(builder)
}

export const setStyleRule = (
  builder: Builder,
  name: string,
  value: string
): Op => {
  const nameOffset = builder.createString(name)
  const valueOffset = builder.createString(value)
  SetStyleRule.startSetStyleRule(builder)
  SetStyleRule.addName(builder, nameOffset)
  SetStyleRule.addValue(builder, valueOffset)
  return SetStyleRule.endSetStyleRule(builder)
}

export const removeStyleRule = (builder: Builder, name: string): Op => {
  const nameOffset = builder.createString(name)
  RemoveStyleRule.startRemoveStyleRule(builder)
  RemoveStyleRule.addName(builder, nameOffset)
  return RemoveStyleRule.endRemoveStyleRule(builder)
}

export const stashNextSibling = (builder: Builder, address: number): Op => {
  StashNextSibling.startStashNextSibling(builder)
  StashNextSibling.addAddress(builder, address)
  return StashNextSibling.endStashNextSibling(builder)
}

export const discardStashedNode = (builder: Builder, address: number): Op => {
  DiscardStashed.startDiscardStashed(builder)
  DiscardStashed.addAddress(builder, address)
  return DiscardStashed.endDiscardStashed(builder)
}
