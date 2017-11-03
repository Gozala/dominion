/* @flow */

import type { Table } from "flatbuffers"
import * as Decoder from "decoder.flow"
import * as FBSD from "./Decoder.fbs.ts.js"
import type { Builder, Offset } from "flatbuffers"
import type { Encode, Encoder } from "../../Log"
import { DecoderError, FieldError } from "./Error"
import unreachable from "unreachable"

export opaque type Encoded<type>: Offset = Offset

export const decoderType = FBSD.decoder
export const valueType = FBSD.value
export type DecoderType = FBSD.Decoder
export type ValueType = FBSD.Value

type JSONValue =
  | number
  | string
  | null
  | Array<JSONValue>
  | { [string]: JSONValue }

class String extends FBSD.String {
  static encode(builder: Builder, value: string): Encoded<String> {
    const offset = builder.createString(value)
    String.startString(builder)
    String.addValue(builder, offset)
    return String.endString(builder)
  }
}

class Float extends FBSD.Float {
  static encode(builder: Builder, value: number): Encoded<Float> {
    Float.startFloat(builder)
    Float.addValue(builder, value)
    return Float.endFloat(builder)
  }
}

class Boolean extends FBSD.Boolean {
  static encode(builder: Builder, value: boolean): Encoded<Boolean> {
    Boolean.startBoolean(builder)
    Boolean.addValue(builder, value)
    return Boolean.endBoolean(builder)
  }
}

class JSONElement extends FBSD.JSONElement {
  static encode(builder: Builder, value: JSONValue): Encoded<JSONElement> {
    const type = JSON.typeOf(value)
    const encodedValue =
      type === valueType.Null ? null : JSON.encode(builder, value)
    JSONElement.startJSONElement(builder)
    JSONElement.addValueType(builder, type)
    if (encodedValue) {
      JSONElement.addValue(builder, encodedValue)
    }
    return JSONElement.endJSONElement(builder)
  }
}

class JSONArray extends FBSD.JSONArray {
  static encode(builder: Builder, array: JSONValue[]): Encoded<JSONArray> {
    const elements = []
    for (let element of array) {
      elements.push(JSONElement.encode(builder, element))
    }
    const offset = JSONArray.createElementsVector(builder, elements)
    JSONArray.startJSONArray(builder)
    if (offset != null) {
      JSONArray.addElements(builder, offset)
    } else {
      throw TypeError("Unable to create a vector")
    }
    return JSONArray.endJSONArray(builder)
  }
}

class JSONProperty extends FBSD.JSONProperty {
  static encode(
    builder: Builder,
    name: string,
    value: JSONValue
  ): Encoded<JSONProperty> {
    const encodedName = builder.createString(name)
    const encodedValue = JSON.encode(builder, value)
    JSONProperty.startJSONProperty(builder)
    JSONProperty.addName(builder, encodedName)
    JSONProperty.addValueType(builder, JSON.typeOf(value))
    if (encodedValue != null) {
      JSONProperty.addValue(builder, encodedValue)
    }
    return JSONProperty.endJSONProperty(builder)
  }
}

class JSONObject extends FBSD.JSONObject {
  static encode(
    builder: Builder,
    object: { [string]: JSONValue }
  ): Encoded<JSONObject> {
    const properties = []
    for (const name of Object.keys(object)) {
      const value = object[name]
      properties.push(JSONProperty.encode(builder, name, value))
    }
    const offset = JSONObject.createPropretiesVector(builder, properties)
    JSONObject.startJSONObject(builder)
    if (offset != null) {
      JSONObject.addPropreties(builder, offset)
    } else {
      throw TypeError("Unable to create vector")
    }
    return JSONObject.endJSONObject(builder)
  }
}

type EncodedJSON =
  | null
  | Encoded<JSONArray>
  | Encoded<JSONObject>
  | Encoded<String>
  | Encoded<Boolean>
  | Encoded<Float>

export class JSON {
  static from<a>(value: mixed): JSONValue {
    return (value: any)
  }
  static typeOf(value: mixed): ValueType {
    switch (typeof value) {
      case "string":
        return valueType.String
      case "boolean":
        return valueType.Boolean
      case "number":
        return valueType.Float
      default: {
        if (value === null) {
          return valueType.Null
        } else {
          return valueType.JSON
        }
      }
    }
  }
  static encode(builder: Builder, value: JSONValue): EncodedJSON {
    switch (typeof value) {
      case "string": {
        return String.encode(builder, value)
      }
      case "number": {
        return Float.encode(builder, value)
      }
      case "boolean": {
        return Boolean.encode(builder, value)
      }
      case "object": {
        if (value === null) {
          return null
        } else if (Array.isArray(value)) {
          return JSONArray.encode(builder, value)
        } else {
          return JSONObject.encode(builder, value)
        }
      }
      default:
        return unreachable(value)
    }
  }
}

type VariantType =
  | Accessor
  | Collection
  | Primitive
  | Dictionary
  | Maybe
  | Optional
  | Either
  | Null
  | Undefined
  | Field
  | Index
  | Ok
  | Error
  | Form
  | Record

type EncodedDecoder =
  | Encoded<Accessor>
  | Encoded<Collection>
  | Encoded<Primitive>
  | Encoded<Dictionary>
  | Encoded<Maybe>
  | Encoded<Optional>
  | Encoded<Either>
  | Encoded<Null>
  | Encoded<Undefined>
  | Encoded<Field>
  | Encoded<Index>
  | Encoded<Ok>
  | Encoded<Error>
  | Encoded<Form>
  | Encoded<Record>

class Accessor extends FBSD.Accessor {
  decoderType: typeof decoderType.Accessor = decoderType.Accessor
  static encode<a>(
    builder: Builder,
    name: string,
    decoder: Decoder.Decoder<a>
  ): Encoded<Accessor> {
    const nameOffset = builder.createString(name)
    const decoderOffset = Variant.encode(builder, decoder)
    Accessor.startAccessor(builder)
    Accessor.addName(builder, nameOffset)
    Accessor.addAccessorType(builder, Variant.typeOf(decoder))
    Accessor.addAccessor(builder, decoderOffset)
    return FBSD.Accessor.endAccessor(builder)
  }
  static decode<a>(
    name: string,
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<a> {
    return Decoder.accessor(name, decoder)
  }
  decode<a>(): Decoder.Decoder<a> | DecoderError {
    const name = this.name()
    if (!name) {
      return new FieldError("name", Accessor)
    }
    const type = this.accessorType()
    const variant = Variant.variant(type)
    const encodedAccessor = variant && this.accessor(variant)
    const decoder = encodedAccessor && Variant.decode(encodedAccessor)
    if (decoder) {
      return Accessor.decode(name, decoder)
    } else {
      return new FieldError("accessor", Accessor)
    }
  }
}

class Collection extends FBSD.Collection {
  decoderType: typeof decoderType.Collection = decoderType.Collection
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Collection> {
    const encodedDecoder = Variant.encode(builder, decoder)
    Collection.startCollection(builder)
    Collection.addItemType(builder, Variant.typeOf(decoder))
    Collection.addItem(builder, encodedDecoder)
    return Collection.endCollection(builder)
  }
  static decode<a>(decoder: Decoder.Decoder<a>): Decoder.Decoder<a[]> {
    return Decoder.array(decoder)
  }
}
class Fields {
  static encode<a>(
    builder: Builder,
    fields: { [string]: Decoder.Decoder<a> }
  ): Offset[] {
    const offsets = []
    for (let name of Object.keys(fields)) {
      const decoder = fields[name]
      const nameOffset = builder.createString(name)
      const valueOffset = Variant.encode(builder, decoder)
      FBSD.Field.startField(builder)
      FBSD.Field.addName(builder, nameOffset)
      FBSD.Field.addFieldType(builder, Variant.typeOf(decoder))
      FBSD.Field.addField(builder, valueOffset)
      offsets.push(FBSD.Field.endField(builder))
    }
    return offsets
  }
  static decode<a>(
    name: string,
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<a> {
    return Decoder.field(name, decoder)
  }
}

class Primitive extends FBSD.Primitive {
  decoderType: typeof decoderType.Primitive = decoderType.Primitive
  static encode(builder: Builder, type: ValueType): Encoded<Primitive> {
    Primitive.startPrimitive(builder)
    Primitive.addType(builder, type)
    return Primitive.endPrimitive(builder)
  }
  static decode(
    type: ValueType
  ):
    | Decoder.Decoder<string>
    | Decoder.Decoder<Decoder.float>
    | Decoder.Decoder<Decoder.integer>
    | Decoder.Decoder<boolean> {
    switch (type) {
      case valueType.Boolean:
        return Decoder.Boolean
      case valueType.Float:
        return Decoder.Float
      case valueType.Integer:
        return Decoder.Integer
      case valueType.String:
        return Decoder.String
      default:
        throw TypeError(`Unsupported decoder type ${type}`)
    }
  }
}

class Dictionary extends FBSD.Dictionary {
  decoderType: typeof decoderType.Dictionary = decoderType.Dictionary
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Dictionary> {
    const encodedDecoder = Variant.encode(builder, decoder)
    FBSD.Dictionary.startDictionary(builder)
    FBSD.Dictionary.addDictionaryType(builder, Variant.typeOf(decoder))
    FBSD.Dictionary.addDictionary(builder, encodedDecoder)
    return FBSD.Dictionary.endDictionary(builder)
  }
  static decode<a>(
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<{ [string]: a }> {
    return Decoder.dictionary(decoder)
  }
}

class Maybe extends FBSD.Maybe {
  decoderType: typeof decoderType.Maybe = decoderType.Maybe
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Maybe> {
    const encodedDecoder = Variant.encode(builder, decoder)
    Maybe.startMaybe(builder)
    Maybe.addMaybeType(builder, Variant.typeOf(decoder))
    Maybe.addMaybe(builder, encodedDecoder)
    return Maybe.endMaybe(builder)
  }
  static decode<a>(decoder: Decoder.Decoder<a>): Decoder.Decoder<?a> {
    return Decoder.maybe(decoder)
  }
}

class Optional extends FBSD.Optional {
  decoderType: typeof decoderType.Optional = decoderType.Optional
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Optional> {
    const encodedDecoder = Variant.encode(builder, decoder)
    Optional.startOptional(builder)
    Optional.addOptionalType(builder, Variant.typeOf(decoder))
    Optional.addOptional(builder, encodedDecoder)
    return Optional.endOptional(builder)
  }
  static decode<a>(decoder: Decoder.Decoder<a>): Decoder.Decoder<?a> {
    return Decoder.optional(decoder)
  }
}

class Either extends FBSD.Either {
  decoderType: typeof decoderType.Either = decoderType.Either
  static encode<a>(
    builder: Builder,
    decoders: Decoder.Decoder<a>[]
  ): Encoded<Either> {
    const variants = []
    for (const variant of decoders) {
      variants.push(Variant.encode(builder, variant))
    }

    const encodedVariants = Either.createVariantsVector(builder, variants)

    Either.startEither(builder)
    if (encodedVariants != null) {
      Either.addVariants(builder, encodedVariants)
    } else {
      throw TypeError("was unable to create variants vector")
    }

    return Either.endEither(builder)
  }
  static decode<a>(decoders: Decoder.Decoder<a>[]): Decoder.Decoder<a> {
    return Decoder.either(...decoders)
  }
}

class Undefined extends FBSD.Undefined {
  decoderType: typeof decoderType.Undefined = decoderType.Undefined
  static encode(builder: Builder, value: JSONValue): Encoded<Undefined> {
    const encodedValue = JSON.encode(builder, value)
    Undefined.startUndefined(builder)
    Undefined.addUndefinedType(builder, JSON.typeOf(value))
    if (encodedValue) {
      Undefined.addUndefined(builder, encodedValue)
    }
    return Undefined.endUndefined(builder)
  }
  static decode(value: JSONValue): Decoder.Decoder<JSONValue> {
    return Decoder.avoid(value)
  }
}

class Null extends FBSD.Null {
  decoderType: typeof decoderType.Null = decoderType.Null
  static encode(builder: Builder, value: JSONValue): Encoded<Null> {
    const encodedValue = JSON.encode(builder, value)
    Null.startNull(builder)
    Null.addNullType(builder, JSON.typeOf(value))
    if (encodedValue) {
      Null.addNull(builder, encodedValue)
    }
    return Null.endNull(builder)
  }
  static decode(value: JSONValue): Decoder.Decoder<JSONValue> {
    return Decoder.annul(value)
  }
}

class Field extends FBSD.Field {
  decoderType: typeof decoderType.Field = decoderType.Field
  static encode<a>(
    builder: Builder,
    name: string,
    decoder: Decoder.Decoder<a>
  ): Encoded<Field> {
    const encodedName = builder.createString(name)
    const encodedVariant = Variant.encode(builder, decoder)
    Field.startField(builder)
    Field.addName(builder, encodedName)
    Field.addFieldType(builder, Variant.typeOf(decoder))
    Field.addField(builder, encodedVariant)
    return Field.endField(builder)
  }
  static decode<a>(
    name: string,
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<a> {
    return Decoder.field(name, decoder)
  }
}

class Index extends FBSD.Index {
  decoderType: typeof decoderType.Index = decoderType.Index
  static encode<a>(
    builder: Builder,
    index: number,
    decoder: Decoder.Decoder<a>
  ): Encoded<Index> {
    const encodedVariant = Variant.encode(builder, decoder)
    Index.startIndex(builder)
    Index.addIndex(builder, index)
    Index.addMemberType(builder, Variant.typeOf(decoder))
    Index.addMember(builder, encodedVariant)
    return Index.endIndex(builder)
  }
  static decode<a>(
    index: number,
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<a> {
    return Decoder.index(index, decoder)
  }
}

class Ok extends FBSD.Ok {
  decoderType: typeof decoderType.Ok = decoderType.Ok
  static encode(builder: Builder, value: JSONValue): Encoded<Ok> {
    const encodedValue = JSON.encode(builder, value)
    Ok.startOk(builder)
    Ok.addOkType(builder, JSON.typeOf(value))
    if (encodedValue) {
      Ok.addOk(builder, encodedValue)
    }
    return Ok.endOk(builder)
  }
  static decode(value: JSONValue): Decoder.Decoder<JSONValue> {
    return Decoder.ok(value)
  }
}

class Error extends FBSD.Error {
  decoderType: typeof decoderType.Error = decoderType.Error
  static encode(builder: Builder, message: string): Encoded<Error> {
    const encodedMessage = builder.createString(message)
    Error.startError(builder)
    Error.addMessage(builder, encodedMessage)
    return Error.endError(builder)
  }
  static decode<a>(message: string): Decoder.Decoder<a> {
    return Decoder.error(message)
  }
}

class Form extends FBSD.Form {
  decoderType: typeof decoderType.Form = decoderType.Form
  static encode<a>(builder: Builder, form: Decoder.Fields<a>): Encoded<Form> {
    const encodedFields = Form.createFormVector(
      builder,
      Fields.encode(builder, form)
    )

    Form.startForm(builder)
    if (encodedFields) {
      Form.addForm(builder, encodedFields)
    } else {
      throw TypeError("Can't create vector")
    }
    return Form.endForm(builder)
  }
  static decode<a: {}>(fields: Decoder.Fields<a>): Decoder.Decoder<a> {
    return Decoder.form(fields)
  }
}

class Record extends FBSD.Record {
  decoderType: typeof decoderType.Record = decoderType.Record
  static encode<a>(
    builder: Builder,
    fields: Decoder.Fields<a>
  ): Encoded<Record> {
    const encodedFields = Record.createFieldsVector(
      builder,
      Fields.encode(builder, fields)
    )
    Record.startRecord(builder)
    if (encodedFields) {
      Record.addFields(builder, encodedFields)
    } else {
      throw TypeError("Can't create vector")
    }
    return Record.endRecord(builder)
  }
  static decode<a: {}>(fields: Decoder.Fields<a>): Decoder.Record<a> {
    return Decoder.record(fields)
  }
}

export default class Variant {
  static pool: { [DecoderType]: VariantType } = {
    [decoderType.Accessor]: new Accessor(),
    [decoderType.Collection]: new Collection(),
    [decoderType.Dictionary]: new Dictionary(),
    [decoderType.Either]: new Either(),
    [decoderType.Error]: new Error(),
    [decoderType.Field]: new Field(),
    [decoderType.Form]: new Form(),
    [decoderType.Index]: new Index(),
    [decoderType.Maybe]: new Maybe(),
    [decoderType.Null]: new Null(),
    [decoderType.Ok]: new Ok(),
    [decoderType.Optional]: new Optional(),
    [decoderType.Primitive]: new Primitive(),
    [decoderType.Record]: new Record(),
    [decoderType.Undefined]: new Undefined()
  }
  static typeOf<a>(decoder: Decoder.Decoder<a>): DecoderType {
    const { type } = decoder
    switch (type) {
      case "Boolean":
      case "Float":
      case "Integer":
      case "String":
        return decoderType.Primitive
      case "Array":
        return decoderType.Collection
      default:
        return decoderType[type]
    }
  }
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): EncodedDecoder {
    switch (decoder.type) {
      case "Accessor": {
        return Accessor.encode(builder, decoder.name, decoder.accessor)
      }
      case "Array": {
        return Collection.encode(builder, decoder.array)
      }
      case "Boolean": {
        return Primitive.encode(builder, valueType.Boolean)
      }
      case "Integer": {
        return Primitive.encode(builder, valueType.Integer)
      }
      case "Float": {
        return Primitive.encode(builder, valueType.Float)
      }
      case "String": {
        return Primitive.encode(builder, valueType.String)
      }
      case "Dictionary": {
        return Dictionary.encode(builder, decoder.dictionary)
      }
      case "Maybe": {
        return Maybe.encode(builder, decoder.maybe)
      }
      case "Optional": {
        return Optional.encode(builder, decoder.optional)
      }
      case "Either": {
        return Either.encode(builder, decoder.either)
      }
      case "Null": {
        return Null.encode(builder, JSON.from(decoder.Null))
      }
      case "Undefined": {
        return Undefined.encode(builder, JSON.from(decoder.Undefined))
      }
      case "Field": {
        return Field.encode(builder, decoder.name, decoder.field)
      }
      case "Index": {
        return Index.encode(builder, decoder.index, decoder.member)
      }
      case "Ok": {
        return Ok.encode(builder, JSON.from(decoder.value))
      }
      case "Error": {
        return Error.encode(builder, decoder.message)
      }
      case "Record": {
        return Record.encode(builder, decoder.fields)
      }
      case "Form": {
        return Form.encode(builder, decoder.form)
      }
      default:
        return unreachable(decoder)
    }
  }
  static decode<a>(variant: VariantType): Decoder.Decoder<a> | DecoderError {
    return variant.decode()
  }
  static variant(type: DecoderType): ?VariantType {
    return Variant.pool[type]
  }
}
