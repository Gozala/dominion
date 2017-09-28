/* @flow */

import type { Encoder } from "../Log"

class LogPatcher<target> implements Encoder<target> {
  log: string[]
  host: target
  constructor(host: target) {
    this.host = host
    this.log = []
  }
  selectChildren(): LogPatcher<target> {
    this.log.push("selectChildren()")
    return this
  }
  selectSibling(offset: number): LogPatcher<target> {
    this.log.push(`selectSibling(${offset})`)
    return this
  }
  selectParent(): LogPatcher<target> {
    this.log.push(`selectParent()`)
    return this
  }
  removeNextSibling(): LogPatcher<target> {
    this.log.push(`removeNextSibling()`)
    return this
  }

  insertText(data: string): LogPatcher<target> {
    this.log.push(`insertText("${data}")`)
    return this
  }
  insertComment(data: string): LogPatcher<target> {
    this.log.push(`insertComment("${data}")`)
    return this
  }
  insertElement(localName: string): LogPatcher<target> {
    this.log.push(`insertElement("${localName}")`)
    return this
  }
  insertElementNS(namespaceURI: string, localName: string): LogPatcher<target> {
    this.log.push(`insertElementNS("${namespaceURI}", "${localName}")`)
    return this
  }
  insertStashedNode(address: number): LogPatcher<target> {
    this.log.push(`insertStashedNode(${address})`)
    return this
  }

  replaceWithText(data: string): LogPatcher<target> {
    this.log.push(`replaceWithText("${data}")`)
    return this
  }
  replaceWithComment(data: string): LogPatcher<target> {
    this.log.push(`replaceWithComment("${data}")`)
    return this
  }
  replaceWithElement(localName: string): LogPatcher<target> {
    this.log.push(`replaceWithElement("${localName}")`)
    return this
  }
  replaceWithElementNS(
    namespaceURI: string,
    localName: string
  ): LogPatcher<target> {
    this.log.push(`replaceWithElementNS("${namespaceURI}", "${localName}")`)
    return this
  }
  replaceWithStashedNode(address: number): LogPatcher<target> {
    this.log.push(`replaceWithStashedNode(${address})`)
    return this
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): LogPatcher<target> {
    this.log.push(`editTextData(${start}, ${end}, "${prefix}", "${suffix}")`)
    return this
  }
  setTextData(data: string): LogPatcher<target> {
    this.log.push(`setTextData("${data}")`)
    return this
  }
  setAttribute(name: string, value: string): LogPatcher<target> {
    this.log.push(`setAttribute("${name}", "${value}")`)
    return this
  }
  removeAttribute(name: string): LogPatcher<target> {
    this.log.push(`removeAttribute("${name}")`)
    return this
  }
  setAttributeNS(
    namespaceURI: string,
    name: string,
    value: string
  ): LogPatcher<target> {
    this.log.push(`setAttributeNS("${namespaceURI}", "${name}", "${value}")`)
    return this
  }
  removeAttributeNS(namespaceURI: string, name: string): LogPatcher<target> {
    this.log.push(`removeAttributeNS("${namespaceURI}", "${name}")`)
    return this
  }
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): LogPatcher<target> {
    this.log.push(`assignProperty("${name}", ${JSON.stringify(value)})`)
    return this
  }
  deleteProperty(name: string): LogPatcher<target> {
    this.log.push(`deleteProperty("${name}")`)
    return this
  }
  setStyleRule(name: string, value: string): LogPatcher<target> {
    this.log.push(`setStyleRule("${name}", "${value}")`)
    return this
  }
  removeStyleRule(name: string): LogPatcher<target> {
    this.log.push(`removeStyleRule("${name}")`)
    return this
  }

  stashNextSibling(address: number): LogPatcher<target> {
    this.log.push(`stashNextSibling(${address})`)
    return this
  }
  discardStashedNode(address: number): LogPatcher<target> {
    this.log.push(`discardStashedNode(${address})`)
    return this
  }
  encode(): target {
    return this.host
  }
}

export const patcher = <target>(host: target): LogPatcher<target> =>
  new LogPatcher(host)
