/* @flow */

export interface Log<buffer> {
  address: number,

  selectParent(): Log<buffer>,
  selectChildren(): Log<buffer>,
  selectSibling(offset: number): Log<buffer>,

  removeNextSibling(): Log<buffer>,

  replaceWithText(data: string): Log<buffer>,
  replaceWithComment(data: string): Log<buffer>,
  replaceWithElement(localName: string): Log<buffer>,
  replaceWithElementNS(namespaceURI: string, localName: string): Log<buffer>,
  replaceWithStashedNode(address: number): Log<buffer>,

  insertText(text: string): Log<buffer>,
  insertComment(text: string): Log<buffer>,
  insertElement(name: string): Log<buffer>,
  insertElementNS(namespaceURI: string, name: string): Log<buffer>,
  insertStashedNode(address: number): Log<buffer>,

  setTextData(text: string): Log<buffer>,
  editTextData(
    from: number,
    to: number,
    prefix: string,
    suffix: string
  ): Log<buffer>,

  setAttribute(name: string, value: string): Log<buffer>,
  setAttributeNS(
    namespaceURI: string,
    name: string,
    value: string
  ): Log<buffer>,
  removeAttribute(name: string): Log<buffer>,
  removeAttributeNS(namespaceURI: string, name: string): Log<buffer>,
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): Log<buffer>,
  deleteProperty(name: string): Log<buffer>,
  setStyleRule(name: string, value: string): Log<buffer>,
  removeStyleRule(name: string): Log<buffer>,

  stashNextSibling(): Log<buffer>,
  discardStashedNode(address: number): Log<buffer>,

  format(): buffer
}
