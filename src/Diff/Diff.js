/* @flow */

import type { Encoder } from "../Log"
type Nav = [-1 | 0 | 1, number]

export default class Diff<x> {
  isError = false
  buffer: x
  changeLog: Encoder<x>
  navigationLog: Nav[]
  address: number
  constructor(
    buffer: x,
    changeLog: Encoder<x>,
    address: number,
    navigationLog: Nav[]
  ) {
    Diff.reset(this, buffer, changeLog, address, navigationLog)
  }
  static reset(
    diff: Diff<x>,
    buffer: x,
    changeLog: Encoder<x>,
    address: number,
    navigationLog: Nav[]
  ): Diff<x> {
    diff.buffer = buffer
    diff.changeLog = changeLog
    diff.address = address
    diff.navigationLog = navigationLog
    return diff
  }
  static updateAddress(diff: Diff<x>, address: number): Diff<x> {
    return Diff.reset(
      diff,
      diff.buffer,
      diff.changeLog,
      address,
      diff.navigationLog
    )
  }
  static updateNavigationLog(diff: Diff<x>, navigationLog: Nav[]): Diff<x> {
    return Diff.reset(
      diff,
      diff.buffer,
      diff.changeLog,
      diff.address,
      navigationLog
    )
  }

  static update(diff: Diff<x>, buffer: x): Diff<x> {
    return Diff.reset(
      diff,
      buffer,
      diff.changeLog,
      diff.address,
      diff.navigationLog
    )
  }
  static navigate(diff: Diff<x>): Diff<x> {
    const { navigationLog, changeLog } = diff
    let { buffer } = diff

    while (navigationLog.length > 0) {
      let [level, index] = navigationLog.pop()

      if (level < 0) {
        buffer = changeLog.selectParent(buffer)
      }

      if (level > 0) {
        buffer = changeLog.selectChildren(buffer)
      }

      if (index !== 0) {
        buffer = changeLog.selectSibling(buffer, index)
      }
    }

    return Diff.update(diff, buffer)
  }

  static selectChildren(diff: Diff<x>): Diff<x> {
    const { navigationLog } = diff
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog[0]
    switch (level) {
      case -1: {
        if (index === 0) {
          navigationLog.shift()
        }
        navigationLog.unshift([1, 0])
        break
      }
      case 0: {
        navigationLog.unshift([1, 0])
        break
      }
      default: {
        navigationLog.unshift([1, 0])
        break
      }
    }
    return Diff.updateNavigationLog(diff, navigationLog)
  }
  static selectSibling(diff: Diff<x>, offset: number): Diff<x> {
    const { navigationLog } = diff
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog.shift()
    navigationLog.unshift([level, index + offset])

    return Diff.updateNavigationLog(diff, navigationLog)
  }
  static selectParent(diff: Diff<x>): Diff<x> {
    const { navigationLog } = diff
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog[0]
    switch (level) {
      case -1: {
        navigationLog.unshift([-1, 0])
        break
      }
      case 0: {
        navigationLog.shift()
        break
      }
      default: {
        navigationLog.shift()
        break
      }
    }

    return Diff.updateNavigationLog(diff, navigationLog)
  }
  static removeNextSibling(diff: Diff<x>): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.removeNextSibling(buffer))
  }

  static insertText(diff: Diff<x>, data: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.insertText(buffer, data))
  }
  static insertComment(diff: Diff<x>, data: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.insertComment(buffer, data))
  }
  static insertElement(diff: Diff<x>, localName: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.insertElement(buffer, localName))
  }
  static insertElementNS(
    diff: Diff<x>,
    namespaceURI: string,
    localName: string
  ): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(
      diff,
      changeLog.insertElementNS(buffer, namespaceURI, localName)
    )
  }
  static insertStashedNode(diff: Diff<x>, address: number): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.insertStashedNode(buffer, address))
  }

  static replaceWithText(diff: Diff<x>, data: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.replaceWithText(buffer, data))
  }
  static replaceWithComment(diff: Diff<x>, data: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.replaceWithComment(buffer, data))
  }
  static replaceWithElement(diff: Diff<x>, localName: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.replaceWithElement(buffer, localName))
  }
  static replaceWithElementNS(
    diff: Diff<x>,
    namespaceURI: string,
    localName: string
  ): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(
      diff,
      changeLog.replaceWithElementNS(buffer, namespaceURI, localName)
    )
  }
  static replaceWithStashedNode(diff: Diff<x>, address: number): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.replaceWithStashedNode(buffer, address))
  }

  static editTextData(
    diff: Diff<x>,
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(
      diff,
      changeLog.editTextData(buffer, start, end, prefix, suffix)
    )
  }
  static setTextData(diff: Diff<x>, data: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.setTextData(buffer, data))
  }
  static setAttribute(diff: Diff<x>, name: string, value: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.setAttribute(buffer, name, value))
  }
  static removeAttribute(diff: Diff<x>, name: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.removeAttribute(buffer, name))
  }
  static setAttributeNS(
    diff: Diff<x>,
    namespaceURI: string,
    name: string,
    value: string
  ): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(
      diff,
      changeLog.setAttributeNS(buffer, namespaceURI, name, value)
    )
  }
  static removeAttributeNS(
    diff: Diff<x>,
    namespaceURI: string,
    name: string
  ): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(
      diff,
      changeLog.removeAttributeNS(buffer, namespaceURI, name)
    )
  }
  static assignProperty(
    diff: Diff<x>,
    name: string,
    value: string | number | boolean | null
  ): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.assignProperty(buffer, name, value))
  }
  static deleteProperty(diff: Diff<x>, name: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.deleteProperty(buffer, name))
  }
  static setStyleRule(diff: Diff<x>, name: string, value: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.setStyleRule(buffer, name, value))
  }
  static removeStyleRule(diff: Diff<x>, name: string): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.removeStyleRule(buffer, name))
  }

  static stashNextSibling(diff: Diff<x>, address: number): Diff<x> {
    const next = Diff.navigate(Diff.updateAddress(diff, address + 1))
    return Diff.update(
      next,
      next.changeLog.stashNextSibling(next.buffer, address)
    )
  }
  static discardStashedNode(diff: Diff<x>, address: number): Diff<x> {
    const { changeLog, buffer } = Diff.navigate(diff)
    return Diff.update(diff, changeLog.discardStashedNode(buffer, address))
  }
}
