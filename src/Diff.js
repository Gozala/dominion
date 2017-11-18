/* @flow */

import type {
  Node,
  Text,
  Comment,
  Element,
  Thunk,
  Tagged,
  Indexed,
  Fragment,
  UnindexedElement,
  IndexedElement,
  IndexedFragment,
  UnindexedFragment,
  IndexedChildren,
  UnindexedChildren,
  Properties,
  Attributes,
  StyleRules,
  Listener,
  Listeners
} from "./DOM/Node"
import type { Encoder, ChangeList, Result } from "./Log"
import { nodeType } from "./DOM/Node"
import Diff from "./Diff/Diff"
import unreachable from "unreachable"
import { Table, Retain, Delete } from "./Diff/EditDistance"

const empty: Array<any> = Object.freeze([])
const blank: Object = Object.freeze(Object.create(null))

class Changes<a> implements ChangeList {
  last: Node<a>
  next: Node<a>
  constructor(last: Node<a>, next: Node<a>) {
    this.last = last
    this.next = next
  }
  encode<buffer>(changeLog: Encoder<buffer>, init: buffer): Result<buffer> {
    return diffNode(this.last, this.next, new Diff(init, changeLog, 1, []))
      .buffer
  }
}

export const diff = <a>(last: Node<a>, next: Node<a>): ChangeList =>
  new Changes(last, next)

export default diff

const removeFragment = <a, x>(node: Fragment<a>, log: Diff<x>): Diff<x> => {
  const { children } = node
  let index = 0
  while (index >= 0) {
    const child = children[index]
    if (child == null) {
      index = -1
    } else {
      index++
      log = Diff.removeNextSibling(log)
    }
  }
  return log
}

const insertText = <a, x>(node: Text<a>, log: Diff<x>): Diff<x> =>
  Diff.insertText(log, node.data)

const insertComment = <a, x>(node: Comment<a>, log: Diff<x>): Diff<x> =>
  Diff.insertComment(log, node.data)

const insertElementNode = <a, x>(node: Element<a>, log: Diff<x>): Diff<x> => {
  const { localName, namespaceURI } = node
  const out =
    namespaceURI == null
      ? Diff.insertElement(log, localName)
      : Diff.insertElementNS(log, namespaceURI, localName)
  return out
}

const insertIndexedElement = <a, x>(
  node: IndexedElement<a>,
  log: Diff<x>
): Diff<x> =>
  Diff.selectSibling(
    populateIndexedElement(
      node,
      setSettings(node, Diff.selectSibling(insertElementNode(node, log), 1))
    ),
    -1
  )

const insertUnindexedElement = <a, x>(
  node: UnindexedElement<a>,
  log: Diff<x>
): Diff<x> =>
  Diff.selectSibling(
    populateUnindexedElement(
      node,
      setSettings(node, Diff.selectSibling(insertElementNode(node, log), 1))
    ),
    -1
  )

const populateIndexedElement = <a, x>(
  node: IndexedElement<a>,
  log: Diff<x>
): Diff<x> =>
  Diff.selectParent(
    insertIndexedChildren(node.children, Diff.selectChildren(log))
  )

const populateUnindexedElement = <a, x>(
  node: UnindexedElement<a>,
  log: Diff<x>
): Diff<x> =>
  Diff.selectParent(
    insertUnindexedChildren(node.children, Diff.selectChildren(log))
  )

const insertIndexedFragment = <a, x>(
  node: IndexedFragment<a>,
  log: Diff<x>
): Diff<x> => insertIndexedChildren(node.children, log)

const insertUnindexedFragment = <a, x>(
  node: UnindexedFragment<a>,
  log: Diff<x>
): Diff<x> => insertUnindexedChildren(node.children, log)

const insertIndexedChildren = <a, x>(
  children: IndexedChildren<a>,
  log: Diff<x>
): Diff<x> => diffIndexedChildren(empty, children, log)

const insertUnindexedChildren = <a, x>(
  children: UnindexedChildren<a>,
  log: Diff<x>
): Diff<x> => diffUnindexedChildren(empty, children, log)

const insertThunk = <a, x>(thunk: Thunk<a>, log: Diff<x>): Diff<x> =>
  insertNode(thunk.force(), log)

const insertTagged = <inner, outer, x>(
  tagged: Tagged<outer, inner>,
  log: Diff<x>
): Diff<x> => insertNode(tagged.node, log)

const replaceWithText = <a, x>(node: Text<a>, log: Diff<x>): Diff<x> =>
  Diff.replaceWithText(log, node.data)

const replaceWithComment = <a, x>(node: Comment<a>, log: Diff<x>): Diff<x> =>
  Diff.replaceWithComment(log, node.data)

const replaceWithElementNode = <a, x>(
  node: Element<a>,
  log: Diff<x>
): Diff<x> => {
  const { localName, namespaceURI } = node
  const out =
    namespaceURI == null
      ? Diff.replaceWithElement(log, localName)
      : Diff.replaceWithElementNS(log, namespaceURI, localName)
  return out
}

const replaceWithUnindexedElement = <a, x>(
  node: UnindexedElement<a>,
  log: Diff<x>
): Diff<x> =>
  populateUnindexedElement(
    node,
    setSettings(node, replaceWithElementNode(node, log))
  )

const replaceWithIndexedElement = <a, x>(
  node: IndexedElement<a>,
  log: Diff<x>
): Diff<x> =>
  populateIndexedElement(
    node,
    setSettings(node, replaceWithElementNode(node, log))
  )

const replaceWithThunk = <a, x>(thunk: Thunk<a>, log: Diff<x>): Diff<x> =>
  replaceWithNode(thunk.force(), log)

const replaceWithTagged = <a, x>(tagged: Tagged<a>, log: Diff<x>): Diff<x> =>
  replaceWithNode(tagged.node, log)

const replaceWithIndexedFragment = <a, x>(
  node: IndexedFragment<a>,
  log: Diff<x>
): Diff<x> =>
  insertIndexedFragment(
    node,
    Diff.removeNextSibling(Diff.selectSibling(log, -1))
  )

const replaceWithUnindexedFragment = <a, x>(
  node: UnindexedFragment<a>,
  log: Diff<x>
): Diff<x> =>
  insertUnindexedFragment(
    node,
    Diff.removeNextSibling(Diff.selectSibling(log, -1))
  )

const replaceWithNode = <a, x>(node: Node<a>, log: Diff<x>): Diff<x> => {
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
    case nodeType.INDEXED_FRAGMENT_NODE: {
      return replaceWithIndexedFragment(node, log)
    }
    case nodeType.UNINDEXED_FRAGMENT_NODE: {
      return replaceWithUnindexedFragment(node, log)
    }
    default: {
      return unreachable(node)
    }
  }
}

const insertNode = <a, x>(node: Node<a>, log: Diff<x>): Diff<x> => {
  switch (node.nodeType) {
    case nodeType.TEXT_NODE: {
      return Diff.insertText(log, node.data)
    }
    case nodeType.COMMENT_NODE: {
      return Diff.insertComment(log, node.data)
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
    case nodeType.INDEXED_FRAGMENT_NODE: {
      return insertIndexedFragment(node, log)
    }
    case nodeType.UNINDEXED_FRAGMENT_NODE: {
      return insertUnindexedFragment(node, log)
    }
    default: {
      return unreachable(node)
    }
  }
}

const diffThunk = <a, x>(
  last: Thunk<a>,
  next: Thunk<a>,
  log: Diff<x>
): Diff<x> => {
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
  log: Diff<x>
): Diff<x> => {
  return diffNode(last.node, next.node, log)
}

const diffNode = <a, x>(
  last: Node<a>,
  next: Node<a>,
  log: Diff<x>
): Diff<x> => {
  if (last === next) {
    return log
  } else {
    switch (next.nodeType) {
      case nodeType.TEXT_NODE: {
        switch (last.nodeType) {
          case nodeType.TEXT_NODE:
            return diffText(last, next, log)
          case nodeType.INDEXED_FRAGMENT_NODE:
            return insertText(next, removeFragment(last, log))
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return insertText(next, removeFragment(last, log))
          default:
            return replaceWithText(next, log)
        }
      }
      case nodeType.COMMENT_NODE: {
        switch (last.nodeType) {
          case nodeType.COMMENT_NODE:
            return diffComment(last, next, log)
          case nodeType.INDEXED_FRAGMENT_NODE:
            return insertComment(next, removeFragment(last, log))
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return insertComment(next, removeFragment(last, log))
          default:
            return replaceWithComment(next, log)
        }
      }
      case nodeType.ELEMENT_NODE: {
        switch (last.nodeType) {
          case nodeType.ELEMENT_NODE:
            return diffUnindexedElement(last, next, log)
          case nodeType.INDEXED_FRAGMENT_NODE:
            return insertUnindexedElement(next, removeFragment(last, log))
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return insertUnindexedElement(next, removeFragment(last, log))
          default:
            return replaceWithUnindexedElement(next, log)
        }
      }
      case nodeType.INDEXED_ELEMENT_NODE: {
        switch (last.nodeType) {
          case nodeType.INDEXED_ELEMENT_NODE:
            return diffIndexedElement(last, next, log)
          case nodeType.INDEXED_FRAGMENT_NODE:
            return insertIndexedElement(next, removeFragment(last, log))
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return insertIndexedElement(next, removeFragment(last, log))
          default:
            return replaceWithIndexedElement(next, log)
        }
      }
      case nodeType.THUNK_NODE: {
        switch (last.nodeType) {
          case nodeType.THUNK_NODE:
            return diffThunk(last, next, log)
          case nodeType.INDEXED_FRAGMENT_NODE:
            return insertThunk(next, removeFragment(last, log))
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return insertThunk(next, removeFragment(last, log))
          default:
            return replaceWithThunk(next, log)
        }
      }
      case nodeType.TAGGED_ELEMENT_NODE: {
        switch (last.nodeType) {
          case nodeType.TAGGED_ELEMENT_NODE:
            return diffTagged(last, next, log)
          case nodeType.INDEXED_FRAGMENT_NODE:
            return insertTagged(next, removeFragment(last, log))
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return insertTagged(next, removeFragment(last, log))
          default:
            return replaceWithTagged(next, log)
        }
      }
      case nodeType.INDEXED_FRAGMENT_NODE: {
        switch (last.nodeType) {
          case nodeType.INDEXED_FRAGMENT_NODE:
            return diffIndexedFragment(last, next, log)
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return insertIndexedFragment(next, removeFragment(last, log))
          default:
            return replaceWithIndexedFragment(next, log)
        }
      }
      case nodeType.UNINDEXED_FRAGMENT_NODE: {
        switch (last.nodeType) {
          case nodeType.UNINDEXED_FRAGMENT_NODE:
            return diffUnindexedFragment(last, next, log)
          case nodeType.INDEXED_FRAGMENT_NODE:
            return insertUnindexedFragment(next, removeFragment(last, log))
          default:
            return replaceWithUnindexedFragment(next, log)
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
  log: Diff<x>
): Diff<x> => {
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
  log: Diff<x>
): Diff<x> => {
  if (last == null) {
    return insertComment(next, log)
  } else if (last.data === next.data) {
    return log
  } else {
    return diffTextData(last.data, next.data, log)
  }
}

const diffTextData = <x>(last: string, next: string, log: Diff<x>): Diff<x> => {
  const nextLength = next.length
  const lastLength = last.length
  if (nextLength <= 6) {
    return Diff.setTextData(log, next)
  } else if (lastLength > nextLength) {
    const index = last.indexOf(next)
    if (index === -1) {
      return Diff.setTextData(log, next)
    } else {
      return Diff.editTextData(
        log,
        index,
        lastLength - index - nextLength,
        "",
        ""
      )
    }
  } else {
    const index = next.indexOf(last)
    if (index === -1) {
      return Diff.setTextData(log, next)
    } else {
      return Diff.editTextData(
        log,
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
  log: Diff<x>
): Diff<x> => {
  if (
    next.localName === last.localName &&
    next.namespaceURI === last.namespaceURI
  ) {
    return Diff.selectParent(
      diffUnindexedChildren(
        last.children,
        next.children,
        Diff.selectChildren(diffSettings(last, next, log))
      )
    )
  } else {
    return replaceWithUnindexedElement(next, log)
  }
}

const diffUnindexedFragment = <a, x>(
  last: UnindexedFragment<a>,
  next: UnindexedFragment<a>,
  log: Diff<x>
): Diff<x> => diffUnindexedChildren(last.children, next.children, log)

const diffUnindexedChildren = <a, x>(
  last: UnindexedChildren<a>,
  next: UnindexedChildren<a>,
  log: Diff<x>
): Diff<x> => {
  let index = 0
  while (index >= 0) {
    const lastChild = last[index]
    const nextChild = next[index]

    // If last and next versions contain a child for the given index, just
    // diff them and move on.
    if (lastChild != null && nextChild != null) {
      log = diffNode(lastChild, nextChild, Diff.selectSibling(log, 1))
      index += 1
      // If child is present in next version but not in the last version
      // insert it and select it.
    } else if (nextChild != null) {
      log = Diff.selectSibling(insertNode(nextChild, log), 1)
      index += 1
      // If child is present in last version but isn't present in new version
      // remove child
    } else if (lastChild != null) {
      log = Diff.removeNextSibling(log)
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
  log: Diff<x>
): Diff<x> => {
  if (
    next.localName === last.localName &&
    next.namespaceURI === next.namespaceURI
  ) {
    return Diff.selectParent(
      diffIndexedChildren(
        last.children,
        next.children,
        Diff.selectChildren(diffSettings(last, next, log))
      )
    )
  } else {
    return replaceWithIndexedElement(next, log)
  }
}

const diffIndexedFragment = <a, x>(
  last: IndexedFragment<a>,
  next: IndexedFragment<a>,
  log: Diff<x>
): Diff<x> => diffIndexedChildren(last.children, next.children, log)

const push = <a>(x: a, xs: ?(a[])): a[] => {
  if (xs != null) {
    xs.push(x)
    return xs
  } else {
    return [x]
  }
}

type Insert<a> = { kind: "insert", node: Node<a> }
type DiffStash<a> = { kind: "diff", last: Node<a>, next: Node<a> | null }

type QOP<a> = Insert<a> | DiffStash<a>

const diffIndexedChildren = <a, x>(
  last: IndexedChildren<a>,
  next: IndexedChildren<a>,
  diff: Diff<x>
): Diff<x> => {
  const table = Table.create(last, next)
  const edits = table.get(next.length, last.length).toArray()
  const stash = {}
  const shifted = {}

  let index = 0
  for (let edit of edits) {
    switch (edit) {
      case Delete: {
        const key = last[index][0]
        if (table.next[key] == null) {
          diff == Diff.removeNextSibling(diff)
        } else if (shifted[key] == null) {
          stash[key] = diff.address
          diff = Diff.stashNextSibling(diff, diff.address)
        }
        index++
        break
      }
      case Retain: {
        const [key, node] = last[index]
        diff = diffNode(node, table.next[key], Diff.selectSibling(diff, 1))
        index++
        break
      }
      default: {
        const key = edit
        if (table.last[key] == null) {
          diff = insertNode(table.next[key], diff)
          diff = Diff.selectSibling(diff, 1)
        } else {
          if (stash[key] == null) {
            shifted[key] = true
            diff = Diff.shiftSiblings(diff, table.last[key] - index)
            diff = Diff.selectSibling(diff, 1)
          } else {
            diff = Diff.insertStashedNode(diff, stash[key])
            diff = Diff.selectSibling(diff, 1)
          }
        }
      }
    }
  }

  return diff
}
// const diffIndexedChildren = <a, x>(
//   last: IndexedChildren<a>,
//   next: IndexedChildren<a>,
//   log: Diff<x>
// ): Diff<x> => {
//   let migrants: ?{ [string]: [number, Node<a>] } = null
//   let lastIndex = 0
//   let nextIndex = 0
//   let offset = 0

//   while (lastIndex >= 0) {
//     const lastIndexed = last[lastIndex]
//     // If child in last version does not exist we just break a loop.
//     if (lastIndexed == null) {
//       lastIndex = -1
//     } else {
//       const [lastKey, lastNode] = lastIndexed
//       // If migrants table is empty we have not encountered index missmatch yet
//       // which allows us to write diff directly into the log.
//       if (migrants == null) {
//         const nextIndexed = next[nextIndex]
//         // If indexes match then just diff nodes and move to next sibling
//         if (nextIndexed && nextIndexed[0] === lastKey) {
//           const [nextKey, nextNode] = next[nextIndex]
//           log = diffNode(lastNode, nextNode, Diff.selectSibling(log, 1))
//           lastIndex += 1
//           nextIndex += 1
//         } else {
//           // If indexes did not match then last child either got moved or removed
//           // but we won't know which one until we complete iteration over the next
//           // children. There for we store child and it's original position to the
//           // migration table move to the next child.
//           migrants = { [lastKey]: [lastIndex, lastNode] }
//           lastIndex += 1
//         }
//       } else {
//         // If table isn't empty then we'll need to either rearrange or remove
//         // children but for that we'll need to populate the table with rest of the
//         // children and figure out how the need to be (re)moved during iteration
//         // over the next children.
//         migrants[lastKey] = [lastIndex, lastNode]
//         lastIndex += 1
//       }
//     }
//   }

//   // At this point no more children left in last version, so we will just add
//   // children from next version if there are some left.
//   while (nextIndex >= 0) {
//     const nextIndexed = next[nextIndex]
//     if (nextIndexed == null) {
//       nextIndex = -1
//     } else {
//       const [key, node] = nextIndexed
//       const migrant = migrants != null ? migrants[key] : null
//       // If child is in migrants table it means it was reordered, in that case we
//       // insert it back into the tree and diff against next version and move on.
//       if (migrant) {
//         const [lastIndex, lastNode] = migrant
//         // Calculate how many children are between currently selected node and
//         // and a child matching the key.
//         const n = lastIndex + offset - nextIndex
//         // If number is positive, then move child for this key to the next
//         // sibling position.
//         if (n > 0) {
//           log = Diff.shiftSiblings(log, n)
//           offset += 1
//         } else {
//           offset -= 1
//         }

//         log = diffNode(lastNode, node, Diff.selectSibling(log, 1))

//         if (migrants != null) {
//           delete migrants[key]
//         }
//         nextIndex += 1
//       } else {
//         // If child was not in the migrants table then it's a new child and we
//         // just insert it and select next. We also increment offset as all the
//         // children in migrants table would move position further due to inserted
//         // child.
//         log = Diff.selectSibling(insertNode(node, log), 1)
//         nextIndex += 1
//         offset += 1
//       }
//     }
//   }

//   // if there are children left in the migrants table those are left overs from
//   // last child list there for we remove each one. Note that we don't actually
//   // care about their indexes as we just going to remove them.
//   if (migrants) {
//     for (let key in migrants) {
//       log = Diff.removeNextSibling(log)
//     }
//   }

//   return log
// }

const setSettings = <a, x>(node: Element<a>, log: Diff<x>): Diff<x> => {
  const v1 = log
  const v2 = diffProperties(blank, node.properties, v1)
  const v3 = diffAttributes(blank, node.attributes, v2)
  const v4 = diffStyle(blank, node.style, v3)
  const v5 = diffListeners(blank, node.listeners, v4)
  return v5
}

const diffSettings = <a, x>(
  last: Element<a>,
  next: Element<a>,
  log: Diff<x>
): Diff<x> => {
  const v1 = log
  const v2 = diffProperties(last.properties, next.properties, v1)
  const v3 = diffAttributes(last.attributes, next.attributes, v2)
  const v4 = diffStyle(last.style, next.style, v3)
  const v5 = diffListeners(last.listeners, next.listeners, v4)
  return v5
}

const diffProperties = <x>(
  last: Properties,
  next: Properties,
  log: Diff<x>
): Diff<x> => {
  for (let name in last) {
    if (!(name in next)) {
      log = Diff.deleteProperty(log, name)
    }
  }

  for (let name in next) {
    const value = next[name]
    if (last[name] !== value) {
      if (value === undefined) {
        log = Diff.deleteProperty(log, name)
      } else {
        log = Diff.assignProperty(log, name, value)
      }
    }
  }

  return log
}

const diffAttributes = <x>(
  last: Attributes,
  next: Attributes,
  log: Diff<x>
): Diff<x> => {
  for (let key in last) {
    if (!(key in next)) {
      const attribute = last[key]
      if (attribute != null) {
        const { name, namespaceURI } = attribute
        if (namespaceURI == null) {
          log = Diff.removeAttribute(log, name)
        } else {
          log = Diff.removeAttributeNS(log, namespaceURI, name)
        }
      }
    }
  }

  for (let key in next) {
    const attribute = next[key]
    if (attribute != null) {
      const { namespaceURI, name, value } = attribute
      const x = last[key]
      if (x == null || x.value !== value) {
        if (namespaceURI == null) {
          if (value == null) {
            log = Diff.removeAttribute(log, name)
          } else {
            log = Diff.setAttribute(log, name, value)
          }
        } else {
          if (value == null) {
            log = Diff.removeAttributeNS(log, namespaceURI, name)
          } else {
            log = Diff.setAttributeNS(log, namespaceURI, name, value)
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
  log: Diff<x>
): Diff<x> => {
  let styles = null

  for (let name in last) {
    if (name !== "settingType") {
      if (!(name in next) && last[name] != null) {
        log = Diff.removeStyleRule(log, name)
      }
    }
  }

  for (let name in next) {
    if (name != "settingType") {
      const value = next[name]
      const lastValue = last[name]
      if (lastValue !== value) {
        if (value == null) {
          if (lastValue != null) {
            log = Diff.removeStyleRule(log, name)
          }
        } else {
          log = Diff.setStyleRule(log, name, value)
        }
      }
    }
  }

  return log
}

const isEqualListeners = <a>(last: Listener<a>, next: Listener<a>): boolean => {
  return (
    last.type === next.type &&
    last.capture === next.capture &&
    JSON.stringify(last.decoder) === JSON.stringify(next.decoder)
  )
}

const diffListeners = <x, a>(
  last: Listeners<a>,
  next: Listeners<a>,
  log: Diff<x>
): Diff<x> => {
  for (let name in last) {
    if (!(name in next)) {
      const listener = last[name]
      if (listener) {
        const { type, capture, decoder } = listener
        log = Diff.removeEventDecoder(log, type, decoder, capture)
      }
    }
  }

  for (let name in next) {
    const nextListener = next[name]
    const lastListener = last[name]

    const [remove, add] =
      lastListener && !nextListener
        ? [lastListener, null]
        : !lastListener && nextListener
          ? [null, nextListener]
          : lastListener &&
            nextListener &&
            isEqualListeners(lastListener, nextListener)
            ? [null, null]
            : [lastListener, nextListener]

    if (remove) {
      const { type, capture, decoder } = remove
      log = Diff.removeEventDecoder(log, type, decoder, capture)
    }
    if (add) {
      const { type, capture, decoder } = add
      log = Diff.addEventDecoder(log, type, decoder, capture)
    }
  }

  return log
}
