// @flow

import { empty, singleton, type List } from "../List"
import unreachable from "unreachable"

export const Retain = "Retain"
export const Delete = "Delete"

type $Array<a> = Array<[a]>

type Edit<a> = a | typeof Retain | typeof Delete

// We don't want to copy arrays all the time, aren't mutating lists, and
// only need O(1) prepend and length, we can get away with a custom singly
// linked list implementation.

// TODO: keep track of number of non-retain edits and use this instead of
// length when choosing which path to take.

// Abstract out the table in case I want to edit the implementation to
// arrays of arrays or something.

type EditTable<a> = { [string]: Cell<a> }

class Cell<a> {
  edits: List<Edit<a>>
  length: number
  deleted: { [string]: a }
  constructor(edits: List<Edit<a>>) {
    this.edits = edits
    this.length = edits.length
  }
  insert(node: a): Cell<a> {
    return new Cell(this.edits.push(node))
  }
  delete(node: a): Cell<a> {
    return new Cell(this.edits.push(Delete))
  }
  retain(node: a): Cell<a> {
    const { edits } = this
    return new Cell(edits.push(Retain))
  }
}

const put = <a>(
  table: EditTable<a>,
  x: number,
  y: number,
  edits: Cell<a>
): EditTable<a> => {
  console.log(`put(${x},${y},@${edits.length})`)
  return (table[`${x},${y}`] = edits), table
}

const get = <a>(table: EditTable<a>, x: number, y: number): Cell<a> => {
  console.log(`get(${x},${y}, @${table[`${x},${y}`].length})`)
  const edits = table[`${x},${y}`]
  if (edits) {
    return edits
  } else {
    return (table[`${x},${y}`] = new Cell(empty()))
  }
}

const makeEditsTable = <a>(last: $Array<a>, next: $Array<a>): EditTable<a> => {
  var table = {},
    n = last.length,
    m = next.length,
    i,
    j

  put(table, 0, 0, new Cell(empty()))

  for (i = 1; i <= m; i += 1) {
    // console.log(`${i}.0=[+${next[i - 1]} ...${i - 1}.0]`)
    put(table, i, 0, get(table, i - 1, 0).insert(next[i - 1][0]))
  }

  for (j = 1; j <= n; j += 1) {
    // console.log(`0.${j}=[-${last[j - 1]} ...${0}.${j - 1}]`)
    put(table, 0, j, get(table, 0, j - 1).delete(last[j - 1][0]))
  }

  return table
}

type Direction = "Up" | "Left" | "Diagonal"

const chooseCell = <a>(
  table: EditTable<a>,
  x: number,
  y: number,
  last: $Array<a>,
  next: $Array<a>,
  edit: <a>(
    Direction,
    EditTable<a>,
    Cell<a>,
    $Array<a>,
    $Array<a>
  ) => EditTable<a>
): EditTable<a> => {
  var edits = get(table, x, y - 1),
    min = edits.length,
    direction: Direction = "Up"
  console.log(`${x}.${y - 1}:${min}`)

  if (get(table, x - 1, y).length < min) {
    console.log("LEFT")
    edits = get(table, x - 1, y)
    min = edits.length
    direction = "Left"
  }

  if (get(table, x - 1, y - 1).length < min) {
    console.log("Diagonal")
    edits = get(table, x - 1, y - 1)
    min = edits.length
    direction = "Diagonal"
  }

  console.log(direction)
  return edit(direction, table, edits, last, next)
}

// Constructor for operations (which are a stream of edits). Uses
// variation of Levenshtein Distance.
export const editDistance = <a>(
  last: $Array<a>,
  next: $Array<a>
): Edit<a>[] => {
  let n = last.length,
    m = next.length,
    i,
    j,
    table = makeEditsTable(last, next)

  for (i = 1; i <= m; i += 1) {
    for (j = 1; j <= n; j += 1) {
      console.log(`${i}.${j}`)
      table = chooseCell(
        table,
        i,
        j,
        last,
        next,
        <a>(
          direction: Direction,
          table: EditTable<a>,
          edits: Cell<a>,
          last: $Array<a>,
          next: $Array<a>
        ): EditTable<a> => {
          console.log(direction)
          switch (direction) {
            case "Left": {
              return put(table, i, j, edits.insert(next[i - 1][0]))
            }
            case "Up": {
              return put(table, i, j, edits.delete(last[j - 1][0]))
            }
            case "Diagonal": {
              if (last[j - 1] === next[i - 1]) {
                return put(table, i, j, edits.retain(last[j - 1][0]))
              } else {
                return put(
                  table,
                  i,
                  j,
                  edits.delete(last[j - 1][0]).insert(next[i - 1][0])
                )
              }
            }
            default:
              return unreachable(direction)
          }
        }
      )
    }
  }

  return get(table, m, n)
    .edits.toArray()
    .reverse()
}

// const edits = diff(["a", "b", "c"], ["b", "c", "a"])
// edits

editDistance([["a"], ["b"], ["c"]], [["b"], ["c"], ["a"]]) //?
// a b c d e f
// b c d e f a

// a b c d e f
// x a b c d e f
