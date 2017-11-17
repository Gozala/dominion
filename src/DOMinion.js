/* @flow */

import type {
  Text,
  Element,
  UnindexedElement,
  IndexedElement,
  Indexed,
  Thunk,
  Tagged,
  Comment,
  Node,
  Style,
  StyleRules,
  Properties,
  Attributes,
  ClassList,
  Setting,
  Attribute,
  Property,
  Listener,
  Listeners
} from "./DOM/Node"
import type { Decoder } from "decoder.flow"
import type { Dict } from "dictionary.flow"
import { nodeType, settingType } from "./DOM/Node"
import { diff } from "./Diff"
import { patch } from "./Patch"
import DOMPatch from "./Patch/DOM"
import * as Dictionary from "dictionary.flow"
import unreachable from "unreachable"
export type { Encoder, Decode, Archive, ChangeList, DecoderError } from "./Log"

const empty: Array<any> = Object.freeze([])
const blank: Dict<any> = Dictionary.empty()

class AttributeSetting implements Attribute {
  settingType = settingType.attribute
  namespaceURI: string | null
  name: string
  value: string | null
  constructor(namespaceURI: string | null, name: string, value: string | null) {
    this.namespaceURI = namespaceURI
    this.name = name
    this.value = value
  }
}

class PropertySetting implements Property {
  settingType = settingType.property
  name: string
  value: string | number | boolean | null | void
  constructor(name: string, value: string | number | boolean | null | void) {
    this.name = name
    this.value = value
  }
}

class ListenerSetting<message> implements Listener<message> {
  settingType = settingType.listener
  type: string
  capture: boolean
  decoder: Decoder<?message>
  constructor(type: string, capture: boolean, decoder: Decoder<?message>) {
    this.type = type
    this.capture = capture
    this.decoder = decoder
  }
}

class TextNode<message> implements Text<message> {
  nodeType = nodeType.TEXT_NODE
  data: string
  constructor(data: string) {
    this.data = data
  }
  toDebugString(): string {
    return `#${this.data}`
  }
  map<tagged>(tag: message => tagged): Text<tagged> {
    return (this: Text<any>)
  }
}

class CommentNode<message> implements Comment<message> {
  nodeType = nodeType.COMMENT_NODE
  data: string
  constructor(data: string) {
    this.data = data
  }
  toDebugString(): string {
    return `<!-- ${this.data} -->`
  }
  map<tagged>(tag: message => tagged): Comment<tagged> {
    return (this: Comment<any>)
  }
}

class TaggedNode<outer, inner> implements Tagged<outer, inner> {
  nodeType = nodeType.TAGGED_ELEMENT_NODE
  node: Node<inner>
  tag: inner => outer
  constructor(node: Node<inner>, tag: inner => outer) {
    this.node = node
    this.tag = tag
  }
  toDebugString(): string {
    return `<tagged tag=${this.tag.toString()}>${this.node.toDebugString()}</tagged>`
  }
  map<tagged>(tag: outer => tagged): Node<tagged> {
    return new TaggedNode(this, tag)
  }
}

class ElementNode<message> {
  localName: string
  namespaceURI: null | string
  attributes: Attributes = blank
  properties: Properties = blank
  style: StyleRules = blank
  listeners: Listeners<message> = blank
  classList: ClassList
  constructor(namespaceURI: null | string, localName: string) {
    this.namespaceURI = namespaceURI
    this.localName = localName
  }
  toDebugChildrenString(): string {
    return ""
  }
  toDebugString(): string {
    const { localName, namespaceURI } = this
    const attributes = []

    if (namespaceURI != null) {
      attributes.push(`xmlns="${namespaceURI}"`)
    }

    for (const key in this.attributes) {
      const attribute = this.attributes[key]
      if (attribute != null && attribute.value != null) {
        attributes.push(`"${attribute.name}"="${attribute.value}"`)
      }
    }

    const properties = []
    for (const key in this.properties) {
      const value = this.properties[key]
      if (value !== undefined) {
        properties.push(`\`property:${key}\`=\`${JSON.stringify(value)}\``)
      }
    }

    const rules = []
    for (const name in this.style) {
      if (name !== "settingType") {
        const value = this.style[name]
        if (value != null) {
          rules.push(`${cammelCaseToDashDelimeted(name)}:${value}`)
        }
      }
    }

    const style = rules.length === 0 ? "" : ` style="${rules.join(";")}"`

    const settings = [...attributes, ...properties].join(" ")
    const details = settings === "" ? style : ` ${settings}${style}`

    return `<${localName}${details}>${this.toDebugChildrenString()}</${
      localName
    }>`
  }
}

const cammelCaseToDashDelimeted = (input: string): string => {
  let output = ""
  for (let ch of input) {
    if (ch.toUpperCase() == ch) {
      output += `-${ch.toLowerCase()}`
    } else {
      output += ch
    }
  }
  return output
}

const setSettings = <message>(
  element: Element<message>,
  settings: Iterable<Setting<message>>
) => {
  for (const setting of settings) {
    setSetting(element, setting)
  }
}

const set = <t>(name: string, value: t, dict: Dict<t>): Dict<t> =>
  dict === blank
    ? Dictionary.singleton(name, value)
    : Dictionary.set(name, value, dict)

const setSetting = <message>(
  element: Element<message>,
  setting: Setting<message>
): Element<message> => {
  switch (setting.settingType) {
    case settingType.attribute: {
      const ns = setting.namespaceURI == null ? "" : `@${setting.namespaceURI}`
      element.attributes = set(
        `${setting.name}${ns}`,
        setting,
        element.attributes
      )
      return element
    }
    case settingType.property: {
      element.properties = set(setting.name, setting.value, element.properties)
      return element
    }
    case settingType.style: {
      element.style =
        element.style === blank
          ? Object.assign((Object.create(null): Object), setting)
          : Object.assign((element.style: Object), setting)
      return element
    }
    case settingType.listener: {
      const key = `${setting.type}${setting.capture ? "Capture" : ""}`
      element.listeners = set(key, setting, element.listeners)

      return element
    }
    default: {
      return unreachable(setting)
    }
  }
}

class UnindexedElementNode<message> extends ElementNode<message>
  implements UnindexedElement<message> {
  nodeType = nodeType.ELEMENT_NODE
  children: Array<Node<message>>
  toDebugChildrenString(): string {
    return this.children.map(child => child.toDebugString()).join("")
  }
  map<tagged>(tag: message => tagged): Node<tagged> {
    return new TaggedNode(this, tag)
  }
}

class IndexedElementNode<message> extends ElementNode<message>
  implements IndexedElement<message> {
  nodeType = nodeType.INDEXED_ELEMENT_NODE
  children: Array<Indexed<Node<message>>>

  toDebugChildString([key, child]: Indexed<Node<message>>): string {
    return `<element index='${key}'>${child.toDebugString()}</element>`
  }
  toDebugChildrenString(): string {
    return this.children.map(this.toDebugChildString).join("")
  }
  map<tagged>(tag: message => tagged): Node<tagged> {
    return new TaggedNode(this, tag)
  }
}

class ThunkNode<message, params: Array<mixed>>
  implements Thunk<message, params> {
  node: ?Node<message>
  args: params
  nodeType = nodeType.THUNK_NODE
  render: (...args: params) => Node<message>
  force(): Node<message> {
    if (this.node == null) {
      return (this.node = this.render(...this.args))
    } else {
      return this.node
    }
  }
  constructor(render: (...args: params) => Node<message>, args: params) {
    this.render = render
    this.args = args
  }
  toDebugString(): string {
    return this.force().toDebugString()
  }
  map<tagged>(tag: message => tagged): Node<tagged> {
    return new TaggedNode(this, tag)
  }
}

export const setAttribute = (name: string, value: ?string = ""): Attribute =>
  new AttributeSetting(null, name, value == null ? null : value)

export const setAttributeNS = (
  namespaceURI: string,
  name: string,
  value: ?string = ""
): Attribute =>
  new AttributeSetting(namespaceURI, name, value == null ? null : value)

export const property = (
  name: string,
  value?: string | number | boolean | null
): Property => new PropertySetting(name, value)

export const on = <message>(
  type: string,
  decoder: Decoder<?message>,
  capture: boolean = false
): Listener<message> => new ListenerSetting(type, capture, decoder)

export const style = (rules: StyleRules): Style => {
  const style: Style = (rules: Object)
  style.settingType = settingType.style
  return style
}

export const createTextNode = <message>(data: string): Text<message> =>
  new TextNode(data)

export const createComment = <message>(data: string): Comment<message> =>
  new CommentNode(data)

export const createElement = <message>(
  localName: string,
  settings: Iterable<Setting<message>> = empty,
  children: Node<message>[] = empty
): UnindexedElement<message> => {
  const element = new UnindexedElementNode(null, localName)
  setSettings(element, settings)
  element.children = children
  return element
}

export const createElementNS = <message>(
  namespaceURI: string,
  localName: string,
  settings: Iterable<Setting<message>> = empty,
  children: Node<message>[] = empty
): UnindexedElement<message> => {
  const element = new UnindexedElementNode(namespaceURI, localName)
  setSettings(element, settings)
  element.children = children
  return element
}

export const createIndexedElement = <message>(
  localName: string,
  settings: Iterable<Setting<message>> = empty,
  children: Indexed<Node<message>>[] = empty
): IndexedElement<message> => {
  const element = new IndexedElementNode(null, localName)
  setSettings(element, settings)
  element.children = children
  return element
}

export const createIndexedElementNS = <message>(
  namespaceURI: string,
  localName: string,
  settings: Iterable<Setting<message>> = empty,
  children: Indexed<Node<message>>[] = empty
): IndexedElement<message> => {
  const element = new IndexedElementNode(namespaceURI, localName)
  setSettings(element, settings)
  element.children = children
  return element
}

export const createThunk = <message, params: Array<mixed>>(
  view: (...params) => Node<message>,
  ...args: params
): Thunk<message> => new ThunkNode(view, args)

export const createHost = <message>(
  settings: Iterable<Setting<message>> = empty,
  children: Node<message>[] = empty
): Element<message> => createElement("x-host", settings, children)

export const mount = DOMPatch.archive
export { diff, patch }

export type {
  Text,
  Element,
  UnindexedElement,
  IndexedElement,
  Indexed,
  Thunk,
  Comment,
  Node,
  Style,
  StyleRules,
  Properties,
  Attributes,
  ClassList,
  Setting,
  Attribute,
  Property,
  Listener,
  Listeners
}
