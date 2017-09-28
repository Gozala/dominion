/* @flow */

export interface Encoder<x> {
  selectParent(): Encoder<x>,
  selectChildren(): Encoder<x>,
  selectSibling(offset: number): Encoder<x>,

  removeNextSibling(): Encoder<x>,

  replaceWithText(data: string): Encoder<x>,
  replaceWithComment(data: string): Encoder<x>,
  replaceWithElement(localName: string): Encoder<x>,
  replaceWithElementNS(namespaceURI: string, localName: string): Encoder<x>,
  replaceWithStashedNode(address: number): Encoder<x>,

  insertText(data: string): Encoder<x>,
  insertComment(data: string): Encoder<x>,
  insertElement(name: string): Encoder<x>,
  insertElementNS(namespaceURI: string, name: string): Encoder<x>,
  insertStashedNode(address: number): Encoder<x>,

  setTextData(data: string): Encoder<x>,
  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Encoder<x>,

  setAttribute(name: string, value: string): Encoder<x>,
  setAttributeNS(namespaceURI: string, name: string, value: string): Encoder<x>,
  removeAttribute(name: string): Encoder<x>,
  removeAttributeNS(namespaceURI: string, name: string): Encoder<x>,
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): Encoder<x>,
  deleteProperty(name: string): Encoder<x>,
  setStyleRule(name: string, value: string): Encoder<x>,
  removeStyleRule(name: string): Encoder<x>,

  stashNextSibling(address: number): Encoder<x>,
  discardStashedNode(address: number): Encoder<x>,

  encode(): x
}

export interface DecoderError {
  isError: true,
  toString(): string
}

export interface Decoder {
  decode<buffer>(Encoder<buffer>): DecoderError | Encoder<buffer>
}
