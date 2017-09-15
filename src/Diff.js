/* @flow */

import type {
  Node,
  Text,
  Comment,
  Element,
  Thunk,
  Tagged,
  UnindexedElement,
  IndexedElement,
  Properties,
  Attributes,
  StyleRules
} from "./DOM/Node"
import type { Log } from "./Log"
import { nodeType } from "./DOM/Node"
import unreachable from "unreachable"

const empty = Object.freeze([])

export const diff = <a, x>(
  last: ?Node<a>,
  next: Node<a>,
  log: Log<x>
): Log<x> => diffNode(last, next, log)

export default diff

const insertText = <a, x>(node: Text<a>, log: Log<x>): Log<x> =>
  log.insertText(node.data)

const insertComment = <a, x>(node: Comment<a>, log: Log<x>): Log<x> =>
  log.insertComment(node.data)

const insertElement = <a, x>(
  { localName, namespaceURI, properties, attributes, style }: Element<a>,
  log: Log<x>
): Log<x> => {
  const v1 =
    namespaceURI == null
      ? log.insertElement(localName)
      : log.insertElementNS(namespaceURI, localName)
  const v2 = v1.selectSibling(1)
  const v3 = diffProperties(null, properties, v2)
  const v4 = diffAttributes(null, attributes, v3)
  const v5 = diffStyle(null, style, v4)
  return v5
}

const insertUnindexedElement = <a, x>(
  element: UnindexedElement<a>,
  log: Log<x>
): Log<x> => diffUnindexedChildren(null, element, insertElement(element, log))

const insertIndexedElement = <a, x>(
  element: IndexedElement<a>,
  log: Log<x>
): Log<x> => diffIndexedChildren(null, element, insertElement(element, log))

const insertThunk = <a, x>(thunk: Thunk<a>, log: Log<x>): Log<x> =>
  insertNode(thunk.force(), log)

const insertTagged = <inner, outer, x>(
  tagged: Tagged<outer, inner>,
  log: Log<x>
): Log<x> => insertNode(tagged.node, log)

const replaceWithText = <a, x>(node: Text<a>, log: Log<x>): Log<x> =>
  log.replaceWithText(node.data)

const replaceWithComment = <a, x>(node: Comment<a>, log: Log<x>): Log<x> =>
  log.replaceWithComment(node.data)

const replaceWithElement = <a, x>(node: Element<a>, log: Log<x>): Log<x> => {
  const { localName, namespaceURI } = node
  if (namespaceURI) {
    log = log.replaceWithElementNS(namespaceURI, localName)
  } else {
    log = log.replaceWithElement(localName)
  }
  // TODO: Apply settings
  return log
}

const replaceWithUnindexedElement = <a, x>(
  element: UnindexedElement<a>,
  log: Log<x>
): Log<x> =>
  diffUnindexedChildren(null, element, replaceWithElement(element, log))

const replaceWithIndexedElement = <a, x>(
  element: IndexedElement<a>,
  log: Log<x>
): Log<x> =>
  diffIndexedChildren(null, element, replaceWithElement(element, log))

const replaceWithThunk = <a, x>(thunk: Thunk<a>, log: Log<x>): Log<x> =>
  replaceWithNode(thunk.force(), log)

const replaceWithTagged = <a, x>(tagged: Tagged<a>, log: Log<x>): Log<x> =>
  replaceWithNode(tagged.node, log)

const replaceWithNode = <a, x>(node: Node<a>, log: Log<x>): Log<x> => {
  switch (node.nodeType) {
    case nodeType.TEXT_NODE: {
      return replaceWithText(node, log)
    }
    case nodeType.COMMENT_NODE: {
      return replaceWithComment(node, log)
    }
    case nodeType.ELEMENT_NODE: {
      return replaceWithUnindexedElement(node, log)
    }
    case nodeType.INDEXED_ELEMENT_NODE: {
      return replaceWithIndexedElement(node, log)
    }
    case nodeType.THUNK_NODE: {
      return replaceWithThunk(node, log)
    }
    case nodeType.TAGGED_ELEMENT_NODE: {
      return replaceWithTagged(node, log)
    }
    default: {
      return unreachable(node)
    }
  }
}

const insertNode = <a, x>(node: Node<a>, log: Log<x>): Log<x> => {
  switch (node.nodeType) {
    case nodeType.TEXT_NODE: {
      return log.insertText(node.data)
    }
    case nodeType.COMMENT_NODE: {
      return log.insertComment(node.data)
    }
    case nodeType.ELEMENT_NODE: {
      return insertUnindexedElement(node, log)
    }
    case nodeType.INDEXED_ELEMENT_NODE: {
      return insertIndexedElement(node, log)
    }
    case nodeType.THUNK_NODE: {
      return insertThunk(node, log)
    }
    case nodeType.TAGGED_ELEMENT_NODE: {
      return insertTagged(node, log)
    }
    default: {
      return unreachable(node)
    }
  }
}

const diffThunk = <a, x>(
  last: Thunk<a>,
  next: Thunk<a>,
  log: Log<x>
): Log<x> => {
  const { args: lastArgs, render: lastRender } = last
  const { args: nextArgs, render: nextRender } = next
  const equal =
    lastRender === nextRender &&
    lastArgs.length === nextArgs.length &&
    lastArgs[0] === nextArgs[0] &&
    lastArgs[1] === nextArgs[1] &&
    lastArgs[2] === nextArgs[2] &&
    lastArgs[3] === nextArgs[3] &&
    lastArgs[4] === nextArgs[4] &&
    lastArgs[5] === nextArgs[5] &&
    lastArgs[6] === nextArgs[6] &&
    lastArgs[7] === nextArgs[7] &&
    lastArgs[8] === nextArgs[8]

  if (equal) {
    next.node = last.node
    return log
  } else {
    return diffNode(last.force(), next.force(), log)
  }
}

const diffTagged = <message, tagged, x>(
  last: Tagged<message, tagged>,
  next: Tagged<message, tagged>,
  log: Log<x>
): Log<x> => {
  return diffNode(last.node, next.node, log)
}

const diffNode = <a, x>(last: ?Node<a>, next: Node<a>, log: Log<x>): Log<x> => {
  if (last == null) {
    return insertNode(next, log)
  } else {
    switch (next.nodeType) {
      case nodeType.TEXT_NODE: {
        if (last.nodeType === next.nodeType) {
          return diffText(last, next, log)
        } else {
          return replaceWithText(next, log)
        }
      }
      case nodeType.COMMENT_NODE: {
        if (last.nodeType === next.nodeType) {
          return diffComment(last, next, log)
        } else {
          return replaceWithComment(next, log)
        }
      }
      case nodeType.ELEMENT_NODE: {
        if (last.nodeType === next.nodeType) {
          return diffUnindexedElement(last, next, log)
        } else {
          return replaceWithElement(next, log)
        }
      }
      case nodeType.INDEXED_ELEMENT_NODE: {
        if (last.nodeType === next.nodeType) {
          return diffIndexedElement(last, next, log)
        } else {
          return replaceWithElement(next, log)
        }
      }
      case nodeType.THUNK_NODE: {
        if (last.nodeType === next.nodeType) {
          return diffThunk(last, next, log)
        } else {
          return replaceWithThunk(next, log)
        }
      }
      case nodeType.TAGGED_ELEMENT_NODE: {
        if (last.nodeType === next.nodeType) {
          return diffTagged(last, next, log)
        } else {
          return replaceWithTagged(next, log)
        }
      }
      default: {
        return unreachable(next)
      }
    }
  }
}

const diffText = <a, x>(last: ?Text<a>, next: Text<a>, log: Log<x>): Log<x> => {
  if (last == null) {
    return insertText(next, log)
  } else if (last.data === next.data) {
    return log
  } else {
    return diffTextData(last.data, next.data, log)
  }
}

const diffComment = <a, x>(
  last: ?Comment<a>,
  next: Comment<a>,
  log: Log<x>
): Log<x> => {
  if (last == null) {
    return insertComment(next, log)
  } else if (last.data === next.data) {
    return log
  } else {
    return diffTextData(last.data, next.data, log)
  }
}

const diffTextData = <x>(last: string, next: string, log: Log<x>): Log<x> => {
  const nextLength = next.length
  const lastLength = last.length
  if (nextLength <= 6) {
    return log.setTextData(next)
  } else if (lastLength > nextLength) {
    const index = last.indexOf(next)
    if (index === -1) {
      return log.setTextData(next)
    } else {
      return log.editTextData(index, lastLength - index - nextLength, "", "")
    }
  } else {
    const index = next.indexOf(last)
    if (index === -1) {
      return log.setTextData(next)
    } else {
      return log.editTextData(
        0,
        0,
        next.substr(0, index),
        next.substr(index + last.length)
      )
    }
  }
}

const diffUnindexedElement = <a, x>(
  last: ?UnindexedElement<a>,
  next: UnindexedElement<a>,
  log: Log<x>
): Log<x> => diffElement(last, next, diffUnindexedChildren, log)

const diffIndexedElement = <a, x>(
  last: ?IndexedElement<a>,
  next: IndexedElement<a>,
  log: Log<x>
): Log<x> => diffElement(last, next, diffIndexedChildren, log)

const diffElement = <a, element: Element<a>, x>(
  last: ?element,
  next: element,
  diffChildren: (element, element, Log<x>) => Log<x>,
  log: Log<x>
): Log<x> => {
  if (last == null) {
    return insertElement(next, log)
  } else if (
    last.localName !== next.localName ||
    last.namespaceURI !== next.namespaceURI
  ) {
    return replaceWithElement(next, log)
  } else {
    return diffChildren(last, next, diffSettings(last, next, log))
  }
}

const diffUnindexedChildren = <a, x>(
  lastElement: ?UnindexedElement<a>,
  nextElement: UnindexedElement<a>,
  log: Log<x>
): Log<x> => {
  const last = lastElement == null ? empty : lastElement.children
  const next = nextElement.children

  const lastCount = last.length
  const nextCount = next.length
  const count = lastCount > nextCount ? lastCount : nextCount
  // In nutshell select element.children so that element.selectSibling(1) will
  // select first child.
  log = log.selectChildren()

  let index = 0
  while (index < count) {
    const lastChild = last[index]
    const nextChild = next[index]

    // If last and next versions contain a child for the given index, just
    // diff them and move on.
    if (lastChild != null && nextChild != null) {
      log = diffNode(lastChild, nextChild, log.selectSibling(1))
      index += 1
      // If child is present in next version but not in the last version
      // insert it and select it.
    } else if (nextChild != null) {
      log = insertNode(nextChild, log).selectSibling(1)
      index += 1
      // If child is present in last version but isn't present in new version
      // remove child
    } else if (lastChild != null) {
      log = log.removeNextSibling()
      index += 1
    }
  }

  return log.selectParent()
}

const diffIndexedChildren = <a, x>(
  lastElement: ?IndexedElement<a>,
  nextElement: IndexedElement<a>,
  log: Log<x>
): Log<x> => {
  const last = lastElement == null ? empty : lastElement.children
  const next = nextElement.children
  const migrants: { [string]: [number, Node<a>] } = Object.create(null)
  const lastCount = last.length
  const nextCount = next.length
  let lastIndex = 0
  let nextIndex = 0

  log = log.selectChildren()

  while (lastIndex < lastCount) {
    const lastIndexed = last[lastIndex]
    const nextIndexed = next[nextIndex]

    // If child is present in last and next version and has same index select it
    // and diff.
    if (
      lastIndexed != null &&
      nextIndexed != null &&
      lastIndexed[0] === nextIndexed[0]
    ) {
      const [lastKey, lastNode] = last[lastIndex]
      const [nextKey, nextNode] = next[nextIndex]
      log = diffNode(lastNode, nextNode, log.selectSibling(1))

      lastIndex += 1
      nextIndex += 1

      // Otherwise child in last version (we know it's present since
      // lastIndex < lastCount) but child in new version isn't or has a different
      // index. In which case we move child from a tree into a register.
    } else {
      const [lastKey, lastNode] = last[lastIndex]

      log = log.stashNextSibling()

      migrants[lastKey] = [log.address, lastNode]
      lastIndex += 1
    }
  }

  // At this point no more children left in last version, so we will just add
  // children from next version if there are some left.
  while (nextIndex < nextCount) {
    const [key, node] = next[nextIndex]
    const registered = migrants[key]
    // If child is in migrants dict it means it was reordered, in that case we
    // insert it back into the tree and diff against next version and move on.
    if (registered) {
      const [address, last] = registered
      log = log.insertStashedNode(address).selectSibling(1)
      log = diffNode(last, node, log)

      delete migrants[key]
      nextIndex += 1

      // otherwise we just add nodes from the next version.
    } else {
      log = insertNode(node, log).selectSibling(1)
      nextIndex += 1
    }
  }

  // Finally remove things from the register. It would be nice if we could avoid
  // optimize following operations:
  // `StashNextSibling(17) -> ... -> DiscardStashedNode(17)`
  // to:
  // `Remove -> ...`
  // if `...` contains no `InsertStashedNode(17)` but trouble with that is that
  // we'd have to queue up everything up until we reach this point and then
  // move stuff from queue while optimizing it. This would add ton of complexity
  // and it's unclear if optimization will matter in practice, so for now we
  // keep it simple.
  for (let key in migrants) {
    const [address] = migrants[key]
    log = log.discardStashedNode(address)
  }

  return log.selectParent()
}

const diffSettings = <a, x>(
  last: Element<a>,
  next: Element<a>,
  log: Log<x>
): Log<x> => {
  const v1 = log
  const v2 = diffProperties(last.properties, next.properties, v1)
  const v3 = diffAttributes(last.attributes, next.attributes, v2)
  const v4 = diffStyle(last.style, next.style, v3)
  return v4
}

const diffProperties = <x>(
  last: ?Properties,
  next: ?Properties,
  log: Log<x>
): Log<x> => {
  if (last != null) {
    for (let name in last) {
      if (next == null || !(name in last)) {
        log = log.deleteProperty(name)
      }
    }
  }

  if (next != null) {
    for (let name in next) {
      const value = next[name]
      if (last == null || last[name] !== value) {
        if (value === undefined) {
          log = log.deleteProperty(name)
        } else {
          log = log.assignProperty(name, value)
        }
      }
    }
  }

  return log
}

const diffAttributes = <x>(
  last: ?Attributes,
  next: ?Attributes,
  log: Log<x>
): Log<x> => {
  if (last != null) {
    for (let key in last) {
      if (next == null || !(key in next)) {
        const attribute = last[key]
        if (attribute != null) {
          const { name, namespaceURI } = attribute
          if (namespaceURI == null) {
            log = log.removeAttribute(name)
          } else {
            log = log.removeAttributeNS(namespaceURI, name)
          }
        }
      }
    }
  }

  if (next != null) {
    for (let key in next) {
      const attribute = next[key]
      if (attribute != null) {
        const { namespaceURI, name, value } = attribute
        const x = last == null ? null : last[key]
        if (x == null || x.value !== value) {
          if (namespaceURI == null) {
            if (value == null) {
              log = log.removeAttribute(name)
            } else {
              log = log.setAttribute(name, value)
            }
          } else {
            if (value == null) {
              log = log.removeAttributeNS(namespaceURI, name)
            } else {
              log = log.setAttributeNS(namespaceURI, name, value)
            }
          }
        }
      }
    }
  }

  return log
}

const diffStyle = <x>(
  last: ?StyleRules,
  next: ?StyleRules,
  log: Log<x>
): Log<x> => {
  let styles = null

  if (last) {
    for (let name in last) {
      if (next == null || !(name in next)) {
        log = log.removeStyleRule(name)
      }
    }
  }

  if (next != null) {
    for (let name in next) {
      const value = next[name]
      if (last == null || last[name] !== value) {
        if (value == null) {
          log = log.removeStyleRule(name)
        } else {
          log = log.setStyleRule(name, value)
        }
      }
    }
  }

  return log
}
