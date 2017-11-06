// @flow

// Transformed verison of fbs.ts
// Replace import {flatbuffers} -> import * as flatbuffers
// Comment out all `// export namespace Decoder{` and corresponding `}`
// Rewrite enums to Type and value pairs.
// Replace '<T extends' with '<T:'
// Rewrite all overloads for string field methods.
// Replace 'Decoder.Decoder.' with 'decoderType.'
// Replace 'JSON.' with 'jsonType.'
// Replace 'Value.' with 'valueType.'
// Replace 'Decoder.' with ''
// Replace all '/** @type {Decoder} */ (this.bb.readUint8(this.bb_pos + offset))' with `((this.bb.readUint8(this.bb_pos + offset):any):Decoder)`
// Replace all `/** @type {Value} */ (this.bb.readInt8(this.bb_pos + offset))` with `((this.bb.readInt8(this.bb_pos + offset):any):Value)`
// Replace all `/** @type {JSON} */ (this.bb.readUint8(this.bb_pos + offset))` with `((this.bb.readUint8(this.bb_pos + offset):any):JSON)`

import * as flatbuffers from "flatbuffers"
import * as JSON from "../JSON.fbs/JSON"

/**
 * @enum
 */
// // export namespace Decoder{
export const decoder = {
  NONE: (0: 0),
  Error: (1: 1),
  Ok: (2: 2),
  Boolean: (3: 3),
  Accessor: (4: 4),
  Either: (5: 5),
  Field: (6: 6),
  Index: (7: 7),
  Null: (8: 8),
  Undefined: (9: 9),
  Optional: (10: 10),
  Maybe: (11: 11),
  Collection: (12: 12),
  Dictionary: (13: 13),
  Record: (14: 14),
  Form: (15: 15),
  String: (16: 16),
  Integer: (17: 17),
  Float: (18: 18)
}

export type Decoder = $Values<typeof decoder>
// };

/**
   * @constructor
   */
// export namespace Decoder{
export class Accessor {
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
   * @returns {Accessor}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Accessor {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Accessor=} obj
   * @returns {Accessor}
   */
  static getRootAsAccessor(
    bb: flatbuffers.ByteBuffer,
    obj?: Accessor
  ): Accessor {
    return (obj || new Accessor()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: any): string | null {
    //name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    //name(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startAccessor(builder: flatbuffers.Builder) {
    builder.startObject(3)
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
   * @param {Decoder} accessorType
   */
  static addDecoderType(builder: flatbuffers.Builder, accessorType: Decoder) {
    builder.addFieldInt8(1, accessorType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} accessorOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    accessorOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, accessorOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endAccessor(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Collection {
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
   * @returns {Collection}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Collection {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Collection=} obj
   * @returns {Collection}
   */
  static getRootAsCollection(
    bb: flatbuffers.ByteBuffer,
    obj?: Collection
  ): Collection {
    return (obj || new Collection()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startCollection(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} decoderType
   */
  static addDecoderType(builder: flatbuffers.Builder, decoderType: Decoder) {
    builder.addFieldInt8(0, decoderType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} decoderOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, decoderOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endCollection(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Boolean {
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
   * @returns {Boolean}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Boolean {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Boolean=} obj
   * @returns {Boolean}
   */
  static getRootAsPrimitive(
    bb: flatbuffers.ByteBuffer,
    obj?: Boolean
  ): Boolean {
    return (obj || new Boolean()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startBoolean(builder: flatbuffers.Builder) {
    builder.startObject(0)
  }
  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endBoolean(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Dictionary {
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
   * @returns {Dictionary}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Dictionary {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Dictionary=} obj
   * @returns {Dictionary}
   */
  static getRootAsDictionary(
    bb: flatbuffers.ByteBuffer,
    obj?: Dictionary
  ): Dictionary {
    return (obj || new Dictionary()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startDictionary(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} decoderType
   */
  static addDecoderType(builder: flatbuffers.Builder, decoderType: Decoder) {
    builder.addFieldInt8(0, decoderType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} decoderOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, decoderOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endDictionary(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Either {
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
   * @returns {Either}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Either {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Either=} obj
   * @returns {Either}
   */
  static getRootAsEither(bb: flatbuffers.ByteBuffer, obj?: Either): Either {
    return (obj || new Either()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {Variant=} obj
   * @returns {Variant}
   */
  variants(index: number, obj?: Variant): Variant | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Variant()).__init(
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
  variantsLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startEither(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} variantsOffset
   */
  static addVariants(
    builder: flatbuffers.Builder,
    variantsOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, variantsOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createVariantsVector(
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
  static startVariantsVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endEither(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Variant {
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
   * @returns {Variant}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Variant {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Variant=} obj
   * @returns {Variant}
   */
  static getRootAsVariant(bb: flatbuffers.ByteBuffer, obj?: Variant): Variant {
    return (obj || new Variant()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startVariant(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} decoderType
   */
  static addDecoderType(builder: flatbuffers.Builder, decoderType: Decoder) {
    builder.addFieldInt8(0, decoderType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} decoderOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, decoderOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endVariant(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Error {
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
   * @returns {Error}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Error {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Error=} obj
   * @returns {Error}
   */
  static getRootAsError(bb: flatbuffers.ByteBuffer, obj?: Error): Error {
    return (obj || new Error()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  message(optionalEncoding?: any): string | null {
    //message(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    //message(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startError(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} messageOffset
   */
  static addMessage(
    builder: flatbuffers.Builder,
    messageOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, messageOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endError(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Ok {
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
   * @returns {Ok}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Ok {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Ok=} obj
   * @returns {Ok}
   */
  static getRootAsOk(bb: flatbuffers.ByteBuffer, obj?: Ok): Ok {
    return (obj || new Ok()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {JSON.JSONType}
   */
  valueType(): JSON.JSONType {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): JSON.JSONType)
      : JSON.JSONVariant.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  value<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startOk(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {JSON.JSONType} JSONType
   */
  static addValueType(builder: flatbuffers.Builder, valueType: JSON.JSONType) {
    builder.addFieldInt8(0, valueType, JSON.JSONVariant.NONE)
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
  static endOk(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Field {
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
   * @returns {Field}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Field {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Field=} obj
   * @returns {Field}
   */
  static getRootAsField(bb: flatbuffers.ByteBuffer, obj?: Field): Field {
    return (obj || new Field()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {flatbuffers.Encoding=} optionalEncoding
   * @returns {string|Uint8Array|null}
   */
  name(optionalEncoding?: any): string | null {
    //name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
    //name(optionalEncoding?:any):string|Uint8Array|null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? this.bb.__string(this.bb_pos + offset, optionalEncoding)
      : null
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startField(builder: flatbuffers.Builder) {
    builder.startObject(3)
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
   * @param {Decoder} decoderType
   */
  static addDecoderType(builder: flatbuffers.Builder, decoderType: Decoder) {
    builder.addFieldInt8(1, decoderType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} fieldOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, decoderOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endField(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Index {
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
   * @returns {Index}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Index {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Index=} obj
   * @returns {Index}
   */
  static getRootAsIndex(bb: flatbuffers.ByteBuffer, obj?: Index): Index {
    return (obj || new Index()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {number}
   */
  index(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.readInt32(this.bb_pos + offset) : 0
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 8)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startIndex(builder: flatbuffers.Builder) {
    builder.startObject(3)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {number} index
   */
  static addIndex(builder: flatbuffers.Builder, index: number) {
    builder.addFieldInt32(0, index, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} memberType
   */
  static addDecoderType(builder: flatbuffers.Builder, decoderType: Decoder) {
    builder.addFieldInt8(1, decoderType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} memberOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(2, decoderOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endIndex(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Form {
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
   * @returns {Form}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Form {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Form=} obj
   * @returns {Form}
   */
  static getRootAsForm(bb: flatbuffers.ByteBuffer, obj?: Form): Form {
    return (obj || new Form()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {Field=} obj
   * @returns {Field}
   */
  fields(index: number, obj?: Field): Field | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Field()).__init(
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
  fieldsLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startForm(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} fieldsOffset
   */
  static addFields(
    builder: flatbuffers.Builder,
    fieldsOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, fieldsOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createFormVector(
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
  static startFieldsVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endForm(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Record {
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
   * @returns {Record}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Record {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Record=} obj
   * @returns {Record}
   */
  static getRootAsRecord(bb: flatbuffers.ByteBuffer, obj?: Record): Record {
    return (obj || new Record()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @param {number} index
   * @param {Field=} obj
   * @returns {Field}
   */
  fields(index: number, obj?: Field): Field | null {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? (obj || new Field()).__init(
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
  fieldsLength(): number {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startRecord(builder: flatbuffers.Builder) {
    builder.startObject(1)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} fieldsOffset
   */
  static addFields(
    builder: flatbuffers.Builder,
    fieldsOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(0, fieldsOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Array.<flatbuffers.Offset>} data
   * @returns {flatbuffers.Offset}
   */
  static createFieldsVector(
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
  static startFieldsVector(builder: flatbuffers.Builder, numElems: number) {
    builder.startVector(4, numElems, 4)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endRecord(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Maybe {
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
   * @returns {Maybe}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Maybe {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Maybe=} obj
   * @returns {Maybe}
   */
  static getRootAsMaybe(bb: flatbuffers.ByteBuffer, obj?: Maybe): Maybe {
    return (obj || new Maybe()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startMaybe(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} decoderType
   */
  static addDecoderType(builder: flatbuffers.Builder, decoderType: Decoder) {
    builder.addFieldInt8(0, decoderType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} maybeOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, decoderOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endMaybe(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Null {
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
   * @returns {Null}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Null {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Null=} obj
   * @returns {Null}
   */
  static getRootAsNull(bb: flatbuffers.ByteBuffer, obj?: Null): Null {
    return (obj || new Null()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {JSON}
   */
  valueType(): JSON.JSONType {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): JSON.JSONType)
      : JSON.JSONVariant.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  value<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startNull(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {JSON} valueType
   */
  static addValueType(builder: flatbuffers.Builder, valueType: JSON.JSONType) {
    builder.addFieldInt8(0, valueType, JSON.JSONVariant.NONE)
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
  static endNull(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Undefined {
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
   * @returns {Undefined}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Undefined {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Undefined=} obj
   * @returns {Undefined}
   */
  static getRootAsUndefined(
    bb: flatbuffers.ByteBuffer,
    obj?: Undefined
  ): Undefined {
    return (obj || new Undefined()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {JSON}
   */
  valueType(): JSON.JSONType {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): JSON.JSONType)
      : JSON.JSONVariant.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  value<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startUndefined(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {JSON} valueType
   */
  static addValueType(builder: flatbuffers.Builder, valueType: JSON.JSONType) {
    builder.addFieldInt8(0, valueType, JSON.JSONVariant.NONE)
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
  static endUndefined(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }

  //}
}
/**
   * @constructor
   */
// export namespace Decoder{
export class Optional {
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
   * @returns {Optional}
   */
  __init(i: number, bb: flatbuffers.ByteBuffer): Optional {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
   * @param {flatbuffers.ByteBuffer} bb
   * @param {Optional=} obj
   * @returns {Optional}
   */
  static getRootAsOptional(
    bb: flatbuffers.ByteBuffer,
    obj?: Optional
  ): Optional {
    return (obj || new Optional()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
   * @returns {Decoder}
   */
  decoderType(): Decoder {
    var offset = this.bb.__offset(this.bb_pos, 4)
    return offset
      ? ((this.bb.readUint8(this.bb_pos + offset): any): Decoder)
      : decoder.NONE
  }

  /**
   * @param {flatbuffers.Table} obj
   * @returns {?flatbuffers.Table}
   */
  decoder<T: flatbuffers.Table>(obj: T): T | null {
    var offset = this.bb.__offset(this.bb_pos, 6)
    return offset ? this.bb.__union(obj, this.bb_pos + offset) : null
  }

  /**
   * @param {flatbuffers.Builder} builder
   */
  static startOptional(builder: flatbuffers.Builder) {
    builder.startObject(2)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {Decoder} decoderType
   */
  static addDecoderType(builder: flatbuffers.Builder, decoderType: Decoder) {
    builder.addFieldInt8(0, decoderType, decoder.NONE)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @param {flatbuffers.Offset} optionalOffset
   */
  static addDecoder(
    builder: flatbuffers.Builder,
    decoderOffset: flatbuffers.Offset
  ) {
    builder.addFieldOffset(1, decoderOffset, 0)
  }

  /**
   * @param {flatbuffers.Builder} builder
   * @returns {flatbuffers.Offset}
   */
  static endOptional(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }

/**
 * @constructor
 */
// export namespace Decoder{
export class Integer {
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
 * @returns {Integer}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): Integer {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Integer=} obj
 * @returns {Integer}
 */
  static getRootAsInteger(bb: flatbuffers.ByteBuffer, obj?: Integer): Integer {
    return (obj || new Integer()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startInteger(builder: flatbuffers.Builder) {
    builder.startObject(0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endInteger(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }
/**
 * @constructor
 */
// export namespace Decoder{
export class Float {
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
 * @returns {Float}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): Float {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {Float=} obj
 * @returns {Float}
 */
  static getRootAsFloat(bb: flatbuffers.ByteBuffer, obj?: Float): Float {
    return (obj || new Float()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startFloat(builder: flatbuffers.Builder) {
    builder.startObject(0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endFloat(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }
/**
 * @constructor
 */
// export namespace Decoder{
export class String {
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
 * @returns {String}
 */
  __init(i: number, bb: flatbuffers.ByteBuffer): String {
    this.bb_pos = i
    this.bb = bb
    return this
  }

  /**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {String=} obj
 * @returns {String}
 */
  static getRootAsString(bb: flatbuffers.ByteBuffer, obj?: String): String {
    return (obj || new String()).__init(
      bb.readInt32(bb.position()) + bb.position(),
      bb
    )
  }

  /**
 * @param {flatbuffers.Builder} builder
 */
  static startString(builder: flatbuffers.Builder) {
    builder.startObject(0)
  }

  /**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
  static endString(builder: flatbuffers.Builder): flatbuffers.Offset {
    var offset = builder.endObject()
    return offset
  }
}
// }
