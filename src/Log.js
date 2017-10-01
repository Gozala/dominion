/* @flow */

import * as result from "result.flow"

export interface ChangeLog<buffer> {
  selectParent(buffer): buffer,
  selectChildren(buffer): buffer,
  selectSibling(buffer, offset: number): buffer,

  removeNextSibling(buffer): buffer,

  replaceWithText(buffer, data: string): buffer,
  replaceWithComment(buffer, data: string): buffer,
  replaceWithElement(buffer, localName: string): buffer,
  replaceWithElementNS(buffer, namespaceURI: string, localName: string): buffer,
  replaceWithStashedNode(buffer, address: number): buffer,

  insertText(buffer, data: string): buffer,
  insertComment(buffer, data: string): buffer,
  insertElement(buffer, name: string): buffer,
  insertElementNS(buffer, namespaceURI: string, name: string): buffer,
  insertStashedNode(buffer, address: number): buffer,

  setTextData(buffer, data: string): buffer,
  editTextData(
    buffer,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): buffer,

  setAttribute(buffer, name: string, value: string): buffer,
  setAttributeNS(
    buffer,
    namespaceURI: string,
    name: string,
    value: string
  ): buffer,
  removeAttribute(buffer, name: string): buffer,
  removeAttributeNS(buffer, namespaceURI: string, name: string): buffer,
  assignProperty(
    buffer,
    name: string,
    value: string | number | boolean | null
  ): buffer,
  deleteProperty(buffer, name: string): buffer,
  setStyleRule(buffer, name: string, value: string): buffer,
  removeStyleRule(buffer, name: string): buffer,

  stashNextSibling(buffer, address: number): buffer,
  discardStashedNode(buffer, address: number): buffer
}

export interface DecoderError {
  isError: true,
  toString(): string
}

export type Result<value> = value | DecoderError

export interface ChangeList {
  reduce<buffer>(ChangeLog<buffer>, buffer): Result<buffer>
}

export interface Encoder<buffer> {
  (ChangeList): Result<buffer>
}

export interface Decoder<buffer> {
  (buffer): ChangeList
}
