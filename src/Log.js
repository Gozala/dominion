/* @flow */

import type { Decoder } from "decoder.flow"

export type EventDecoder = Decoder<any>

export interface Encoder<buffer> {
  selectParent(buffer): buffer;
  selectChildren(buffer): buffer;
  selectSibling(buffer, offset: number): buffer;

  removeNextSibling(buffer): buffer;

  replaceWithText(buffer, data: string): buffer;
  replaceWithComment(buffer, data: string): buffer;
  replaceWithElement(buffer, localName: string): buffer;
  replaceWithElementNS(buffer, namespaceURI: string, localName: string): buffer;
  replaceWithStashedNode(buffer, address: number): buffer;

  insertText(buffer, data: string): buffer;
  insertComment(buffer, data: string): buffer;
  insertElement(buffer, name: string): buffer;
  insertElementNS(buffer, namespaceURI: string, name: string): buffer;
  insertStashedNode(buffer, address: number): buffer;

  setTextData(buffer, data: string): buffer;
  editTextData(
    buffer,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): buffer;

  setAttribute(buffer, name: string, value: string): buffer;
  setAttributeNS(
    buffer,
    namespaceURI: string,
    name: string,
    value: string
  ): buffer;
  removeAttribute(buffer, name: string): buffer;
  removeAttributeNS(buffer, namespaceURI: string, name: string): buffer;
  assignProperty(
    buffer,
    name: string,
    value: string | number | boolean | null
  ): buffer;
  deleteProperty(buffer, name: string): buffer;
  setStyleRule(buffer, name: string, value: string): buffer;
  removeStyleRule(buffer, name: string): buffer;
  addEventDecoder(
    buffer,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ): buffer;
  removeEventDecoder(
    buffer,
    type: string,
    decoder: EventDecoder,
    capture: boolean
  ): buffer;

  stashNextSibling(buffer, address: number): buffer;
  discardStashedNode(buffer, address: number): buffer;
  shiftSiblings(buffer, count: number): buffer;
}

export interface DecoderError {
  isError: true;
  toString(): string;
}

export type Result<value> = value | DecoderError

export interface ChangeList {
  encode<buffer>(Encoder<buffer>, buffer): Result<buffer>;
}

// export interface Encode<buffer> {
//   (ChangeList): Result<buffer>;
// }

export interface Decode<buffer> {
  (buffer): ChangeList;
}

export interface Archive<node> {
  patch(ChangeList): Result<node>;
}
