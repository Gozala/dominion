/* @flow */

// Transformed verison of DOMinion.fbs.ts

import * as flatbuffers from "flatbuffers"
import * as Decoder from "../Decoder.fbs/Decoder"

export const op = {
  NONE: (0: 0),
  SelectChildren: (1: 1),
  SelectSibling: (2: 2),
  SelectParent: (3: 3),
  InsertComment: (4: 4),
  InsertText: (5: 5),
  InsertElement: (6: 6),
  InsertStashedNode: (7: 7),
  ReplaceWithComment: (8: 8),
  ReplaceWithText: (9: 9),
  ReplaceWithElement: (10: 10),
  ReplaceWithStashedNode: (11: 11),
  RemoveNextSibling: (12: 12),
  SetTextData: (13: 13),
  EditTextData: (14: 14),
  SetAttribute: (15: 15),
  RemoveAttribute: (16: 16),
  AssignStringProperty: (17: 17),
  AssignBooleanProperty: (18: 18),
  AssignNumberProperty: (19: 19),
  AssignNullProperty: (20: 20),
  DeleteProperty: (21: 21),
  SetStyleRule: (22: 22),
  RemoveStyleRule: (23: 23),
  StashNextSibling: (24: 24),
  DiscardStashed: (25: 25),
  ShiftSiblings: (26: 26),
  AddEventListener: (27: 27),
  RemoveEventListener: (28: 28)
}

export type Op = $Values<typeof op>

/**
 * @constructor
 */

export class StashNextSibling {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {StashNextSibling}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): StashNextSibling {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {StashNextSibling=} obj
   * @returns {StashNextSibling}
   */
  static getRootAsStashNextSibling(
    bb: flatbuffers.ByteBuffer,
    obj?: StashNextSibling
  ): StashNextSibling {
    return (obj || new StashNextSibling()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  address(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startStashNextSibling(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} address
   */
  static addAddress(builder: flatbuffers.Builder, address: number) {
    builder.addFieldInt32(0, address, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endStashNextSibling(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}

export class ShiftSiblings {
  /**
   * @type {flatbuffers.ByteBuffer}
   */
  bb: flatbuffers.ByteBuffer

  /**
   * @type {number}
   */
  bb_pos: number = 0
  /**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {ShiftSiblings}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): ShiftSiblings {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {ShiftSiblings=} obj
 * @returns {ShiftSiblings}
 */
  static getRootAsShiftSiblings(
    bb: flatbuffers.ByteBuffer,
    obj?: ShiftSiblings
  ): ShiftSiblings {
    return (obj || new ShiftSiblings()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @returns {number}
 */
  count(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startShiftSiblings(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @param {number} count
 */
  static addCount(builder: flatbuffers.Builder, count: number) {
    builder.addFieldInt32(0, count, 0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endShiftSiblings(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}

/**
   * @constructor
   */
export class DiscardStashed {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {DiscardStashed}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): DiscardStashed {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {DiscardStashed=} obj
   * @returns {DiscardStashed}
   */
  static getRootAsDiscardStashed(
    bb: flatbuffers.ByteBuffer,
    obj?: DiscardStashed
  ): DiscardStashed {
    return (obj || new DiscardStashed()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  address(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startDiscardStashed(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} address
   */
  static addAddress(builder: flatbuffers.Builder, address: number) {
    builder.addFieldInt32(0, address, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endDiscardStashed(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class AssignStringProperty {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {AssignStringProperty}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): AssignStringProperty {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {AssignStringProperty=} obj
   * @returns {AssignStringProperty}
   */
  static getRootAsAssignStringProperty(
    bb: flatbuffers.ByteBuffer,
    obj?: AssignStringProperty
  ): AssignStringProperty {
    return (obj || new AssignStringProperty()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  value(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startAssignStringProperty(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} valueOffset
   */
  static addValue(
    builder: flatbuffers.Builder,
    valueOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, valueOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endAssignStringProperty(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class AssignBooleanProperty {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {AssignBooleanProperty}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): AssignBooleanProperty {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {AssignBooleanProperty=} obj
   * @returns {AssignBooleanProperty}
   */
  static getRootAsAssignBooleanProperty(
    bb: flatbuffers.ByteBuffer,
    obj?: AssignBooleanProperty
  ): AssignBooleanProperty {
    return (obj || new AssignBooleanProperty()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @returns {boolean}
   */
  value(): boolean {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startAssignBooleanProperty(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {boolean} value
   */
  static addValue(builder: flatbuffers.Builder, value: boolean) {
    builder.addFieldInt8(1, +value, +false)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endAssignBooleanProperty(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class AssignNumberProperty {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {AssignNumberProperty}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): AssignNumberProperty {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {AssignNumberProperty=} obj
   * @returns {AssignNumberProperty}
   */
  static getRootAsAssignNumberProperty(
    bb: flatbuffers.ByteBuffer,
    obj?: AssignNumberProperty
  ): AssignNumberProperty {
    return (obj || new AssignNumberProperty()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @returns {number}
   */
  value(): number {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.readFloat64(this.bb_pos + offset) : 0.0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startAssignNumberProperty(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} value
   */
  static addValue(builder: flatbuffers.Builder, value: number) {
    builder.addFieldFloat64(1, value, 0.0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endAssignNumberProperty(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class AssignNullProperty {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {AssignNullProperty}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): AssignNullProperty {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {AssignNullProperty=} obj
   * @returns {AssignNullProperty}
   */
  static getRootAsAssignNullProperty(
    bb: flatbuffers.ByteBuffer,
    obj?: AssignNullProperty
  ): AssignNullProperty {
    return (obj || new AssignNullProperty()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startAssignNullProperty(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endAssignNullProperty(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class DeleteProperty {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {DeleteProperty}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): DeleteProperty {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {DeleteProperty=} obj
   * @returns {DeleteProperty}
   */
  static getRootAsDeleteProperty(
    bb: flatbuffers.ByteBuffer,
    obj?: DeleteProperty
  ): DeleteProperty {
    return (obj || new DeleteProperty()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startDeleteProperty(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endDeleteProperty(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class SetStyleRule {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {SetStyleRule}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): SetStyleRule {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {SetStyleRule=} obj
   * @returns {SetStyleRule}
   */
  static getRootAsSetStyleRule(
    bb: flatbuffers.ByteBuffer,
    obj?: SetStyleRule
  ): SetStyleRule {
    return (obj || new SetStyleRule()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  value(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startSetStyleRule(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} valueOffset
   */
  static addValue(
    builder: flatbuffers.Builder,
    valueOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, valueOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endSetStyleRule(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class RemoveStyleRule {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {RemoveStyleRule}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): RemoveStyleRule {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {RemoveStyleRule=} obj
   * @returns {RemoveStyleRule}
   */
  static getRootAsRemoveStyleRule(
    bb: flatbuffers.ByteBuffer,
    obj?: RemoveStyleRule
  ): RemoveStyleRule {
    return (obj || new RemoveStyleRule()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startRemoveStyleRule(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endRemoveStyleRule(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class SetAttribute {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {SetAttribute}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): SetAttribute {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {SetAttribute=} obj
   * @returns {SetAttribute}
   */
  static getRootAsSetAttribute(
    bb: flatbuffers.ByteBuffer,
    obj?: SetAttribute
  ): SetAttribute {
    return (obj || new SetAttribute()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  namespaceURI(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  value(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startSetAttribute(builder: flatbuffers.Builder) {
    builder.startObject(3)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} namespaceURIOffset
   */
  static addNamespaceURI(
    builder: flatbuffers.Builder,
    namespaceURIOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, namespaceURIOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(1, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} valueOffset
   */
  static addValue(
    builder: flatbuffers.Builder,
    valueOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, valueOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endSetAttribute(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class RemoveAttribute {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {RemoveAttribute}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): RemoveAttribute {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {RemoveAttribute=} obj
   * @returns {RemoveAttribute}
   */
  static getRootAsRemoveAttribute(
    bb: flatbuffers.ByteBuffer,
    obj?: RemoveAttribute
  ): RemoveAttribute {
    return (obj || new RemoveAttribute()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  namespaceURI(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startRemoveAttribute(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} namespaceURIOffset
   */
  static addNamespaceURI(
    builder: flatbuffers.Builder,
    namespaceURIOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, namespaceURIOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} nameOffset
   */
  static addName(builder: flatbuffers.Builder, nameOffset: flatbuffers.Offset) {
    builder.addFieldOffset(1, nameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endRemoveAttribute(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class InsertText {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {InsertText}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): InsertText {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {InsertText=} obj
   * @returns {InsertText}
   */
  static getRootAsInsertText(
    bb: flatbuffers.ByteBuffer,
    obj?: InsertText
  ): InsertText {
    return (obj || new InsertText()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  data(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startInsertText(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} dataOffset
   */
  static addData(builder: flatbuffers.Builder, dataOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, dataOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endInsertText(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class InsertComment {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {InsertComment}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): InsertComment {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {InsertComment=} obj
   * @returns {InsertComment}
   */
  static getRootAsInsertComment(
    bb: flatbuffers.ByteBuffer,
    obj?: InsertComment
  ): InsertComment {
    return (obj || new InsertComment()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  data(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startInsertComment(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} dataOffset
   */
  static addData(builder: flatbuffers.Builder, dataOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, dataOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endInsertComment(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class InsertElement {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {InsertElement}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): InsertElement {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {InsertElement=} obj
   * @returns {InsertElement}
   */
  static getRootAsInsertElement(
    bb: flatbuffers.ByteBuffer,
    obj?: InsertElement
  ): InsertElement {
    return (obj || new InsertElement()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  namespaceURI(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  localName(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startInsertElement(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} namespaceURIOffset
   */
  static addNamespaceURI(
    builder: flatbuffers.Builder,
    namespaceURIOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, namespaceURIOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} localNameOffset
   */
  static addLocalName(
    builder: flatbuffers.Builder,
    localNameOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, localNameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endInsertElement(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class InsertStashedNode {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {InsertStashedNode}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): InsertStashedNode {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {InsertStashedNode=} obj
   * @returns {InsertStashedNode}
   */
  static getRootAsInsertStashedNode(
    bb: flatbuffers.ByteBuffer,
    obj?: InsertStashedNode
  ): InsertStashedNode {
    return (obj || new InsertStashedNode()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  address(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startInsertStashedNode(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} address
   */
  static addAddress(builder: flatbuffers.Builder, address: number) {
    builder.addFieldInt32(0, address, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endInsertStashedNode(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class ReplaceWithText {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {ReplaceWithText}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): ReplaceWithText {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {ReplaceWithText=} obj
   * @returns {ReplaceWithText}
   */
  static getRootAsReplaceWithText(
    bb: flatbuffers.ByteBuffer,
    obj?: ReplaceWithText
  ): ReplaceWithText {
    return (obj || new ReplaceWithText()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  data(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startReplaceWithText(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} dataOffset
   */
  static addData(builder: flatbuffers.Builder, dataOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, dataOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endReplaceWithText(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class ReplaceWithComment {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {ReplaceWithComment}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): ReplaceWithComment {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {ReplaceWithComment=} obj
   * @returns {ReplaceWithComment}
   */
  static getRootAsReplaceWithComment(
    bb: flatbuffers.ByteBuffer,
    obj?: ReplaceWithComment
  ): ReplaceWithComment {
    return (obj || new ReplaceWithComment()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  data(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startReplaceWithComment(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} dataOffset
   */
  static addData(builder: flatbuffers.Builder, dataOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, dataOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endReplaceWithComment(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class ReplaceWithElement {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {ReplaceWithElement}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): ReplaceWithElement {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {ReplaceWithElement=} obj
   * @returns {ReplaceWithElement}
   */
  static getRootAsReplaceWithElement(
    bb: flatbuffers.ByteBuffer,
    obj?: ReplaceWithElement
  ): ReplaceWithElement {
    return (obj || new ReplaceWithElement()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  namespaceURI(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  localName(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startReplaceWithElement(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} namespaceURIOffset
   */
  static addNamespaceURI(
    builder: flatbuffers.Builder,
    namespaceURIOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, namespaceURIOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} localNameOffset
   */
  static addLocalName(
    builder: flatbuffers.Builder,
    localNameOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, localNameOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endReplaceWithElement(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class ReplaceWithStashedNode {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {ReplaceWithStashedNode}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): ReplaceWithStashedNode {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {ReplaceWithStashedNode=} obj
   * @returns {ReplaceWithStashedNode}
   */
  static getRootAsReplaceWithStashedNode(
    bb: flatbuffers.ByteBuffer,
    obj?: ReplaceWithStashedNode
  ): ReplaceWithStashedNode {
    return (obj || new ReplaceWithStashedNode()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  address(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startReplaceWithStashedNode(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} address
   */
  static addAddress(builder: flatbuffers.Builder, address: number) {
    builder.addFieldInt32(0, address, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endReplaceWithStashedNode(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class SetTextData {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {SetTextData}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): SetTextData {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {SetTextData=} obj
   * @returns {SetTextData}
   */
  static getRootAsSetTextData(
    bb: flatbuffers.ByteBuffer,
    obj?: SetTextData
  ): SetTextData {
    return (obj || new SetTextData()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  data(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startSetTextData(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} dataOffset
   */
  static addData(builder: flatbuffers.Builder, dataOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, dataOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endSetTextData(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class EditTextData {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {EditTextData}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): EditTextData {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {EditTextData=} obj
   * @returns {EditTextData}
   */
  static getRootAsEditTextData(
    bb: flatbuffers.ByteBuffer,
    obj?: EditTextData
  ): EditTextData {
    return (obj || new EditTextData()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  start(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @returns {number}
   */
  end(): number {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  prefix(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.EncodingValue=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  suffix(optionalEncoding?: flatbuffers.EncodingValue): string | null {
    var offset = this.bb.__offset(this.bb_pos, 10)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startEditTextData(builder: flatbuffers.Builder) {
    builder.startObject(4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} start
   */
  static addStart(builder: flatbuffers.Builder, start: number) {
    builder.addFieldInt32(0, start, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} end
   */
  static addEnd(builder: flatbuffers.Builder, end: number) {
    builder.addFieldInt32(1, end, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} prefixOffset
   */
  static addPrefix(
    builder: flatbuffers.Builder,
    prefixOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, prefixOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} suffixOffset
   */
  static addSuffix(
    builder: flatbuffers.Builder,
    suffixOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(3, suffixOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endEditTextData(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class SelectChildren {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {SelectChildren}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): SelectChildren {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {SelectChildren=} obj
   * @returns {SelectChildren}
   */
  static getRootAsSelectChildren(
    bb: flatbuffers.ByteBuffer,
    obj?: SelectChildren
  ): SelectChildren {
    return (obj || new SelectChildren()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startSelectChildren(builder: flatbuffers.Builder) {
    builder.startObject(0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endSelectChildren(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class SelectSibling {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {SelectSibling}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): SelectSibling {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {SelectSibling=} obj
   * @returns {SelectSibling}
   */
  static getRootAsSelectSibling(
    bb: flatbuffers.ByteBuffer,
    obj?: SelectSibling
  ): SelectSibling {
    return (obj || new SelectSibling()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  offset(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startSelectSibling(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} offset
   */
  static addOffset(builder: flatbuffers.Builder, offset: number) {
    builder.addFieldInt32(0, offset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endSelectSibling(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class SelectParent {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {SelectParent}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): SelectParent {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {SelectParent=} obj
   * @returns {SelectParent}
   */
  static getRootAsSelectParent(
    bb: flatbuffers.ByteBuffer,
    obj?: SelectParent
  ): SelectParent {
    return (obj || new SelectParent()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startSelectParent(builder: flatbuffers.Builder) {
    builder.startObject(0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endSelectParent(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class RemoveNextSibling {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {RemoveNextSibling}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): RemoveNextSibling {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {RemoveNextSibling=} obj
   * @returns {RemoveNextSibling}
   */
  static getRootAsRemoveNextSibling(
    bb: flatbuffers.ByteBuffer,
    obj?: RemoveNextSibling
  ): RemoveNextSibling {
    return (obj || new RemoveNextSibling()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startRemoveNextSibling(builder: flatbuffers.Builder) {
    builder.startObject(0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endRemoveNextSibling(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
* @constructor
*/
// export namespace DOMinion{
export class AddEventListener {
  /**
  * @type {flatbuffers.ByteBuffer}
  */
  bb: flatbuffers.ByteBuffer

  /**
  * @type {number}
  */
  bb_pos: number = 0
  /**
* @param {number} i
* @param {flatbuffers.ByteBuffer} bb
* @returns {AddEventListener}
*/
  __init(i: number, bb: flatbuffers.ByteBuffer): AddEventListener {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
* @param {flatbuffers.ByteBuffer} bb
* @param {AddEventListener=} obj
* @returns {AddEventListener}
*/
  static getRootAsAddEventListener(
    bb: flatbuffers.ByteBuffer,
    obj?: AddEventListener
  ): AddEventListener {
    return (obj || new AddEventListener()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
* @param {flatbuffers.Encoding=} optionalEncoding
* @returns {string|Uint8Array|null}
*/
  type(optionalEncoding?: any): string | null {
    // type(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    // type(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
* @returns {boolean}
*/
  capture(): boolean {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false
  }

  /**
* @returns {Decoder.Decoder}
*/
  decoderType(): Decoder.Decoder {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset
      ? /** @type {Decoder.Decoder} */ (((this.bb.readUint8(
          this.bb_pos + offset
        ): any): Decoder.Decoder))
      : Decoder.decoder.NONE
  }

  /**
* @param {flatbuffers.Table} obj
* @returns {?flatbuffers.Table}
*/
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 10)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
* @param {flatbuffers.Builder} builder
*/
  static startAddEventListener(builder: flatbuffers.Builder) {
    builder.startObject(4)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {flatbuffers.Offset} typeOffset
*/
  static addType(builder: flatbuffers.Builder, typeOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, typeOffset, 0)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {boolean} capture
*/
  static addCapture(builder: flatbuffers.Builder, capture: boolean) {
    builder.addFieldInt8(1, +capture, +false)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {Decoder.Decoder} decoderType
*/
  static addDecoderType(
    builder: flatbuffers.Builder,
    decoderType: Decoder.Decoder
  ) {
    builder.addFieldInt8(2, decoderType, Decoder.decoder.NONE)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {flatbuffers.Offset} decoderOffset
*/
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(3, decoderOffset, 0)
  }

  /**
* @param {flatbuffers.Builder} builder
* @returns {flatbuffers.Offset}
*/
  static endAddEventListener(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }
/**
* @constructor
*/
// export namespace DOMinion{
export class RemoveEventListener {
  /**
  * @type {flatbuffers.ByteBuffer}
  */
  bb: flatbuffers.ByteBuffer

  /**
  * @type {number}
  */
  bb_pos: number = 0
  /**
* @param {number} i
* @param {flatbuffers.ByteBuffer} bb
* @returns {RemoveEventListener}
*/
  __init(i: number, bb: flatbuffers.ByteBuffer): RemoveEventListener {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
* @param {flatbuffers.ByteBuffer} bb
* @param {RemoveEventListener=} obj
* @returns {RemoveEventListener}
*/
  static getRootAsRemoveEventListener(
    bb: flatbuffers.ByteBuffer,
    obj?: RemoveEventListener
  ): RemoveEventListener {
    return (obj || new RemoveEventListener()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
* @param {flatbuffers.Encoding=} optionalEncoding
* @returns {string|Uint8Array|null}
*/
  type(optionalEncoding?: any): string | null {
    // type(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    // type(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
* @returns {boolean}
*/
  capture(): boolean {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? !!this.bb.readInt8(this.bb_pos + offset) : false
  }

  /**
* @returns {Decoder.Decoder}
*/
  decoderType(): Decoder.Decoder {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset
      ? /** @type {Decoder.Decoder} */ (((this.bb.readUint8(
          this.bb_pos + offset
        ): any): Decoder.Decoder))
      : Decoder.decoder.NONE
  }

  /**
* @param {flatbuffers.Table} obj
* @returns {?flatbuffers.Table}
*/
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 10)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
* @param {flatbuffers.Builder} builder
*/
  static startRemoveEventListener(builder: flatbuffers.Builder) {
    builder.startObject(4)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {flatbuffers.Offset} typeOffset
*/
  static addType(builder: flatbuffers.Builder, typeOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, typeOffset, 0)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {boolean} capture
*/
  static addCapture(builder: flatbuffers.Builder, capture: boolean) {
    builder.addFieldInt8(1, +capture, +false)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {Decoder.Decoder} decoderType
*/
  static addDecoderType(
    builder: flatbuffers.Builder,
    decoderType: Decoder.Decoder
  ) {
    builder.addFieldInt8(2, decoderType, Decoder.decoder.NONE)
  }

  /**
* @param {flatbuffers.Builder} builder
* @param {flatbuffers.Offset} decoderOffset
*/
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(3, decoderOffset, 0)
  }

  /**
* @param {flatbuffers.Builder} builder
* @returns {flatbuffers.Offset}
*/
  static endRemoveEventListener(
    builder: flatbuffers.Builder
  ): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }
/**
   * @constructor
   */
export class Change {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {Change}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Change {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Change=} obj
   * @returns {Change}
   */
  static getRootAsChange(bb: flatbuffers.ByteBuffer, obj?: Change): Change {
    return (obj || new Change()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Op}
   */
  opType(): Op {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? (this.bb.readUint8(this.bb_pos + offset): any) : op.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  op<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startChange(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Op} opType
   */
  static addOpType(builder: flatbuffers.Builder, opType: Op) {
    builder.addFieldInt8(0, opType, op.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} opOffset
   */
  static addOp(builder: flatbuffers.Builder, opOffset: flatbuffers.Offset) {
    builder.addFieldOffset(1, opOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endChange(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
/**
   * @constructor
   */
export class ChangeLog {
  /**
     * @type {flatbuffers.ByteBuffer}
     */
  bb: flatbuffers.ByteBuffer

  /**
     * @type {number}
     */
  bb_pos: number = 0
  /**
   * @param {number} i
   * @param {flatbuffers.ByteBuffer} bb
   * @returns {ChangeLog}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): ChangeLog {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {ChangeLog=} obj
   * @returns {ChangeLog}
   */
  static getRootAsChangeLog(
    bb: flatbuffers.ByteBuffer,
    obj?: ChangeLog
  ): ChangeLog {
    return (obj || new ChangeLog()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {Change=} obj
   * @returns {Change}
   */
  log(index: number, obj?: Change): Change | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Change()).__init(
          this.bb.__indirect(
            this.bb.__vector(this.bb_pos + offset) + index * 4
          ),
          this.bb
        )
      : null
  }

  /**
   * @returns {number}
   */
  logLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startChangeLog(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} logOffset
   */
  static addLog(builder: flatbuffers.Builder, logOffset: flatbuffers.Offset) {
    builder.addFieldOffset(0, logOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createLogVector(
    builder: flatbuffers.Builder,
    data: flatbuffers.Offset[]
  ): flatbuffers.Offset {
    builder.startVector(4, data.length, 4)
    for (var i = data.length - 1; i >= 0; i--) {
      builder.addOffset(data[i])
    }
    return builder.endVector()
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} numElems
   */
  static startLogVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endChangeLog(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} offset
   */
  static finishChangeLogBuffer(
    builder: flatbuffers.Builder,
    offset: flatbuffers.Offset
  ) {
    builder.finish(offset)
  }
}
