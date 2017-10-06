/* @flow */

import Encoder from "./FlatBuffer/Encoder"
import Decoder from "./FlatBuffer/Decoder"

export default class FlatBuffer {
  static Encoder = Encoder
  static Decoder = Decoder
  static encoder = Encoder.encoder
  static encode = Encoder.encode
  static decode = Decoder.decode
}
