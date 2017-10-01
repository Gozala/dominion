/* @flow */

export interface ChangeLog {
  selectParent(): ChangeLog,
  selectChildren(): ChangeLog,
  selectSibling(offset: number): ChangeLog,

  removeNextSibling(): ChangeLog,

  replaceWithText(data: string): ChangeLog,
  replaceWithComment(data: string): ChangeLog,
  replaceWithElement(localName: string): ChangeLog,
  replaceWithElementNS(namespaceURI: string, localName: string): ChangeLog,
  replaceWithStashedNode(address: number): ChangeLog,

  insertText(data: string): ChangeLog,
  insertComment(data: string): ChangeLog,
  insertElement(name: string): ChangeLog,
  insertElementNS(namespaceURI: string, name: string): ChangeLog,
  insertStashedNode(address: number): ChangeLog,

  setTextData(data: string): ChangeLog,
  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): ChangeLog,

  setAttribute(name: string, value: string): ChangeLog,
  setAttributeNS(namespaceURI: string, name: string, value: string): ChangeLog,
  removeAttribute(name: string): ChangeLog,
  removeAttributeNS(namespaceURI: string, name: string): ChangeLog,
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): ChangeLog,
  deleteProperty(name: string): ChangeLog,
  setStyleRule(name: string, value: string): ChangeLog,
  removeStyleRule(name: string): ChangeLog,

  stashNextSibling(address: number): ChangeLog,
  discardStashedNode(address: number): ChangeLog
}

export interface DecoderError {
  isError: true,
  toString(): string
}

export interface ChangeList {
  (ChangeLog): ChangeLog | DecoderError
}

export interface Encoder<buffer> {
  (ChangeList): buffer
}

export interface Decoder<buffer> {
  (buffer): ChangeList
}
