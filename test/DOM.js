/* @flow */

import * as DOM from "../"
import test from "blue-tape"

test("test baisc", async test => {
  test.isEqual(typeof DOM, "object")
})
