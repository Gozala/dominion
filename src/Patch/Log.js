/* @flow */

import { error, ok } from "result.flow"
import type { Encoder, ChangeList, ChangeLog, Result } from "../Log"

const push = <a>(x: a, xs: a[]): a[] => (xs.push(x), xs)

class LogPatcher implements ChangeLog<string[]> {
  isError = false
  selectChildren(log: string[]): string[] {
    return push("selectChildren()", log)
  }
  selectSibling(log: string[], offset: number): string[] {
    return push(`selectSibling(${offset})`, log)
  }
  selectParent(log: string[]): string[] {
    return push(`selectParent()`, log)
  }
  removeNextSibling(log: string[]): string[] {
    return push(`removeNextSibling()`, log)
  }

  insertText(log: string[], data: string): string[] {
    return push(`insertText("${data}")`, log)
  }
  insertComment(log: string[], data: string): string[] {
    return push(`insertComment("${data}")`, log)
  }
  insertElement(log: string[], localName: string): string[] {
    return push(`insertElement("${localName}")`, log)
  }
  insertElementNS(
    log: string[],
    namespaceURI: string,
    localName: string
  ): string[] {
    return push(`insertElementNS("${namespaceURI}", "${localName}")`, log)
  }
  insertStashedNode(log: string[], address: number): string[] {
    return push(`insertStashedNode(${address})`, log)
  }

  replaceWithText(log: string[], data: string): string[] {
    return push(`replaceWithText("${data}")`, log)
  }
  replaceWithComment(log: string[], data: string): string[] {
    return push(`replaceWithComment("${data}")`, log)
  }
  replaceWithElement(log: string[], localName: string): string[] {
    return push(`replaceWithElement("${localName}")`, log)
  }
  replaceWithElementNS(
    log: string[],
    namespaceURI: string,
    localName: string
  ): string[] {
    return push(`replaceWithElementNS("${namespaceURI}", "${localName}")`, log)
  }
  replaceWithStashedNode(log: string[], address: number): string[] {
    return push(`replaceWithStashedNode(${address})`, log)
  }

  editTextData(
    log: string[],
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): string[] {
    return push(`editTextData(${start}, ${end}, "${prefix}", "${suffix}")`, log)
  }
  setTextData(log: string[], data: string): string[] {
    return push(`setTextData("${data}")`, log)
  }
  setAttribute(log: string[], name: string, value: string): string[] {
    return push(`setAttribute("${name}", "${value}")`, log)
  }
  removeAttribute(log: string[], name: string): string[] {
    return push(`removeAttribute("${name}")`, log)
  }
  setAttributeNS(
    log: string[],
    namespaceURI: string,
    name: string,
    value: string
  ): string[] {
    return push(`setAttributeNS("${namespaceURI}", "${name}", "${value}")`, log)
  }
  removeAttributeNS(
    log: string[],
    namespaceURI: string,
    name: string
  ): string[] {
    return push(`removeAttributeNS("${namespaceURI}", "${name}")`, log)
  }
  assignProperty(
    log: string[],
    name: string,
    value: string | number | boolean | null
  ): string[] {
    return push(`assignProperty("${name}", ${JSON.stringify(value)})`, log)
  }
  deleteProperty(log: string[], name: string): string[] {
    return push(`deleteProperty("${name}")`, log)
  }
  setStyleRule(log: string[], name: string, value: string): string[] {
    return push(`setStyleRule("${name}", "${value}")`, log)
  }
  removeStyleRule(log: string[], name: string): string[] {
    return push(`removeStyleRule("${name}")`, log)
  }

  stashNextSibling(log: string[], address: number): string[] {
    return push(`stashNextSibling(${address})`, log)
  }
  discardStashedNode(log: string[], address: number): string[] {
    return push(`discardStashedNode(${address})`, log)
  }
}

const log = new LogPatcher()
const encoder: Encoder<string[]> = (changeList: ChangeList): Result<string[]> =>
  changeList.reduce(log, [])

export default encoder
