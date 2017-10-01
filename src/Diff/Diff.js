/* @flow */

import type { ChangeLog } from "../Log"

type Nav = [-1 | 0 | 1, number]

export default class Diff<x> implements ChangeLog<x> {
  isError = false
  changeLog: ChangeLog<x>
  navigationLog: Nav[]
  address: number
  constructor(changeLog: ChangeLog<x>, address: number, navigationLog: Nav[]) {
    this.reset(changeLog, address, navigationLog)
  }
  reset(
    changeLog: ChangeLog<x>,
    address: number,
    navigationLog: Nav[]
  ): Diff<x> {
    this.changeLog = changeLog
    this.address = address
    this.navigationLog = navigationLog
    return this
  }
  updateAddress(address: number): Diff<x> {
    return this.reset(this.changeLog, address, this.navigationLog)
  }
  updateNavigationLog(navigationLog: Nav[]): Diff<x> {
    return this.reset(this.changeLog, this.address, navigationLog)
  }

  update(changeLog: ChangeLog<x>): Diff<x> {
    return this.reset(changeLog, this.address, this.navigationLog)
  }
  navigate(): Diff<x> {
    const { navigationLog, changeLog } = this

    while (navigationLog.length > 0) {
      let [level, index] = navigationLog.pop()

      if (level < 0) {
        this.changeLog = changeLog.selectParent()
      }

      if (level > 0) {
        this.changeLog = changeLog.selectChildren()
      }

      if (index !== 0) {
        this.changeLog = changeLog.selectSibling(index)
      }
    }

    return this
  }

  selectChildren(): Diff<x> {
    const { navigationLog, changeLog } = this
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
    return this.updateNavigationLog(navigationLog)
  }
  selectSibling(offset: number): Diff<x> {
    const { navigationLog, changeLog } = this
    const [level, index] =
      navigationLog.length === 0 ? [0, 0] : navigationLog.shift()
    navigationLog.unshift([level, index + offset])

    return this.updateNavigationLog(navigationLog)
  }
  selectParent(): Diff<x> {
    const { navigationLog } = this
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

    return this.updateNavigationLog(navigationLog)
  }
  removeNextSibling(): Diff<x> {
    return this.update(this.navigate().changeLog.removeNextSibling())
  }

  insertText(data: string): Diff<x> {
    return this.update(this.navigate().changeLog.insertText(data))
  }
  insertComment(data: string): Diff<x> {
    return this.update(this.navigate().changeLog.insertComment(data))
  }
  insertElement(localName: string): Diff<x> {
    return this.update(this.navigate().changeLog.insertElement(localName))
  }
  insertElementNS(namespaceURI: string, localName: string): Diff<x> {
    return this.update(
      this.navigate().changeLog.insertElementNS(namespaceURI, localName)
    )
  }
  insertStashedNode(address: number): Diff<x> {
    return this.update(this.navigate().changeLog.insertStashedNode(address))
  }

  replaceWithText(data: string): Diff<x> {
    return this.update(this.navigate().changeLog.replaceWithText(data))
  }
  replaceWithComment(data: string): Diff<x> {
    return this.update(this.navigate().changeLog.replaceWithComment(data))
  }
  replaceWithElement(localName: string): Diff<x> {
    return this.update(this.navigate().changeLog.replaceWithElement(localName))
  }
  replaceWithElementNS(namespaceURI: string, localName: string): Diff<x> {
    return this.update(
      this.navigate().changeLog.replaceWithElementNS(namespaceURI, localName)
    )
  }
  replaceWithStashedNode(address: number): Diff<x> {
    return this.update(
      this.navigate().changeLog.replaceWithStashedNode(address)
    )
  }

  editTextData(
    start: number,
    end: number,
    prefix: string,
    suffix: string
  ): Diff<x> {
    return this.update(
      this.navigate().changeLog.editTextData(start, end, prefix, suffix)
    )
  }
  setTextData(data: string): Diff<x> {
    return this.update(this.navigate().changeLog.setTextData(data))
  }
  setAttribute(name: string, value: string): Diff<x> {
    return this.update(this.navigate().changeLog.setAttribute(name, value))
  }
  removeAttribute(name: string): Diff<x> {
    return this.update(this.navigate().changeLog.removeAttribute(name))
  }
  setAttributeNS(namespaceURI: string, name: string, value: string): Diff<x> {
    return this.update(
      this.navigate().changeLog.setAttributeNS(namespaceURI, name, value)
    )
  }
  removeAttributeNS(namespaceURI: string, name: string): Diff<x> {
    return this.update(
      this.navigate().changeLog.removeAttributeNS(namespaceURI, name)
    )
  }
  assignProperty(
    name: string,
    value: string | number | boolean | null
  ): Diff<x> {
    return this.update(this.navigate().changeLog.assignProperty(name, value))
  }
  deleteProperty(name: string): Diff<x> {
    return this.update(this.navigate().changeLog.deleteProperty(name))
  }
  setStyleRule(name: string, value: string): Diff<x> {
    return this.update(this.navigate().changeLog.setStyleRule(name, value))
  }
  removeStyleRule(name: string): Diff<x> {
    return this.update(this.navigate().changeLog.removeStyleRule(name))
  }

  stashNextSibling(address: number): Diff<x> {
    return this.updateAddress(address + 1).update(
      this.navigate().changeLog.stashNextSibling(address)
    )
  }
  discardStashedNode(address: number): Diff<x> {
    return this.update(this.navigate().changeLog.discardStashedNode(address))
  }
  toBuffer(): x {
    return this.changeLog.toBuffer()
  }
}
