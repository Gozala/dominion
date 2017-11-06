/* @flow */

import type { Table } from "flatbuffers"
import type { Value } from "./JSON.fbs"
import type { integer, float } from "decoder.flow"
import * as Decoder from "decoder.flow"
import * as DecoderTable from "./Decoder.fbs/Decoder"
import type { Builder, Offset } from "flatbuffers"
import type { Encode, Encoder } from "../../Log"
import { DecoderError, FieldError, VariantError } from "./Error"
import JSON from "./JSON.fbs"
import unreachable from "unreachable"

export opaque type Encoded<type>: Offset = Offset

export const decoderType = DecoderTable.decoder
export type DecoderType = DecoderTable.Decoder

type VariantType =
  | Accessor
  | Collection
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
  | Boolean
  | Integer
  | Float
  | String

type EncodedDecoder =
  | Encoded<Accessor>
  | Encoded<Collection>
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
  | Encoded<Boolean>
  | Encoded<String>
  | Encoded<Float>
  | Encoded<Integer>

class Accessor extends DecoderTable.Accessor {
  static encode<a>(
    builder: Builder,
    name: string,
    decoder: Decoder.Decoder<a>
  ): Encoded<Accessor> {
    const nameOffset = builder.createString(name)
    const decoderOffset = Variant.encode(builder, decoder)
    Accessor.startAccessor(builder)
    Accessor.addName(builder, nameOffset)
    Accessor.addDecoderType(builder, Variant.typeOf(decoder))
    Accessor.addDecoder(builder, decoderOffset)
    return Accessor.endAccessor(builder)
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
    const decoder = Variant.decode(this)
    if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return Accessor.decode(name, decoder)
    }
  }
}

class Collection extends DecoderTable.Collection {
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Collection> {
    const encodedDecoder = Variant.encode(builder, decoder)
    Collection.startCollection(builder)
    Collection.addDecoderType(builder, Variant.typeOf(decoder))
    Collection.addDecoder(builder, encodedDecoder)
    return Collection.endCollection(builder)
  }
  static decode<a>(decoder: Decoder.Decoder<a>): Decoder.Decoder<a[]> {
    return Decoder.array(decoder)
  }
  decode<a>(): Decoder.Decoder<a[]> | DecoderError {
    const decoder = Variant.decode(this)
    if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return Collection.decode(decoder)
    }
  }
}

class Dictionary extends DecoderTable.Dictionary {
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Dictionary> {
    const encodedDecoder = Variant.encode(builder, decoder)
    Dictionary.startDictionary(builder)
    Dictionary.addDecoderType(builder, Variant.typeOf(decoder))
    Dictionary.addDecoder(builder, encodedDecoder)
    return Dictionary.endDictionary(builder)
  }
  static decode<a>(
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<{ [string]: a }> {
    return Decoder.dictionary(decoder)
  }
  decode<a>(): Decoder.Decoder<{ [string]: a }> | DecoderError {
    const decoder = Variant.decode(this)
    if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return Dictionary.decode(decoder)
    }
  }
}

class Maybe extends DecoderTable.Maybe {
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Maybe> {
    const encodedDecoder = Variant.encode(builder, decoder)
    Maybe.startMaybe(builder)
    Maybe.addDecoderType(builder, Variant.typeOf(decoder))
    Maybe.addDecoder(builder, encodedDecoder)
    return Maybe.endMaybe(builder)
  }
  static decode<a>(decoder: Decoder.Decoder<a>): Decoder.Decoder<?a> {
    return Decoder.maybe(decoder)
  }
  decode<a>(): Decoder.Decoder<?a> | DecoderError {
    const decoder = Variant.decode(this)
    if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return Maybe.decode(decoder)
    }
  }
}

class Optional extends DecoderTable.Optional {
  static encode<a>(
    builder: Builder,
    decoder: Decoder.Decoder<a>
  ): Encoded<Optional> {
    const encodedDecoder = Variant.encode(builder, decoder)
    Optional.startOptional(builder)
    Optional.addDecoderType(builder, Variant.typeOf(decoder))
    Optional.addDecoder(builder, encodedDecoder)
    return Optional.endOptional(builder)
  }
  static decode<a>(decoder: Decoder.Decoder<a>): Decoder.Decoder<?a> {
    return Decoder.optional(decoder)
  }
  decode<a>(): Decoder.Decoder<?a> | DecoderError {
    const decoder = Variant.decode(this)
    if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return Optional.decode(decoder)
    }
  }
}

class Either extends DecoderTable.Either {
  static variant = new DecoderTable.Variant()
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
    Either.addVariants(builder, encodedVariants)

    return Either.endEither(builder)
  }
  static decode<a>(decoders: Decoder.Decoder<a>[]): Decoder.Decoder<a> {
    return Decoder.either(...decoders)
  }
  decode<a>(): Decoder.Decoder<a> | DecoderError {
    const cursor = Either.variant
    const length = this.variantsLength()
    const variants = []
    let index = 0
    while (index < length) {
      const variant = this.variants(index, cursor)
      if (variant == null) {
        return new FieldError(index.toString(), Either)
      } else {
        const decoder = Variant.decode(variant)
        if (decoder instanceof DecoderError) {
          return decoder
        } else {
          variants[index] = decoder
        }
      }
      index += 1
    }
    return Either.decode(variants)
  }
}

class Undefined extends DecoderTable.Undefined {
  static encode(builder: Builder, value: Value): Encoded<Undefined> {
    const encodedValue = JSON.encode(builder, value)
    Undefined.startUndefined(builder)
    Undefined.addValueType(builder, JSON.typeOf(value))
    if (encodedValue) {
      Undefined.addValue(builder, encodedValue)
    }
    return Undefined.endUndefined(builder)
  }
  static decode(value: Value): Decoder.Decoder<Value> {
    return Decoder.avoid(value)
  }
  decode(): Decoder.Decoder<Value> | DecoderError {
    const value = JSON.decode(this)
    if (value instanceof DecoderError) {
      return new FieldError("value", Undefined)
    } else {
      return Undefined.decode(value)
    }
  }
}

class Null extends DecoderTable.Null {
  static encode(builder: Builder, value: Value): Encoded<Null> {
    const encodedValue = JSON.encode(builder, value)
    Null.startNull(builder)
    Null.addValueType(builder, JSON.typeOf(value))
    if (encodedValue) {
      Null.addValue(builder, encodedValue)
    }
    return Null.endNull(builder)
  }
  static decode(value: Value): Decoder.Decoder<Value> {
    return Decoder.annul(value)
  }
  decode(): Decoder.Decoder<Value> | DecoderError {
    const value = JSON.decode(this)
    if (value instanceof DecoderError) {
      return new FieldError("value", Null)
    } else {
      return Null.decode(value)
    }
  }
}

class Boolean extends DecoderTable.Boolean {
  static encode(builder: Builder): Encoded<Boolean> {
    Boolean.startBoolean(builder)
    return Boolean.endBoolean(builder)
  }
  static decode(): Decoder.Decoder<boolean> {
    return Decoder.Boolean
  }
  decode(): Decoder.Decoder<boolean> {
    return Decoder.Boolean
  }
}

class Integer extends DecoderTable.Integer {
  static encode(builder: Builder): Encoded<Integer> {
    Integer.startInteger(builder)
    return Integer.endInteger(builder)
  }
  static decode(): Decoder.Decoder<integer> {
    return Decoder.Integer
  }
  decode(): Decoder.Decoder<integer> {
    return Decoder.Integer
  }
}

class Float extends DecoderTable.Float {
  static encode(builder: Builder): Encoded<Float> {
    Float.startFloat(builder)
    return Float.endFloat(builder)
  }
  static decode(): Decoder.Decoder<float> {
    return Decoder.Float
  }
  decode(): Decoder.Decoder<float> {
    return Decoder.Float
  }
}

class String extends DecoderTable.String {
  static encode(builder: Builder): Encoded<String> {
    String.startString(builder)
    return String.endString(builder)
  }
  static decode(): Decoder.Decoder<string> {
    return Decoder.String
  }
  static decode(): Decoder.Decoder<string> {
    return Decoder.String
  }
  decode(): Decoder.Decoder<string> {
    return Decoder.String
  }
}

class Field extends DecoderTable.Field {
  static encode<a>(
    builder: Builder,
    name: string,
    decoder: Decoder.Decoder<a>
  ): Encoded<Field> {
    const encodedName = builder.createString(name)
    const encodedVariant = Variant.encode(builder, decoder)
    Field.startField(builder)
    Field.addName(builder, encodedName)
    Field.addDecoderType(builder, Variant.typeOf(decoder))
    Field.addDecoder(builder, encodedVariant)
    return Field.endField(builder)
  }
  static decode<a>(
    name: string,
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<a> {
    return Decoder.field(name, decoder)
  }
  decode<a>(): Decoder.Decoder<a> | DecoderError {
    const name = this.name()
    if (!name) {
      return new FieldError("name", Field)
    }
    const decoder = Variant.decode(this)
    if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return Decoder.field(name, decoder)
    }
  }
}

class Index extends DecoderTable.Index {
  static encode<a>(
    builder: Builder,
    index: number,
    decoder: Decoder.Decoder<a>
  ): Encoded<Index> {
    const encodedVariant = Variant.encode(builder, decoder)
    Index.startIndex(builder)
    Index.addIndex(builder, index)
    Index.addDecoderType(builder, Variant.typeOf(decoder))
    Index.addDecoder(builder, encodedVariant)
    return Index.endIndex(builder)
  }
  static decode<a>(
    index: number,
    decoder: Decoder.Decoder<a>
  ): Decoder.Decoder<a> {
    return Decoder.index(index, decoder)
  }
  decode<a>(): Decoder.Decoder<a> | DecoderError {
    const index = this.index()
    const decoder = Variant.decode(this)
    if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return Decoder.index(index, decoder)
    }
  }
}

class Ok extends DecoderTable.Ok {
  static encode(builder: Builder, value: Value): Encoded<Ok> {
    const encodedValue = JSON.encode(builder, value)
    Ok.startOk(builder)
    Ok.addValueType(builder, JSON.typeOf(value))
    if (encodedValue) {
      Ok.addValue(builder, encodedValue)
    }
    return Ok.endOk(builder)
  }
  static decode(value: Value): Decoder.Decoder<Value> {
    return Decoder.ok(value)
  }
  decode(): Decoder.Decoder<Value> | DecoderError {
    const value = JSON.decode(this)
    if (value instanceof DecoderError) {
      return value
    } else {
      return Ok.decode(value)
    }
  }
}

class Error extends DecoderTable.Error {
  static encode(builder: Builder, message: string): Encoded<Error> {
    const encodedMessage = builder.createString(message)
    Error.startError(builder)
    Error.addMessage(builder, encodedMessage)
    return Error.endError(builder)
  }
  static decode<a>(message: string): Decoder.Decoder<a> {
    return Decoder.error(message)
  }
  decode<a>(): Decoder.Decoder<a> | DecoderError {
    const message = this.message()
    if (message == null) {
      return new FieldError("message", Error)
    } else {
      return Error.decode(message)
    }
  }
}

class Fields {
  static field = new Field()
  static encode<a>(
    builder: Builder,
    fields: { [string]: Decoder.Decoder<a> }
  ): Offset[] {
    const offsets = []
    for (let name of Object.keys(fields)) {
      const decoder = fields[name]
      const nameOffset = builder.createString(name)
      const valueOffset = Variant.encode(builder, decoder)
      Field.startField(builder)
      Field.addName(builder, nameOffset)
      Field.addDecoderType(builder, Variant.typeOf(decoder))
      Field.addDecoder(builder, valueOffset)
      offsets.push(Field.endField(builder))
    }
    return offsets
  }
  static decode<a>(table: Record | Form): { [string]: Decoder.Decoder<a> } {
    const fields = (Object.create(null): Object)
    const cursor = Fields.field
    const length = table.fieldsLength()
    let index = 0
    while (index < length) {
      const field = table.fields(index, cursor)
      if (field == null) {
        return new FieldError(`field#${index}`, Form)
      } else {
        const name = cursor.name()
        if (name == null) {
          return new FieldError(`field#${index}.name`, Form)
        }
        const decoder = Variant.decode(cursor)
        if (decoder instanceof DecoderError) {
          return decoder
        }
        fields[name] = decoder
      }
      index += 1
    }
    return fields
  }
}

class Form extends DecoderTable.Form {
  static cursor = new Field()
  static encode<a>(builder: Builder, fields: Decoder.Fields<a>): Encoded<Form> {
    const encodedFields = Form.createFormVector(
      builder,
      Fields.encode(builder, fields)
    )

    Form.startForm(builder)
    Form.addFields(builder, encodedFields)
    return Form.endForm(builder)
  }
  static decode<a: {}>(fields: Decoder.Fields<a>): Decoder.Decoder<a> {
    return Decoder.form(fields)
  }
  decode<a: {}>(): Decoder.Decoder<a> | DecoderError {
    const fields = Fields.decode(this)
    if (fields instanceof DecoderError) {
      return fields
    } else {
      return Form.decode(fields)
    }
  }
}

class Record extends DecoderTable.Record {
  static encode<a>(
    builder: Builder,
    fields: Decoder.Fields<a>
  ): Encoded<Record> {
    const encodedFields = Record.createFieldsVector(
      builder,
      Fields.encode(builder, fields)
    )
    Record.startRecord(builder)
    Record.addFields(builder, encodedFields)
    return Record.endRecord(builder)
  }
  static decode<a: {}>(fields: Decoder.Fields<a>): Decoder.Decoder<a> {
    return Decoder.record(fields)
  }
  decode<a: {}>(): Decoder.Decoder<a> | DecoderError {
    const fields = Fields.decode(this)
    if (fields instanceof DecoderError) {
      return fields
    } else {
      return Record.decode(fields)
    }
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
    [decoderType.Record]: new Record(),
    [decoderType.Undefined]: new Undefined(),
    [decoderType.Boolean]: new Boolean(),
    [decoderType.Float]: new Float(),
    [decoderType.Integer]: new Integer(),
    [decoderType.String]: new String()
  }
  static typeOf<a>(decoder: Decoder.Decoder<a>): DecoderType {
    const { type } = decoder
    switch (type) {
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
        return Boolean.encode(builder)
      }
      case "Integer": {
        return Integer.encode(builder)
      }
      case "Float": {
        return Float.encode(builder)
      }
      case "String": {
        return String.encode(builder)
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
  static decode<a>(table: {
    decoderType(): DecoderType,
    decoder<t: Table>(t): ?t
  }): Decoder.Decoder<a> | DecoderError {
    const type = table.decoderType()
    const cursor = Variant.pool[type]
    const variant = cursor && table.decoder(cursor)
    const decoder = variant && variant.decode()
    if (decoder == null) {
      return new VariantError(Variant, decoderType, type)
    } else if (decoder instanceof DecoderError) {
      return decoder
    } else {
      return (decoder: any)
    }
  }
}
