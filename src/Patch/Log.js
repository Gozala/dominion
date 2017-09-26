/* @flow */

import type { Log } from "../Log"

class LogPatcher implements Log {
  log: Array<string>
  constructor() {
    this.log = []
  }
  selectChildren(): self {
    this.log.push("selectChildren()")
    return this
  }
  selectSibling(offset: number): self {
    this.log.push(`selectSibling(${offset})`)
    return this
  }
  selectParent(): self {
    this.log.push(`selectParent()`)
    return this
  }
  removeNextSibling(): self {
    this.log.push(`removeNextSibling()`)
    return this
  }

  insertText(data: string): self {
    this.log.push(`insertText("${data}")`)
    return this
  }
  insertComment(data: string): self {
    this.log.push(`insertComment("${data}")`)
    return this
  }
  insertElement(localName: string): self {
    this.log.push(`insertElement("${localName}")`)
    return this
  }
  insertElementNS(namespaceURI: string, localName: string): self {
    this.log.push(`insertElementNS("${namespaceURI}", "${localName}")`)
    return this
  }
  insertStashedNode(address: number): self {
    this.log.push(`insertStashedNode(${address})`)
    return this
  }

  replaceWithText(data: string): self {
    this.log.push(`replaceWithText("${data}")`)
    return this
  }
  replaceWithComment(data: string): self {
    this.log.push(`replaceWithComment("${data}")`)
    return this
  }
  replaceWithElement(localName: string): self {
    this.log.push(`replaceWithElement("${localName}")`)
    return this
  }
  replaceWithElementNS(namespaceURI: string, localName: string): self {
    this.log.push(`replaceWithElementNS("${namespaceURI}", "${localName}")`)
    return this
  }
  replaceWithStashedNode(address: number): self {
    this.log.push(`replaceWithStashedNode(${address})`)
    return this
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): self {
    this.log.push(`editTextData(${start}, ${end}, "${prefix}", "${suffix}")`)
    return this
  }
  setTextData(data: string): self {
    this.log.push(`setTextData("${data}")`)
    return this
  }
  setAttribute(name: string, value: string): self {
    this.log.push(`setAttribute("${name}", "${value}")`)
    return this
  }
  removeAttribute(name: string): self {
    this.log.push(`removeAttribute("${name}")`)
    return this
  }
  setAttributeNS(namespaceURI: string, name: string, value: string): self {
    this.log.push(`setAttributeNS("${namespaceURI}", "${name}", "${value}")`)
    return this
  }
  removeAttributeNS(namespaceURI: string, name: string): self {
    this.log.push(`removeAttributeNS("${namespaceURI}", "${name}")`)
    return this
  }
  assignProperty(name: string, value: string | number | boolean | null): self {
    this.log.push(`assignProperty("${name}", ${JSON.stringify(value)})`)
    return this
  }
  deleteProperty(name: string): self {
    this.log.push(`deleteProperty("${name}")`)
    return this
  }
  setStyleRule(name: string, value: string) {
    this.log.push(`setStyleRule("${name}", "${value}")`)
    return this
  }
  removeStyleRule(name: string) {
    this.log.push(`removeStyleRule("${name}")`)
    return this
  }

  stashNextSibling(address: number): self {
    this.log.push(`stashNextSibling(${address})`)
    return this
  }
  discardStashedNode(address: number): self {
    this.log.push(`discardStashedNode(${address})`)
    return this
  }
}

export const patcher = (): LogPatcher => new LogPatcher()
