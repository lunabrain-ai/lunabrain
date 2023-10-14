"use strict";
(() => {
  // ../node_modules/@bufbuild/protobuf/dist/esm/private/assert.js
  function assert(condition, msg) {
    if (!condition) {
      throw new Error(msg);
    }
  }
  var FLOAT32_MAX = 34028234663852886e22;
  var FLOAT32_MIN = -34028234663852886e22;
  var UINT32_MAX = 4294967295;
  var INT32_MAX = 2147483647;
  var INT32_MIN = -2147483648;
  function assertInt32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid int 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
      throw new Error("invalid int 32: " + arg);
  }
  function assertUInt32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid uint 32: " + typeof arg);
    if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
      throw new Error("invalid uint 32: " + arg);
  }
  function assertFloat32(arg) {
    if (typeof arg !== "number")
      throw new Error("invalid float 32: " + typeof arg);
    if (!Number.isFinite(arg))
      return;
    if (arg > FLOAT32_MAX || arg < FLOAT32_MIN)
      throw new Error("invalid float 32: " + arg);
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/enum.js
  var enumTypeSymbol = Symbol("@bufbuild/protobuf/enum-type");
  function getEnumType(enumObject) {
    const t = enumObject[enumTypeSymbol];
    assert(t, "missing enum type on enum object");
    return t;
  }
  function setEnumType(enumObject, typeName, values, opt) {
    enumObject[enumTypeSymbol] = makeEnumType(typeName, values.map((v) => ({
      no: v.no,
      name: v.name,
      localName: enumObject[v.no]
    })), opt);
  }
  function makeEnumType(typeName, values, _opt) {
    const names = /* @__PURE__ */ Object.create(null);
    const numbers = /* @__PURE__ */ Object.create(null);
    const normalValues = [];
    for (const value of values) {
      const n = normalizeEnumValue(value);
      normalValues.push(n);
      names[value.name] = n;
      numbers[value.no] = n;
    }
    return {
      typeName,
      values: normalValues,
      // We do not surface options at this time
      // options: opt?.options ?? Object.create(null),
      findName(name) {
        return names[name];
      },
      findNumber(no) {
        return numbers[no];
      }
    };
  }
  function makeEnum(typeName, values, opt) {
    const enumObject = {};
    for (const value of values) {
      const n = normalizeEnumValue(value);
      enumObject[n.localName] = n.no;
      enumObject[n.no] = n.localName;
    }
    setEnumType(enumObject, typeName, values, opt);
    return enumObject;
  }
  function normalizeEnumValue(value) {
    if ("localName" in value) {
      return value;
    }
    return Object.assign(Object.assign({}, value), { localName: value.name });
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/message.js
  var Message = class {
    /**
     * Compare with a message of the same type.
     */
    equals(other) {
      return this.getType().runtime.util.equals(this.getType(), this, other);
    }
    /**
     * Create a deep copy.
     */
    clone() {
      return this.getType().runtime.util.clone(this);
    }
    /**
     * Parse from binary data, merging fields.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    fromBinary(bytes, options) {
      const type = this.getType(), format = type.runtime.bin, opt = format.makeReadOptions(options);
      format.readMessage(this, opt.readerFactory(bytes), bytes.byteLength, opt);
      return this;
    }
    /**
     * Parse a message from a JSON value.
     */
    fromJson(jsonValue, options) {
      const type = this.getType(), format = type.runtime.json, opt = format.makeReadOptions(options);
      format.readMessage(type, jsonValue, opt, this);
      return this;
    }
    /**
     * Parse a message from a JSON string.
     */
    fromJsonString(jsonString, options) {
      let json;
      try {
        json = JSON.parse(jsonString);
      } catch (e) {
        throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${e instanceof Error ? e.message : String(e)}`);
      }
      return this.fromJson(json, options);
    }
    /**
     * Serialize the message to binary data.
     */
    toBinary(options) {
      const type = this.getType(), bin = type.runtime.bin, opt = bin.makeWriteOptions(options), writer = opt.writerFactory();
      bin.writeMessage(this, writer, opt);
      return writer.finish();
    }
    /**
     * Serialize the message to a JSON value, a JavaScript value that can be
     * passed to JSON.stringify().
     */
    toJson(options) {
      const type = this.getType(), json = type.runtime.json, opt = json.makeWriteOptions(options);
      return json.writeMessage(this, opt);
    }
    /**
     * Serialize the message to a JSON string.
     */
    toJsonString(options) {
      var _a;
      const value = this.toJson(options);
      return JSON.stringify(value, null, (_a = options === null || options === void 0 ? void 0 : options.prettySpaces) !== null && _a !== void 0 ? _a : 0);
    }
    /**
     * Override for serialization behavior. This will be invoked when calling
     * JSON.stringify on this message (i.e. JSON.stringify(msg)).
     *
     * Note that this will not serialize google.protobuf.Any with a packed
     * message because the protobuf JSON format specifies that it needs to be
     * unpacked, and this is only possible with a type registry to look up the
     * message type.  As a result, attempting to serialize a message with this
     * type will throw an Error.
     *
     * This method is protected because you should not need to invoke it
     * directly -- instead use JSON.stringify or toJsonString for
     * stringified JSON.  Alternatively, if actual JSON is desired, you should
     * use toJson.
     */
    toJSON() {
      return this.toJson({
        emitDefaultValues: true
      });
    }
    /**
     * Retrieve the MessageType of this message - a singleton that represents
     * the protobuf message declaration and provides metadata for reflection-
     * based operations.
     */
    getType() {
      return Object.getPrototypeOf(this).constructor;
    }
  };

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/message-type.js
  function makeMessageType(runtime, typeName, fields, opt) {
    var _a;
    const localName = (_a = opt === null || opt === void 0 ? void 0 : opt.localName) !== null && _a !== void 0 ? _a : typeName.substring(typeName.lastIndexOf(".") + 1);
    const type = {
      [localName]: function(data) {
        runtime.util.initFields(this);
        runtime.util.initPartial(data, this);
      }
    }[localName];
    Object.setPrototypeOf(type.prototype, new Message());
    Object.assign(type, {
      runtime,
      typeName,
      fields: runtime.util.newFieldList(fields),
      fromBinary(bytes, options) {
        return new type().fromBinary(bytes, options);
      },
      fromJson(jsonValue, options) {
        return new type().fromJson(jsonValue, options);
      },
      fromJsonString(jsonString, options) {
        return new type().fromJsonString(jsonString, options);
      },
      equals(a, b) {
        return runtime.util.equals(type, a, b);
      }
    });
    return type;
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/proto-runtime.js
  function makeProtoRuntime(syntax, json, bin, util) {
    return {
      syntax,
      json,
      bin,
      util,
      makeMessageType(typeName, fields, opt) {
        return makeMessageType(this, typeName, fields, opt);
      },
      makeEnum,
      makeEnumType,
      getEnumType
    };
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/field.js
  var ScalarType;
  (function(ScalarType2) {
    ScalarType2[ScalarType2["DOUBLE"] = 1] = "DOUBLE";
    ScalarType2[ScalarType2["FLOAT"] = 2] = "FLOAT";
    ScalarType2[ScalarType2["INT64"] = 3] = "INT64";
    ScalarType2[ScalarType2["UINT64"] = 4] = "UINT64";
    ScalarType2[ScalarType2["INT32"] = 5] = "INT32";
    ScalarType2[ScalarType2["FIXED64"] = 6] = "FIXED64";
    ScalarType2[ScalarType2["FIXED32"] = 7] = "FIXED32";
    ScalarType2[ScalarType2["BOOL"] = 8] = "BOOL";
    ScalarType2[ScalarType2["STRING"] = 9] = "STRING";
    ScalarType2[ScalarType2["BYTES"] = 12] = "BYTES";
    ScalarType2[ScalarType2["UINT32"] = 13] = "UINT32";
    ScalarType2[ScalarType2["SFIXED32"] = 15] = "SFIXED32";
    ScalarType2[ScalarType2["SFIXED64"] = 16] = "SFIXED64";
    ScalarType2[ScalarType2["SINT32"] = 17] = "SINT32";
    ScalarType2[ScalarType2["SINT64"] = 18] = "SINT64";
  })(ScalarType || (ScalarType = {}));

  // ../node_modules/@bufbuild/protobuf/dist/esm/google/varint.js
  function varint64read() {
    let lowBits = 0;
    let highBits = 0;
    for (let shift = 0; shift < 28; shift += 7) {
      let b = this.buf[this.pos++];
      lowBits |= (b & 127) << shift;
      if ((b & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
    }
    let middleByte = this.buf[this.pos++];
    lowBits |= (middleByte & 15) << 28;
    highBits = (middleByte & 112) >> 4;
    if ((middleByte & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
    for (let shift = 3; shift <= 31; shift += 7) {
      let b = this.buf[this.pos++];
      highBits |= (b & 127) << shift;
      if ((b & 128) == 0) {
        this.assertBounds();
        return [lowBits, highBits];
      }
    }
    throw new Error("invalid varint");
  }
  function varint64write(lo, hi, bytes) {
    for (let i = 0; i < 28; i = i + 7) {
      const shift = lo >>> i;
      const hasNext = !(shift >>> 7 == 0 && hi == 0);
      const byte = (hasNext ? shift | 128 : shift) & 255;
      bytes.push(byte);
      if (!hasNext) {
        return;
      }
    }
    const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
    const hasMoreBits = !(hi >> 3 == 0);
    bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
    if (!hasMoreBits) {
      return;
    }
    for (let i = 3; i < 31; i = i + 7) {
      const shift = hi >>> i;
      const hasNext = !(shift >>> 7 == 0);
      const byte = (hasNext ? shift | 128 : shift) & 255;
      bytes.push(byte);
      if (!hasNext) {
        return;
      }
    }
    bytes.push(hi >>> 31 & 1);
  }
  var TWO_PWR_32_DBL = 4294967296;
  function int64FromString(dec) {
    const minus = dec[0] === "-";
    if (minus) {
      dec = dec.slice(1);
    }
    const base = 1e6;
    let lowBits = 0;
    let highBits = 0;
    function add1e6digit(begin, end) {
      const digit1e6 = Number(dec.slice(begin, end));
      highBits *= base;
      lowBits = lowBits * base + digit1e6;
      if (lowBits >= TWO_PWR_32_DBL) {
        highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
        lowBits = lowBits % TWO_PWR_32_DBL;
      }
    }
    add1e6digit(-24, -18);
    add1e6digit(-18, -12);
    add1e6digit(-12, -6);
    add1e6digit(-6);
    return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
  }
  function int64ToString(lo, hi) {
    let bits = newBits(lo, hi);
    const negative = bits.hi & 2147483648;
    if (negative) {
      bits = negate(bits.lo, bits.hi);
    }
    const result = uInt64ToString(bits.lo, bits.hi);
    return negative ? "-" + result : result;
  }
  function uInt64ToString(lo, hi) {
    ({ lo, hi } = toUnsigned(lo, hi));
    if (hi <= 2097151) {
      return String(TWO_PWR_32_DBL * hi + lo);
    }
    const low = lo & 16777215;
    const mid = (lo >>> 24 | hi << 8) & 16777215;
    const high = hi >> 16 & 65535;
    let digitA = low + mid * 6777216 + high * 6710656;
    let digitB = mid + high * 8147497;
    let digitC = high * 2;
    const base = 1e7;
    if (digitA >= base) {
      digitB += Math.floor(digitA / base);
      digitA %= base;
    }
    if (digitB >= base) {
      digitC += Math.floor(digitB / base);
      digitB %= base;
    }
    return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
  }
  function toUnsigned(lo, hi) {
    return { lo: lo >>> 0, hi: hi >>> 0 };
  }
  function newBits(lo, hi) {
    return { lo: lo | 0, hi: hi | 0 };
  }
  function negate(lowBits, highBits) {
    highBits = ~highBits;
    if (lowBits) {
      lowBits = ~lowBits + 1;
    } else {
      highBits += 1;
    }
    return newBits(lowBits, highBits);
  }
  var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
    const partial = String(digit1e7);
    return "0000000".slice(partial.length) + partial;
  };
  function varint32write(value, bytes) {
    if (value >= 0) {
      while (value > 127) {
        bytes.push(value & 127 | 128);
        value = value >>> 7;
      }
      bytes.push(value);
    } else {
      for (let i = 0; i < 9; i++) {
        bytes.push(value & 127 | 128);
        value = value >> 7;
      }
      bytes.push(1);
    }
  }
  function varint32read() {
    let b = this.buf[this.pos++];
    let result = b & 127;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 7;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 14;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 127) << 21;
    if ((b & 128) == 0) {
      this.assertBounds();
      return result;
    }
    b = this.buf[this.pos++];
    result |= (b & 15) << 28;
    for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
      b = this.buf[this.pos++];
    if ((b & 128) != 0)
      throw new Error("invalid varint");
    this.assertBounds();
    return result >>> 0;
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
  function makeInt64Support() {
    const dv = new DataView(new ArrayBuffer(8));
    const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
    if (ok) {
      const MIN = BigInt("-9223372036854775808"), MAX = BigInt("9223372036854775807"), UMIN = BigInt("0"), UMAX = BigInt("18446744073709551615");
      return {
        zero: BigInt(0),
        supported: true,
        parse(value) {
          const bi = typeof value == "bigint" ? value : BigInt(value);
          if (bi > MAX || bi < MIN) {
            throw new Error(`int64 invalid: ${value}`);
          }
          return bi;
        },
        uParse(value) {
          const bi = typeof value == "bigint" ? value : BigInt(value);
          if (bi > UMAX || bi < UMIN) {
            throw new Error(`uint64 invalid: ${value}`);
          }
          return bi;
        },
        enc(value) {
          dv.setBigInt64(0, this.parse(value), true);
          return {
            lo: dv.getInt32(0, true),
            hi: dv.getInt32(4, true)
          };
        },
        uEnc(value) {
          dv.setBigInt64(0, this.uParse(value), true);
          return {
            lo: dv.getInt32(0, true),
            hi: dv.getInt32(4, true)
          };
        },
        dec(lo, hi) {
          dv.setInt32(0, lo, true);
          dv.setInt32(4, hi, true);
          return dv.getBigInt64(0, true);
        },
        uDec(lo, hi) {
          dv.setInt32(0, lo, true);
          dv.setInt32(4, hi, true);
          return dv.getBigUint64(0, true);
        }
      };
    }
    const assertInt64String = (value) => assert(/^-?[0-9]+$/.test(value), `int64 invalid: ${value}`);
    const assertUInt64String = (value) => assert(/^[0-9]+$/.test(value), `uint64 invalid: ${value}`);
    return {
      zero: "0",
      supported: false,
      parse(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertInt64String(value);
        return value;
      },
      uParse(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertUInt64String(value);
        return value;
      },
      enc(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertInt64String(value);
        return int64FromString(value);
      },
      uEnc(value) {
        if (typeof value != "string") {
          value = value.toString();
        }
        assertUInt64String(value);
        return int64FromString(value);
      },
      dec(lo, hi) {
        return int64ToString(lo, hi);
      },
      uDec(lo, hi) {
        return uInt64ToString(lo, hi);
      }
    };
  }
  var protoInt64 = makeInt64Support();

  // ../node_modules/@bufbuild/protobuf/dist/esm/binary-encoding.js
  var WireType;
  (function(WireType2) {
    WireType2[WireType2["Varint"] = 0] = "Varint";
    WireType2[WireType2["Bit64"] = 1] = "Bit64";
    WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
    WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
    WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
    WireType2[WireType2["Bit32"] = 5] = "Bit32";
  })(WireType || (WireType = {}));
  var BinaryWriter = class {
    constructor(textEncoder) {
      this.stack = [];
      this.textEncoder = textEncoder !== null && textEncoder !== void 0 ? textEncoder : new TextEncoder();
      this.chunks = [];
      this.buf = [];
    }
    /**
     * Return all bytes written and reset this writer.
     */
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let len = 0;
      for (let i = 0; i < this.chunks.length; i++)
        len += this.chunks[i].length;
      let bytes = new Uint8Array(len);
      let offset = 0;
      for (let i = 0; i < this.chunks.length; i++) {
        bytes.set(this.chunks[i], offset);
        offset += this.chunks[i].length;
      }
      this.chunks = [];
      return bytes;
    }
    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */
    fork() {
      this.stack.push({ chunks: this.chunks, buf: this.buf });
      this.chunks = [];
      this.buf = [];
      return this;
    }
    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */
    join() {
      let chunk = this.finish();
      let prev = this.stack.pop();
      if (!prev)
        throw new Error("invalid state, fork stack empty");
      this.chunks = prev.chunks;
      this.buf = prev.buf;
      this.uint32(chunk.byteLength);
      return this.raw(chunk);
    }
    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */
    tag(fieldNo, type) {
      return this.uint32((fieldNo << 3 | type) >>> 0);
    }
    /**
     * Write a chunk of raw bytes.
     */
    raw(chunk) {
      if (this.buf.length) {
        this.chunks.push(new Uint8Array(this.buf));
        this.buf = [];
      }
      this.chunks.push(chunk);
      return this;
    }
    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */
    uint32(value) {
      assertUInt32(value);
      while (value > 127) {
        this.buf.push(value & 127 | 128);
        value = value >>> 7;
      }
      this.buf.push(value);
      return this;
    }
    /**
     * Write a `int32` value, a signed 32 bit varint.
     */
    int32(value) {
      assertInt32(value);
      varint32write(value, this.buf);
      return this;
    }
    /**
     * Write a `bool` value, a variant.
     */
    bool(value) {
      this.buf.push(value ? 1 : 0);
      return this;
    }
    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */
    bytes(value) {
      this.uint32(value.byteLength);
      return this.raw(value);
    }
    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */
    string(value) {
      let chunk = this.textEncoder.encode(value);
      this.uint32(chunk.byteLength);
      return this.raw(chunk);
    }
    /**
     * Write a `float` value, 32-bit floating point number.
     */
    float(value) {
      assertFloat32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setFloat32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `double` value, a 64-bit floating point number.
     */
    double(value) {
      let chunk = new Uint8Array(8);
      new DataView(chunk.buffer).setFloat64(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(value) {
      assertUInt32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setUint32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */
    sfixed32(value) {
      assertInt32(value);
      let chunk = new Uint8Array(4);
      new DataView(chunk.buffer).setInt32(0, value, true);
      return this.raw(chunk);
    }
    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(value) {
      assertInt32(value);
      value = (value << 1 ^ value >> 31) >>> 0;
      varint32write(value, this.buf);
      return this;
    }
    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */
    sfixed64(value) {
      let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
      view.setInt32(0, tc.lo, true);
      view.setInt32(4, tc.hi, true);
      return this.raw(chunk);
    }
    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(value) {
      let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
      view.setInt32(0, tc.lo, true);
      view.setInt32(4, tc.hi, true);
      return this.raw(chunk);
    }
    /**
     * Write a `int64` value, a signed 64-bit varint.
     */
    int64(value) {
      let tc = protoInt64.enc(value);
      varint64write(tc.lo, tc.hi, this.buf);
      return this;
    }
    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(value) {
      let tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
      varint64write(lo, hi, this.buf);
      return this;
    }
    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */
    uint64(value) {
      let tc = protoInt64.uEnc(value);
      varint64write(tc.lo, tc.hi, this.buf);
      return this;
    }
  };
  var BinaryReader = class {
    constructor(buf, textDecoder) {
      this.varint64 = varint64read;
      this.uint32 = varint32read;
      this.buf = buf;
      this.len = buf.length;
      this.pos = 0;
      this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
      this.textDecoder = textDecoder !== null && textDecoder !== void 0 ? textDecoder : new TextDecoder();
    }
    /**
     * Reads a tag - field number and wire type.
     */
    tag() {
      let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
      if (fieldNo <= 0 || wireType < 0 || wireType > 5)
        throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
      return [fieldNo, wireType];
    }
    /**
     * Skip one element on the wire and return the skipped data.
     * Supports WireType.StartGroup since v2.0.0-alpha.23.
     */
    skip(wireType) {
      let start = this.pos;
      switch (wireType) {
        case WireType.Varint:
          while (this.buf[this.pos++] & 128) {
          }
          break;
        case WireType.Bit64:
          this.pos += 4;
        case WireType.Bit32:
          this.pos += 4;
          break;
        case WireType.LengthDelimited:
          let len = this.uint32();
          this.pos += len;
          break;
        case WireType.StartGroup:
          let t;
          while ((t = this.tag()[1]) !== WireType.EndGroup) {
            this.skip(t);
          }
          break;
        default:
          throw new Error("cant skip wire type " + wireType);
      }
      this.assertBounds();
      return this.buf.subarray(start, this.pos);
    }
    /**
     * Throws error if position in byte array is out of range.
     */
    assertBounds() {
      if (this.pos > this.len)
        throw new RangeError("premature EOF");
    }
    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    int32() {
      return this.uint32() | 0;
    }
    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32() {
      let zze = this.uint32();
      return zze >>> 1 ^ -(zze & 1);
    }
    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64() {
      return protoInt64.dec(...this.varint64());
    }
    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64() {
      return protoInt64.uDec(...this.varint64());
    }
    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64() {
      let [lo, hi] = this.varint64();
      let s = -(lo & 1);
      lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
      hi = hi >>> 1 ^ s;
      return protoInt64.dec(lo, hi);
    }
    /**
     * Read a `bool` field, a variant.
     */
    bool() {
      let [lo, hi] = this.varint64();
      return lo !== 0 || hi !== 0;
    }
    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64() {
      return protoInt64.uDec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64() {
      return protoInt64.dec(this.sfixed32(), this.sfixed32());
    }
    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes() {
      let len = this.uint32(), start = this.pos;
      this.pos += len;
      this.assertBounds();
      return this.buf.subarray(start, start + len);
    }
    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string() {
      return this.textDecoder.decode(this.bytes());
    }
  };

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/field-wrapper.js
  function wrapField(type, value) {
    if (value instanceof Message || !type.fieldWrapper) {
      return value;
    }
    return type.fieldWrapper.wrapField(value);
  }
  var wktWrapperToScalarType = {
    "google.protobuf.DoubleValue": ScalarType.DOUBLE,
    "google.protobuf.FloatValue": ScalarType.FLOAT,
    "google.protobuf.Int64Value": ScalarType.INT64,
    "google.protobuf.UInt64Value": ScalarType.UINT64,
    "google.protobuf.Int32Value": ScalarType.INT32,
    "google.protobuf.UInt32Value": ScalarType.UINT32,
    "google.protobuf.BoolValue": ScalarType.BOOL,
    "google.protobuf.StringValue": ScalarType.STRING,
    "google.protobuf.BytesValue": ScalarType.BYTES
  };

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/scalars.js
  function scalarEquals(type, a, b) {
    if (a === b) {
      return true;
    }
    if (type == ScalarType.BYTES) {
      if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) {
        return false;
      }
      if (a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return false;
        }
      }
      return true;
    }
    switch (type) {
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        return a == b;
    }
    return false;
  }
  function scalarDefaultValue(type) {
    switch (type) {
      case ScalarType.BOOL:
        return false;
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        return protoInt64.zero;
      case ScalarType.DOUBLE:
      case ScalarType.FLOAT:
        return 0;
      case ScalarType.BYTES:
        return new Uint8Array(0);
      case ScalarType.STRING:
        return "";
      default:
        return 0;
    }
  }
  function scalarTypeInfo(type, value) {
    const isUndefined = value === void 0;
    let wireType = WireType.Varint;
    let isIntrinsicDefault = value === 0;
    switch (type) {
      case ScalarType.STRING:
        isIntrinsicDefault = isUndefined || !value.length;
        wireType = WireType.LengthDelimited;
        break;
      case ScalarType.BOOL:
        isIntrinsicDefault = value === false;
        break;
      case ScalarType.DOUBLE:
        wireType = WireType.Bit64;
        break;
      case ScalarType.FLOAT:
        wireType = WireType.Bit32;
        break;
      case ScalarType.INT64:
        isIntrinsicDefault = isUndefined || value == 0;
        break;
      case ScalarType.UINT64:
        isIntrinsicDefault = isUndefined || value == 0;
        break;
      case ScalarType.FIXED64:
        isIntrinsicDefault = isUndefined || value == 0;
        wireType = WireType.Bit64;
        break;
      case ScalarType.BYTES:
        isIntrinsicDefault = isUndefined || !value.byteLength;
        wireType = WireType.LengthDelimited;
        break;
      case ScalarType.FIXED32:
        wireType = WireType.Bit32;
        break;
      case ScalarType.SFIXED32:
        wireType = WireType.Bit32;
        break;
      case ScalarType.SFIXED64:
        isIntrinsicDefault = isUndefined || value == 0;
        wireType = WireType.Bit64;
        break;
      case ScalarType.SINT64:
        isIntrinsicDefault = isUndefined || value == 0;
        break;
    }
    const method = ScalarType[type].toLowerCase();
    return [wireType, method, isUndefined || isIntrinsicDefault];
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/binary-format-common.js
  var unknownFieldsSymbol = Symbol("@bufbuild/protobuf/unknown-fields");
  var readDefaults = {
    readUnknownFields: true,
    readerFactory: (bytes) => new BinaryReader(bytes)
  };
  var writeDefaults = {
    writeUnknownFields: true,
    writerFactory: () => new BinaryWriter()
  };
  function makeReadOptions(options) {
    return options ? Object.assign(Object.assign({}, readDefaults), options) : readDefaults;
  }
  function makeWriteOptions(options) {
    return options ? Object.assign(Object.assign({}, writeDefaults), options) : writeDefaults;
  }
  function makeBinaryFormatCommon() {
    return {
      makeReadOptions,
      makeWriteOptions,
      listUnknownFields(message) {
        var _a;
        return (_a = message[unknownFieldsSymbol]) !== null && _a !== void 0 ? _a : [];
      },
      discardUnknownFields(message) {
        delete message[unknownFieldsSymbol];
      },
      writeUnknownFields(message, writer) {
        const m = message;
        const c = m[unknownFieldsSymbol];
        if (c) {
          for (const f of c) {
            writer.tag(f.no, f.wireType).raw(f.data);
          }
        }
      },
      onUnknownField(message, no, wireType, data) {
        const m = message;
        if (!Array.isArray(m[unknownFieldsSymbol])) {
          m[unknownFieldsSymbol] = [];
        }
        m[unknownFieldsSymbol].push({ no, wireType, data });
      },
      readMessage(message, reader, length, options) {
        const type = message.getType();
        const end = length === void 0 ? reader.len : reader.pos + length;
        while (reader.pos < end) {
          const [fieldNo, wireType] = reader.tag(), field = type.fields.find(fieldNo);
          if (!field) {
            const data = reader.skip(wireType);
            if (options.readUnknownFields) {
              this.onUnknownField(message, fieldNo, wireType, data);
            }
            continue;
          }
          let target = message, repeated = field.repeated, localName = field.localName;
          if (field.oneof) {
            target = target[field.oneof.localName];
            if (target.case != localName) {
              delete target.value;
            }
            target.case = localName;
            localName = "value";
          }
          switch (field.kind) {
            case "scalar":
            case "enum":
              const scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
              if (repeated) {
                let arr = target[localName];
                if (wireType == WireType.LengthDelimited && scalarType != ScalarType.STRING && scalarType != ScalarType.BYTES) {
                  let e = reader.uint32() + reader.pos;
                  while (reader.pos < e) {
                    arr.push(readScalar(reader, scalarType));
                  }
                } else {
                  arr.push(readScalar(reader, scalarType));
                }
              } else {
                target[localName] = readScalar(reader, scalarType);
              }
              break;
            case "message":
              const messageType = field.T;
              if (repeated) {
                target[localName].push(readMessageField(reader, new messageType(), options));
              } else {
                if (target[localName] instanceof Message) {
                  readMessageField(reader, target[localName], options);
                } else {
                  target[localName] = readMessageField(reader, new messageType(), options);
                  if (messageType.fieldWrapper && !field.oneof && !field.repeated) {
                    target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
                  }
                }
              }
              break;
            case "map":
              let [mapKey, mapVal] = readMapEntry(field, reader, options);
              target[localName][mapKey] = mapVal;
              break;
          }
        }
      }
    };
  }
  function readMessageField(reader, message, options) {
    const format = message.getType().runtime.bin;
    format.readMessage(message, reader, reader.uint32(), options);
    return message;
  }
  function readMapEntry(field, reader, options) {
    const length = reader.uint32(), end = reader.pos + length;
    let key, val;
    while (reader.pos < end) {
      let [fieldNo] = reader.tag();
      switch (fieldNo) {
        case 1:
          key = readScalar(reader, field.K);
          break;
        case 2:
          switch (field.V.kind) {
            case "scalar":
              val = readScalar(reader, field.V.T);
              break;
            case "enum":
              val = reader.int32();
              break;
            case "message":
              val = readMessageField(reader, new field.V.T(), options);
              break;
          }
          break;
      }
    }
    if (key === void 0) {
      let keyRaw = scalarDefaultValue(field.K);
      key = field.K == ScalarType.BOOL ? keyRaw.toString() : keyRaw;
    }
    if (typeof key != "string" && typeof key != "number") {
      key = key.toString();
    }
    if (val === void 0) {
      switch (field.V.kind) {
        case "scalar":
          val = scalarDefaultValue(field.V.T);
          break;
        case "enum":
          val = 0;
          break;
        case "message":
          val = new field.V.T();
          break;
      }
    }
    return [key, val];
  }
  function readScalar(reader, type) {
    switch (type) {
      case ScalarType.STRING:
        return reader.string();
      case ScalarType.BOOL:
        return reader.bool();
      case ScalarType.DOUBLE:
        return reader.double();
      case ScalarType.FLOAT:
        return reader.float();
      case ScalarType.INT32:
        return reader.int32();
      case ScalarType.INT64:
        return reader.int64();
      case ScalarType.UINT64:
        return reader.uint64();
      case ScalarType.FIXED64:
        return reader.fixed64();
      case ScalarType.BYTES:
        return reader.bytes();
      case ScalarType.FIXED32:
        return reader.fixed32();
      case ScalarType.SFIXED32:
        return reader.sfixed32();
      case ScalarType.SFIXED64:
        return reader.sfixed64();
      case ScalarType.SINT64:
        return reader.sint64();
      case ScalarType.UINT32:
        return reader.uint32();
      case ScalarType.SINT32:
        return reader.sint32();
    }
  }
  function writeMapEntry(writer, options, field, key, value) {
    writer.tag(field.no, WireType.LengthDelimited);
    writer.fork();
    let keyValue = key;
    switch (field.K) {
      case ScalarType.INT32:
      case ScalarType.FIXED32:
      case ScalarType.UINT32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
        keyValue = Number.parseInt(key);
        break;
      case ScalarType.BOOL:
        assert(key == "true" || key == "false");
        keyValue = key == "true";
        break;
    }
    writeScalar(writer, field.K, 1, keyValue, true);
    switch (field.V.kind) {
      case "scalar":
        writeScalar(writer, field.V.T, 2, value, true);
        break;
      case "enum":
        writeScalar(writer, ScalarType.INT32, 2, value, true);
        break;
      case "message":
        writeMessageField(writer, options, field.V.T, 2, value);
        break;
    }
    writer.join();
  }
  function writeMessageField(writer, options, type, fieldNo, value) {
    if (value !== void 0) {
      const message = wrapField(type, value);
      writer.tag(fieldNo, WireType.LengthDelimited).bytes(message.toBinary(options));
    }
  }
  function writeScalar(writer, type, fieldNo, value, emitIntrinsicDefault) {
    let [wireType, method, isIntrinsicDefault] = scalarTypeInfo(type, value);
    if (!isIntrinsicDefault || emitIntrinsicDefault) {
      writer.tag(fieldNo, wireType)[method](value);
    }
  }
  function writePacked(writer, type, fieldNo, value) {
    if (!value.length) {
      return;
    }
    writer.tag(fieldNo, WireType.LengthDelimited).fork();
    let [, method] = scalarTypeInfo(type);
    for (let i = 0; i < value.length; i++) {
      writer[method](value[i]);
    }
    writer.join();
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/binary-format-proto3.js
  function makeBinaryFormatProto3() {
    return Object.assign(Object.assign({}, makeBinaryFormatCommon()), { writeMessage(message, writer, options) {
      const type = message.getType();
      for (const field of type.fields.byNumber()) {
        let value, repeated = field.repeated, localName = field.localName;
        if (field.oneof) {
          const oneof = message[field.oneof.localName];
          if (oneof.case !== localName) {
            continue;
          }
          value = oneof.value;
        } else {
          value = message[localName];
        }
        switch (field.kind) {
          case "scalar":
          case "enum":
            let scalarType = field.kind == "enum" ? ScalarType.INT32 : field.T;
            if (repeated) {
              if (field.packed) {
                writePacked(writer, scalarType, field.no, value);
              } else {
                for (const item of value) {
                  writeScalar(writer, scalarType, field.no, item, true);
                }
              }
            } else {
              if (value !== void 0) {
                writeScalar(writer, scalarType, field.no, value, !!field.oneof || field.opt);
              }
            }
            break;
          case "message":
            if (repeated) {
              for (const item of value) {
                writeMessageField(writer, options, field.T, field.no, item);
              }
            } else {
              writeMessageField(writer, options, field.T, field.no, value);
            }
            break;
          case "map":
            for (const [key, val] of Object.entries(value)) {
              writeMapEntry(writer, options, field, key, val);
            }
            break;
        }
      }
      if (options.writeUnknownFields) {
        this.writeUnknownFields(message, writer);
      }
      return writer;
    } });
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/proto-base64.js
  var encTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  var decTable = [];
  for (let i = 0; i < encTable.length; i++)
    decTable[encTable[i].charCodeAt(0)] = i;
  decTable["-".charCodeAt(0)] = encTable.indexOf("+");
  decTable["_".charCodeAt(0)] = encTable.indexOf("/");
  var protoBase64 = {
    /**
     * Decodes a base64 string to a byte array.
     *
     * - ignores white-space, including line breaks and tabs
     * - allows inner padding (can decode concatenated base64 strings)
     * - does not require padding
     * - understands base64url encoding:
     *   "-" instead of "+",
     *   "_" instead of "/",
     *   no padding
     */
    dec(base64Str) {
      let es = base64Str.length * 3 / 4;
      if (base64Str[base64Str.length - 2] == "=")
        es -= 2;
      else if (base64Str[base64Str.length - 1] == "=")
        es -= 1;
      let bytes = new Uint8Array(es), bytePos = 0, groupPos = 0, b, p = 0;
      for (let i = 0; i < base64Str.length; i++) {
        b = decTable[base64Str.charCodeAt(i)];
        if (b === void 0) {
          switch (base64Str[i]) {
            case "=":
              groupPos = 0;
            case "\n":
            case "\r":
            case "	":
            case " ":
              continue;
            default:
              throw Error("invalid base64 string.");
          }
        }
        switch (groupPos) {
          case 0:
            p = b;
            groupPos = 1;
            break;
          case 1:
            bytes[bytePos++] = p << 2 | (b & 48) >> 4;
            p = b;
            groupPos = 2;
            break;
          case 2:
            bytes[bytePos++] = (p & 15) << 4 | (b & 60) >> 2;
            p = b;
            groupPos = 3;
            break;
          case 3:
            bytes[bytePos++] = (p & 3) << 6 | b;
            groupPos = 0;
            break;
        }
      }
      if (groupPos == 1)
        throw Error("invalid base64 string.");
      return bytes.subarray(0, bytePos);
    },
    /**
     * Encode a byte array to a base64 string.
     */
    enc(bytes) {
      let base64 = "", groupPos = 0, b, p = 0;
      for (let i = 0; i < bytes.length; i++) {
        b = bytes[i];
        switch (groupPos) {
          case 0:
            base64 += encTable[b >> 2];
            p = (b & 3) << 4;
            groupPos = 1;
            break;
          case 1:
            base64 += encTable[p | b >> 4];
            p = (b & 15) << 2;
            groupPos = 2;
            break;
          case 2:
            base64 += encTable[p | b >> 6];
            base64 += encTable[b & 63];
            groupPos = 0;
            break;
        }
      }
      if (groupPos) {
        base64 += encTable[p];
        base64 += "=";
        if (groupPos == 1)
          base64 += "=";
      }
      return base64;
    }
  };

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/json-format-common.js
  var jsonReadDefaults = {
    ignoreUnknownFields: false
  };
  var jsonWriteDefaults = {
    emitDefaultValues: false,
    enumAsInteger: false,
    useProtoFieldName: false,
    prettySpaces: 0
  };
  function makeReadOptions2(options) {
    return options ? Object.assign(Object.assign({}, jsonReadDefaults), options) : jsonReadDefaults;
  }
  function makeWriteOptions2(options) {
    return options ? Object.assign(Object.assign({}, jsonWriteDefaults), options) : jsonWriteDefaults;
  }
  function makeJsonFormatCommon(makeWriteField) {
    const writeField = makeWriteField(writeEnum, writeScalar2);
    return {
      makeReadOptions: makeReadOptions2,
      makeWriteOptions: makeWriteOptions2,
      readMessage(type, json, options, message) {
        if (json == null || Array.isArray(json) || typeof json != "object") {
          throw new Error(`cannot decode message ${type.typeName} from JSON: ${this.debug(json)}`);
        }
        message = message !== null && message !== void 0 ? message : new type();
        const oneofSeen = {};
        for (const [jsonKey, jsonValue] of Object.entries(json)) {
          const field = type.fields.findJsonName(jsonKey);
          if (!field) {
            if (!options.ignoreUnknownFields) {
              throw new Error(`cannot decode message ${type.typeName} from JSON: key "${jsonKey}" is unknown`);
            }
            continue;
          }
          let localName = field.localName;
          let target = message;
          if (field.oneof) {
            if (jsonValue === null && field.kind == "scalar") {
              continue;
            }
            const seen = oneofSeen[field.oneof.localName];
            if (seen) {
              throw new Error(`cannot decode message ${type.typeName} from JSON: multiple keys for oneof "${field.oneof.name}" present: "${seen}", "${jsonKey}"`);
            }
            oneofSeen[field.oneof.localName] = jsonKey;
            target = target[field.oneof.localName] = { case: localName };
            localName = "value";
          }
          if (field.repeated) {
            if (jsonValue === null) {
              continue;
            }
            if (!Array.isArray(jsonValue)) {
              throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`);
            }
            const targetArray = target[localName];
            for (const jsonItem of jsonValue) {
              if (jsonItem === null) {
                throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonItem)}`);
              }
              let val;
              switch (field.kind) {
                case "message":
                  val = field.T.fromJson(jsonItem, options);
                  break;
                case "enum":
                  val = readEnum(field.T, jsonItem, options.ignoreUnknownFields);
                  if (val === void 0)
                    continue;
                  break;
                case "scalar":
                  try {
                    val = readScalar2(field.T, jsonItem);
                  } catch (e) {
                    let m = `cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonItem)}`;
                    if (e instanceof Error && e.message.length > 0) {
                      m += `: ${e.message}`;
                    }
                    throw new Error(m);
                  }
                  break;
              }
              targetArray.push(val);
            }
          } else if (field.kind == "map") {
            if (jsonValue === null) {
              continue;
            }
            if (Array.isArray(jsonValue) || typeof jsonValue != "object") {
              throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`);
            }
            const targetMap = target[localName];
            for (const [jsonMapKey, jsonMapValue] of Object.entries(jsonValue)) {
              if (jsonMapValue === null) {
                throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: map value null`);
              }
              let val;
              switch (field.V.kind) {
                case "message":
                  val = field.V.T.fromJson(jsonMapValue, options);
                  break;
                case "enum":
                  val = readEnum(field.V.T, jsonMapValue, options.ignoreUnknownFields);
                  if (val === void 0)
                    continue;
                  break;
                case "scalar":
                  try {
                    val = readScalar2(field.V.T, jsonMapValue);
                  } catch (e) {
                    let m = `cannot decode map value for field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`;
                    if (e instanceof Error && e.message.length > 0) {
                      m += `: ${e.message}`;
                    }
                    throw new Error(m);
                  }
                  break;
              }
              try {
                targetMap[readScalar2(field.K, field.K == ScalarType.BOOL ? jsonMapKey == "true" ? true : jsonMapKey == "false" ? false : jsonMapKey : jsonMapKey).toString()] = val;
              } catch (e) {
                let m = `cannot decode map key for field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`;
                if (e instanceof Error && e.message.length > 0) {
                  m += `: ${e.message}`;
                }
                throw new Error(m);
              }
            }
          } else {
            switch (field.kind) {
              case "message":
                const messageType = field.T;
                if (jsonValue === null && messageType.typeName != "google.protobuf.Value") {
                  if (field.oneof) {
                    throw new Error(`cannot decode field ${type.typeName}.${field.name} from JSON: null is invalid for oneof field "${jsonKey}"`);
                  }
                  continue;
                }
                if (target[localName] instanceof Message) {
                  target[localName].fromJson(jsonValue, options);
                } else {
                  target[localName] = messageType.fromJson(jsonValue, options);
                  if (messageType.fieldWrapper && !field.oneof) {
                    target[localName] = messageType.fieldWrapper.unwrapField(target[localName]);
                  }
                }
                break;
              case "enum":
                const enumValue = readEnum(field.T, jsonValue, options.ignoreUnknownFields);
                if (enumValue !== void 0) {
                  target[localName] = enumValue;
                }
                break;
              case "scalar":
                try {
                  target[localName] = readScalar2(field.T, jsonValue);
                } catch (e) {
                  let m = `cannot decode field ${type.typeName}.${field.name} from JSON: ${this.debug(jsonValue)}`;
                  if (e instanceof Error && e.message.length > 0) {
                    m += `: ${e.message}`;
                  }
                  throw new Error(m);
                }
                break;
            }
          }
        }
        return message;
      },
      writeMessage(message, options) {
        const type = message.getType();
        const json = {};
        let field;
        try {
          for (const member of type.fields.byMember()) {
            let jsonValue;
            if (member.kind == "oneof") {
              const oneof = message[member.localName];
              if (oneof.value === void 0) {
                continue;
              }
              field = member.findField(oneof.case);
              if (!field) {
                throw "oneof case not found: " + oneof.case;
              }
              jsonValue = writeField(field, oneof.value, options);
            } else {
              field = member;
              jsonValue = writeField(field, message[field.localName], options);
            }
            if (jsonValue !== void 0) {
              json[options.useProtoFieldName ? field.name : field.jsonName] = jsonValue;
            }
          }
        } catch (e) {
          const m = field ? `cannot encode field ${type.typeName}.${field.name} to JSON` : `cannot encode message ${type.typeName} to JSON`;
          const r = e instanceof Error ? e.message : String(e);
          throw new Error(m + (r.length > 0 ? `: ${r}` : ""));
        }
        return json;
      },
      readScalar: readScalar2,
      writeScalar: writeScalar2,
      debug: debugJsonValue
    };
  }
  function debugJsonValue(json) {
    if (json === null) {
      return "null";
    }
    switch (typeof json) {
      case "object":
        return Array.isArray(json) ? "array" : "object";
      case "string":
        return json.length > 100 ? "string" : `"${json.split('"').join('\\"')}"`;
      default:
        return String(json);
    }
  }
  function readScalar2(type, json) {
    switch (type) {
      case ScalarType.DOUBLE:
      case ScalarType.FLOAT:
        if (json === null)
          return 0;
        if (json === "NaN")
          return Number.NaN;
        if (json === "Infinity")
          return Number.POSITIVE_INFINITY;
        if (json === "-Infinity")
          return Number.NEGATIVE_INFINITY;
        if (json === "") {
          break;
        }
        if (typeof json == "string" && json.trim().length !== json.length) {
          break;
        }
        if (typeof json != "string" && typeof json != "number") {
          break;
        }
        const float = Number(json);
        if (Number.isNaN(float)) {
          break;
        }
        if (!Number.isFinite(float)) {
          break;
        }
        if (type == ScalarType.FLOAT)
          assertFloat32(float);
        return float;
      case ScalarType.INT32:
      case ScalarType.FIXED32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
      case ScalarType.UINT32:
        if (json === null)
          return 0;
        let int32;
        if (typeof json == "number")
          int32 = json;
        else if (typeof json == "string" && json.length > 0) {
          if (json.trim().length === json.length)
            int32 = Number(json);
        }
        if (int32 === void 0)
          break;
        if (type == ScalarType.UINT32)
          assertUInt32(int32);
        else
          assertInt32(int32);
        return int32;
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        if (json === null)
          return protoInt64.zero;
        if (typeof json != "number" && typeof json != "string")
          break;
        return protoInt64.parse(json);
      case ScalarType.FIXED64:
      case ScalarType.UINT64:
        if (json === null)
          return protoInt64.zero;
        if (typeof json != "number" && typeof json != "string")
          break;
        return protoInt64.uParse(json);
      case ScalarType.BOOL:
        if (json === null)
          return false;
        if (typeof json !== "boolean")
          break;
        return json;
      case ScalarType.STRING:
        if (json === null)
          return "";
        if (typeof json !== "string") {
          break;
        }
        try {
          encodeURIComponent(json);
        } catch (e) {
          throw new Error("invalid UTF8");
        }
        return json;
      case ScalarType.BYTES:
        if (json === null || json === "")
          return new Uint8Array(0);
        if (typeof json !== "string")
          break;
        return protoBase64.dec(json);
    }
    throw new Error();
  }
  function readEnum(type, json, ignoreUnknownFields) {
    if (json === null) {
      return 0;
    }
    switch (typeof json) {
      case "number":
        if (Number.isInteger(json)) {
          return json;
        }
        break;
      case "string":
        const value = type.findName(json);
        if (value || ignoreUnknownFields) {
          return value === null || value === void 0 ? void 0 : value.no;
        }
        break;
    }
    throw new Error(`cannot decode enum ${type.typeName} from JSON: ${debugJsonValue(json)}`);
  }
  function writeEnum(type, value, emitIntrinsicDefault, enumAsInteger) {
    var _a;
    if (value === void 0) {
      return value;
    }
    if (value === 0 && !emitIntrinsicDefault) {
      return void 0;
    }
    if (enumAsInteger) {
      return value;
    }
    if (type.typeName == "google.protobuf.NullValue") {
      return null;
    }
    const val = type.findNumber(value);
    return (_a = val === null || val === void 0 ? void 0 : val.name) !== null && _a !== void 0 ? _a : value;
  }
  function writeScalar2(type, value, emitIntrinsicDefault) {
    if (value === void 0) {
      return void 0;
    }
    switch (type) {
      case ScalarType.INT32:
      case ScalarType.SFIXED32:
      case ScalarType.SINT32:
      case ScalarType.FIXED32:
      case ScalarType.UINT32:
        assert(typeof value == "number");
        return value != 0 || emitIntrinsicDefault ? value : void 0;
      case ScalarType.FLOAT:
      case ScalarType.DOUBLE:
        assert(typeof value == "number");
        if (Number.isNaN(value))
          return "NaN";
        if (value === Number.POSITIVE_INFINITY)
          return "Infinity";
        if (value === Number.NEGATIVE_INFINITY)
          return "-Infinity";
        return value !== 0 || emitIntrinsicDefault ? value : void 0;
      case ScalarType.STRING:
        assert(typeof value == "string");
        return value.length > 0 || emitIntrinsicDefault ? value : void 0;
      case ScalarType.BOOL:
        assert(typeof value == "boolean");
        return value || emitIntrinsicDefault ? value : void 0;
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
      case ScalarType.INT64:
      case ScalarType.SFIXED64:
      case ScalarType.SINT64:
        assert(typeof value == "bigint" || typeof value == "string" || typeof value == "number");
        return emitIntrinsicDefault || value != 0 ? value.toString(10) : void 0;
      case ScalarType.BYTES:
        assert(value instanceof Uint8Array);
        return emitIntrinsicDefault || value.byteLength > 0 ? protoBase64.enc(value) : void 0;
    }
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/json-format-proto3.js
  function makeJsonFormatProto3() {
    return makeJsonFormatCommon((writeEnum2, writeScalar3) => {
      return function writeField(field, value, options) {
        if (field.kind == "map") {
          const jsonObj = {};
          switch (field.V.kind) {
            case "scalar":
              for (const [entryKey, entryValue] of Object.entries(value)) {
                const val = writeScalar3(field.V.T, entryValue, true);
                assert(val !== void 0);
                jsonObj[entryKey.toString()] = val;
              }
              break;
            case "message":
              for (const [entryKey, entryValue] of Object.entries(value)) {
                jsonObj[entryKey.toString()] = entryValue.toJson(options);
              }
              break;
            case "enum":
              const enumType = field.V.T;
              for (const [entryKey, entryValue] of Object.entries(value)) {
                assert(entryValue === void 0 || typeof entryValue == "number");
                const val = writeEnum2(enumType, entryValue, true, options.enumAsInteger);
                assert(val !== void 0);
                jsonObj[entryKey.toString()] = val;
              }
              break;
          }
          return options.emitDefaultValues || Object.keys(jsonObj).length > 0 ? jsonObj : void 0;
        } else if (field.repeated) {
          const jsonArr = [];
          switch (field.kind) {
            case "scalar":
              for (let i = 0; i < value.length; i++) {
                jsonArr.push(writeScalar3(field.T, value[i], true));
              }
              break;
            case "enum":
              for (let i = 0; i < value.length; i++) {
                jsonArr.push(writeEnum2(field.T, value[i], true, options.enumAsInteger));
              }
              break;
            case "message":
              for (let i = 0; i < value.length; i++) {
                jsonArr.push(wrapField(field.T, value[i]).toJson(options));
              }
              break;
          }
          return options.emitDefaultValues || jsonArr.length > 0 ? jsonArr : void 0;
        } else {
          switch (field.kind) {
            case "scalar":
              return writeScalar3(field.T, value, !!field.oneof || field.opt || options.emitDefaultValues);
            case "enum":
              return writeEnum2(field.T, value, !!field.oneof || field.opt || options.emitDefaultValues, options.enumAsInteger);
            case "message":
              return value !== void 0 ? wrapField(field.T, value).toJson(options) : void 0;
          }
        }
      };
    });
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/util-common.js
  function makeUtilCommon() {
    return {
      setEnumType,
      initPartial(source, target) {
        if (source === void 0) {
          return;
        }
        const type = target.getType();
        for (const member of type.fields.byMember()) {
          const localName = member.localName, t = target, s = source;
          if (s[localName] === void 0) {
            continue;
          }
          switch (member.kind) {
            case "oneof":
              const sk = s[localName].case;
              if (sk === void 0) {
                continue;
              }
              const sourceField = member.findField(sk);
              let val = s[localName].value;
              if (sourceField && sourceField.kind == "message" && !(val instanceof sourceField.T)) {
                val = new sourceField.T(val);
              } else if (sourceField && sourceField.kind === "scalar" && sourceField.T === ScalarType.BYTES) {
                val = toU8Arr(val);
              }
              t[localName] = { case: sk, value: val };
              break;
            case "scalar":
            case "enum":
              let copy = s[localName];
              if (member.T === ScalarType.BYTES) {
                copy = member.repeated ? copy.map(toU8Arr) : toU8Arr(copy);
              }
              t[localName] = copy;
              break;
            case "map":
              switch (member.V.kind) {
                case "scalar":
                case "enum":
                  if (member.V.T === ScalarType.BYTES) {
                    for (const [k, v] of Object.entries(s[localName])) {
                      t[localName][k] = toU8Arr(v);
                    }
                  } else {
                    Object.assign(t[localName], s[localName]);
                  }
                  break;
                case "message":
                  const messageType = member.V.T;
                  for (const k of Object.keys(s[localName])) {
                    let val2 = s[localName][k];
                    if (!messageType.fieldWrapper) {
                      val2 = new messageType(val2);
                    }
                    t[localName][k] = val2;
                  }
                  break;
              }
              break;
            case "message":
              const mt = member.T;
              if (member.repeated) {
                t[localName] = s[localName].map((val2) => val2 instanceof mt ? val2 : new mt(val2));
              } else if (s[localName] !== void 0) {
                const val2 = s[localName];
                if (mt.fieldWrapper) {
                  if (
                    // We can't use BytesValue.typeName as that will create a circular import
                    mt.typeName === "google.protobuf.BytesValue"
                  ) {
                    t[localName] = toU8Arr(val2);
                  } else {
                    t[localName] = val2;
                  }
                } else {
                  t[localName] = val2 instanceof mt ? val2 : new mt(val2);
                }
              }
              break;
          }
        }
      },
      equals(type, a, b) {
        if (a === b) {
          return true;
        }
        if (!a || !b) {
          return false;
        }
        return type.fields.byMember().every((m) => {
          const va = a[m.localName];
          const vb = b[m.localName];
          if (m.repeated) {
            if (va.length !== vb.length) {
              return false;
            }
            switch (m.kind) {
              case "message":
                return va.every((a2, i) => m.T.equals(a2, vb[i]));
              case "scalar":
                return va.every((a2, i) => scalarEquals(m.T, a2, vb[i]));
              case "enum":
                return va.every((a2, i) => scalarEquals(ScalarType.INT32, a2, vb[i]));
            }
            throw new Error(`repeated cannot contain ${m.kind}`);
          }
          switch (m.kind) {
            case "message":
              return m.T.equals(va, vb);
            case "enum":
              return scalarEquals(ScalarType.INT32, va, vb);
            case "scalar":
              return scalarEquals(m.T, va, vb);
            case "oneof":
              if (va.case !== vb.case) {
                return false;
              }
              const s = m.findField(va.case);
              if (s === void 0) {
                return true;
              }
              switch (s.kind) {
                case "message":
                  return s.T.equals(va.value, vb.value);
                case "enum":
                  return scalarEquals(ScalarType.INT32, va.value, vb.value);
                case "scalar":
                  return scalarEquals(s.T, va.value, vb.value);
              }
              throw new Error(`oneof cannot contain ${s.kind}`);
            case "map":
              const keys = Object.keys(va).concat(Object.keys(vb));
              switch (m.V.kind) {
                case "message":
                  const messageType = m.V.T;
                  return keys.every((k) => messageType.equals(va[k], vb[k]));
                case "enum":
                  return keys.every((k) => scalarEquals(ScalarType.INT32, va[k], vb[k]));
                case "scalar":
                  const scalarType = m.V.T;
                  return keys.every((k) => scalarEquals(scalarType, va[k], vb[k]));
              }
              break;
          }
        });
      },
      clone(message) {
        const type = message.getType(), target = new type(), any = target;
        for (const member of type.fields.byMember()) {
          const source = message[member.localName];
          let copy;
          if (member.repeated) {
            copy = source.map(cloneSingularField);
          } else if (member.kind == "map") {
            copy = any[member.localName];
            for (const [key, v] of Object.entries(source)) {
              copy[key] = cloneSingularField(v);
            }
          } else if (member.kind == "oneof") {
            const f = member.findField(source.case);
            copy = f ? { case: source.case, value: cloneSingularField(source.value) } : { case: void 0 };
          } else {
            copy = cloneSingularField(source);
          }
          any[member.localName] = copy;
        }
        return target;
      }
    };
  }
  function cloneSingularField(value) {
    if (value === void 0) {
      return value;
    }
    if (value instanceof Message) {
      return value.clone();
    }
    if (value instanceof Uint8Array) {
      const c = new Uint8Array(value.byteLength);
      c.set(value);
      return c;
    }
    return value;
  }
  function toU8Arr(input) {
    return input instanceof Uint8Array ? input : new Uint8Array(input);
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/field-list.js
  var InternalFieldList = class {
    constructor(fields, normalizer) {
      this._fields = fields;
      this._normalizer = normalizer;
    }
    findJsonName(jsonName) {
      if (!this.jsonNames) {
        const t = {};
        for (const f of this.list()) {
          t[f.jsonName] = t[f.name] = f;
        }
        this.jsonNames = t;
      }
      return this.jsonNames[jsonName];
    }
    find(fieldNo) {
      if (!this.numbers) {
        const t = {};
        for (const f of this.list()) {
          t[f.no] = f;
        }
        this.numbers = t;
      }
      return this.numbers[fieldNo];
    }
    list() {
      if (!this.all) {
        this.all = this._normalizer(this._fields);
      }
      return this.all;
    }
    byNumber() {
      if (!this.numbersAsc) {
        this.numbersAsc = this.list().concat().sort((a, b) => a.no - b.no);
      }
      return this.numbersAsc;
    }
    byMember() {
      if (!this.members) {
        this.members = [];
        const a = this.members;
        let o;
        for (const f of this.list()) {
          if (f.oneof) {
            if (f.oneof !== o) {
              o = f.oneof;
              a.push(o);
            }
          } else {
            a.push(f);
          }
        }
      }
      return this.members;
    }
  };

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/names.js
  function localFieldName(protoName, inOneof) {
    const name = protoCamelCase(protoName);
    if (inOneof) {
      return name;
    }
    return safeObjectProperty(safeMessageProperty(name));
  }
  function localOneofName(protoName) {
    return localFieldName(protoName, false);
  }
  var fieldJsonName = protoCamelCase;
  function protoCamelCase(snakeCase) {
    let capNext = false;
    const b = [];
    for (let i = 0; i < snakeCase.length; i++) {
      let c = snakeCase.charAt(i);
      switch (c) {
        case "_":
          capNext = true;
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          b.push(c);
          capNext = false;
          break;
        default:
          if (capNext) {
            capNext = false;
            c = c.toUpperCase();
          }
          b.push(c);
          break;
      }
    }
    return b.join("");
  }
  var reservedObjectProperties = /* @__PURE__ */ new Set([
    // names reserved by JavaScript
    "constructor",
    "toString",
    "toJSON",
    "valueOf"
  ]);
  var reservedMessageProperties = /* @__PURE__ */ new Set([
    // names reserved by the runtime
    "getType",
    "clone",
    "equals",
    "fromBinary",
    "fromJson",
    "fromJsonString",
    "toBinary",
    "toJson",
    "toJsonString",
    // names reserved by the runtime for the future
    "toObject"
  ]);
  var fallback = (name) => `${name}$`;
  var safeMessageProperty = (name) => {
    if (reservedMessageProperties.has(name)) {
      return fallback(name);
    }
    return name;
  };
  var safeObjectProperty = (name) => {
    if (reservedObjectProperties.has(name)) {
      return fallback(name);
    }
    return name;
  };

  // ../node_modules/@bufbuild/protobuf/dist/esm/private/field.js
  var InternalOneofInfo = class {
    constructor(name) {
      this.kind = "oneof";
      this.repeated = false;
      this.packed = false;
      this.opt = false;
      this.default = void 0;
      this.fields = [];
      this.name = name;
      this.localName = localOneofName(name);
    }
    addField(field) {
      assert(field.oneof === this, `field ${field.name} not one of ${this.name}`);
      this.fields.push(field);
    }
    findField(localName) {
      if (!this._lookup) {
        this._lookup = /* @__PURE__ */ Object.create(null);
        for (let i = 0; i < this.fields.length; i++) {
          this._lookup[this.fields[i].localName] = this.fields[i];
        }
      }
      return this._lookup[localName];
    }
  };

  // ../node_modules/@bufbuild/protobuf/dist/esm/proto3.js
  var proto3 = makeProtoRuntime("proto3", makeJsonFormatProto3(), makeBinaryFormatProto3(), Object.assign(Object.assign({}, makeUtilCommon()), {
    newFieldList(fields) {
      return new InternalFieldList(fields, normalizeFieldInfosProto3);
    },
    initFields(target) {
      for (const member of target.getType().fields.byMember()) {
        if (member.opt) {
          continue;
        }
        const name = member.localName, t = target;
        if (member.repeated) {
          t[name] = [];
          continue;
        }
        switch (member.kind) {
          case "oneof":
            t[name] = { case: void 0 };
            break;
          case "enum":
            t[name] = 0;
            break;
          case "map":
            t[name] = {};
            break;
          case "scalar":
            t[name] = scalarDefaultValue(member.T);
            break;
          case "message":
            break;
        }
      }
    }
  }));
  function normalizeFieldInfosProto3(fieldInfos) {
    var _a, _b, _c;
    const r = [];
    let o;
    for (const field of typeof fieldInfos == "function" ? fieldInfos() : fieldInfos) {
      const f = field;
      f.localName = localFieldName(field.name, field.oneof !== void 0);
      f.jsonName = (_a = field.jsonName) !== null && _a !== void 0 ? _a : fieldJsonName(field.name);
      f.repeated = (_b = field.repeated) !== null && _b !== void 0 ? _b : false;
      f.packed = (_c = field.packed) !== null && _c !== void 0 ? _c : field.kind == "enum" || field.kind == "scalar" && field.T != ScalarType.BYTES && field.T != ScalarType.STRING;
      if (field.oneof !== void 0) {
        const ooname = typeof field.oneof == "string" ? field.oneof : field.oneof.name;
        if (!o || o.name != ooname) {
          o = new InternalOneofInfo(ooname);
        }
        f.oneof = o;
        o.addField(f);
      }
      r.push(f);
    }
    return r;
  }

  // ../node_modules/@bufbuild/protobuf/dist/esm/service-type.js
  var MethodKind;
  (function(MethodKind2) {
    MethodKind2[MethodKind2["Unary"] = 0] = "Unary";
    MethodKind2[MethodKind2["ServerStreaming"] = 1] = "ServerStreaming";
    MethodKind2[MethodKind2["ClientStreaming"] = 2] = "ClientStreaming";
    MethodKind2[MethodKind2["BiDiStreaming"] = 3] = "BiDiStreaming";
  })(MethodKind || (MethodKind = {}));
  var MethodIdempotency;
  (function(MethodIdempotency2) {
    MethodIdempotency2[MethodIdempotency2["NoSideEffects"] = 1] = "NoSideEffects";
    MethodIdempotency2[MethodIdempotency2["Idempotent"] = 2] = "Idempotent";
  })(MethodIdempotency || (MethodIdempotency = {}));

  // ../node_modules/@bufbuild/protobuf/dist/esm/google/protobuf/empty_pb.js
  var Empty = class _Empty extends Message {
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static fromBinary(bytes, options) {
      return new _Empty().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Empty().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Empty().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Empty, a, b);
    }
  };
  Empty.runtime = proto3;
  Empty.typeName = "google.protobuf.Empty";
  Empty.fields = proto3.util.newFieldList(() => []);

  // ../node_modules/@bufbuild/connect/dist/esm/code.js
  var Code;
  (function(Code2) {
    Code2[Code2["Canceled"] = 1] = "Canceled";
    Code2[Code2["Unknown"] = 2] = "Unknown";
    Code2[Code2["InvalidArgument"] = 3] = "InvalidArgument";
    Code2[Code2["DeadlineExceeded"] = 4] = "DeadlineExceeded";
    Code2[Code2["NotFound"] = 5] = "NotFound";
    Code2[Code2["AlreadyExists"] = 6] = "AlreadyExists";
    Code2[Code2["PermissionDenied"] = 7] = "PermissionDenied";
    Code2[Code2["ResourceExhausted"] = 8] = "ResourceExhausted";
    Code2[Code2["FailedPrecondition"] = 9] = "FailedPrecondition";
    Code2[Code2["Aborted"] = 10] = "Aborted";
    Code2[Code2["OutOfRange"] = 11] = "OutOfRange";
    Code2[Code2["Unimplemented"] = 12] = "Unimplemented";
    Code2[Code2["Internal"] = 13] = "Internal";
    Code2[Code2["Unavailable"] = 14] = "Unavailable";
    Code2[Code2["DataLoss"] = 15] = "DataLoss";
    Code2[Code2["Unauthenticated"] = 16] = "Unauthenticated";
  })(Code || (Code = {}));

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/code-string.js
  function codeToString(value) {
    const name = Code[value];
    if (typeof name != "string") {
      return value.toString();
    }
    return name[0].toLowerCase() + name.substring(1).replace(/[A-Z]/g, (c) => "_" + c.toLowerCase());
  }
  var stringToCode;
  function codeFromString(value) {
    if (!stringToCode) {
      stringToCode = {};
      for (const value2 of Object.values(Code)) {
        if (typeof value2 == "string") {
          continue;
        }
        stringToCode[codeToString(value2)] = value2;
      }
    }
    return stringToCode[value];
  }

  // ../node_modules/@bufbuild/connect/dist/esm/connect-error.js
  var ConnectError = class _ConnectError extends Error {
    /**
     * Create a new ConnectError.
     * If no code is provided, code "unknown" is used.
     * Outgoing details are only relevant for the server side - a service may
     * raise an error with details, and it is up to the protocol implementation
     * to encode and send the details along with error.
     */
    constructor(message, code = Code.Unknown, metadata, outgoingDetails, cause) {
      super(createMessage(message, code));
      this.name = "ConnectError";
      Object.setPrototypeOf(this, new.target.prototype);
      this.rawMessage = message;
      this.code = code;
      this.metadata = new Headers(metadata !== null && metadata !== void 0 ? metadata : {});
      this.details = outgoingDetails !== null && outgoingDetails !== void 0 ? outgoingDetails : [];
      this.cause = cause;
    }
    /**
     * Convert any value - typically a caught error into a ConnectError,
     * following these rules:
     * - If the value is already a ConnectError, return it as is.
     * - If the value is an AbortError from the fetch API, return the message
     *   of the AbortError with code Canceled.
     * - For other Errors, return the error message with code Unknown by default.
     * - For other values, return the values String representation as a message,
     *   with the code Unknown by default.
     * The original value will be used for the "cause" property for the new
     * ConnectError.
     */
    static from(reason, code = Code.Unknown) {
      if (reason instanceof _ConnectError) {
        return reason;
      }
      if (reason instanceof Error) {
        if (reason.name == "AbortError") {
          return new _ConnectError(reason.message, Code.Canceled);
        }
        return new _ConnectError(reason.message, code, void 0, void 0, reason);
      }
      return new _ConnectError(String(reason), code, void 0, void 0, reason);
    }
    findDetails(typeOrRegistry) {
      const registry = "typeName" in typeOrRegistry ? {
        findMessage: (typeName) => typeName === typeOrRegistry.typeName ? typeOrRegistry : void 0
      } : typeOrRegistry;
      const details = [];
      for (const data of this.details) {
        if (data instanceof Message) {
          if (registry.findMessage(data.getType().typeName)) {
            details.push(data);
          }
          continue;
        }
        const type = registry.findMessage(data.type);
        if (type) {
          try {
            details.push(type.fromBinary(data.value));
          } catch (_) {
          }
        }
      }
      return details;
    }
  };
  function createMessage(message, code) {
    return message.length ? `[${codeToString(code)}] ${message}` : `[${codeToString(code)}]`;
  }

  // ../node_modules/@bufbuild/connect/dist/esm/http-headers.js
  function appendHeaders(...headers) {
    const h = new Headers();
    for (const e of headers) {
      e.forEach((value, key) => {
        h.append(key, value);
      });
    }
    return h;
  }

  // ../node_modules/@bufbuild/connect/dist/esm/any-client.js
  function makeAnyClient(service, createMethod) {
    const client = {};
    for (const [localName, methodInfo] of Object.entries(service.methods)) {
      const method = createMethod(Object.assign(Object.assign({}, methodInfo), {
        localName,
        service
      }));
      if (method != null) {
        client[localName] = method;
      }
    }
    return client;
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol/envelope.js
  function createEnvelopeReadableStream(stream) {
    let reader;
    let buffer = new Uint8Array(0);
    function append(chunk) {
      const n = new Uint8Array(buffer.length + chunk.length);
      n.set(buffer);
      n.set(chunk, buffer.length);
      buffer = n;
    }
    return new ReadableStream({
      start() {
        reader = stream.getReader();
      },
      async pull(controller) {
        let header = void 0;
        for (; ; ) {
          if (header === void 0 && buffer.byteLength >= 5) {
            let length = 0;
            for (let i = 1; i < 5; i++) {
              length = (length << 8) + buffer[i];
            }
            header = { flags: buffer[0], length };
          }
          if (header !== void 0 && buffer.byteLength >= header.length + 5) {
            break;
          }
          const result = await reader.read();
          if (result.done) {
            break;
          }
          append(result.value);
        }
        if (header === void 0) {
          if (buffer.byteLength == 0) {
            controller.close();
            return;
          }
          controller.error(new ConnectError("premature end of stream", Code.DataLoss));
          return;
        }
        const data = buffer.subarray(5, 5 + header.length);
        buffer = buffer.subarray(5 + header.length);
        controller.enqueue({
          flags: header.flags,
          data
        });
      }
    });
  }
  function encodeEnvelope(flags, data) {
    const bytes = new Uint8Array(data.length + 5);
    bytes.set(data, 5);
    const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    v.setUint8(0, flags);
    v.setUint32(1, data.length);
    return bytes;
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol/async-iterable.js
  var __asyncValues = function(o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve, reject) {
          v = o[n](v), settle(resolve, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve({ value: v2, done: d });
      }, reject);
    }
  };
  var __await = function(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  };
  var __asyncGenerator = function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      if (g[n])
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length)
        resume(q[0][0], q[0][1]);
    }
  };
  var __asyncDelegator = function(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
      throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
      return this;
    }, i;
    function verb(n, f) {
      i[n] = o[n] ? function(v) {
        return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
      } : f;
    }
  };
  function createAsyncIterable(items) {
    return __asyncGenerator(this, arguments, function* createAsyncIterable_1() {
      yield __await(yield* __asyncDelegator(__asyncValues(items)));
    });
  }

  // ../node_modules/@bufbuild/connect/dist/esm/promise-client.js
  var __asyncValues2 = function(o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve, reject) {
          v = o[n](v), settle(resolve, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve({ value: v2, done: d });
      }, reject);
    }
  };
  var __await2 = function(v) {
    return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
  };
  var __asyncDelegator2 = function(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function(e) {
      throw e;
    }), verb("return"), i[Symbol.iterator] = function() {
      return this;
    }, i;
    function verb(n, f) {
      i[n] = o[n] ? function(v) {
        return (p = !p) ? { value: __await2(o[n](v)), done: false } : f ? f(v) : v;
      } : f;
    }
  };
  var __asyncGenerator2 = function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      if (g[n])
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length)
        resume(q[0][0], q[0][1]);
    }
  };
  function createPromiseClient(service, transport2) {
    return makeAnyClient(service, (method) => {
      switch (method.kind) {
        case MethodKind.Unary:
          return createUnaryFn(transport2, service, method);
        case MethodKind.ServerStreaming:
          return createServerStreamingFn(transport2, service, method);
        case MethodKind.ClientStreaming:
          return createClientStreamingFn(transport2, service, method);
        case MethodKind.BiDiStreaming:
          return createBiDiStreamingFn(transport2, service, method);
        default:
          return null;
      }
    });
  }
  function createUnaryFn(transport2, service, method) {
    return async function(input, options) {
      var _a, _b;
      const response = await transport2.unary(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, input);
      (_a = options === null || options === void 0 ? void 0 : options.onHeader) === null || _a === void 0 ? void 0 : _a.call(options, response.header);
      (_b = options === null || options === void 0 ? void 0 : options.onTrailer) === null || _b === void 0 ? void 0 : _b.call(options, response.trailer);
      return response.message;
    };
  }
  function createServerStreamingFn(transport2, service, method) {
    return function(input, options) {
      return handleStreamResponse(transport2.stream(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, createAsyncIterable([input])), options);
    };
  }
  function createClientStreamingFn(transport2, service, method) {
    return async function(request, options) {
      var _a, e_1, _b, _c;
      var _d, _e;
      const response = await transport2.stream(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, request);
      (_d = options === null || options === void 0 ? void 0 : options.onHeader) === null || _d === void 0 ? void 0 : _d.call(options, response.header);
      let singleMessage;
      try {
        for (var _f = true, _g = __asyncValues2(response.message), _h; _h = await _g.next(), _a = _h.done, !_a; _f = true) {
          _c = _h.value;
          _f = false;
          const message = _c;
          singleMessage = message;
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (!_f && !_a && (_b = _g.return))
            await _b.call(_g);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      if (!singleMessage) {
        throw new ConnectError("protocol error: missing response message", Code.Internal);
      }
      (_e = options === null || options === void 0 ? void 0 : options.onTrailer) === null || _e === void 0 ? void 0 : _e.call(options, response.trailer);
      return singleMessage;
    };
  }
  function createBiDiStreamingFn(transport2, service, method) {
    return function(request, options) {
      return handleStreamResponse(transport2.stream(service, method, options === null || options === void 0 ? void 0 : options.signal, options === null || options === void 0 ? void 0 : options.timeoutMs, options === null || options === void 0 ? void 0 : options.headers, request), options);
    };
  }
  function handleStreamResponse(stream, options) {
    const it = function() {
      var _a, _b;
      return __asyncGenerator2(this, arguments, function* () {
        const response = yield __await2(stream);
        (_a = options === null || options === void 0 ? void 0 : options.onHeader) === null || _a === void 0 ? void 0 : _a.call(options, response.header);
        yield __await2(yield* __asyncDelegator2(__asyncValues2(response.message)));
        (_b = options === null || options === void 0 ? void 0 : options.onTrailer) === null || _b === void 0 ? void 0 : _b.call(options, response.trailer);
      });
    }()[Symbol.asyncIterator]();
    return {
      [Symbol.asyncIterator]: () => ({
        next: () => it.next()
      })
    };
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol/signals.js
  function createLinkedAbortController(...signals) {
    const controller = new AbortController();
    const sa = signals.filter((s) => s !== void 0).concat(controller.signal);
    for (const signal of sa) {
      if (signal.aborted) {
        onAbort.apply(signal);
        break;
      }
      signal.addEventListener("abort", onAbort);
    }
    function onAbort() {
      if (!controller.signal.aborted) {
        controller.abort(getAbortSignalReason(this));
      }
      for (const signal of sa) {
        signal.removeEventListener("abort", onAbort);
      }
    }
    return controller;
  }
  function createDeadlineSignal(timeoutMs) {
    const controller = new AbortController();
    const listener = () => {
      controller.abort(new ConnectError("the operation timed out", Code.DeadlineExceeded));
    };
    let timeoutId;
    if (timeoutMs !== void 0) {
      if (timeoutMs <= 0)
        listener();
      else
        timeoutId = setTimeout(listener, timeoutMs);
    }
    return {
      signal: controller.signal,
      cleanup: () => clearTimeout(timeoutId)
    };
  }
  function getAbortSignalReason(signal) {
    if (!signal.aborted) {
      return void 0;
    }
    if (signal.reason !== void 0) {
      return signal.reason;
    }
    const e = new Error("This operation was aborted");
    e.name = "AbortError";
    return e;
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol/create-method-url.js
  function createMethodUrl(baseUrl, service, method) {
    const s = typeof service == "string" ? service : service.typeName;
    const m = typeof method == "string" ? method : method.name;
    return baseUrl.toString().replace(/\/?$/, `/${s}/${m}`);
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol/serialization.js
  function getJsonOptions(options) {
    var _a;
    const o = Object.assign({}, options);
    (_a = o.ignoreUnknownFields) !== null && _a !== void 0 ? _a : o.ignoreUnknownFields = true;
    return o;
  }
  function createClientMethodSerializers(method, useBinaryFormat, jsonOptions, binaryOptions) {
    const input = useBinaryFormat ? createBinarySerialization(method.I, binaryOptions) : createJsonSerialization(method.I, jsonOptions);
    const output = useBinaryFormat ? createBinarySerialization(method.O, binaryOptions) : createJsonSerialization(method.O, jsonOptions);
    return { parse: output.parse, serialize: input.serialize };
  }
  function createBinarySerialization(messageType, options) {
    return {
      parse(data) {
        try {
          return messageType.fromBinary(data, options);
        } catch (e) {
          const m = e instanceof Error ? e.message : String(e);
          throw new ConnectError(`parse binary: ${m}`, Code.InvalidArgument);
        }
      },
      serialize(data) {
        try {
          return data.toBinary(options);
        } catch (e) {
          const m = e instanceof Error ? e.message : String(e);
          throw new ConnectError(`serialize binary: ${m}`, Code.Internal);
        }
      }
    };
  }
  function createJsonSerialization(messageType, options) {
    var _a, _b;
    const textEncoder = (_a = options === null || options === void 0 ? void 0 : options.textEncoder) !== null && _a !== void 0 ? _a : new TextEncoder();
    const textDecoder = (_b = options === null || options === void 0 ? void 0 : options.textDecoder) !== null && _b !== void 0 ? _b : new TextDecoder();
    const o = getJsonOptions(options);
    return {
      parse(data) {
        try {
          const json = textDecoder.decode(data);
          return messageType.fromJsonString(json, o);
        } catch (e) {
          throw ConnectError.from(e, Code.InvalidArgument);
        }
      },
      serialize(data) {
        try {
          const json = data.toJsonString(o);
          return textEncoder.encode(json);
        } catch (e) {
          throw ConnectError.from(e, Code.Internal);
        }
      }
    };
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/content-type.js
  var contentTypeRegExp = /^application\/(connect\+)?(?:(json)(?:; ?charset=utf-?8)?|(proto))$/i;
  var contentTypeUnaryProto = "application/proto";
  var contentTypeUnaryJson = "application/json";
  var contentTypeStreamProto = "application/connect+proto";
  var contentTypeStreamJson = "application/connect+json";
  function parseContentType(contentType) {
    const match = contentType === null || contentType === void 0 ? void 0 : contentType.match(contentTypeRegExp);
    if (!match) {
      return void 0;
    }
    const stream = !!match[1];
    const binary = !!match[3];
    return { stream, binary };
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/error-json.js
  function errorFromJson(jsonValue, metadata, fallback2) {
    if (metadata) {
      new Headers(metadata).forEach((value, key) => fallback2.metadata.append(key, value));
    }
    if (typeof jsonValue !== "object" || jsonValue == null || Array.isArray(jsonValue) || !("code" in jsonValue) || typeof jsonValue.code !== "string") {
      throw fallback2;
    }
    const code = codeFromString(jsonValue.code);
    if (code === void 0) {
      throw fallback2;
    }
    const message = jsonValue.message;
    if (message != null && typeof message !== "string") {
      throw fallback2;
    }
    const error = new ConnectError(message !== null && message !== void 0 ? message : "", code, metadata);
    if ("details" in jsonValue && Array.isArray(jsonValue.details)) {
      for (const detail of jsonValue.details) {
        if (detail === null || typeof detail != "object" || Array.isArray(detail) || typeof detail.type != "string" || typeof detail.value != "string" || "debug" in detail && typeof detail.debug != "object") {
          throw fallback2;
        }
        try {
          error.details.push({
            type: detail.type,
            value: protoBase64.dec(detail.value),
            debug: detail.debug
          });
        } catch (e) {
          throw fallback2;
        }
      }
    }
    return error;
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/end-stream.js
  var endStreamFlag = 2;
  function endStreamFromJson(data) {
    const parseErr = new ConnectError("invalid end stream", Code.InvalidArgument);
    let jsonValue;
    try {
      jsonValue = JSON.parse(typeof data == "string" ? data : new TextDecoder().decode(data));
    } catch (e) {
      throw parseErr;
    }
    if (typeof jsonValue != "object" || jsonValue == null || Array.isArray(jsonValue)) {
      throw parseErr;
    }
    const metadata = new Headers();
    if ("metadata" in jsonValue) {
      if (typeof jsonValue.metadata != "object" || jsonValue.metadata == null || Array.isArray(jsonValue.metadata)) {
        throw parseErr;
      }
      for (const [key, values] of Object.entries(jsonValue.metadata)) {
        if (!Array.isArray(values) || values.some((value) => typeof value != "string")) {
          throw parseErr;
        }
        for (const value of values) {
          metadata.append(key, value);
        }
      }
    }
    const error = "error" in jsonValue ? errorFromJson(jsonValue.error, metadata, parseErr) : void 0;
    return { metadata, error };
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/headers.js
  var headerContentType = "Content-Type";
  var headerUnaryContentLength = "Content-Length";
  var headerUnaryEncoding = "Content-Encoding";
  var headerUnaryAcceptEncoding = "Accept-Encoding";
  var headerTimeout = "Connect-Timeout-Ms";
  var headerProtocolVersion = "Connect-Protocol-Version";

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/http-status.js
  function codeFromHttpStatus(httpStatus) {
    switch (httpStatus) {
      case 400:
        return Code.InvalidArgument;
      case 401:
        return Code.Unauthenticated;
      case 403:
        return Code.PermissionDenied;
      case 404:
        return Code.Unimplemented;
      case 408:
        return Code.DeadlineExceeded;
      case 409:
        return Code.Aborted;
      case 412:
        return Code.FailedPrecondition;
      case 413:
        return Code.ResourceExhausted;
      case 415:
        return Code.Internal;
      case 429:
        return Code.Unavailable;
      case 431:
        return Code.ResourceExhausted;
      case 502:
        return Code.Unavailable;
      case 503:
        return Code.Unavailable;
      case 504:
        return Code.Unavailable;
      default:
        return Code.Unknown;
    }
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/trailer-mux.js
  function trailerDemux(header) {
    const h = new Headers(), t = new Headers();
    header.forEach((value, key) => {
      if (key.toLowerCase().startsWith("trailer-")) {
        t.set(key.substring(8), value);
      } else {
        h.set(key, value);
      }
    });
    return [h, t];
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/version.js
  var protocolVersion = "1";

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/request-header.js
  function requestHeader(methodKind, useBinaryFormat, timeoutMs, userProvidedHeaders) {
    const result = new Headers(userProvidedHeaders !== null && userProvidedHeaders !== void 0 ? userProvidedHeaders : {});
    if (timeoutMs !== void 0) {
      result.set(headerTimeout, `${timeoutMs}`);
    }
    result.set(headerContentType, methodKind == MethodKind.Unary ? useBinaryFormat ? contentTypeUnaryProto : contentTypeUnaryJson : useBinaryFormat ? contentTypeStreamProto : contentTypeStreamJson);
    result.set(headerProtocolVersion, protocolVersion);
    return result;
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/validate-response.js
  function validateResponse(methodKind, status, headers) {
    const mimeType = headers.get("Content-Type");
    const parsedType = parseContentType(mimeType);
    if (status !== 200) {
      const errorFromStatus = new ConnectError(`HTTP ${status}`, codeFromHttpStatus(status), headers);
      if (methodKind == MethodKind.Unary && parsedType && !parsedType.binary) {
        return { isUnaryError: true, unaryError: errorFromStatus };
      }
      throw errorFromStatus;
    }
    return { isUnaryError: false };
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol-connect/get-request.js
  var contentTypePrefix = "application/";
  function encodeMessageForUrl(message, useBase64) {
    if (useBase64) {
      return protoBase64.enc(message).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    } else {
      return encodeURIComponent(new TextDecoder().decode(message));
    }
  }
  function transformConnectPostToGetRequest(request, message, useBase64) {
    let query = `?connect=v${protocolVersion}`;
    const contentType = request.header.get(headerContentType);
    if ((contentType === null || contentType === void 0 ? void 0 : contentType.indexOf(contentTypePrefix)) === 0) {
      query += "&encoding=" + encodeURIComponent(contentType.slice(contentTypePrefix.length));
    }
    const compression = request.header.get(headerUnaryEncoding);
    if (compression !== null && compression !== "identity") {
      query += "&compression=" + encodeURIComponent(compression);
      useBase64 = true;
    }
    if (useBase64) {
      query += "&base64=1";
    }
    query += "&message=" + encodeMessageForUrl(message, useBase64);
    const url = request.url + query;
    const header = new Headers(request.header);
    header.delete(headerProtocolVersion);
    header.delete(headerContentType);
    header.delete(headerUnaryContentLength);
    header.delete(headerUnaryEncoding);
    header.delete(headerUnaryAcceptEncoding);
    return Object.assign(Object.assign({}, request), {
      init: Object.assign(Object.assign({}, request.init), { method: "GET" }),
      url,
      header
    });
  }

  // ../node_modules/@bufbuild/connect/dist/esm/protocol/run-call.js
  function runUnaryCall(opt) {
    const next = applyInterceptors(opt.next, opt.interceptors);
    const [signal, abort, done] = setupSignal(opt);
    const req = Object.assign(Object.assign({}, opt.req), { message: normalize(opt.req.method.I, opt.req.message), signal });
    return next(req).then((res) => {
      done();
      return res;
    }, abort);
  }
  function runStreamingCall(opt) {
    const next = applyInterceptors(opt.next, opt.interceptors);
    const [signal, abort, done] = setupSignal(opt);
    const req = Object.assign(Object.assign({}, opt.req), { message: normalizeIterable(opt.req.method.I, opt.req.message), signal });
    let doneCalled = false;
    signal.addEventListener("abort", function() {
      var _a, _b;
      const it = opt.req.message[Symbol.asyncIterator]();
      if (!doneCalled) {
        (_a = it.throw) === null || _a === void 0 ? void 0 : _a.call(it, this.reason).catch(() => {
        });
      }
      (_b = it.return) === null || _b === void 0 ? void 0 : _b.call(it).catch(() => {
      });
    });
    return next(req).then((res) => {
      return Object.assign(Object.assign({}, res), { message: {
        [Symbol.asyncIterator]() {
          const it = res.message[Symbol.asyncIterator]();
          return {
            next() {
              return it.next().then((r) => {
                if (r.done == true) {
                  doneCalled = true;
                  done();
                }
                return r;
              }, abort);
            }
            // We deliberately omit throw/return.
          };
        }
      } });
    }, abort);
  }
  function setupSignal(opt) {
    const { signal, cleanup } = createDeadlineSignal(opt.timeoutMs);
    const controller = createLinkedAbortController(opt.signal, signal);
    return [
      controller.signal,
      function abort(reason) {
        const e = ConnectError.from(signal.aborted ? getAbortSignalReason(signal) : reason);
        controller.abort(e);
        cleanup();
        return Promise.reject(e);
      },
      function done() {
        cleanup();
        controller.abort();
      }
    ];
  }
  function applyInterceptors(next, interceptors) {
    var _a;
    return (_a = interceptors === null || interceptors === void 0 ? void 0 : interceptors.concat().reverse().reduce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      (n, i) => i(n),
      next
    )) !== null && _a !== void 0 ? _a : next;
  }
  function normalize(type, message) {
    return message instanceof type ? message : new type(message);
  }
  function normalizeIterable(messageType, input) {
    function transform(result) {
      if (result.done === true) {
        return result;
      }
      return {
        done: result.done,
        value: normalize(messageType, result.value)
      };
    }
    return {
      [Symbol.asyncIterator]() {
        const it = input[Symbol.asyncIterator]();
        const res = {
          next: () => it.next().then(transform)
        };
        if (it.throw !== void 0) {
          res.throw = (e) => it.throw(e).then(transform);
        }
        if (it.return !== void 0) {
          res.return = (v) => it.return(v).then(transform);
        }
        return res;
      }
    };
  }

  // ../node_modules/@bufbuild/connect-web/dist/esm/assert-fetch-api.js
  function assertFetchApi() {
    try {
      new Headers();
    } catch (_) {
      throw new Error("connect-web requires the fetch API. Are you running on an old version of Node.js? Node.js is not supported in Connect for Web - please stay tuned for Connect for Node.");
    }
  }

  // ../node_modules/@bufbuild/connect-web/dist/esm/connect-transport.js
  var __await3 = function(v) {
    return this instanceof __await3 ? (this.v = v, this) : new __await3(v);
  };
  var __asyncGenerator3 = function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      if (g[n])
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await3 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length)
        resume(q[0][0], q[0][1]);
    }
  };
  function createConnectTransport(options) {
    var _a;
    assertFetchApi();
    const useBinaryFormat = (_a = options.useBinaryFormat) !== null && _a !== void 0 ? _a : false;
    return {
      async unary(service, method, signal, timeoutMs, header, message) {
        var _a2;
        const { serialize, parse } = createClientMethodSerializers(method, useBinaryFormat, options.jsonOptions, options.binaryOptions);
        return await runUnaryCall({
          interceptors: options.interceptors,
          signal,
          timeoutMs,
          req: {
            stream: false,
            service,
            method,
            url: createMethodUrl(options.baseUrl, service, method),
            init: {
              method: "POST",
              credentials: (_a2 = options.credentials) !== null && _a2 !== void 0 ? _a2 : "same-origin",
              redirect: "error",
              mode: "cors"
            },
            header: requestHeader(method.kind, useBinaryFormat, timeoutMs, header),
            message
          },
          next: async (req) => {
            var _a3;
            const useGet = options.useHttpGet === true && method.idempotency === MethodIdempotency.NoSideEffects;
            let body = null;
            if (useGet) {
              req = transformConnectPostToGetRequest(req, serialize(req.message), useBinaryFormat);
            } else {
              body = serialize(req.message);
            }
            const fetch = (_a3 = options.fetch) !== null && _a3 !== void 0 ? _a3 : globalThis.fetch;
            const response = await fetch(req.url, Object.assign(Object.assign({}, req.init), { headers: req.header, signal: req.signal, body }));
            const { isUnaryError, unaryError } = validateResponse(method.kind, response.status, response.headers);
            if (isUnaryError) {
              throw errorFromJson(await response.json(), appendHeaders(...trailerDemux(response.headers)), unaryError);
            }
            const [demuxedHeader, demuxedTrailer] = trailerDemux(response.headers);
            return {
              stream: false,
              service,
              method,
              header: demuxedHeader,
              message: useBinaryFormat ? parse(new Uint8Array(await response.arrayBuffer())) : method.O.fromJson(await response.json(), getJsonOptions(options.jsonOptions)),
              trailer: demuxedTrailer
            };
          }
        });
      },
      async stream(service, method, signal, timeoutMs, header, input) {
        var _a2;
        const { serialize, parse } = createClientMethodSerializers(method, useBinaryFormat, options.jsonOptions, options.binaryOptions);
        function parseResponseBody(body, trailerTarget) {
          return __asyncGenerator3(this, arguments, function* parseResponseBody_1() {
            const reader = createEnvelopeReadableStream(body).getReader();
            let endStreamReceived = false;
            for (; ; ) {
              const result = yield __await3(reader.read());
              if (result.done) {
                break;
              }
              const { flags, data } = result.value;
              if ((flags & endStreamFlag) === endStreamFlag) {
                endStreamReceived = true;
                const endStream = endStreamFromJson(data);
                if (endStream.error) {
                  throw endStream.error;
                }
                endStream.metadata.forEach((value, key) => trailerTarget.set(key, value));
                continue;
              }
              yield yield __await3(parse(data));
            }
            if (!endStreamReceived) {
              throw "missing EndStreamResponse";
            }
          });
        }
        async function createRequestBody(input2) {
          if (method.kind != MethodKind.ServerStreaming) {
            throw "The fetch API does not support streaming request bodies";
          }
          const r = await input2[Symbol.asyncIterator]().next();
          if (r.done == true) {
            throw "missing request message";
          }
          return encodeEnvelope(0, serialize(r.value));
        }
        return await runStreamingCall({
          interceptors: options.interceptors,
          timeoutMs,
          signal,
          req: {
            stream: true,
            service,
            method,
            url: createMethodUrl(options.baseUrl, service, method),
            init: {
              method: "POST",
              credentials: (_a2 = options.credentials) !== null && _a2 !== void 0 ? _a2 : "same-origin",
              redirect: "error",
              mode: "cors"
            },
            header: requestHeader(method.kind, useBinaryFormat, timeoutMs, header),
            message: input
          },
          next: async (req) => {
            var _a3;
            const fetch = (_a3 = options.fetch) !== null && _a3 !== void 0 ? _a3 : globalThis.fetch;
            const fRes = await fetch(req.url, Object.assign(Object.assign({}, req.init), { headers: req.header, signal: req.signal, body: await createRequestBody(req.message) }));
            validateResponse(method.kind, fRes.status, fRes.headers);
            if (fRes.body === null) {
              throw "missing response body";
            }
            const trailer = new Headers();
            const res = Object.assign(Object.assign({}, req), { header: fRes.headers, trailer, message: parseResponseBody(fRes.body, trailer) });
            return res;
          }
        });
      }
    };
  }

  // src/rpc/content/content_pb.ts
  var TagRequest = class _TagRequest extends Message {
    /**
     * @generated from field: string group_id = 1;
     */
    groupId = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.TagRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "group_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _TagRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _TagRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _TagRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_TagRequest, a, b);
    }
  };
  var VoteRequest = class _VoteRequest extends Message {
    /**
     * @generated from field: string content_id = 1;
     */
    contentId = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.VoteRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "content_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _VoteRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _VoteRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _VoteRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_VoteRequest, a, b);
    }
  };
  var VoteResponse = class _VoteResponse extends Message {
    /**
     * @generated from field: uint32 votes = 1;
     */
    votes = 0;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.VoteResponse";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "votes",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _VoteResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _VoteResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _VoteResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_VoteResponse, a, b);
    }
  };
  var Tags = class _Tags extends Message {
    /**
     * @generated from field: repeated content.Tag tags = 1;
     */
    tags = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Tags";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "tags", kind: "message", T: Tag, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Tags().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Tags().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Tags().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Tags, a, b);
    }
  };
  var Tag = class _Tag extends Message {
    /**
     * @generated from field: string name = 1;
     */
    name = "";
    /**
     * @generated from field: repeated content.Tag sub_tags = 2;
     */
    subTags = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Tag";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "sub_tags", kind: "message", T: _Tag, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Tag().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Tag().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Tag().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Tag, a, b);
    }
  };
  var ContentIDs = class _ContentIDs extends Message {
    /**
     * @generated from field: repeated string content_ids = 1;
     */
    contentIds = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.ContentIDs";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "content_ids", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _ContentIDs().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _ContentIDs().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _ContentIDs().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_ContentIDs, a, b);
    }
  };
  var Contents = class _Contents extends Message {
    /**
     * @generated from field: content.Content content = 1;
     */
    content;
    /**
     * @generated from field: repeated content.Content related = 2;
     */
    related = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Contents";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "content", kind: "message", T: Content },
      { no: 2, name: "related", kind: "message", T: Content, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Contents().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Contents().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Contents().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Contents, a, b);
    }
  };
  var Query = class _Query extends Message {
    /**
     * @generated from field: string query = 1;
     */
    query = "";
    /**
     * @generated from field: uint32 page = 2;
     */
    page = 0;
    /**
     * @generated from field: string contentID = 3;
     */
    contentID = "";
    /**
     * @generated from field: string groupID = 4;
     */
    groupID = "";
    /**
     * @generated from field: repeated string tags = 5;
     */
    tags = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Query";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "query",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "page",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 3,
        name: "contentID",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "groupID",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 5, name: "tags", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Query().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Query().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Query().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Query, a, b);
    }
  };
  var Results = class _Results extends Message {
    /**
     * @generated from field: repeated content.StoredContent storedContent = 1;
     */
    storedContent = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Results";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "storedContent", kind: "message", T: StoredContent, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Results().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Results().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Results().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Results, a, b);
    }
  };
  var StoredContent = class _StoredContent extends Message {
    /**
     * @generated from field: content.Content content = 1;
     */
    content;
    /**
     * @generated from field: string id = 2;
     */
    id = "";
    /**
     * @generated from field: repeated content.Content related = 3;
     */
    related = [];
    /**
     * @generated from field: string title = 4;
     */
    title = "";
    /**
     * @generated from field: string description = 5;
     */
    description = "";
    /**
     * @generated from field: string image = 6;
     */
    image = "";
    /**
     * @generated from field: string url = 7;
     */
    url = "";
    /**
     * @generated from field: int32 votes = 8;
     */
    votes = 0;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.StoredContent";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "content", kind: "message", T: Content },
      {
        no: 2,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "related", kind: "message", T: Content, repeated: true },
      {
        no: 4,
        name: "title",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "description",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "image",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "votes",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _StoredContent().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _StoredContent().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _StoredContent().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_StoredContent, a, b);
    }
  };
  var Edge = class _Edge extends Message {
    /**
     * @generated from field: string from = 1;
     */
    from = "";
    /**
     * @generated from field: string to = 2;
     */
    to = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Edge";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "from",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "to",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Edge().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Edge().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Edge().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Edge, a, b);
    }
  };
  var Content = class _Content extends Message {
    /**
     * @generated from field: repeated string tags = 1;
     */
    tags = [];
    /**
     * @generated from field: string created_at = 2;
     */
    createdAt = "";
    /**
     * @generated from field: string uri = 3;
     */
    uri = "";
    /**
     * @generated from oneof content.Content.type
     */
    type = { case: void 0 };
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Content";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "tags", kind: "scalar", T: 9, repeated: true },
      {
        no: 2,
        name: "created_at",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "uri",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 6, name: "data", kind: "message", T: Data, oneof: "type" },
      { no: 7, name: "normalized", kind: "message", T: Normalized, oneof: "type" },
      { no: 8, name: "transformed", kind: "message", T: Transformed, oneof: "type" }
    ]);
    static fromBinary(bytes, options) {
      return new _Content().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Content().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Content().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Content, a, b);
    }
  };
  var GitRepo = class _GitRepo extends Message {
    /**
     * @generated from field: string url = 1;
     */
    url = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.GitRepo";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _GitRepo().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GitRepo().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GitRepo().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GitRepo, a, b);
    }
  };
  var Data = class _Data extends Message {
    /**
     * @generated from oneof content.Data.type
     */
    type = { case: void 0 };
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Data";
    static fields = proto3.util.newFieldList(() => [
      { no: 4, name: "text", kind: "message", T: Text, oneof: "type" },
      { no: 5, name: "file", kind: "message", T: File, oneof: "type" },
      { no: 6, name: "url", kind: "message", T: URL2, oneof: "type" }
    ]);
    static fromBinary(bytes, options) {
      return new _Data().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Data().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Data().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Data, a, b);
    }
  };
  var Normalized = class _Normalized extends Message {
    /**
     * @generated from oneof content.Normalized.type
     */
    type = { case: void 0 };
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Normalized";
    static fields = proto3.util.newFieldList(() => [
      { no: 3, name: "article", kind: "message", T: Article, oneof: "type" },
      { no: 4, name: "html", kind: "message", T: HTML, oneof: "type" },
      { no: 6, name: "transcript", kind: "message", T: Transcript, oneof: "type" },
      { no: 7, name: "readme", kind: "message", T: ReadMe, oneof: "type" }
    ]);
    static fromBinary(bytes, options) {
      return new _Normalized().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Normalized().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Normalized().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Normalized, a, b);
    }
  };
  var Transformed = class _Transformed extends Message {
    /**
     * @generated from oneof content.Transformed.type
     */
    type = { case: void 0 };
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Transformed";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "summary", kind: "message", T: Summary, oneof: "type" },
      { no: 2, name: "categories", kind: "message", T: Categories, oneof: "type" }
    ]);
    static fromBinary(bytes, options) {
      return new _Transformed().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Transformed().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Transformed().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Transformed, a, b);
    }
  };
  var Article = class _Article extends Message {
    /**
     * @generated from field: string title = 1;
     */
    title = "";
    /**
     * @generated from field: string author = 2;
     */
    author = "";
    /**
     * @generated from field: int32 length = 3;
     */
    length = 0;
    /**
     * @generated from field: string excerpt = 4;
     */
    excerpt = "";
    /**
     * @generated from field: string site_name = 5;
     */
    siteName = "";
    /**
     * @generated from field: string image = 6;
     */
    image = "";
    /**
     * @generated from field: string favicon = 7;
     */
    favicon = "";
    /**
     * @generated from field: string text = 8;
     */
    text = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Article";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "title",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "author",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "length",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      },
      {
        no: 4,
        name: "excerpt",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "site_name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 6,
        name: "image",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 7,
        name: "favicon",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 8,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Article().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Article().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Article().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Article, a, b);
    }
  };
  var HTML = class _HTML extends Message {
    /**
     * @generated from field: string html = 1;
     */
    html = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.HTML";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "html",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _HTML().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _HTML().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _HTML().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_HTML, a, b);
    }
  };
  var ReadMe = class _ReadMe extends Message {
    /**
     * @generated from field: string data = 1;
     */
    data = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.ReadMe";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "data",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _ReadMe().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _ReadMe().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _ReadMe().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_ReadMe, a, b);
    }
  };
  var Summary = class _Summary extends Message {
    /**
     * @generated from field: string summary = 1;
     */
    summary = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Summary";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "summary",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Summary().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Summary().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Summary().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Summary, a, b);
    }
  };
  var Categories = class _Categories extends Message {
    /**
     * @generated from field: repeated string categories = 1;
     */
    categories = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Categories";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "categories", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Categories().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Categories().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Categories().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Categories, a, b);
    }
  };
  var File = class _File extends Message {
    /**
     * @generated from field: string file = 1;
     */
    file = "";
    /**
     * @generated from field: bytes data = 2;
     */
    data = new Uint8Array(0);
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.File";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "file",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "data",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _File().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _File().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _File().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_File, a, b);
    }
  };
  var Text = class _Text extends Message {
    /**
     * @generated from field: string data = 1;
     */
    data = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Text";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "data",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Text().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Text().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Text().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Text, a, b);
    }
  };
  var URL2 = class _URL extends Message {
    /**
     * @generated from field: string url = 1;
     */
    url = "";
    /**
     * @generated from field: bool crawl = 2;
     */
    crawl = false;
    /**
     * @generated from field: string title = 3;
     */
    title = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.URL";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "url",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "crawl",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 3,
        name: "title",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _URL().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _URL().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _URL().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_URL, a, b);
    }
  };
  var Token = class _Token extends Message {
    /**
     * @generated from field: uint32 id = 1;
     */
    id = 0;
    /**
     * @generated from field: uint64 start_time = 2;
     */
    startTime = protoInt64.zero;
    /**
     * @generated from field: uint64 end_time = 3;
     */
    endTime = protoInt64.zero;
    /**
     * @generated from field: string text = 4;
     */
    text = "";
    /**
     * @generated from field: string p = 5;
     */
    p = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Token";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "start_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 3,
        name: "end_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 4,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "p",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Token().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Token().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Token().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Token, a, b);
    }
  };
  var Segment = class _Segment extends Message {
    /**
     * @generated from field: uint32 num = 1;
     */
    num = 0;
    /**
     * @generated from field: repeated content.Token tokens = 2;
     */
    tokens = [];
    /**
     * @generated from field: string text = 3;
     */
    text = "";
    /**
     * @generated from field: uint64 start_time = 4;
     */
    startTime = protoInt64.zero;
    /**
     * @generated from field: uint64 end_time = 5;
     */
    endTime = protoInt64.zero;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Segment";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "num",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 2, name: "tokens", kind: "message", T: Token, repeated: true },
      {
        no: 3,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "start_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 5,
        name: "end_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Segment().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Segment().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Segment().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Segment, a, b);
    }
  };
  var Transcript = class _Transcript extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    /**
     * @generated from field: string name = 2;
     */
    name = "";
    /**
     * @generated from field: repeated content.Segment segments = 3;
     */
    segments = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "content.Transcript";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "segments", kind: "message", T: Segment, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Transcript().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Transcript().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Transcript().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Transcript, a, b);
    }
  };

  // src/rpc/protoflow_pb.ts
  var AnalyzeConversationRequest = class _AnalyzeConversationRequest extends Message {
    /**
     * @generated from field: string text = 1;
     */
    text = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.AnalyzeConversationRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _AnalyzeConversationRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _AnalyzeConversationRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _AnalyzeConversationRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_AnalyzeConversationRequest, a, b);
    }
  };
  var GenerateImagesRequest = class _GenerateImagesRequest extends Message {
    /**
     * @generated from field: string prompt = 1;
     */
    prompt = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GenerateImagesRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "prompt",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _GenerateImagesRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GenerateImagesRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GenerateImagesRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GenerateImagesRequest, a, b);
    }
  };
  var GenerateImagesResponse = class _GenerateImagesResponse extends Message {
    /**
     * @generated from field: repeated string images = 1;
     */
    images = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GenerateImagesResponse";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "images", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _GenerateImagesResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GenerateImagesResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GenerateImagesResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GenerateImagesResponse, a, b);
    }
  };
  var DeleteSessionRequest = class _DeleteSessionRequest extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.DeleteSessionRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _DeleteSessionRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _DeleteSessionRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _DeleteSessionRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_DeleteSessionRequest, a, b);
    }
  };
  var Prompt = class _Prompt extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    /**
     * @generated from field: string text = 2;
     */
    text = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.Prompt";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Prompt().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Prompt().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Prompt().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Prompt, a, b);
    }
  };
  var GetPromptsRequest = class _GetPromptsRequest extends Message {
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GetPromptsRequest";
    static fields = proto3.util.newFieldList(() => []);
    static fromBinary(bytes, options) {
      return new _GetPromptsRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GetPromptsRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GetPromptsRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GetPromptsRequest, a, b);
    }
  };
  var GetPromptsResponse = class _GetPromptsResponse extends Message {
    /**
     * @generated from field: repeated protoflow.Prompt prompts = 1;
     */
    prompts = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GetPromptsResponse";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "prompts", kind: "message", T: Prompt, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _GetPromptsResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GetPromptsResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GetPromptsResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GetPromptsResponse, a, b);
    }
  };
  var InferRequest = class _InferRequest extends Message {
    /**
     * @generated from field: string prompt = 1;
     */
    prompt = "";
    /**
     * @generated from field: repeated string text = 2;
     */
    text = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.InferRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "prompt",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "text", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _InferRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _InferRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _InferRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_InferRequest, a, b);
    }
  };
  var InferResponse = class _InferResponse extends Message {
    /**
     * @generated from field: string text = 1;
     */
    text = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.InferResponse";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _InferResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _InferResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _InferResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_InferResponse, a, b);
    }
  };
  var UploadContentRequest = class _UploadContentRequest extends Message {
    /**
     * @generated from field: content.Content content = 1;
     */
    content;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.UploadContentRequest";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "content", kind: "message", T: Content }
    ]);
    static fromBinary(bytes, options) {
      return new _UploadContentRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _UploadContentRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _UploadContentRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_UploadContentRequest, a, b);
    }
  };
  var UploadContentResponse = class _UploadContentResponse extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.UploadContentResponse";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _UploadContentResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _UploadContentResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _UploadContentResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_UploadContentResponse, a, b);
    }
  };
  var GetSessionRequest = class _GetSessionRequest extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GetSessionRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _GetSessionRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GetSessionRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GetSessionRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GetSessionRequest, a, b);
    }
  };
  var GetSessionResponse = class _GetSessionResponse extends Message {
    /**
     * @generated from field: protoflow.Session session = 1;
     */
    session;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GetSessionResponse";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "session", kind: "message", T: Session }
    ]);
    static fromBinary(bytes, options) {
      return new _GetSessionResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GetSessionResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GetSessionResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GetSessionResponse, a, b);
    }
  };
  var GetSessionsRequest = class _GetSessionsRequest extends Message {
    /**
     * @generated from field: uint64 page = 1;
     */
    page = protoInt64.zero;
    /**
     * @generated from field: uint64 limit = 2;
     */
    limit = protoInt64.zero;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GetSessionsRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "page",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 2,
        name: "limit",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _GetSessionsRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GetSessionsRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GetSessionsRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GetSessionsRequest, a, b);
    }
  };
  var GetSessionsResponse = class _GetSessionsResponse extends Message {
    /**
     * @generated from field: repeated protoflow.Session sessions = 1;
     */
    sessions = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.GetSessionsResponse";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "sessions", kind: "message", T: Session, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _GetSessionsResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GetSessionsResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GetSessionsResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GetSessionsResponse, a, b);
    }
  };
  var Token2 = class _Token extends Message {
    /**
     * @generated from field: uint32 id = 1;
     */
    id = 0;
    /**
     * @generated from field: uint64 start_time = 2;
     */
    startTime = protoInt64.zero;
    /**
     * @generated from field: uint64 end_time = 3;
     */
    endTime = protoInt64.zero;
    /**
     * @generated from field: string text = 4;
     */
    text = "";
    /**
     * @generated from field: string p = 5;
     */
    p = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.Token";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 2,
        name: "start_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 3,
        name: "end_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 4,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 5,
        name: "p",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Token().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Token().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Token().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Token, a, b);
    }
  };
  var Segment2 = class _Segment extends Message {
    /**
     * @generated from field: uint32 num = 1;
     */
    num = 0;
    /**
     * @generated from field: repeated protoflow.Token tokens = 2;
     */
    tokens = [];
    /**
     * @generated from field: string text = 3;
     */
    text = "";
    /**
     * @generated from field: uint64 start_time = 4;
     */
    startTime = protoInt64.zero;
    /**
     * @generated from field: uint64 end_time = 5;
     */
    endTime = protoInt64.zero;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.Segment";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "num",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      { no: 2, name: "tokens", kind: "message", T: Token2, repeated: true },
      {
        no: 3,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 4,
        name: "start_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      },
      {
        no: 5,
        name: "end_time",
        kind: "scalar",
        T: 4
        /* ScalarType.UINT64 */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Segment().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Segment().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Segment().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Segment, a, b);
    }
  };
  var Session = class _Session extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    /**
     * @generated from field: string name = 2;
     */
    name = "";
    /**
     * @generated from field: repeated protoflow.Segment segments = 3;
     */
    segments = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.Session";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "segments", kind: "message", T: Segment2, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Session().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Session().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Session().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Session, a, b);
    }
  };
  var TranscriptionRequest = class _TranscriptionRequest extends Message {
    /**
     * @generated from field: string file_path = 14;
     */
    filePath = "";
    /**
     * Path to the model file
     *
     * @generated from field: string model = 1;
     */
    model = "";
    /**
     * Spoken language
     *
     * @generated from field: string language = 2;
     */
    language = "";
    /**
     * Translate from source language to English
     *
     * @generated from field: bool translate = 3;
     */
    translate = false;
    /**
     * Time offset in nanoseconds to match Go's time.Duration
     *
     * @generated from field: int64 offset = 4;
     */
    offset = protoInt64.zero;
    /**
     * Duration of audio to process in nanoseconds
     *
     * @generated from field: int64 duration = 5;
     */
    duration = protoInt64.zero;
    /**
     * Number of threads to use
     *
     * @generated from field: uint32 threads = 6;
     */
    threads = 0;
    /**
     * Enable speedup
     *
     * @generated from field: bool speedup = 7;
     */
    speedup = false;
    /**
     * Maximum segment length in characters
     *
     * @generated from field: uint32 max_len = 8;
     */
    maxLen = 0;
    /**
     * Maximum tokens per segment
     *
     * @generated from field: uint32 max_tokens = 9;
     */
    maxTokens = 0;
    /**
     * Maximum segment score
     *
     * @generated from field: double word_threshold = 10;
     */
    wordThreshold = 0;
    /**
     * Display tokens
     *
     * @generated from field: bool tokens = 11;
     */
    tokens = false;
    /**
     * Colorize tokens
     *
     * @generated from field: bool colorize = 12;
     */
    colorize = false;
    /**
     * Output format (srt, none or leave as empty string)
     *
     * @generated from field: string out = 13;
     */
    out = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.TranscriptionRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 14,
        name: "file_path",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 1,
        name: "model",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "language",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 3,
        name: "translate",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 4,
        name: "offset",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 5,
        name: "duration",
        kind: "scalar",
        T: 3
        /* ScalarType.INT64 */
      },
      {
        no: 6,
        name: "threads",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 7,
        name: "speedup",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 8,
        name: "max_len",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 9,
        name: "max_tokens",
        kind: "scalar",
        T: 13
        /* ScalarType.UINT32 */
      },
      {
        no: 10,
        name: "word_threshold",
        kind: "scalar",
        T: 1
        /* ScalarType.DOUBLE */
      },
      {
        no: 11,
        name: "tokens",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 12,
        name: "colorize",
        kind: "scalar",
        T: 8
        /* ScalarType.BOOL */
      },
      {
        no: 13,
        name: "out",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _TranscriptionRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _TranscriptionRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _TranscriptionRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_TranscriptionRequest, a, b);
    }
  };
  var RegisterFlags = class _RegisterFlags extends Message {
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.RegisterFlags";
    static fields = proto3.util.newFieldList(() => []);
    static fromBinary(bytes, options) {
      return new _RegisterFlags().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _RegisterFlags().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _RegisterFlags().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_RegisterFlags, a, b);
    }
  };
  var OCRText = class _OCRText extends Message {
    /**
     * @generated from field: string text = 1;
     */
    text = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.OCRText";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _OCRText().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _OCRText().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _OCRText().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_OCRText, a, b);
    }
  };
  var Image = class _Image extends Message {
    /**
     * @generated from field: bytes image = 1;
     */
    image = new Uint8Array(0);
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.Image";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "image",
        kind: "scalar",
        T: 12
        /* ScalarType.BYTES */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _Image().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Image().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Image().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Image, a, b);
    }
  };
  var ConvertFileRequest = class _ConvertFileRequest extends Message {
    /**
     * @generated from field: string from = 1;
     */
    from = "";
    /**
     * @generated from field: string to = 2;
     */
    to = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.ConvertFileRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "from",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "to",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _ConvertFileRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _ConvertFileRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _ConvertFileRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_ConvertFileRequest, a, b);
    }
  };
  var ChatRequest = class _ChatRequest extends Message {
    /**
     * @generated from field: int32 capture_device = 1;
     */
    captureDevice = 0;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.ChatRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "capture_device",
        kind: "scalar",
        T: 5
        /* ScalarType.INT32 */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _ChatRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _ChatRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _ChatRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_ChatRequest, a, b);
    }
  };
  var ChatResponse = class _ChatResponse extends Message {
    /**
     * @generated from field: protoflow.Segment segment = 1;
     */
    segment;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.ChatResponse";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "segment", kind: "message", T: Segment2 }
    ]);
    static fromBinary(bytes, options) {
      return new _ChatResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _ChatResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _ChatResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_ChatResponse, a, b);
    }
  };
  var YouTubeVideo = class _YouTubeVideo extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    /**
     * @generated from field: string file = 2;
     */
    file = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.YouTubeVideo";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "file",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _YouTubeVideo().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _YouTubeVideo().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _YouTubeVideo().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_YouTubeVideo, a, b);
    }
  };
  var FilePath = class _FilePath extends Message {
    /**
     * @generated from field: string file = 1;
     */
    file = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.FilePath";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "file",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _FilePath().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _FilePath().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _FilePath().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_FilePath, a, b);
    }
  };
  var YouTubeVideoResponse = class _YouTubeVideoResponse extends Message {
    /**
     * @generated from field: string title = 1;
     */
    title = "";
    /**
     * @generated from field: protoflow.FilePath file_path = 2;
     */
    filePath;
    /**
     * @generated from field: repeated protoflow.Segment transcript = 3;
     */
    transcript = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "protoflow.YouTubeVideoResponse";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "title",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 2, name: "file_path", kind: "message", T: FilePath },
      { no: 3, name: "transcript", kind: "message", T: Segment2, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _YouTubeVideoResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _YouTubeVideoResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _YouTubeVideoResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_YouTubeVideoResponse, a, b);
    }
  };

  // src/rpc/ai_pb.ts
  var AnalyzeConversationResponse = class _AnalyzeConversationResponse extends Message {
    /**
     * Phone numbers of the participants
     *
     * @generated from field: repeated string phone_numbers = 1;
     */
    phoneNumbers = [];
    /**
     * The summary of the conversation
     *
     * @generated from field: string summary = 2;
     */
    summary = "";
    /**
     * Based on the content of the conversation, the system will generate a list of questions
     *
     * @generated from field: repeated string questions = 3;
     */
    questions = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "ai.AnalyzeConversationResponse";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "phone_numbers", kind: "scalar", T: 9, repeated: true },
      {
        no: 2,
        name: "summary",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "questions", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _AnalyzeConversationResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _AnalyzeConversationResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _AnalyzeConversationResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_AnalyzeConversationResponse, a, b);
    }
  };
  var AnalyzeContent = class _AnalyzeContent extends Message {
    /**
     * Potential categories for the content in the form: category/subcategory/other-category. The category is all lowercase and spaces are replaced with dashes.
     *
     * @generated from field: repeated string categories = 1;
     */
    categories = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "ai.AnalyzeContent";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "categories", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _AnalyzeContent().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _AnalyzeContent().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _AnalyzeContent().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_AnalyzeContent, a, b);
    }
  };

  // src/rpc/protoflow_connect.ts
  var ProtoflowService = {
    typeName: "protoflow.ProtoflowService",
    methods: {
      /**
       * @generated from rpc protoflow.ProtoflowService.DownloadYouTubeVideo
       */
      downloadYouTubeVideo: {
        name: "DownloadYouTubeVideo",
        I: YouTubeVideo,
        O: YouTubeVideoResponse,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.GetSessions
       */
      getSessions: {
        name: "GetSessions",
        I: GetSessionsRequest,
        O: GetSessionsResponse,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.GetSession
       */
      getSession: {
        name: "GetSession",
        I: GetSessionRequest,
        O: GetSessionResponse,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.DeleteSession
       */
      deleteSession: {
        name: "DeleteSession",
        I: DeleteSessionRequest,
        O: Empty,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.GetPrompts
       */
      getPrompts: {
        name: "GetPrompts",
        I: GetPromptsRequest,
        O: GetPromptsResponse,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.NewPrompt
       */
      newPrompt: {
        name: "NewPrompt",
        I: Prompt,
        O: Prompt,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.UploadContent
       */
      uploadContent: {
        name: "UploadContent",
        I: UploadContentRequest,
        O: ChatResponse,
        kind: MethodKind.ServerStreaming
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.Infer
       */
      infer: {
        name: "Infer",
        I: InferRequest,
        O: InferResponse,
        kind: MethodKind.ServerStreaming
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.Chat
       */
      chat: {
        name: "Chat",
        I: ChatRequest,
        O: ChatResponse,
        kind: MethodKind.ServerStreaming
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.ConvertFile
       */
      convertFile: {
        name: "ConvertFile",
        I: ConvertFileRequest,
        O: FilePath,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.GenerateImages
       */
      generateImages: {
        name: "GenerateImages",
        I: GenerateImagesRequest,
        O: GenerateImagesResponse,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc protoflow.ProtoflowService.AnalyzeConversation
       */
      analyzeConversation: {
        name: "AnalyzeConversation",
        I: AnalyzeConversationRequest,
        O: AnalyzeConversationResponse,
        kind: MethodKind.Unary
      }
    }
  };

  // src/rpc/content/content_connect.ts
  var ContentService = {
    typeName: "content.ContentService",
    methods: {
      /**
       * @generated from rpc content.ContentService.Save
       */
      save: {
        name: "Save",
        I: Contents,
        O: ContentIDs,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc content.ContentService.Search
       */
      search: {
        name: "Search",
        I: Query,
        O: Results,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc content.ContentService.Analyze
       */
      analyze: {
        name: "Analyze",
        I: Content,
        O: Contents,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc content.ContentService.Delete
       */
      delete: {
        name: "Delete",
        I: ContentIDs,
        O: ContentIDs,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc content.ContentService.GetTags
       */
      getTags: {
        name: "GetTags",
        I: TagRequest,
        O: Tags,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc content.ContentService.Vote
       */
      vote: {
        name: "Vote",
        I: VoteRequest,
        O: VoteResponse,
        kind: MethodKind.Unary
      }
    }
  };

  // src/rpc/user/user_pb.ts
  var GroupInfoRequest = class _GroupInfoRequest extends Message {
    /**
     * @generated from field: string secret = 1;
     */
    secret = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.GroupInfoRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "secret",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _GroupInfoRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GroupInfoRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GroupInfoRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GroupInfoRequest, a, b);
    }
  };
  var GroupID = class _GroupID extends Message {
    /**
     * @generated from field: string group_id = 1;
     */
    groupId = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.GroupID";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "group_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _GroupID().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GroupID().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GroupID().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GroupID, a, b);
    }
  };
  var ShareRequest = class _ShareRequest extends Message {
    /**
     * @generated from field: string content_id = 1;
     */
    contentId = "";
    /**
     * @generated from field: string group_id = 2;
     */
    groupId = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.ShareRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "content_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "group_id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _ShareRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _ShareRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _ShareRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_ShareRequest, a, b);
    }
  };
  var GroupInvite = class _GroupInvite extends Message {
    /**
     * @generated from field: string secret = 1;
     */
    secret = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.GroupInvite";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "secret",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _GroupInvite().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _GroupInvite().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _GroupInvite().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_GroupInvite, a, b);
    }
  };
  var Groups = class _Groups extends Message {
    /**
     * @generated from field: repeated user.Group groups = 1;
     */
    groups = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.Groups";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "groups", kind: "message", T: Group, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Groups().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Groups().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Groups().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Groups, a, b);
    }
  };
  var AnalyzeConversationRequest2 = class _AnalyzeConversationRequest extends Message {
    /**
     * @generated from field: string text = 1;
     */
    text = "";
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.AnalyzeConversationRequest";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "text",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      }
    ]);
    static fromBinary(bytes, options) {
      return new _AnalyzeConversationRequest().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _AnalyzeConversationRequest().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _AnalyzeConversationRequest().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_AnalyzeConversationRequest, a, b);
    }
  };
  var User = class _User extends Message {
    /**
     * @generated from field: string email = 1;
     */
    email = "";
    /**
     * @generated from field: string password = 2;
     */
    password = "";
    /**
     * @generated from field: user.Config config = 3;
     */
    config;
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.User";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "email",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "password",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "config", kind: "message", T: Config }
    ]);
    static fromBinary(bytes, options) {
      return new _User().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _User().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _User().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_User, a, b);
    }
  };
  var Group = class _Group extends Message {
    /**
     * @generated from field: string id = 1;
     */
    id = "";
    /**
     * @generated from field: string name = 2;
     */
    name = "";
    /**
     * @generated from field: repeated string users = 3;
     */
    users = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.Group";
    static fields = proto3.util.newFieldList(() => [
      {
        no: 1,
        name: "id",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      {
        no: 2,
        name: "name",
        kind: "scalar",
        T: 9
        /* ScalarType.STRING */
      },
      { no: 3, name: "users", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Group().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Group().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Group().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Group, a, b);
    }
  };
  var Config = class _Config extends Message {
    /**
     * @generated from field: repeated string domain_whitelist = 1;
     */
    domainWhitelist = [];
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.Config";
    static fields = proto3.util.newFieldList(() => [
      { no: 1, name: "domain_whitelist", kind: "scalar", T: 9, repeated: true }
    ]);
    static fromBinary(bytes, options) {
      return new _Config().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _Config().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _Config().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_Config, a, b);
    }
  };
  var LoginResponse = class _LoginResponse extends Message {
    constructor(data) {
      super();
      proto3.util.initPartial(data, this);
    }
    static runtime = proto3;
    static typeName = "user.LoginResponse";
    static fields = proto3.util.newFieldList(() => []);
    static fromBinary(bytes, options) {
      return new _LoginResponse().fromBinary(bytes, options);
    }
    static fromJson(jsonValue, options) {
      return new _LoginResponse().fromJson(jsonValue, options);
    }
    static fromJsonString(jsonString, options) {
      return new _LoginResponse().fromJsonString(jsonString, options);
    }
    static equals(a, b) {
      return proto3.util.equals(_LoginResponse, a, b);
    }
  };

  // src/rpc/user/user_connect.ts
  var UserService = {
    typeName: "user.UserService",
    methods: {
      /**
       * @generated from rpc user.UserService.Register
       */
      register: {
        name: "Register",
        I: User,
        O: User,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.Login
       */
      login: {
        name: "Login",
        I: User,
        O: User,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.Logout
       */
      logout: {
        name: "Logout",
        I: Empty,
        O: Empty,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.UpdateConfig
       */
      updateConfig: {
        name: "UpdateConfig",
        I: Config,
        O: Empty,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.CreateGroupInvite
       */
      createGroupInvite: {
        name: "CreateGroupInvite",
        I: GroupID,
        O: GroupInvite,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.JoinGroup
       */
      joinGroup: {
        name: "JoinGroup",
        I: GroupInvite,
        O: Group,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.GroupInfo
       */
      groupInfo: {
        name: "GroupInfo",
        I: GroupInfoRequest,
        O: Group,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.CreateGroup
       */
      createGroup: {
        name: "CreateGroup",
        I: Group,
        O: Group,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.GetGroups
       */
      getGroups: {
        name: "GetGroups",
        I: Empty,
        O: Groups,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.DeleteGroup
       */
      deleteGroup: {
        name: "DeleteGroup",
        I: Group,
        O: Empty,
        kind: MethodKind.Unary
      },
      /**
       * @generated from rpc user.UserService.Share
       */
      share: {
        name: "Share",
        I: ShareRequest,
        O: Empty,
        kind: MethodKind.Unary
      }
    }
  };

  // ../node_modules/@tanstack/query-core/build/lib/subscribable.mjs
  var Subscribable = class {
    constructor() {
      this.listeners = /* @__PURE__ */ new Set();
      this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
      const identity = {
        listener
      };
      this.listeners.add(identity);
      this.onSubscribe();
      return () => {
        this.listeners.delete(identity);
        this.onUnsubscribe();
      };
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {
    }
    onUnsubscribe() {
    }
  };

  // ../node_modules/@tanstack/query-core/build/lib/utils.mjs
  var isServer = typeof window === "undefined" || "Deno" in window;
  function noop() {
    return void 0;
  }
  function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
  }
  function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
  }
  function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
  }
  function parseQueryArgs(arg1, arg2, arg3) {
    if (!isQueryKey(arg1)) {
      return arg1;
    }
    if (typeof arg2 === "function") {
      return {
        ...arg3,
        queryKey: arg1,
        queryFn: arg2
      };
    }
    return {
      ...arg2,
      queryKey: arg1
    };
  }
  function parseFilterArgs(arg1, arg2, arg3) {
    return isQueryKey(arg1) ? [{
      ...arg2,
      queryKey: arg1
    }, arg3] : [arg1 || {}, arg2];
  }
  function matchQuery(filters, query) {
    const {
      type = "all",
      exact,
      fetchStatus,
      predicate,
      queryKey,
      stale
    } = filters;
    if (isQueryKey(queryKey)) {
      if (exact) {
        if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
          return false;
        }
      } else if (!partialMatchKey(query.queryKey, queryKey)) {
        return false;
      }
    }
    if (type !== "all") {
      const isActive = query.isActive();
      if (type === "active" && !isActive) {
        return false;
      }
      if (type === "inactive" && isActive) {
        return false;
      }
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) {
      return false;
    }
    if (typeof fetchStatus !== "undefined" && fetchStatus !== query.state.fetchStatus) {
      return false;
    }
    if (predicate && !predicate(query)) {
      return false;
    }
    return true;
  }
  function matchMutation(filters, mutation) {
    const {
      exact,
      fetching,
      predicate,
      mutationKey
    } = filters;
    if (isQueryKey(mutationKey)) {
      if (!mutation.options.mutationKey) {
        return false;
      }
      if (exact) {
        if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
          return false;
        }
      } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
        return false;
      }
    }
    if (typeof fetching === "boolean" && mutation.state.status === "loading" !== fetching) {
      return false;
    }
    if (predicate && !predicate(mutation)) {
      return false;
    }
    return true;
  }
  function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = (options == null ? void 0 : options.queryKeyHashFn) || hashQueryKey;
    return hashFn(queryKey);
  }
  function hashQueryKey(queryKey) {
    return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val);
  }
  function partialMatchKey(a, b) {
    return partialDeepEqual(a, b);
  }
  function partialDeepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
      return !Object.keys(b).some((key) => !partialDeepEqual(a[key], b[key]));
    }
    return false;
  }
  function replaceEqualDeep(a, b) {
    if (a === b) {
      return a;
    }
    const array = isPlainArray(a) && isPlainArray(b);
    if (array || isPlainObject(a) && isPlainObject(b)) {
      const aSize = array ? a.length : Object.keys(a).length;
      const bItems = array ? b : Object.keys(b);
      const bSize = bItems.length;
      const copy = array ? [] : {};
      let equalItems = 0;
      for (let i = 0; i < bSize; i++) {
        const key = array ? i : bItems[i];
        copy[key] = replaceEqualDeep(a[key], b[key]);
        if (copy[key] === a[key]) {
          equalItems++;
        }
      }
      return aSize === bSize && equalItems === aSize ? a : copy;
    }
    return b;
  }
  function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
  }
  function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
      return false;
    }
    const ctor = o.constructor;
    if (typeof ctor === "undefined") {
      return true;
    }
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
      return false;
    }
    if (!prot.hasOwnProperty("isPrototypeOf")) {
      return false;
    }
    return true;
  }
  function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isQueryKey(value) {
    return Array.isArray(value);
  }
  function sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  function scheduleMicrotask(callback) {
    sleep(0).then(callback);
  }
  function getAbortController() {
    if (typeof AbortController === "function") {
      return new AbortController();
    }
    return;
  }
  function replaceData(prevData, data, options) {
    if (options.isDataEqual != null && options.isDataEqual(prevData, data)) {
      return prevData;
    } else if (typeof options.structuralSharing === "function") {
      return options.structuralSharing(prevData, data);
    } else if (options.structuralSharing !== false) {
      return replaceEqualDeep(prevData, data);
    }
    return data;
  }

  // ../node_modules/@tanstack/query-core/build/lib/focusManager.mjs
  var FocusManager = class extends Subscribable {
    constructor() {
      super();
      this.setup = (onFocus) => {
        if (!isServer && window.addEventListener) {
          const listener = () => onFocus();
          window.addEventListener("visibilitychange", listener, false);
          window.addEventListener("focus", listener, false);
          return () => {
            window.removeEventListener("visibilitychange", listener);
            window.removeEventListener("focus", listener);
          };
        }
        return;
      };
    }
    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }
    onUnsubscribe() {
      if (!this.hasListeners()) {
        var _this$cleanup;
        (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
        this.cleanup = void 0;
      }
    }
    setEventListener(setup) {
      var _this$cleanup2;
      this.setup = setup;
      (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
      this.cleanup = setup((focused) => {
        if (typeof focused === "boolean") {
          this.setFocused(focused);
        } else {
          this.onFocus();
        }
      });
    }
    setFocused(focused) {
      const changed = this.focused !== focused;
      if (changed) {
        this.focused = focused;
        this.onFocus();
      }
    }
    onFocus() {
      this.listeners.forEach(({
        listener
      }) => {
        listener();
      });
    }
    isFocused() {
      if (typeof this.focused === "boolean") {
        return this.focused;
      }
      if (typeof document === "undefined") {
        return true;
      }
      return [void 0, "visible", "prerender"].includes(document.visibilityState);
    }
  };
  var focusManager = new FocusManager();

  // ../node_modules/@tanstack/query-core/build/lib/onlineManager.mjs
  var onlineEvents = ["online", "offline"];
  var OnlineManager = class extends Subscribable {
    constructor() {
      super();
      this.setup = (onOnline) => {
        if (!isServer && window.addEventListener) {
          const listener = () => onOnline();
          onlineEvents.forEach((event) => {
            window.addEventListener(event, listener, false);
          });
          return () => {
            onlineEvents.forEach((event) => {
              window.removeEventListener(event, listener);
            });
          };
        }
        return;
      };
    }
    onSubscribe() {
      if (!this.cleanup) {
        this.setEventListener(this.setup);
      }
    }
    onUnsubscribe() {
      if (!this.hasListeners()) {
        var _this$cleanup;
        (_this$cleanup = this.cleanup) == null ? void 0 : _this$cleanup.call(this);
        this.cleanup = void 0;
      }
    }
    setEventListener(setup) {
      var _this$cleanup2;
      this.setup = setup;
      (_this$cleanup2 = this.cleanup) == null ? void 0 : _this$cleanup2.call(this);
      this.cleanup = setup((online) => {
        if (typeof online === "boolean") {
          this.setOnline(online);
        } else {
          this.onOnline();
        }
      });
    }
    setOnline(online) {
      const changed = this.online !== online;
      if (changed) {
        this.online = online;
        this.onOnline();
      }
    }
    onOnline() {
      this.listeners.forEach(({
        listener
      }) => {
        listener();
      });
    }
    isOnline() {
      if (typeof this.online === "boolean") {
        return this.online;
      }
      if (typeof navigator === "undefined" || typeof navigator.onLine === "undefined") {
        return true;
      }
      return navigator.onLine;
    }
  };
  var onlineManager = new OnlineManager();

  // ../node_modules/@tanstack/query-core/build/lib/retryer.mjs
  function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
  }
  function canFetch(networkMode) {
    return (networkMode != null ? networkMode : "online") === "online" ? onlineManager.isOnline() : true;
  }
  var CancelledError = class {
    constructor(options) {
      this.revert = options == null ? void 0 : options.revert;
      this.silent = options == null ? void 0 : options.silent;
    }
  };
  function isCancelledError(value) {
    return value instanceof CancelledError;
  }
  function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let isResolved = false;
    let continueFn;
    let promiseResolve;
    let promiseReject;
    const promise = new Promise((outerResolve, outerReject) => {
      promiseResolve = outerResolve;
      promiseReject = outerReject;
    });
    const cancel = (cancelOptions) => {
      if (!isResolved) {
        reject(new CancelledError(cancelOptions));
        config.abort == null ? void 0 : config.abort();
      }
    };
    const cancelRetry = () => {
      isRetryCancelled = true;
    };
    const continueRetry = () => {
      isRetryCancelled = false;
    };
    const shouldPause = () => !focusManager.isFocused() || config.networkMode !== "always" && !onlineManager.isOnline();
    const resolve = (value) => {
      if (!isResolved) {
        isResolved = true;
        config.onSuccess == null ? void 0 : config.onSuccess(value);
        continueFn == null ? void 0 : continueFn();
        promiseResolve(value);
      }
    };
    const reject = (value) => {
      if (!isResolved) {
        isResolved = true;
        config.onError == null ? void 0 : config.onError(value);
        continueFn == null ? void 0 : continueFn();
        promiseReject(value);
      }
    };
    const pause = () => {
      return new Promise((continueResolve) => {
        continueFn = (value) => {
          const canContinue = isResolved || !shouldPause();
          if (canContinue) {
            continueResolve(value);
          }
          return canContinue;
        };
        config.onPause == null ? void 0 : config.onPause();
      }).then(() => {
        continueFn = void 0;
        if (!isResolved) {
          config.onContinue == null ? void 0 : config.onContinue();
        }
      });
    };
    const run = () => {
      if (isResolved) {
        return;
      }
      let promiseOrValue;
      try {
        promiseOrValue = config.fn();
      } catch (error) {
        promiseOrValue = Promise.reject(error);
      }
      Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
        var _config$retry, _config$retryDelay;
        if (isResolved) {
          return;
        }
        const retry = (_config$retry = config.retry) != null ? _config$retry : 3;
        const retryDelay = (_config$retryDelay = config.retryDelay) != null ? _config$retryDelay : defaultRetryDelay;
        const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
        const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
        if (isRetryCancelled || !shouldRetry) {
          reject(error);
          return;
        }
        failureCount++;
        config.onFail == null ? void 0 : config.onFail(failureCount, error);
        sleep(delay).then(() => {
          if (shouldPause()) {
            return pause();
          }
          return;
        }).then(() => {
          if (isRetryCancelled) {
            reject(error);
          } else {
            run();
          }
        });
      });
    };
    if (canFetch(config.networkMode)) {
      run();
    } else {
      pause().then(run);
    }
    return {
      promise,
      cancel,
      continue: () => {
        const didContinue = continueFn == null ? void 0 : continueFn();
        return didContinue ? promise : Promise.resolve();
      },
      cancelRetry,
      continueRetry
    };
  }

  // ../node_modules/@tanstack/query-core/build/lib/logger.mjs
  var defaultLogger = console;

  // ../node_modules/@tanstack/query-core/build/lib/notifyManager.mjs
  function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback) => {
      callback();
    };
    let batchNotifyFn = (callback) => {
      callback();
    };
    const batch = (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    };
    const schedule = (callback) => {
      if (transactions) {
        queue.push(callback);
      } else {
        scheduleMicrotask(() => {
          notifyFn(callback);
        });
      }
    };
    const batchCalls = (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    };
    const flush = () => {
      const originalQueue = queue;
      queue = [];
      if (originalQueue.length) {
        scheduleMicrotask(() => {
          batchNotifyFn(() => {
            originalQueue.forEach((callback) => {
              notifyFn(callback);
            });
          });
        });
      }
    };
    const setNotifyFunction = (fn) => {
      notifyFn = fn;
    };
    const setBatchNotifyFunction = (fn) => {
      batchNotifyFn = fn;
    };
    return {
      batch,
      batchCalls,
      schedule,
      setNotifyFunction,
      setBatchNotifyFunction
    };
  }
  var notifyManager = createNotifyManager();

  // ../node_modules/@tanstack/query-core/build/lib/removable.mjs
  var Removable = class {
    destroy() {
      this.clearGcTimeout();
    }
    scheduleGc() {
      this.clearGcTimeout();
      if (isValidTimeout(this.cacheTime)) {
        this.gcTimeout = setTimeout(() => {
          this.optionalRemove();
        }, this.cacheTime);
      }
    }
    updateCacheTime(newCacheTime) {
      this.cacheTime = Math.max(this.cacheTime || 0, newCacheTime != null ? newCacheTime : isServer ? Infinity : 5 * 60 * 1e3);
    }
    clearGcTimeout() {
      if (this.gcTimeout) {
        clearTimeout(this.gcTimeout);
        this.gcTimeout = void 0;
      }
    }
  };

  // ../node_modules/@tanstack/query-core/build/lib/query.mjs
  var Query2 = class extends Removable {
    constructor(config) {
      super();
      this.abortSignalConsumed = false;
      this.defaultOptions = config.defaultOptions;
      this.setOptions(config.options);
      this.observers = [];
      this.cache = config.cache;
      this.logger = config.logger || defaultLogger;
      this.queryKey = config.queryKey;
      this.queryHash = config.queryHash;
      this.initialState = config.state || getDefaultState(this.options);
      this.state = this.initialState;
      this.scheduleGc();
    }
    get meta() {
      return this.options.meta;
    }
    setOptions(options) {
      this.options = {
        ...this.defaultOptions,
        ...options
      };
      this.updateCacheTime(this.options.cacheTime);
    }
    optionalRemove() {
      if (!this.observers.length && this.state.fetchStatus === "idle") {
        this.cache.remove(this);
      }
    }
    setData(newData, options) {
      const data = replaceData(this.state.data, newData, this.options);
      this.dispatch({
        data,
        type: "success",
        dataUpdatedAt: options == null ? void 0 : options.updatedAt,
        manual: options == null ? void 0 : options.manual
      });
      return data;
    }
    setState(state, setStateOptions) {
      this.dispatch({
        type: "setState",
        state,
        setStateOptions
      });
    }
    cancel(options) {
      var _this$retryer;
      const promise = this.promise;
      (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.cancel(options);
      return promise ? promise.then(noop).catch(noop) : Promise.resolve();
    }
    destroy() {
      super.destroy();
      this.cancel({
        silent: true
      });
    }
    reset() {
      this.destroy();
      this.setState(this.initialState);
    }
    isActive() {
      return this.observers.some((observer) => observer.options.enabled !== false);
    }
    isDisabled() {
      return this.getObserversCount() > 0 && !this.isActive();
    }
    isStale() {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || this.observers.some((observer) => observer.getCurrentResult().isStale);
    }
    isStaleByTime(staleTime = 0) {
      return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
      var _this$retryer2;
      const observer = this.observers.find((x) => x.shouldFetchOnWindowFocus());
      if (observer) {
        observer.refetch({
          cancelRefetch: false
        });
      }
      (_this$retryer2 = this.retryer) == null ? void 0 : _this$retryer2.continue();
    }
    onOnline() {
      var _this$retryer3;
      const observer = this.observers.find((x) => x.shouldFetchOnReconnect());
      if (observer) {
        observer.refetch({
          cancelRefetch: false
        });
      }
      (_this$retryer3 = this.retryer) == null ? void 0 : _this$retryer3.continue();
    }
    addObserver(observer) {
      if (!this.observers.includes(observer)) {
        this.observers.push(observer);
        this.clearGcTimeout();
        this.cache.notify({
          type: "observerAdded",
          query: this,
          observer
        });
      }
    }
    removeObserver(observer) {
      if (this.observers.includes(observer)) {
        this.observers = this.observers.filter((x) => x !== observer);
        if (!this.observers.length) {
          if (this.retryer) {
            if (this.abortSignalConsumed) {
              this.retryer.cancel({
                revert: true
              });
            } else {
              this.retryer.cancelRetry();
            }
          }
          this.scheduleGc();
        }
        this.cache.notify({
          type: "observerRemoved",
          query: this,
          observer
        });
      }
    }
    getObserversCount() {
      return this.observers.length;
    }
    invalidate() {
      if (!this.state.isInvalidated) {
        this.dispatch({
          type: "invalidate"
        });
      }
    }
    fetch(options, fetchOptions) {
      var _this$options$behavio, _context$fetchOptions;
      if (this.state.fetchStatus !== "idle") {
        if (this.state.dataUpdatedAt && fetchOptions != null && fetchOptions.cancelRefetch) {
          this.cancel({
            silent: true
          });
        } else if (this.promise) {
          var _this$retryer4;
          (_this$retryer4 = this.retryer) == null ? void 0 : _this$retryer4.continueRetry();
          return this.promise;
        }
      }
      if (options) {
        this.setOptions(options);
      }
      if (!this.options.queryFn) {
        const observer = this.observers.find((x) => x.options.queryFn);
        if (observer) {
          this.setOptions(observer.options);
        }
      }
      if (true) {
        if (!Array.isArray(this.options.queryKey)) {
          this.logger.error("As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']");
        }
      }
      const abortController = getAbortController();
      const queryFnContext = {
        queryKey: this.queryKey,
        pageParam: void 0,
        meta: this.meta
      };
      const addSignalProperty = (object) => {
        Object.defineProperty(object, "signal", {
          enumerable: true,
          get: () => {
            if (abortController) {
              this.abortSignalConsumed = true;
              return abortController.signal;
            }
            return void 0;
          }
        });
      };
      addSignalProperty(queryFnContext);
      const fetchFn = () => {
        if (!this.options.queryFn) {
          return Promise.reject("Missing queryFn for queryKey '" + this.options.queryHash + "'");
        }
        this.abortSignalConsumed = false;
        return this.options.queryFn(queryFnContext);
      };
      const context = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context);
      (_this$options$behavio = this.options.behavior) == null ? void 0 : _this$options$behavio.onFetch(context);
      this.revertState = this.state;
      if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== ((_context$fetchOptions = context.fetchOptions) == null ? void 0 : _context$fetchOptions.meta)) {
        var _context$fetchOptions2;
        this.dispatch({
          type: "fetch",
          meta: (_context$fetchOptions2 = context.fetchOptions) == null ? void 0 : _context$fetchOptions2.meta
        });
      }
      const onError = (error) => {
        if (!(isCancelledError(error) && error.silent)) {
          this.dispatch({
            type: "error",
            error
          });
        }
        if (!isCancelledError(error)) {
          var _this$cache$config$on, _this$cache$config, _this$cache$config$on2, _this$cache$config2;
          (_this$cache$config$on = (_this$cache$config = this.cache.config).onError) == null ? void 0 : _this$cache$config$on.call(_this$cache$config, error, this);
          (_this$cache$config$on2 = (_this$cache$config2 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on2.call(_this$cache$config2, this.state.data, error, this);
          if (true) {
            this.logger.error(error);
          }
        }
        if (!this.isFetchingOptimistic) {
          this.scheduleGc();
        }
        this.isFetchingOptimistic = false;
      };
      this.retryer = createRetryer({
        fn: context.fetchFn,
        abort: abortController == null ? void 0 : abortController.abort.bind(abortController),
        onSuccess: (data) => {
          var _this$cache$config$on3, _this$cache$config3, _this$cache$config$on4, _this$cache$config4;
          if (typeof data === "undefined") {
            if (true) {
              this.logger.error("Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: " + this.queryHash);
            }
            onError(new Error(this.queryHash + " data is undefined"));
            return;
          }
          this.setData(data);
          (_this$cache$config$on3 = (_this$cache$config3 = this.cache.config).onSuccess) == null ? void 0 : _this$cache$config$on3.call(_this$cache$config3, data, this);
          (_this$cache$config$on4 = (_this$cache$config4 = this.cache.config).onSettled) == null ? void 0 : _this$cache$config$on4.call(_this$cache$config4, data, this.state.error, this);
          if (!this.isFetchingOptimistic) {
            this.scheduleGc();
          }
          this.isFetchingOptimistic = false;
        },
        onError,
        onFail: (failureCount, error) => {
          this.dispatch({
            type: "failed",
            failureCount,
            error
          });
        },
        onPause: () => {
          this.dispatch({
            type: "pause"
          });
        },
        onContinue: () => {
          this.dispatch({
            type: "continue"
          });
        },
        retry: context.options.retry,
        retryDelay: context.options.retryDelay,
        networkMode: context.options.networkMode
      });
      this.promise = this.retryer.promise;
      return this.promise;
    }
    dispatch(action) {
      const reducer = (state) => {
        var _action$meta, _action$dataUpdatedAt;
        switch (action.type) {
          case "failed":
            return {
              ...state,
              fetchFailureCount: action.failureCount,
              fetchFailureReason: action.error
            };
          case "pause":
            return {
              ...state,
              fetchStatus: "paused"
            };
          case "continue":
            return {
              ...state,
              fetchStatus: "fetching"
            };
          case "fetch":
            return {
              ...state,
              fetchFailureCount: 0,
              fetchFailureReason: null,
              fetchMeta: (_action$meta = action.meta) != null ? _action$meta : null,
              fetchStatus: canFetch(this.options.networkMode) ? "fetching" : "paused",
              ...!state.dataUpdatedAt && {
                error: null,
                status: "loading"
              }
            };
          case "success":
            return {
              ...state,
              data: action.data,
              dataUpdateCount: state.dataUpdateCount + 1,
              dataUpdatedAt: (_action$dataUpdatedAt = action.dataUpdatedAt) != null ? _action$dataUpdatedAt : Date.now(),
              error: null,
              isInvalidated: false,
              status: "success",
              ...!action.manual && {
                fetchStatus: "idle",
                fetchFailureCount: 0,
                fetchFailureReason: null
              }
            };
          case "error":
            const error = action.error;
            if (isCancelledError(error) && error.revert && this.revertState) {
              return {
                ...this.revertState,
                fetchStatus: "idle"
              };
            }
            return {
              ...state,
              error,
              errorUpdateCount: state.errorUpdateCount + 1,
              errorUpdatedAt: Date.now(),
              fetchFailureCount: state.fetchFailureCount + 1,
              fetchFailureReason: error,
              fetchStatus: "idle",
              status: "error"
            };
          case "invalidate":
            return {
              ...state,
              isInvalidated: true
            };
          case "setState":
            return {
              ...state,
              ...action.state
            };
        }
      };
      this.state = reducer(this.state);
      notifyManager.batch(() => {
        this.observers.forEach((observer) => {
          observer.onQueryUpdate(action);
        });
        this.cache.notify({
          query: this,
          type: "updated",
          action
        });
      });
    }
  };
  function getDefaultState(options) {
    const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
    const hasData = typeof data !== "undefined";
    const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
    return {
      data,
      dataUpdateCount: 0,
      dataUpdatedAt: hasData ? initialDataUpdatedAt != null ? initialDataUpdatedAt : Date.now() : 0,
      error: null,
      errorUpdateCount: 0,
      errorUpdatedAt: 0,
      fetchFailureCount: 0,
      fetchFailureReason: null,
      fetchMeta: null,
      isInvalidated: false,
      status: hasData ? "success" : "loading",
      fetchStatus: "idle"
    };
  }

  // ../node_modules/@tanstack/query-core/build/lib/queryCache.mjs
  var QueryCache = class extends Subscribable {
    constructor(config) {
      super();
      this.config = config || {};
      this.queries = [];
      this.queriesMap = {};
    }
    build(client, options, state) {
      var _options$queryHash;
      const queryKey = options.queryKey;
      const queryHash = (_options$queryHash = options.queryHash) != null ? _options$queryHash : hashQueryKeyByOptions(queryKey, options);
      let query = this.get(queryHash);
      if (!query) {
        query = new Query2({
          cache: this,
          logger: client.getLogger(),
          queryKey,
          queryHash,
          options: client.defaultQueryOptions(options),
          state,
          defaultOptions: client.getQueryDefaults(queryKey)
        });
        this.add(query);
      }
      return query;
    }
    add(query) {
      if (!this.queriesMap[query.queryHash]) {
        this.queriesMap[query.queryHash] = query;
        this.queries.push(query);
        this.notify({
          type: "added",
          query
        });
      }
    }
    remove(query) {
      const queryInMap = this.queriesMap[query.queryHash];
      if (queryInMap) {
        query.destroy();
        this.queries = this.queries.filter((x) => x !== query);
        if (queryInMap === query) {
          delete this.queriesMap[query.queryHash];
        }
        this.notify({
          type: "removed",
          query
        });
      }
    }
    clear() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          this.remove(query);
        });
      });
    }
    get(queryHash) {
      return this.queriesMap[queryHash];
    }
    getAll() {
      return this.queries;
    }
    find(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      if (typeof filters.exact === "undefined") {
        filters.exact = true;
      }
      return this.queries.find((query) => matchQuery(filters, query));
    }
    findAll(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      return Object.keys(filters).length > 0 ? this.queries.filter((query) => matchQuery(filters, query)) : this.queries;
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach(({
          listener
        }) => {
          listener(event);
        });
      });
    }
    onFocus() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          query.onFocus();
        });
      });
    }
    onOnline() {
      notifyManager.batch(() => {
        this.queries.forEach((query) => {
          query.onOnline();
        });
      });
    }
  };

  // ../node_modules/@tanstack/query-core/build/lib/mutation.mjs
  var Mutation = class extends Removable {
    constructor(config) {
      super();
      this.defaultOptions = config.defaultOptions;
      this.mutationId = config.mutationId;
      this.mutationCache = config.mutationCache;
      this.logger = config.logger || defaultLogger;
      this.observers = [];
      this.state = config.state || getDefaultState2();
      this.setOptions(config.options);
      this.scheduleGc();
    }
    setOptions(options) {
      this.options = {
        ...this.defaultOptions,
        ...options
      };
      this.updateCacheTime(this.options.cacheTime);
    }
    get meta() {
      return this.options.meta;
    }
    setState(state) {
      this.dispatch({
        type: "setState",
        state
      });
    }
    addObserver(observer) {
      if (!this.observers.includes(observer)) {
        this.observers.push(observer);
        this.clearGcTimeout();
        this.mutationCache.notify({
          type: "observerAdded",
          mutation: this,
          observer
        });
      }
    }
    removeObserver(observer) {
      this.observers = this.observers.filter((x) => x !== observer);
      this.scheduleGc();
      this.mutationCache.notify({
        type: "observerRemoved",
        mutation: this,
        observer
      });
    }
    optionalRemove() {
      if (!this.observers.length) {
        if (this.state.status === "loading") {
          this.scheduleGc();
        } else {
          this.mutationCache.remove(this);
        }
      }
    }
    continue() {
      var _this$retryer$continu, _this$retryer;
      return (_this$retryer$continu = (_this$retryer = this.retryer) == null ? void 0 : _this$retryer.continue()) != null ? _this$retryer$continu : this.execute();
    }
    async execute() {
      const executeMutation = () => {
        var _this$options$retry;
        this.retryer = createRetryer({
          fn: () => {
            if (!this.options.mutationFn) {
              return Promise.reject("No mutationFn found");
            }
            return this.options.mutationFn(this.state.variables);
          },
          onFail: (failureCount, error) => {
            this.dispatch({
              type: "failed",
              failureCount,
              error
            });
          },
          onPause: () => {
            this.dispatch({
              type: "pause"
            });
          },
          onContinue: () => {
            this.dispatch({
              type: "continue"
            });
          },
          retry: (_this$options$retry = this.options.retry) != null ? _this$options$retry : 0,
          retryDelay: this.options.retryDelay,
          networkMode: this.options.networkMode
        });
        return this.retryer.promise;
      };
      const restored = this.state.status === "loading";
      try {
        var _this$mutationCache$c3, _this$mutationCache$c4, _this$options$onSucce, _this$options2, _this$mutationCache$c5, _this$mutationCache$c6, _this$options$onSettl, _this$options3;
        if (!restored) {
          var _this$mutationCache$c, _this$mutationCache$c2, _this$options$onMutat, _this$options;
          this.dispatch({
            type: "loading",
            variables: this.options.variables
          });
          await ((_this$mutationCache$c = (_this$mutationCache$c2 = this.mutationCache.config).onMutate) == null ? void 0 : _this$mutationCache$c.call(_this$mutationCache$c2, this.state.variables, this));
          const context = await ((_this$options$onMutat = (_this$options = this.options).onMutate) == null ? void 0 : _this$options$onMutat.call(_this$options, this.state.variables));
          if (context !== this.state.context) {
            this.dispatch({
              type: "loading",
              context,
              variables: this.state.variables
            });
          }
        }
        const data = await executeMutation();
        await ((_this$mutationCache$c3 = (_this$mutationCache$c4 = this.mutationCache.config).onSuccess) == null ? void 0 : _this$mutationCache$c3.call(_this$mutationCache$c4, data, this.state.variables, this.state.context, this));
        await ((_this$options$onSucce = (_this$options2 = this.options).onSuccess) == null ? void 0 : _this$options$onSucce.call(_this$options2, data, this.state.variables, this.state.context));
        await ((_this$mutationCache$c5 = (_this$mutationCache$c6 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c5.call(_this$mutationCache$c6, data, null, this.state.variables, this.state.context, this));
        await ((_this$options$onSettl = (_this$options3 = this.options).onSettled) == null ? void 0 : _this$options$onSettl.call(_this$options3, data, null, this.state.variables, this.state.context));
        this.dispatch({
          type: "success",
          data
        });
        return data;
      } catch (error) {
        try {
          var _this$mutationCache$c7, _this$mutationCache$c8, _this$options$onError, _this$options4, _this$mutationCache$c9, _this$mutationCache$c10, _this$options$onSettl2, _this$options5;
          await ((_this$mutationCache$c7 = (_this$mutationCache$c8 = this.mutationCache.config).onError) == null ? void 0 : _this$mutationCache$c7.call(_this$mutationCache$c8, error, this.state.variables, this.state.context, this));
          if (true) {
            this.logger.error(error);
          }
          await ((_this$options$onError = (_this$options4 = this.options).onError) == null ? void 0 : _this$options$onError.call(_this$options4, error, this.state.variables, this.state.context));
          await ((_this$mutationCache$c9 = (_this$mutationCache$c10 = this.mutationCache.config).onSettled) == null ? void 0 : _this$mutationCache$c9.call(_this$mutationCache$c10, void 0, error, this.state.variables, this.state.context, this));
          await ((_this$options$onSettl2 = (_this$options5 = this.options).onSettled) == null ? void 0 : _this$options$onSettl2.call(_this$options5, void 0, error, this.state.variables, this.state.context));
          throw error;
        } finally {
          this.dispatch({
            type: "error",
            error
          });
        }
      }
    }
    dispatch(action) {
      const reducer = (state) => {
        switch (action.type) {
          case "failed":
            return {
              ...state,
              failureCount: action.failureCount,
              failureReason: action.error
            };
          case "pause":
            return {
              ...state,
              isPaused: true
            };
          case "continue":
            return {
              ...state,
              isPaused: false
            };
          case "loading":
            return {
              ...state,
              context: action.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: !canFetch(this.options.networkMode),
              status: "loading",
              variables: action.variables
            };
          case "success":
            return {
              ...state,
              data: action.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: false
            };
          case "error":
            return {
              ...state,
              data: void 0,
              error: action.error,
              failureCount: state.failureCount + 1,
              failureReason: action.error,
              isPaused: false,
              status: "error"
            };
          case "setState":
            return {
              ...state,
              ...action.state
            };
        }
      };
      this.state = reducer(this.state);
      notifyManager.batch(() => {
        this.observers.forEach((observer) => {
          observer.onMutationUpdate(action);
        });
        this.mutationCache.notify({
          mutation: this,
          type: "updated",
          action
        });
      });
    }
  };
  function getDefaultState2() {
    return {
      context: void 0,
      data: void 0,
      error: null,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: "idle",
      variables: void 0
    };
  }

  // ../node_modules/@tanstack/query-core/build/lib/mutationCache.mjs
  var MutationCache = class extends Subscribable {
    constructor(config) {
      super();
      this.config = config || {};
      this.mutations = [];
      this.mutationId = 0;
    }
    build(client, options, state) {
      const mutation = new Mutation({
        mutationCache: this,
        logger: client.getLogger(),
        mutationId: ++this.mutationId,
        options: client.defaultMutationOptions(options),
        state,
        defaultOptions: options.mutationKey ? client.getMutationDefaults(options.mutationKey) : void 0
      });
      this.add(mutation);
      return mutation;
    }
    add(mutation) {
      this.mutations.push(mutation);
      this.notify({
        type: "added",
        mutation
      });
    }
    remove(mutation) {
      this.mutations = this.mutations.filter((x) => x !== mutation);
      this.notify({
        type: "removed",
        mutation
      });
    }
    clear() {
      notifyManager.batch(() => {
        this.mutations.forEach((mutation) => {
          this.remove(mutation);
        });
      });
    }
    getAll() {
      return this.mutations;
    }
    find(filters) {
      if (typeof filters.exact === "undefined") {
        filters.exact = true;
      }
      return this.mutations.find((mutation) => matchMutation(filters, mutation));
    }
    findAll(filters) {
      return this.mutations.filter((mutation) => matchMutation(filters, mutation));
    }
    notify(event) {
      notifyManager.batch(() => {
        this.listeners.forEach(({
          listener
        }) => {
          listener(event);
        });
      });
    }
    resumePausedMutations() {
      var _this$resuming;
      this.resuming = ((_this$resuming = this.resuming) != null ? _this$resuming : Promise.resolve()).then(() => {
        const pausedMutations = this.mutations.filter((x) => x.state.isPaused);
        return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop)), Promise.resolve()));
      }).then(() => {
        this.resuming = void 0;
      });
      return this.resuming;
    }
  };

  // ../node_modules/@tanstack/query-core/build/lib/infiniteQueryBehavior.mjs
  function infiniteQueryBehavior() {
    return {
      onFetch: (context) => {
        context.fetchFn = () => {
          var _context$fetchOptions, _context$fetchOptions2, _context$fetchOptions3, _context$fetchOptions4, _context$state$data, _context$state$data2;
          const refetchPage = (_context$fetchOptions = context.fetchOptions) == null ? void 0 : (_context$fetchOptions2 = _context$fetchOptions.meta) == null ? void 0 : _context$fetchOptions2.refetchPage;
          const fetchMore = (_context$fetchOptions3 = context.fetchOptions) == null ? void 0 : (_context$fetchOptions4 = _context$fetchOptions3.meta) == null ? void 0 : _context$fetchOptions4.fetchMore;
          const pageParam = fetchMore == null ? void 0 : fetchMore.pageParam;
          const isFetchingNextPage = (fetchMore == null ? void 0 : fetchMore.direction) === "forward";
          const isFetchingPreviousPage = (fetchMore == null ? void 0 : fetchMore.direction) === "backward";
          const oldPages = ((_context$state$data = context.state.data) == null ? void 0 : _context$state$data.pages) || [];
          const oldPageParams = ((_context$state$data2 = context.state.data) == null ? void 0 : _context$state$data2.pageParams) || [];
          let newPageParams = oldPageParams;
          let cancelled = false;
          const addSignalProperty = (object) => {
            Object.defineProperty(object, "signal", {
              enumerable: true,
              get: () => {
                var _context$signal;
                if ((_context$signal = context.signal) != null && _context$signal.aborted) {
                  cancelled = true;
                } else {
                  var _context$signal2;
                  (_context$signal2 = context.signal) == null ? void 0 : _context$signal2.addEventListener("abort", () => {
                    cancelled = true;
                  });
                }
                return context.signal;
              }
            });
          };
          const queryFn = context.options.queryFn || (() => Promise.reject("Missing queryFn for queryKey '" + context.options.queryHash + "'"));
          const buildNewPages = (pages, param, page, previous) => {
            newPageParams = previous ? [param, ...newPageParams] : [...newPageParams, param];
            return previous ? [page, ...pages] : [...pages, page];
          };
          const fetchPage = (pages, manual, param, previous) => {
            if (cancelled) {
              return Promise.reject("Cancelled");
            }
            if (typeof param === "undefined" && !manual && pages.length) {
              return Promise.resolve(pages);
            }
            const queryFnContext = {
              queryKey: context.queryKey,
              pageParam: param,
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext);
            const queryFnResult = queryFn(queryFnContext);
            const promise2 = Promise.resolve(queryFnResult).then((page) => buildNewPages(pages, param, page, previous));
            return promise2;
          };
          let promise;
          if (!oldPages.length) {
            promise = fetchPage([]);
          } else if (isFetchingNextPage) {
            const manual = typeof pageParam !== "undefined";
            const param = manual ? pageParam : getNextPageParam(context.options, oldPages);
            promise = fetchPage(oldPages, manual, param);
          } else if (isFetchingPreviousPage) {
            const manual = typeof pageParam !== "undefined";
            const param = manual ? pageParam : getPreviousPageParam(context.options, oldPages);
            promise = fetchPage(oldPages, manual, param, true);
          } else {
            newPageParams = [];
            const manual = typeof context.options.getNextPageParam === "undefined";
            const shouldFetchFirstPage = refetchPage && oldPages[0] ? refetchPage(oldPages[0], 0, oldPages) : true;
            promise = shouldFetchFirstPage ? fetchPage([], manual, oldPageParams[0]) : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0]));
            for (let i = 1; i < oldPages.length; i++) {
              promise = promise.then((pages) => {
                const shouldFetchNextPage = refetchPage && oldPages[i] ? refetchPage(oldPages[i], i, oldPages) : true;
                if (shouldFetchNextPage) {
                  const param = manual ? oldPageParams[i] : getNextPageParam(context.options, pages);
                  return fetchPage(pages, manual, param);
                }
                return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
              });
            }
          }
          const finalPromise = promise.then((pages) => ({
            pages,
            pageParams: newPageParams
          }));
          return finalPromise;
        };
      }
    };
  }
  function getNextPageParam(options, pages) {
    return options.getNextPageParam == null ? void 0 : options.getNextPageParam(pages[pages.length - 1], pages);
  }
  function getPreviousPageParam(options, pages) {
    return options.getPreviousPageParam == null ? void 0 : options.getPreviousPageParam(pages[0], pages);
  }

  // ../node_modules/@tanstack/query-core/build/lib/queryClient.mjs
  var QueryClient = class {
    constructor(config = {}) {
      this.queryCache = config.queryCache || new QueryCache();
      this.mutationCache = config.mutationCache || new MutationCache();
      this.logger = config.logger || defaultLogger;
      this.defaultOptions = config.defaultOptions || {};
      this.queryDefaults = [];
      this.mutationDefaults = [];
      this.mountCount = 0;
      if (config.logger) {
        this.logger.error("Passing a custom logger has been deprecated and will be removed in the next major version.");
      }
    }
    mount() {
      this.mountCount++;
      if (this.mountCount !== 1)
        return;
      this.unsubscribeFocus = focusManager.subscribe(() => {
        if (focusManager.isFocused()) {
          this.resumePausedMutations();
          this.queryCache.onFocus();
        }
      });
      this.unsubscribeOnline = onlineManager.subscribe(() => {
        if (onlineManager.isOnline()) {
          this.resumePausedMutations();
          this.queryCache.onOnline();
        }
      });
    }
    unmount() {
      var _this$unsubscribeFocu, _this$unsubscribeOnli;
      this.mountCount--;
      if (this.mountCount !== 0)
        return;
      (_this$unsubscribeFocu = this.unsubscribeFocus) == null ? void 0 : _this$unsubscribeFocu.call(this);
      this.unsubscribeFocus = void 0;
      (_this$unsubscribeOnli = this.unsubscribeOnline) == null ? void 0 : _this$unsubscribeOnli.call(this);
      this.unsubscribeOnline = void 0;
    }
    isFetching(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      filters.fetchStatus = "fetching";
      return this.queryCache.findAll(filters).length;
    }
    isMutating(filters) {
      return this.mutationCache.findAll({
        ...filters,
        fetching: true
      }).length;
    }
    getQueryData(queryKey, filters) {
      var _this$queryCache$find;
      return (_this$queryCache$find = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find.state.data;
    }
    ensureQueryData(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      const cachedData = this.getQueryData(parsedOptions.queryKey);
      return cachedData ? Promise.resolve(cachedData) : this.fetchQuery(parsedOptions);
    }
    getQueriesData(queryKeyOrFilters) {
      return this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey,
        state
      }) => {
        const data = state.data;
        return [queryKey, data];
      });
    }
    setQueryData(queryKey, updater, options) {
      const query = this.queryCache.find(queryKey);
      const prevData = query == null ? void 0 : query.state.data;
      const data = functionalUpdate(updater, prevData);
      if (typeof data === "undefined") {
        return void 0;
      }
      const parsedOptions = parseQueryArgs(queryKey);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions);
      return this.queryCache.build(this, defaultedOptions).setData(data, {
        ...options,
        manual: true
      });
    }
    setQueriesData(queryKeyOrFilters, updater, options) {
      return notifyManager.batch(() => this.getQueryCache().findAll(queryKeyOrFilters).map(({
        queryKey
      }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
    }
    getQueryState(queryKey, filters) {
      var _this$queryCache$find2;
      return (_this$queryCache$find2 = this.queryCache.find(queryKey, filters)) == null ? void 0 : _this$queryCache$find2.state;
    }
    removeQueries(arg1, arg2) {
      const [filters] = parseFilterArgs(arg1, arg2);
      const queryCache = this.queryCache;
      notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          queryCache.remove(query);
        });
      });
    }
    resetQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const queryCache = this.queryCache;
      const refetchFilters = {
        type: "active",
        ...filters
      };
      return notifyManager.batch(() => {
        queryCache.findAll(filters).forEach((query) => {
          query.reset();
        });
        return this.refetchQueries(refetchFilters, options);
      });
    }
    cancelQueries(arg1, arg2, arg3) {
      const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);
      if (typeof cancelOptions.revert === "undefined") {
        cancelOptions.revert = true;
      }
      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map((query) => query.cancel(cancelOptions)));
      return Promise.all(promises).then(noop).catch(noop);
    }
    invalidateQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      return notifyManager.batch(() => {
        var _ref, _filters$refetchType;
        this.queryCache.findAll(filters).forEach((query) => {
          query.invalidate();
        });
        if (filters.refetchType === "none") {
          return Promise.resolve();
        }
        const refetchFilters = {
          ...filters,
          type: (_ref = (_filters$refetchType = filters.refetchType) != null ? _filters$refetchType : filters.type) != null ? _ref : "active"
        };
        return this.refetchQueries(refetchFilters, options);
      });
    }
    refetchQueries(arg1, arg2, arg3) {
      const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
      const promises = notifyManager.batch(() => this.queryCache.findAll(filters).filter((query) => !query.isDisabled()).map((query) => {
        var _options$cancelRefetc;
        return query.fetch(void 0, {
          ...options,
          cancelRefetch: (_options$cancelRefetc = options == null ? void 0 : options.cancelRefetch) != null ? _options$cancelRefetc : true,
          meta: {
            refetchPage: filters.refetchPage
          }
        });
      }));
      let promise = Promise.all(promises).then(noop);
      if (!(options != null && options.throwOnError)) {
        promise = promise.catch(noop);
      }
      return promise;
    }
    fetchQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      const defaultedOptions = this.defaultQueryOptions(parsedOptions);
      if (typeof defaultedOptions.retry === "undefined") {
        defaultedOptions.retry = false;
      }
      const query = this.queryCache.build(this, defaultedOptions);
      return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    prefetchQuery(arg1, arg2, arg3) {
      return this.fetchQuery(arg1, arg2, arg3).then(noop).catch(noop);
    }
    fetchInfiniteQuery(arg1, arg2, arg3) {
      const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
      parsedOptions.behavior = infiniteQueryBehavior();
      return this.fetchQuery(parsedOptions);
    }
    prefetchInfiniteQuery(arg1, arg2, arg3) {
      return this.fetchInfiniteQuery(arg1, arg2, arg3).then(noop).catch(noop);
    }
    resumePausedMutations() {
      return this.mutationCache.resumePausedMutations();
    }
    getQueryCache() {
      return this.queryCache;
    }
    getMutationCache() {
      return this.mutationCache;
    }
    getLogger() {
      return this.logger;
    }
    getDefaultOptions() {
      return this.defaultOptions;
    }
    setDefaultOptions(options) {
      this.defaultOptions = options;
    }
    setQueryDefaults(queryKey, options) {
      const result = this.queryDefaults.find((x) => hashQueryKey(queryKey) === hashQueryKey(x.queryKey));
      if (result) {
        result.defaultOptions = options;
      } else {
        this.queryDefaults.push({
          queryKey,
          defaultOptions: options
        });
      }
    }
    getQueryDefaults(queryKey) {
      if (!queryKey) {
        return void 0;
      }
      const firstMatchingDefaults = this.queryDefaults.find((x) => partialMatchKey(queryKey, x.queryKey));
      if (true) {
        const matchingDefaults = this.queryDefaults.filter((x) => partialMatchKey(queryKey, x.queryKey));
        if (matchingDefaults.length > 1) {
          this.logger.error("[QueryClient] Several query defaults match with key '" + JSON.stringify(queryKey) + "'. The first matching query defaults are used. Please check how query defaults are registered. Order does matter here. cf. https://react-query.tanstack.com/reference/QueryClient#queryclientsetquerydefaults.");
        }
      }
      return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
    }
    setMutationDefaults(mutationKey, options) {
      const result = this.mutationDefaults.find((x) => hashQueryKey(mutationKey) === hashQueryKey(x.mutationKey));
      if (result) {
        result.defaultOptions = options;
      } else {
        this.mutationDefaults.push({
          mutationKey,
          defaultOptions: options
        });
      }
    }
    getMutationDefaults(mutationKey) {
      if (!mutationKey) {
        return void 0;
      }
      const firstMatchingDefaults = this.mutationDefaults.find((x) => partialMatchKey(mutationKey, x.mutationKey));
      if (true) {
        const matchingDefaults = this.mutationDefaults.filter((x) => partialMatchKey(mutationKey, x.mutationKey));
        if (matchingDefaults.length > 1) {
          this.logger.error("[QueryClient] Several mutation defaults match with key '" + JSON.stringify(mutationKey) + "'. The first matching mutation defaults are used. Please check how mutation defaults are registered. Order does matter here. cf. https://react-query.tanstack.com/reference/QueryClient#queryclientsetmutationdefaults.");
        }
      }
      return firstMatchingDefaults == null ? void 0 : firstMatchingDefaults.defaultOptions;
    }
    defaultQueryOptions(options) {
      if (options != null && options._defaulted) {
        return options;
      }
      const defaultedOptions = {
        ...this.defaultOptions.queries,
        ...this.getQueryDefaults(options == null ? void 0 : options.queryKey),
        ...options,
        _defaulted: true
      };
      if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
        defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
      }
      if (typeof defaultedOptions.refetchOnReconnect === "undefined") {
        defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
      }
      if (typeof defaultedOptions.useErrorBoundary === "undefined") {
        defaultedOptions.useErrorBoundary = !!defaultedOptions.suspense;
      }
      return defaultedOptions;
    }
    defaultMutationOptions(options) {
      if (options != null && options._defaulted) {
        return options;
      }
      return {
        ...this.defaultOptions.mutations,
        ...this.getMutationDefaults(options == null ? void 0 : options.mutationKey),
        ...options,
        _defaulted: true
      };
    }
    clear() {
      this.queryCache.clear();
      this.mutationCache.clear();
    }
  };

  // src/service.ts
  var baseURL = "https://demo.lunabrain.com";
  var queryClient = new QueryClient();
  var transport = createConnectTransport({
    baseUrl: `${baseURL}/api` || "error"
    // credentials: "include",
  });
  var projectService = createPromiseClient(ProtoflowService, transport);
  var contentService = createPromiseClient(ContentService, transport);
  var userService = createPromiseClient(UserService, transport);

  // src/extension/util.ts
  function urlContent(url, tags) {
    return new Content({
      tags,
      type: {
        case: "data",
        value: new Data({
          type: {
            case: "url",
            value: {
              url
            }
          }
        })
      }
    });
  }

  // src/extension/shared.tsx
  var contentGet = "content/get";
  var contentSave = "content/save";

  // src/extension/background.tsx
  var tabContent = void 0;
  var chromeExt = () => {
    async function saveContent(tabContent2) {
      const u = new URL(tabContent2.from);
      try {
        const resp = await contentService.save({
          content: urlContent(tabContent2.to, ["browser/history", u.host]),
          related: []
        });
        console.log(resp);
      } catch (e) {
        console.error("failed to save", e);
      }
    }
    (async () => {
      const resp = await userService.login({}, {});
      console.log(resp);
    })();
    chrome.runtime.onInstalled.addListener(function() {
      console.log("Extension Installed");
    });
    chrome.runtime.onStartup.addListener(function() {
      console.log("Extension Started");
    });
    chrome.webNavigation.onCompleted.addListener((details) => {
      if (details.url && details.frameType === "outermost_frame") {
      }
    });
    function getTabDetails(tabId) {
      return new Promise((resolve, reject) => {
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError) {
            resolve(void 0);
          } else {
            resolve(tab);
          }
        });
      });
    }
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === contentGet) {
        sendResponse({ data: tabContent });
        tabContent = void 0;
      }
      if (message.action === contentSave) {
        void saveContent(message.data);
      }
    });
    chrome.tabs.onCreated.addListener(async (tab) => {
      if (!tab.id) {
        return;
      }
      const tabDetails = await getTabDetails(tab.id);
      if (tabDetails) {
      }
    });
    chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
      const tabDetails = await getTabDetails(tabId);
      if (tabDetails) {
      }
    });
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        if (!details.initiator || details.type !== "main_frame") {
          return;
        }
        const u = new URL(details.initiator);
        const v = new URL(details.url);
        if (u.host === v.host) {
          return;
        }
        if (u.host === "news.ycombinator.com") {
          tabContent = {
            from: details.initiator,
            to: details.url
          };
        }
      },
      { urls: ["<all_urls>"] },
      []
    );
    chrome.webRequest.onBeforeSendHeaders.addListener(
      (details) => {
        let refererValue = "";
        if (!details.requestHeaders) {
          return;
        }
        for (let header of details.requestHeaders) {
          if (header.name.toLowerCase() === "referer" && header.value) {
            refererValue = header.value;
            break;
          }
        }
      },
      { urls: ["<all_urls>"] },
      // Monitor all URLs
      ["requestHeaders"]
      // Necessary to get the request headers
    );
  };
  chromeExt();
})();
//# sourceMappingURL=background.js.map
