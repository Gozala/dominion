/* @flow */

import type {
  Node,
  Text,
  Comment,
  Element,
  Thunk,
  Tagged,
  Indexed,
  UnindexedElement,
  IndexedElement,
  IndexedNodeList,
  UnindexedNodeList,
  IndexedChildren,
  UnindexedChildren,
  Properties,
  Attributes,
  StyleRules
} from "./DOM/Node"
import type { Encoder } from "./Log"
import { nodeType } from "./DOM/Node"
import unreachable from "unreachable"

const empty = Object.freeze([])
const blank: Object = Object.freeze(Object.create(null))

export const diff = <a, x>(
  last: Node<a>,
  next: Node<a>,
  log: Encoder<x>
): Encoder<x> => diffNode(last, next, log)

export default diff

const insertText = <a, x>(node: Text<a>, log: Encoder<x>): Encoder<x> =>
  log.insertText(node.data)

const insertComment = <a, x>(node: Comment<a>, log: Encoder<x>): Encoder<x> =>
  log.insertComment(node.data)

const insertElementNode = <a, x>(
  node: Element<a>,
  log: Encoder<x>
): Encoder<x> => {
  const { localName, namespaceURI } = node
  const out =
    namespaceURI == null
      ? log.insertElement(localName)
      : log.insertElementNS(namespaceURI, localName)
  return out
}

const insertIndexedElement = <a, x>(
  node: IndexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  populateIndexedElement(
    node,
    setSettings(node, insertElementNode(node, log).selectSibling(1))
  ).selectSibling(-1)

const insertUnindexedElement = <a, x>(
  node: UnindexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  populateUnindexedElement(
    node,
    setSettings(node, insertElementNode(node, log).selectSibling(1))
  ).selectSibling(-1)

const populateIndexedElement = <a, x>(
  node: IndexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  insertIndexedChildren(node.children, log.selectChildren()).selectParent()

const populateUnindexedElement = <a, x>(
  node: UnindexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  insertUnindexedChildren(node.children, log.selectChildren()).selectParent()

const insertIndexedNodeList = <a, x>(
  nodeList: IndexedNodeList<a>,
  log: Encoder<x>
): Encoder<x> => insertIndexedChildren(nodeList.children, log)

const insertUnindexedNodeList = <a, x>(
  nodeList: UnindexedNodeList<a>,
  log: Encoder<x>
): Encoder<x> => insertUnindexedChildren(nodeList.children, log)

const insertIndexedChildren = <a, x>(
  children: IndexedChildren<a>,
  log: Encoder<x>
): Encoder<x> => diffIndexedChildren([], children, log)

const insertUnindexedChildren = <a, x>(
  children: UnindexedChildren<a>,
  log: Encoder<x>
): Encoder<x> => diffUnindexedChildren([], children, log)

const insertThunk = <a, x>(thunk: Thunk<a>, log: Encoder<x>): Encoder<x> =>
  insertNode(thunk.force(), log)

const insertTagged = <inner, outer, x>(
  tagged: Tagged<outer, inner>,
  log: Encoder<x>
): Encoder<x> => insertNode(tagged.node, log)

const replaceWithText = <a, x>(node: Text<a>, log: Encoder<x>): Encoder<x> =>
  log.replaceWithText(node.data)

const replaceWithComment = <a, x>(
  node: Comment<a>,
  log: Encoder<x>
): Encoder<x> => log.replaceWithComment(node.data)

const replaceWithElementNode = <a, x>(
  node: Element<a>,
  log: Encoder<x>
): Encoder<x> => {
  const { localName, namespaceURI } = node
  const out =
    namespaceURI == null
      ? log.replaceWithElement(localName)
      : log.replaceWithElementNS(namespaceURI, localName)
  return out
}

const replaceWithUnindexedElement = <a, x>(
  node: UnindexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  populateUnindexedElement(
    node,
    setSettings(node, replaceWithElementNode(node, log))
  )

const replaceWithIndexedElement = <a, x>(
  node: IndexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  populateIndexedElement(
    node,
    setSettings(node, replaceWithElementNode(node, log))
  )

const replaceWithThunk = <a, x>(thunk: Thunk<a>, log: Encoder<x>): Encoder<x> =>
  replaceWithNode(thunk.force(), log)

const replaceWithTagged = <a, x>(
  tagged: Tagged<a>,
  log: Encoder<x>
): Encoder<x> => replaceWithNode(tagged.node, log)

const replaceWithIndexedNodeList = <a, x>(
  nodeList: IndexedNodeList<a>,
  log: Encoder<x>
): Encoder<x> =>
  insertIndexedNodeList(nodeList, log.selectSibling(-1).removeNextSibling())

const replaceWithUnindexedNodeList = <a, x>(
  nodeList: UnindexedNodeList<a>,
  log: Encoder<x>
): Encoder<x> =>
  insertUnindexedNodeList(nodeList, log.selectSibling(-1).removeNextSibling())

const replaceWithNode = <a, x>(node: Node<a>, log: Encoder<x>): Encoder<x> => {
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
    case nodeType.INDEXED_NODE_LIST: {
      return replaceWithIndexedNodeList(node, log)
    }
    case nodeType.UNINDEXED_NODE_LIST: {
      return replaceWithUnindexedNodeList(node, log)
    }
    default: {
      return unreachable(node)
    }
  }
}

const insertNode = <a, x>(node: Node<a>, log: Encoder<x>): Encoder<x> => {
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
    case nodeType.INDEXED_NODE_LIST: {
      return insertIndexedNodeList(node, log)
    }
    case nodeType.UNINDEXED_NODE_LIST: {
      return insertUnindexedNodeList(node, log)
    }
    default: {
      return unreachable(node)
    }
  }
}

const diffThunk = <a, x>(
  last: Thunk<a>,
  next: Thunk<a>,
  log: Encoder<x>
): Encoder<x> => {
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
  log: Encoder<x>
): Encoder<x> => {
  return diffNode(last.node, next.node, log)
}

const diffNode = <a, x>(
  last: Node<a>,
  next: Node<a>,
  log: Encoder<x>
): Encoder<x> => {
  if (last == null) {
    return insertNode(next, log)
  } else if (last === next) {
    return log
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
        if (last.nodeType === nodeType.ELEMENT_NODE) {
          return diffUnindexedElement(last, next, log)
        } else {
          return replaceWithUnindexedElement(next, log)
        }
      }
      case nodeType.INDEXED_ELEMENT_NODE: {
        if (last.nodeType === nodeType.INDEXED_ELEMENT_NODE) {
          return diffIndexedElement(last, next, log)
        } else {
          return replaceWithIndexedElement(next, log)
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
      case nodeType.INDEXED_NODE_LIST: {
        if (last.nodeType === next.nodeType) {
          return diffIndexedNodeList(last, next, log)
        } else {
          return replaceWithIndexedNodeList(next, log)
        }
      }
      case nodeType.UNINDEXED_NODE_LIST: {
        if (last.nodeType === next.nodeType) {
          return diffUnindexedNodeList(last, next, log)
        } else {
          return replaceWithUnindexedNodeList(next, log)
        }
      }
      default: {
        return unreachable(next)
      }
    }
  }
}

const diffText = <a, x>(
  last: Text<a>,
  next: Text<a>,
  log: Encoder<x>
): Encoder<x> => {
  if (last == null) {
    return insertText(next, log)
  } else if (last.data === next.data) {
    return log
  } else {
    return diffTextData(last.data, next.data, log)
  }
}

const diffComment = <a, x>(
  last: Comment<a>,
  next: Comment<a>,
  log: Encoder<x>
): Encoder<x> => {
  if (last == null) {
    return insertComment(next, log)
  } else if (last.data === next.data) {
    return log
  } else {
    return diffTextData(last.data, next.data, log)
  }
}

const diffTextData = <x>(
  last: string,
  next: string,
  log: Encoder<x>
): Encoder<x> => {
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
  last: UnindexedElement<a>,
  next: UnindexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  diffUnindexedChildren(
    last.children,
    next.children,
    log.selectChildren()
  ).selectParent()

const diffUnindexedNodeList = <a, x>(
  last: UnindexedNodeList<a>,
  next: UnindexedNodeList<a>,
  log: Encoder<x>
): Encoder<x> => diffUnindexedChildren(last.children, next.children, log)

const diffUnindexedChildren = <a, x>(
  last: UnindexedChildren<a>,
  next: UnindexedChildren<a>,
  log: Encoder<x>
): Encoder<x> => {
  let index = 0
  while (index >= 0) {
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
    } else {
      index = -1
    }
  }

  return log
}

const diffIndexedElement = <a, x>(
  last: IndexedElement<a>,
  next: IndexedElement<a>,
  log: Encoder<x>
): Encoder<x> =>
  diffIndexedChildren(
    last.children,
    next.children,
    log.selectChildren()
  ).selectParent()

const diffIndexedNodeList = <a, x>(
  last: IndexedNodeList<a>,
  next: IndexedNodeList<a>,
  log: Encoder<x>
): Encoder<x> => diffIndexedChildren(last.children, next.children, log)

const diffIndexedChildren = <a, x>(
  last: IndexedChildren<a>,
  next: IndexedChildren<a>,
  log: Encoder<x>
): Encoder<x> => {
  const migrants: { [string]: [number, Node<a>] } = (Object.create(
    null
  ): Object)
  let lastIndex = 0
  let nextIndex = 0

  while (lastIndex >= 0) {
    const lastIndexed = last[lastIndex]
    // If child in last version does not exist we just break a loop.
    if (lastIndexed == null) {
      lastIndex = -1
    } else {
      const [lastKey, lastNode] = lastIndexed
      const nextIndexed = next[nextIndex]

      // If child is present in last and next version and has same index select
      // it and diff.
      if (nextIndexed && nextIndexed[0] === lastKey) {
        const [nextKey, nextNode] = next[nextIndex]
        log = diffNode(lastNode, nextNode, log.selectSibling(1))

        lastIndex += 1
        nextIndex += 1
        // Otherwise stash child from last version and continue.
      } else {
        const { address } = log
        log = log.stashNextSibling(address)

        migrants[lastKey] = [address, lastNode]
        lastIndex += 1
      }
    }
  }

  // At this point no more children left in last version, so we will just add
  // children from next version if there are some left.
  while (nextIndex >= 0) {
    const nextIndexed = next[nextIndex]
    if (nextIndexed == null) {
      nextIndex = -1
    } else {
      const [key, node] = nextIndexed
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
    return log
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

  return log
}

const setSettings = <a, x>(node: Element<a>, log: Encoder<x>): Encoder<x> => {
  const v1 = log
  const v2 = diffProperties(blank, node.properties, v1)
  const v3 = diffAttributes(blank, node.attributes, v2)
  const v4 = diffStyle(blank, node.style, v3)
  return v4
}

const diffSettings = <a, x>(
  last: Element<a>,
  next: Element<a>,
  log: Encoder<x>
): Encoder<x> => {
  const v1 = log
  const v2 = diffProperties(last && last.properties, next.properties, v1)
  const v3 = diffAttributes(last && last.attributes, next.attributes, v2)
  const v4 = diffStyle(last && last.style, next.style, v3)
  return v4
}

const diffProperties = <x>(
  last: Properties,
  next: Properties,
  log: Encoder<x>
): Encoder<x> => {
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
  last: Attributes,
  next: Attributes,
  log: Encoder<x>
): Encoder<x> => {
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
  last: StyleRules,
  next: StyleRules,
  log: Encoder<x>
): Encoder<x> => {
  let styles = null

  if (last) {
    for (let name in last) {
      if (name !== "settingType") {
        if (next == null || !(name in next)) {
          log = log.removeStyleRule(name)
        }
      }
    }
  }

  if (next != null) {
    for (let name in next) {
      if (name != "settingType") {
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
  }

  return log
}
