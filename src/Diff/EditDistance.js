// @flow

import { empty, singleton, type List } from "../List"
import unreachable from "unreachable"

export const Retain = "Retain"
export const Delete = "Delete"

type Edit<a> = a | typeof Retain | typeof Delete

// We don't want to copy arrays all the time, aren't mutating lists, and
// only need O(1) prepend and length, we can get away with a custom singly
// linked list implementation.

// Abstract out the table in case I want to edit the implementation to
// arrays of arrays or something.

export class Table<a> {
  cells: { [string]: Cell<a> }
  last: { [string]: number }
  next: { [string]: a }
  constructor() {
    this.cells = (Object.create(null): Object)
    this.last = (Object.create(null): Object)
    this.next = (Object.create(null): Object)
  }
  static init(last: Array<[string, a]>, next: Array<[string, a]>): Table<a> {
    const table = new this()
    let n = last.length
    let m = next.length
    let i = 0
    let j = 0

    table.put(i, j, new Cell(empty()))

    for (i = 1; i <= m; i += 1) {
      const [key, node] = next[i - 1]
      table.next[key] = node
      table.put(i, 0, table.get(i - 1, 0).insert(key))
    }

    for (j = 1; j <= n; j += 1) {
      const [key, node] = last[j - 1]
      table.last[key] = j - 1
      table.put(0, j, table.get(0, j - 1).delete(key))
    }

    return table
  }
  static create(last: Array<[string, a]>, next: Array<[string, a]>): Table<a> {
    const n = last.length
    const m = next.length

    let table = Table.init(last, next)
    let i = 0
    let j = 0

    for (i = 1; i <= m; i += 1) {
      for (j = 1; j <= n; j += 1) {
        table = chooseCell(
          table,
          i,
          j,
          last,
          next,
          <a>(
            direction: Direction,
            table: Table<a>,
            edits: Cell<a>,
            last: Array<[string, a]>,
            next: Array<[string, a]>
          ): Table<a> => {
            switch (direction) {
              case "Left": {
                return table.put(i, j, edits.insert(next[i - 1][0]))
              }
              case "Up": {
                return table.put(i, j, edits.delete(last[j - 1][0]))
              }
              case "Diagonal": {
                if (last[j - 1][0] === next[i - 1][0]) {
                  return table.put(i, j, edits.retain(last[j - 1][0]))
                } else {
                  return table.put(
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

    return table
  }
  put(x: number, y: number, cell: Cell<a>): Table<a> {
    this.cells[`${x},${y}`] = cell
    return this
  }
  get(x: number, y: number): Cell<a> {
    const cell = this.cells[`${x},${y}`]
    if (cell) {
      return cell
    } else {
      return (this.cells[`${x},${y}`] = new Cell(empty()))
    }
  }
}

class Cell<a> {
  edits: List<Edit<string>>
  length: number
  constructor(edits: List<Edit<string>>) {
    this.edits = edits
    this.length = edits.length
  }
  insert(key: string): Cell<a> {
    return new Cell(this.edits.push(key))
  }
  delete(key: string): Cell<a> {
    return new Cell(this.edits.push(Delete))
  }
  retain(key: string): Cell<a> {
    const { edits } = this
    return new Cell(edits.push(Retain))
  }
  toArray(): Edit<string>[] {
    return this.edits.toArray().reverse()
  }
}

type Direction = "Up" | "Left" | "Diagonal"

const chooseCell = <a>(
  table: Table<a>,
  x: number,
  y: number,
  last: Array<[string, a]>,
  next: Array<[string, a]>,
  edit: <a>(
    Direction,
    Table<a>,
    Cell<a>,
    Array<[string, a]>,
    Array<[string, a]>
  ) => Table<a>
): Table<a> => {
  let edits = table.get(x, y - 1)
  let min = edits.length
  let direction: Direction = "Up"

  if (table.get(x - 1, y).length < min) {
    edits = table.get(x - 1, y)
    min = edits.length
    direction = "Left"
  }

  if (table.get(x - 1, y - 1).length < min) {
    edits = table.get(x - 1, y - 1)
    min = edits.length
    direction = "Diagonal"
  }

  return edit(direction, table, edits, last, next)
}

// Constructor for operations (which are a stream of edits). Uses
// variation of Levenshtein Distance.
export const editDistance = <a>(
  last: Array<[string, a]>,
  next: Array<[string, a]>
): Cell<a> => Table.create(last, next).get(next.length, last.length)
