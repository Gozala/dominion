/* @flow */

export interface Log {
  selectParent(): self,
  selectChildren(): self,
  selectSibling(offset: number): self,

  removeNextSibling(): self,

  replaceWithText(data: string): self,
  replaceWithComment(data: string): self,
  replaceWithElement(localName: string): self,
  replaceWithElementNS(namespaceURI: string, localName: string): self,
  replaceWithStashedNode(address: number): self,

  insertText(text: string): self,
  insertComment(text: string): self,
  insertElement(name: string): self,
  insertElementNS(namespaceURI: string, name: string): self,
  insertStashedNode(address: number): self,

  setTextData(text: string): self,
  editTextData(from: number, to: number, prefix: string, suffix: string): self,

  setAttribute(name: string, value: string): self,
  setAttributeNS(namespaceURI: string, name: string, value: string): self,
  removeAttribute(name: string): self,
  removeAttributeNS(namespaceURI: string, name: string): self,
  assignProperty(name: string, value: string | number | boolean | null): self,
  deleteProperty(name: string): self,
  setStyleRule(name: string, value: string): self,
  removeStyleRule(name: string): self,

  stashNextSibling(): self,
  discardStashedNode(address: number): self
}

export interface DecoderError {
  isError: true,
  toString(): string
}

export interface Encoder<buffer> extends Log {
  encode(): buffer
}

export interface Decoder {
  decode(Log): DecoderError | Log
}
