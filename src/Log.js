/* @flow */

export interface ChangeLog<buffer> {
  selectParent(): ChangeLog<buffer>,
  selectChildren(): ChangeLog<buffer>,
  selectSibling(offset: number): ChangeLog<buffer>,

  removeNextSibling(): ChangeLog<buffer>,

  replaceWithText(data: string): ChangeLog<buffer>,
  replaceWithComment(data: string): ChangeLog<buffer>,
  replaceWithElement(localName: string): ChangeLog<buffer>,
  replaceWithElementNS(
    namespaceURI: string,
    localName: string
  ): ChangeLog<buffer>,
  replaceWithStashedNode(address: number): ChangeLog<buffer>,

  insertText(data: string): ChangeLog<buffer>,
  insertComment(data: string): ChangeLog<buffer>,
  insertElement(name: string): ChangeLog<buffer>,
  insertElementNS(namespaceURI: string, name: string): ChangeLog<buffer>,
  insertStashedNode(address: number): ChangeLog<buffer>,

  setTextData(data: string): ChangeLog<buffer>,
  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): ChangeLog<buffer>,

  setAttribute(name: string, value: string): ChangeLog<buffer>,
  setAttributeNS(
    namespaceURI: string,
    name: string,
    value: string
  ): ChangeLog<buffer>,
  removeAttribute(name: string): ChangeLog<buffer>,
  removeAttributeNS(namespaceURI: string, name: string): ChangeLog<buffer>,
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): ChangeLog<buffer>,
  deleteProperty(name: string): ChangeLog<buffer>,
  setStyleRule(name: string, value: string): ChangeLog<buffer>,
  removeStyleRule(name: string): ChangeLog<buffer>,

  stashNextSibling(address: number): ChangeLog<buffer>,
  discardStashedNode(address: number): ChangeLog<buffer>,

  toBuffer(): buffer
}

export interface DecoderError {
  isError: true,
  toString(): string
}

export interface Encoder<x> {
  ((ChangeLog<x>) => ChangeLog<x>): x
}

export interface Decoder<x> {
  <y>(data: x, Encoder<y>): DecoderError | y
}
