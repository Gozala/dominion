/* @flow */

import { error, ok } from "result.flow"
import type { Encode, Encoder, ChangeList, Result } from "../Log"

const push = <a>(x: a, xs: a[]): a[] => (xs.push(x), xs)

export default class LogEncoder {
  static selectChildren(log: string[]): string[] {
    return push("selectChildren()", log)
  }
  static selectSibling(log: string[], offset: number): string[] {
    return push(`selectSibling(${offset})`, log)
  }
  static selectParent(log: string[]): string[] {
    return push(`selectParent()`, log)
  }
  static removeNextSibling(log: string[]): string[] {
    return push(`removeNextSibling()`, log)
  }

  static insertText(log: string[], data: string): string[] {
    return push(`insertText("${data}")`, log)
  }
  static insertComment(log: string[], data: string): string[] {
    return push(`insertComment("${data}")`, log)
  }
  static insertElement(log: string[], localName: string): string[] {
    return push(`insertElement("${localName}")`, log)
  }
  static insertElementNS(
    log: string[],
    namespaceURI: string,
    localName: string
  ): string[] {
    return push(`insertElementNS("${namespaceURI}", "${localName}")`, log)
  }
  static insertStashedNode(log: string[], address: number): string[] {
    return push(`insertStashedNode(${address})`, log)
  }

  static replaceWithText(log: string[], data: string): string[] {
    return push(`replaceWithText("${data}")`, log)
  }
  static replaceWithComment(log: string[], data: string): string[] {
    return push(`replaceWithComment("${data}")`, log)
  }
  static replaceWithElement(log: string[], localName: string): string[] {
    return push(`replaceWithElement("${localName}")`, log)
  }
  static replaceWithElementNS(
    log: string[],
    namespaceURI: string,
    localName: string
  ): string[] {
    return push(`replaceWithElementNS("${namespaceURI}", "${localName}")`, log)
  }
  static replaceWithStashedNode(log: string[], address: number): string[] {
    return push(`replaceWithStashedNode(${address})`, log)
  }

  static editTextData(
    log: string[],
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): string[] {
    return push(`editTextData(${start}, ${end}, "${prefix}", "${suffix}")`, log)
  }
  static setTextData(log: string[], data: string): string[] {
    return push(`setTextData("${data}")`, log)
  }
  static setAttribute(log: string[], name: string, value: string): string[] {
    return push(`setAttribute("${name}", "${value}")`, log)
  }
  static removeAttribute(log: string[], name: string): string[] {
    return push(`removeAttribute("${name}")`, log)
  }
  static setAttributeNS(
    log: string[],
    namespaceURI: string,
    name: string,
    value: string
  ): string[] {
    return push(`setAttributeNS("${namespaceURI}", "${name}", "${value}")`, log)
  }
  static removeAttributeNS(
    log: string[],
    namespaceURI: string,
    name: string
  ): string[] {
    return push(`removeAttributeNS("${namespaceURI}", "${name}")`, log)
  }
  static assignProperty(
    log: string[],
    name: string,
    value: string | number | boolean | null
  ): string[] {
    return push(`assignProperty("${name}", ${JSON.stringify(value)})`, log)
  }
  static deleteProperty(log: string[], name: string): string[] {
    return push(`deleteProperty("${name}")`, log)
  }
  static setStyleRule(log: string[], name: string, value: string): string[] {
    return push(`setStyleRule("${name}", "${value}")`, log)
  }
  static removeStyleRule(log: string[], name: string): string[] {
    return push(`removeStyleRule("${name}")`, log)
  }

  static stashNextSibling(log: string[], address: number): string[] {
    return push(`stashNextSibling(${address})`, log)
  }
  static discardStashedNode(log: string[], address: number): string[] {
    return push(`discardStashedNode(${address})`, log)
  }
  static shiftSiblings(log: string[], count: number): string[] {
    return push(`shiftSiblings(${count})`, log)
  }

  static encode(changeList: ChangeList): Result<string[]> {
    return changeList.encode(LogEncoder, [])
  }
}
