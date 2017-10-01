/* @flow */

import { error, ok } from "result.flow"
import type { Encoder, ChangeList, ChangeLog, Result } from "../Log"

class LogPatcher implements ChangeLog<string[]> {
  isError = false
  log: string[]
  constructor(log: string[]) {
    this.log = log
  }
  selectChildren(): LogPatcher {
    this.log.push("selectChildren()")
    return this
  }
  selectSibling(offset: number): LogPatcher {
    this.log.push(`selectSibling(${offset})`)
    return this
  }
  selectParent(): LogPatcher {
    this.log.push(`selectParent()`)
    return this
  }
  removeNextSibling(): LogPatcher {
    this.log.push(`removeNextSibling()`)
    return this
  }

  insertText(data: string): LogPatcher {
    this.log.push(`insertText("${data}")`)
    return this
  }
  insertComment(data: string): LogPatcher {
    this.log.push(`insertComment("${data}")`)
    return this
  }
  insertElement(localName: string): LogPatcher {
    this.log.push(`insertElement("${localName}")`)
    return this
  }
  insertElementNS(namespaceURI: string, localName: string): LogPatcher {
    this.log.push(`insertElementNS("${namespaceURI}", "${localName}")`)
    return this
  }
  insertStashedNode(address: number): LogPatcher {
    this.log.push(`insertStashedNode(${address})`)
    return this
  }

  replaceWithText(data: string): LogPatcher {
    this.log.push(`replaceWithText("${data}")`)
    return this
  }
  replaceWithComment(data: string): LogPatcher {
    this.log.push(`replaceWithComment("${data}")`)
    return this
  }
  replaceWithElement(localName: string): LogPatcher {
    this.log.push(`replaceWithElement("${localName}")`)
    return this
  }
  replaceWithElementNS(namespaceURI: string, localName: string): LogPatcher {
    this.log.push(`replaceWithElementNS("${namespaceURI}", "${localName}")`)
    return this
  }
  replaceWithStashedNode(address: number): LogPatcher {
    this.log.push(`replaceWithStashedNode(${address})`)
    return this
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): LogPatcher {
    this.log.push(`editTextData(${start}, ${end}, "${prefix}", "${suffix}")`)
    return this
  }
  setTextData(data: string): LogPatcher {
    this.log.push(`setTextData("${data}")`)
    return this
  }
  setAttribute(name: string, value: string): LogPatcher {
    this.log.push(`setAttribute("${name}", "${value}")`)
    return this
  }
  removeAttribute(name: string): LogPatcher {
    this.log.push(`removeAttribute("${name}")`)
    return this
  }
  setAttributeNS(
    namespaceURI: string,
    name: string,
    value: string
  ): LogPatcher {
    this.log.push(`setAttributeNS("${namespaceURI}", "${name}", "${value}")`)
    return this
  }
  removeAttributeNS(namespaceURI: string, name: string): LogPatcher {
    this.log.push(`removeAttributeNS("${namespaceURI}", "${name}")`)
    return this
  }
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): LogPatcher {
    this.log.push(`assignProperty("${name}", ${JSON.stringify(value)})`)
    return this
  }
  deleteProperty(name: string): LogPatcher {
    this.log.push(`deleteProperty("${name}")`)
    return this
  }
  setStyleRule(name: string, value: string): LogPatcher {
    this.log.push(`setStyleRule("${name}", "${value}")`)
    return this
  }
  removeStyleRule(name: string): LogPatcher {
    this.log.push(`removeStyleRule("${name}")`)
    return this
  }

  stashNextSibling(address: number): LogPatcher {
    this.log.push(`stashNextSibling(${address})`)
    return this
  }
  discardStashedNode(address: number): LogPatcher {
    this.log.push(`discardStashedNode(${address})`)
    return this
  }
  toBuffer(): string[] {
    return this.log.splice(0)
  }
}

const log = new LogPatcher([])
const encoder: Encoder<string[]> = (
  changeList: ChangeList
): Result<string[]> => {
  const result = changeList(log)
  if (result.isError === true) {
    return error(result)
  } else {
    return ok(result.toBuffer())
  }
}

export default encoder
