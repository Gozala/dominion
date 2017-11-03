/* @flow */

import type { Dict } from "dictionary.flow"
import type { Decoder } from "decoder.flow"

export type TEXT_NODE = 3
export type ELEMENT_NODE = 1
export type COMMENT_NODE = 8
export type DOCUMENT_FRAGMENT_NODE = 11
export type INDEXED_ELEMENT_NODE = 21
export type TAGGED_ELEMENT_NODE = 22
export type THUNK_NODE = 23
export type INDEXED_FRAGMENT_NODE = 24
export type UNINDEXED_FRAGMENT_NODE = 25

export type ATTRIBUTE_SETTING = 1
export type PROPERTY_SETTING = 2
export type STYLE_SETTING = 3
export type LISTENER_SETTING = 4

export type Properties = Dict<void | null | boolean | number | string>
export type Attributes = Dict<Attribute>
export type ClassList = Set<string>

export type StyleRules = Dict<string | null>

export type Style = {
  settingType: STYLE_SETTING,
  [string]: string | null
}

export interface Property {
  settingType: PROPERTY_SETTING;
  name: string;
  value: void | null | boolean | number | string;
}

export interface Attribute {
  settingType: ATTRIBUTE_SETTING;
  name: string;
  value: string | null;
  namespaceURI: string | null;
}

export interface Listener<message> {
  settingType: LISTENER_SETTING;
  type: string;
  capture: boolean;
  decoder: Decoder<message>;
}

export type Listeners<message> = Dict<Listener<message>>
export type Setting<message> = Listener<message> | Attribute | Property | Style

export type Settings<message> = Array<Setting<message>>

export interface Text<message> {
  nodeType: TEXT_NODE;
  data: string;
  toDebugString(): string;
}

export interface Comment<message> {
  nodeType: COMMENT_NODE;
  data: string;
  toDebugString(): string;
}

interface ElementNode<message> {
  localName: string;
  namespaceURI: null | string;
  properties: Properties;
  attributes: Attributes;
  style: StyleRules;
  classList: ClassList;
  listeners: Listeners<message>;
  toDebugString(): string;
}

export type Indexed<node> = [string, node]

export type UnindexedChildren<message> = Array<Node<message>>
export type IndexedChildren<message> = Array<Indexed<Node<message>>>

export interface UnindexedElement<message> extends ElementNode<message> {
  nodeType: ELEMENT_NODE;
  children: UnindexedChildren<message>;
}

export interface IndexedElement<message> extends ElementNode<message> {
  nodeType: INDEXED_ELEMENT_NODE;
  children: IndexedChildren<message>;
}

export type Element<message> =
  | IndexedElement<message>
  | UnindexedElement<message>

export type Fragment<message> =
  | IndexedFragment<message>
  | UnindexedFragment<message>

export interface UnindexedFragment<message> {
  nodeType: UNINDEXED_FRAGMENT_NODE;
  children: UnindexedChildren<message>;
  toDebugString(): string;
}

export interface IndexedFragment<message> {
  nodeType: INDEXED_FRAGMENT_NODE;
  children: IndexedChildren<message>;
  toDebugString(): string;
}

export interface Thunk<message, params: Array<mixed> = *> {
  nodeType: THUNK_NODE;
  node: ?Node<message>;
  args: params;
  render: (...args: params) => Node<message>;
  force(): Node<message>;
  toDebugString(): string;
}

export interface Tagged<message, inner = *> {
  nodeType: TAGGED_ELEMENT_NODE;
  node: Node<inner>;
  tag: inner => message;
  toDebugString(): string;
}

export const nodeType = {
  TEXT_NODE: (3: TEXT_NODE),
  ELEMENT_NODE: (1: ELEMENT_NODE),
  INDEXED_ELEMENT_NODE: (21: INDEXED_ELEMENT_NODE),
  TAGGED_ELEMENT_NODE: (22: TAGGED_ELEMENT_NODE),
  THUNK_NODE: (23: THUNK_NODE),
  COMMENT_NODE: (8: COMMENT_NODE),
  DOCUMENT_FRAGMENT_NODE: (11: DOCUMENT_FRAGMENT_NODE),
  INDEXED_FRAGMENT_NODE: (24: INDEXED_FRAGMENT_NODE),
  UNINDEXED_FRAGMENT_NODE: (25: UNINDEXED_FRAGMENT_NODE)
}

export const settingType = {
  attribute: (1: ATTRIBUTE_SETTING),
  property: (2: PROPERTY_SETTING),
  style: (3: STYLE_SETTING),
  listener: (4: LISTENER_SETTING)
}

export type Node<message> =
  | Comment<message>
  | Text<message>
  | UnindexedElement<message>
  | IndexedElement<message>
  | Thunk<message>
  | Tagged<message>
  | IndexedFragment<message>
  | UnindexedFragment<message>
