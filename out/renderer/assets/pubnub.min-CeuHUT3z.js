import { c as commonjsGlobal, g as getDefaultExportFromCjs } from "./_commonjsHelpers-DWwsNxpa.js";
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
var pubnub_min$3 = { exports: {} };
var pubnub_min$2 = pubnub_min$3.exports;
var hasRequiredPubnub_min;
function requirePubnub_min() {
  if (hasRequiredPubnub_min) return pubnub_min$3.exports;
  hasRequiredPubnub_min = 1;
  (function(module, exports) {
    !(function(e, t) {
      module.exports = t();
    })(pubnub_min$2, (function() {
      var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {};
      function t(e2) {
        return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
      }
      var s = { exports: {} };
      !(function(t2) {
        !(function(e2, s2) {
          var n2 = Math.pow(2, -24), r2 = Math.pow(2, 32), i2 = Math.pow(2, 53);
          var a2 = { encode: function(e3) {
            var t3, n3 = new ArrayBuffer(256), a3 = new DataView(n3), o2 = 0;
            function c2(e4) {
              for (var s3 = n3.byteLength, r3 = o2 + e4; s3 < r3; ) s3 *= 2;
              if (s3 !== n3.byteLength) {
                var i3 = a3;
                n3 = new ArrayBuffer(s3), a3 = new DataView(n3);
                for (var c3 = o2 + 3 >> 2, u3 = 0; u3 < c3; ++u3) a3.setUint32(4 * u3, i3.getUint32(4 * u3));
              }
              return t3 = e4, a3;
            }
            function u2() {
              o2 += t3;
            }
            function l2(e4) {
              u2(c2(1).setUint8(o2, e4));
            }
            function h2(e4) {
              for (var t4 = c2(e4.length), s3 = 0; s3 < e4.length; ++s3) t4.setUint8(o2 + s3, e4[s3]);
              u2();
            }
            function d2(e4, t4) {
              t4 < 24 ? l2(e4 << 5 | t4) : t4 < 256 ? (l2(e4 << 5 | 24), l2(t4)) : t4 < 65536 ? (l2(e4 << 5 | 25), (function(e5) {
                u2(c2(2).setUint16(o2, e5));
              })(t4)) : t4 < 4294967296 ? (l2(e4 << 5 | 26), (function(e5) {
                u2(c2(4).setUint32(o2, e5));
              })(t4)) : (l2(e4 << 5 | 27), (function(e5) {
                var t5 = e5 % r2, s3 = (e5 - t5) / r2, n4 = c2(8);
                n4.setUint32(o2, s3), n4.setUint32(o2 + 4, t5), u2();
              })(t4));
            }
            if ((function e4(t4) {
              var n4;
              if (false === t4) return l2(244);
              if (true === t4) return l2(245);
              if (null === t4) return l2(246);
              if (t4 === s2) return l2(247);
              switch (typeof t4) {
                case "number":
                  if (Math.floor(t4) === t4) {
                    if (0 <= t4 && t4 <= i2) return d2(0, t4);
                    if (-i2 <= t4 && t4 < 0) return d2(1, -(t4 + 1));
                  }
                  return l2(251), (function(e5) {
                    u2(c2(8).setFloat64(o2, e5));
                  })(t4);
                case "string":
                  var r3 = [];
                  for (n4 = 0; n4 < t4.length; ++n4) {
                    var a4 = t4.charCodeAt(n4);
                    a4 < 128 ? r3.push(a4) : a4 < 2048 ? (r3.push(192 | a4 >> 6), r3.push(128 | 63 & a4)) : a4 < 55296 ? (r3.push(224 | a4 >> 12), r3.push(128 | a4 >> 6 & 63), r3.push(128 | 63 & a4)) : (a4 = (1023 & a4) << 10, a4 |= 1023 & t4.charCodeAt(++n4), a4 += 65536, r3.push(240 | a4 >> 18), r3.push(128 | a4 >> 12 & 63), r3.push(128 | a4 >> 6 & 63), r3.push(128 | 63 & a4));
                  }
                  return d2(3, r3.length), h2(r3);
                default:
                  var p3;
                  if (Array.isArray(t4)) for (d2(4, p3 = t4.length), n4 = 0; n4 < p3; ++n4) e4(t4[n4]);
                  else if (t4 instanceof Uint8Array) d2(2, t4.length), h2(t4);
                  else {
                    var g3 = Object.keys(t4);
                    for (d2(5, p3 = g3.length), n4 = 0; n4 < p3; ++n4) {
                      var b3 = g3[n4];
                      e4(b3), e4(t4[b3]);
                    }
                  }
              }
            })(e3), "slice" in n3) return n3.slice(0, o2);
            for (var p2 = new ArrayBuffer(o2), g2 = new DataView(p2), b2 = 0; b2 < o2; ++b2) g2.setUint8(b2, a3.getUint8(b2));
            return p2;
          }, decode: function(e3, t3, i3) {
            var a3 = new DataView(e3), o2 = 0;
            function c2(e4, t4) {
              return o2 += t4, e4;
            }
            function u2(t4) {
              return c2(new Uint8Array(e3, o2, t4), t4);
            }
            function l2() {
              return c2(a3.getUint8(o2), 1);
            }
            function h2() {
              return c2(a3.getUint16(o2), 2);
            }
            function d2() {
              return c2(a3.getUint32(o2), 4);
            }
            function p2() {
              return 255 === a3.getUint8(o2) && (o2 += 1, true);
            }
            function g2(e4) {
              if (e4 < 24) return e4;
              if (24 === e4) return l2();
              if (25 === e4) return h2();
              if (26 === e4) return d2();
              if (27 === e4) return d2() * r2 + d2();
              if (31 === e4) return -1;
              throw "Invalid length encoding";
            }
            function b2(e4) {
              var t4 = l2();
              if (255 === t4) return -1;
              var s3 = g2(31 & t4);
              if (s3 < 0 || t4 >> 5 !== e4) throw "Invalid indefinite length element";
              return s3;
            }
            function y2(e4, t4) {
              for (var s3 = 0; s3 < t4; ++s3) {
                var n3 = l2();
                128 & n3 && (n3 < 224 ? (n3 = (31 & n3) << 6 | 63 & l2(), t4 -= 1) : n3 < 240 ? (n3 = (15 & n3) << 12 | (63 & l2()) << 6 | 63 & l2(), t4 -= 2) : (n3 = (15 & n3) << 18 | (63 & l2()) << 12 | (63 & l2()) << 6 | 63 & l2(), t4 -= 3)), n3 < 65536 ? e4.push(n3) : (n3 -= 65536, e4.push(55296 | n3 >> 10), e4.push(56320 | 1023 & n3));
              }
            }
            "function" != typeof t3 && (t3 = function(e4) {
              return e4;
            }), "function" != typeof i3 && (i3 = function() {
              return s2;
            });
            var m2 = (function e4() {
              var r3, d3, m3 = l2(), f2 = m3 >> 5, v2 = 31 & m3;
              if (7 === f2) switch (v2) {
                case 25:
                  return (function() {
                    var e5 = new ArrayBuffer(4), t4 = new DataView(e5), s3 = h2(), r4 = 32768 & s3, i4 = 31744 & s3, a4 = 1023 & s3;
                    if (31744 === i4) i4 = 261120;
                    else if (0 !== i4) i4 += 114688;
                    else if (0 !== a4) return a4 * n2;
                    return t4.setUint32(0, r4 << 16 | i4 << 13 | a4 << 13), t4.getFloat32(0);
                  })();
                case 26:
                  return c2(a3.getFloat32(o2), 4);
                case 27:
                  return c2(a3.getFloat64(o2), 8);
              }
              if ((d3 = g2(v2)) < 0 && (f2 < 2 || 6 < f2)) throw "Invalid length";
              switch (f2) {
                case 0:
                  return d3;
                case 1:
                  return -1 - d3;
                case 2:
                  if (d3 < 0) {
                    for (var S2 = [], w2 = 0; (d3 = b2(f2)) >= 0; ) w2 += d3, S2.push(u2(d3));
                    var O2 = new Uint8Array(w2), k2 = 0;
                    for (r3 = 0; r3 < S2.length; ++r3) O2.set(S2[r3], k2), k2 += S2[r3].length;
                    return O2;
                  }
                  return u2(d3);
                case 3:
                  var C2 = [];
                  if (d3 < 0) for (; (d3 = b2(f2)) >= 0; ) y2(C2, d3);
                  else y2(C2, d3);
                  return String.fromCharCode.apply(null, C2);
                case 4:
                  var P2;
                  if (d3 < 0) for (P2 = []; !p2(); ) P2.push(e4());
                  else for (P2 = new Array(d3), r3 = 0; r3 < d3; ++r3) P2[r3] = e4();
                  return P2;
                case 5:
                  var j2 = {};
                  for (r3 = 0; r3 < d3 || d3 < 0 && !p2(); ++r3) {
                    j2[e4()] = e4();
                  }
                  return j2;
                case 6:
                  return t3(e4(), d3);
                case 7:
                  switch (d3) {
                    case 20:
                      return false;
                    case 21:
                      return true;
                    case 22:
                      return null;
                    case 23:
                      return s2;
                    default:
                      return i3(d3);
                  }
              }
            })();
            if (o2 !== e3.byteLength) throw "Remaining bytes";
            return m2;
          } };
          t2.exports ? t2.exports = a2 : e2.CBOR || (e2.CBOR = a2);
        })(e);
      })(s);
      var n = t(s.exports);
      function r(e2, t2) {
        var s2 = {};
        for (var n2 in e2) Object.prototype.hasOwnProperty.call(e2, n2) && t2.indexOf(n2) < 0 && (s2[n2] = e2[n2]);
        if (null != e2 && "function" == typeof Object.getOwnPropertySymbols) {
          var r2 = 0;
          for (n2 = Object.getOwnPropertySymbols(e2); r2 < n2.length; r2++) t2.indexOf(n2[r2]) < 0 && Object.prototype.propertyIsEnumerable.call(e2, n2[r2]) && (s2[n2[r2]] = e2[n2[r2]]);
        }
        return s2;
      }
      function i(e2, t2, s2, n2) {
        return new (s2 || (s2 = Promise))((function(r2, i2) {
          function a2(e3) {
            try {
              c2(n2.next(e3));
            } catch (e4) {
              i2(e4);
            }
          }
          function o2(e3) {
            try {
              c2(n2.throw(e3));
            } catch (e4) {
              i2(e4);
            }
          }
          function c2(e3) {
            var t3;
            e3.done ? r2(e3.value) : (t3 = e3.value, t3 instanceof s2 ? t3 : new s2((function(e4) {
              e4(t3);
            }))).then(a2, o2);
          }
          c2((n2 = n2.apply(e2, t2 || [])).next());
        }));
      }
      "function" == typeof SuppressedError && SuppressedError;
      class a {
        static legacyCryptoModule(e2) {
          throw new Error("Should be implemented by concrete crypto module implementation.");
        }
        static aesCbcCryptoModule(e2) {
          throw new Error("Should be implemented by concrete crypto module implementation.");
        }
        constructor(e2) {
          var t2;
          this.defaultCryptor = e2.default, this.cryptors = null !== (t2 = e2.cryptors) && void 0 !== t2 ? t2 : [];
        }
        set logger(e2) {
          throw new Error("Method not implemented.");
        }
        getAllCryptors() {
          return [this.defaultCryptor, ...this.cryptors];
        }
        toString() {
          return `AbstractCryptoModule { default: ${this.defaultCryptor.toString()}, cryptors: [${this.cryptors.map(((e2) => e2.toString())).join(", ")}]}`;
        }
      }
      a.encoder = new TextEncoder(), a.decoder = new TextDecoder();
      class o {
        static create(e2) {
          return new o(e2);
        }
        constructor(e2) {
          let t2, s2, n2, r2;
          if (e2 instanceof File) r2 = e2, n2 = e2.name, s2 = e2.type, t2 = e2.size;
          else if ("data" in e2) {
            const i2 = e2.data;
            s2 = e2.mimeType, n2 = e2.name, r2 = new File([i2], n2, { type: s2 }), t2 = r2.size;
          }
          if (void 0 === r2) throw new Error("Couldn't construct a file out of supplied options.");
          if (void 0 === n2) throw new Error("Couldn't guess filename out of the options. Please provide one.");
          t2 && (this.contentLength = t2), this.mimeType = s2, this.data = r2, this.name = n2;
        }
        toBuffer() {
          return i(this, void 0, void 0, (function* () {
            throw new Error("This feature is only supported in Node.js environments.");
          }));
        }
        toArrayBuffer() {
          return i(this, void 0, void 0, (function* () {
            return new Promise(((e2, t2) => {
              const s2 = new FileReader();
              s2.addEventListener("load", (() => {
                if (s2.result instanceof ArrayBuffer) return e2(s2.result);
              })), s2.addEventListener("error", (() => t2(s2.error))), s2.readAsArrayBuffer(this.data);
            }));
          }));
        }
        toString() {
          return i(this, void 0, void 0, (function* () {
            return new Promise(((e2, t2) => {
              const s2 = new FileReader();
              s2.addEventListener("load", (() => {
                if ("string" == typeof s2.result) return e2(s2.result);
              })), s2.addEventListener("error", (() => {
                t2(s2.error);
              })), s2.readAsBinaryString(this.data);
            }));
          }));
        }
        toStream() {
          return i(this, void 0, void 0, (function* () {
            throw new Error("This feature is only supported in Node.js environments.");
          }));
        }
        toFile() {
          return i(this, void 0, void 0, (function* () {
            return this.data;
          }));
        }
        toFileUri() {
          return i(this, void 0, void 0, (function* () {
            throw new Error("This feature is only supported in React Native environments.");
          }));
        }
        toBlob() {
          return i(this, void 0, void 0, (function* () {
            return this.data;
          }));
        }
      }
      o.supportsBlob = "undefined" != typeof Blob, o.supportsFile = "undefined" != typeof File, o.supportsBuffer = false, o.supportsStream = false, o.supportsString = true, o.supportsArrayBuffer = true, o.supportsEncryptFile = true, o.supportsFileUri = false;
      function c(e2) {
        const t2 = e2.replace(/==?$/, ""), s2 = Math.floor(t2.length / 4 * 3), n2 = new ArrayBuffer(s2), r2 = new Uint8Array(n2);
        let i2 = 0;
        function a2() {
          const e3 = t2.charAt(i2++), s3 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(e3);
          if (-1 === s3) throw new Error(`Illegal character at ${i2}: ${t2.charAt(i2 - 1)}`);
          return s3;
        }
        for (let e3 = 0; e3 < s2; e3 += 3) {
          const t3 = a2(), s3 = a2(), n3 = a2(), i3 = a2(), o2 = (63 & t3) << 2 | s3 >> 4, c2 = (15 & s3) << 4 | n3 >> 2, u2 = (3 & n3) << 6 | i3;
          r2[e3] = o2, 64 != n3 && (r2[e3 + 1] = c2), 64 != i3 && (r2[e3 + 2] = u2);
        }
        return n2;
      }
      function u(e2) {
        let t2 = "";
        const s2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n2 = new Uint8Array(e2), r2 = n2.byteLength, i2 = r2 % 3, a2 = r2 - i2;
        let o2, c2, u2, l2, h2;
        for (let e3 = 0; e3 < a2; e3 += 3) h2 = n2[e3] << 16 | n2[e3 + 1] << 8 | n2[e3 + 2], o2 = (16515072 & h2) >> 18, c2 = (258048 & h2) >> 12, u2 = (4032 & h2) >> 6, l2 = 63 & h2, t2 += s2[o2] + s2[c2] + s2[u2] + s2[l2];
        return 1 == i2 ? (h2 = n2[a2], o2 = (252 & h2) >> 2, c2 = (3 & h2) << 4, t2 += s2[o2] + s2[c2] + "==") : 2 == i2 && (h2 = n2[a2] << 8 | n2[a2 + 1], o2 = (64512 & h2) >> 10, c2 = (1008 & h2) >> 4, u2 = (15 & h2) << 2, t2 += s2[o2] + s2[c2] + s2[u2] + "="), t2;
      }
      var l;
      !(function(e2) {
        e2.PNNetworkIssuesCategory = "PNNetworkIssuesCategory", e2.PNTimeoutCategory = "PNTimeoutCategory", e2.PNCancelledCategory = "PNCancelledCategory", e2.PNBadRequestCategory = "PNBadRequestCategory", e2.PNAccessDeniedCategory = "PNAccessDeniedCategory", e2.PNValidationErrorCategory = "PNValidationErrorCategory", e2.PNAcknowledgmentCategory = "PNAcknowledgmentCategory", e2.PNMalformedResponseCategory = "PNMalformedResponseCategory", e2.PNServerErrorCategory = "PNServerErrorCategory", e2.PNUnknownCategory = "PNUnknownCategory", e2.PNNetworkUpCategory = "PNNetworkUpCategory", e2.PNNetworkDownCategory = "PNNetworkDownCategory", e2.PNReconnectedCategory = "PNReconnectedCategory", e2.PNConnectedCategory = "PNConnectedCategory", e2.PNSubscriptionChangedCategory = "PNSubscriptionChangedCategory", e2.PNRequestMessageCountExceededCategory = "PNRequestMessageCountExceededCategory", e2.PNDisconnectedCategory = "PNDisconnectedCategory", e2.PNConnectionErrorCategory = "PNConnectionErrorCategory", e2.PNDisconnectedUnexpectedlyCategory = "PNDisconnectedUnexpectedlyCategory", e2.PNSharedWorkerUpdatedCategory = "PNSharedWorkerUpdatedCategory";
      })(l || (l = {}));
      var h = l;
      class d extends Error {
        constructor(e2, t2) {
          super(e2), this.status = t2, this.name = "PubNubError", this.message = e2, Object.setPrototypeOf(this, new.target.prototype);
        }
      }
      function p(e2, t2) {
        var s2;
        return null !== (s2 = e2.statusCode) && void 0 !== s2 || (e2.statusCode = 0), Object.assign(Object.assign({}, e2), { statusCode: e2.statusCode, category: t2, error: true });
      }
      function g(e2, t2) {
        return p(Object.assign(Object.assign({ message: "Unable to deserialize service response" }, void 0 !== e2 ? { responseText: e2 } : {}), void 0 !== t2 ? { statusCode: t2 } : {}), h.PNMalformedResponseCategory);
      }
      var b, y, m, f, v, S = S || (function(e2) {
        var t2 = {}, s2 = t2.lib = {}, n2 = function() {
        }, r2 = s2.Base = { extend: function(e3) {
          n2.prototype = this;
          var t3 = new n2();
          return e3 && t3.mixIn(e3), t3.hasOwnProperty("init") || (t3.init = function() {
            t3.$super.init.apply(this, arguments);
          }), t3.init.prototype = t3, t3.$super = this, t3;
        }, create: function() {
          var e3 = this.extend();
          return e3.init.apply(e3, arguments), e3;
        }, init: function() {
        }, mixIn: function(e3) {
          for (var t3 in e3) e3.hasOwnProperty(t3) && (this[t3] = e3[t3]);
          e3.hasOwnProperty("toString") && (this.toString = e3.toString);
        }, clone: function() {
          return this.init.prototype.extend(this);
        } }, i2 = s2.WordArray = r2.extend({ init: function(e3, t3) {
          e3 = this.words = e3 || [], this.sigBytes = null != t3 ? t3 : 4 * e3.length;
        }, toString: function(e3) {
          return (e3 || o2).stringify(this);
        }, concat: function(e3) {
          var t3 = this.words, s3 = e3.words, n3 = this.sigBytes;
          if (e3 = e3.sigBytes, this.clamp(), n3 % 4) for (var r3 = 0; r3 < e3; r3++) t3[n3 + r3 >>> 2] |= (s3[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255) << 24 - (n3 + r3) % 4 * 8;
          else if (65535 < s3.length) for (r3 = 0; r3 < e3; r3 += 4) t3[n3 + r3 >>> 2] = s3[r3 >>> 2];
          else t3.push.apply(t3, s3);
          return this.sigBytes += e3, this;
        }, clamp: function() {
          var t3 = this.words, s3 = this.sigBytes;
          t3[s3 >>> 2] &= 4294967295 << 32 - s3 % 4 * 8, t3.length = e2.ceil(s3 / 4);
        }, clone: function() {
          var e3 = r2.clone.call(this);
          return e3.words = this.words.slice(0), e3;
        }, random: function(t3) {
          for (var s3 = [], n3 = 0; n3 < t3; n3 += 4) s3.push(4294967296 * e2.random() | 0);
          return new i2.init(s3, t3);
        } }), a2 = t2.enc = {}, o2 = a2.Hex = { stringify: function(e3) {
          var t3 = e3.words;
          e3 = e3.sigBytes;
          for (var s3 = [], n3 = 0; n3 < e3; n3++) {
            var r3 = t3[n3 >>> 2] >>> 24 - n3 % 4 * 8 & 255;
            s3.push((r3 >>> 4).toString(16)), s3.push((15 & r3).toString(16));
          }
          return s3.join("");
        }, parse: function(e3) {
          for (var t3 = e3.length, s3 = [], n3 = 0; n3 < t3; n3 += 2) s3[n3 >>> 3] |= parseInt(e3.substr(n3, 2), 16) << 24 - n3 % 8 * 4;
          return new i2.init(s3, t3 / 2);
        } }, c2 = a2.Latin1 = { stringify: function(e3) {
          var t3 = e3.words;
          e3 = e3.sigBytes;
          for (var s3 = [], n3 = 0; n3 < e3; n3++) s3.push(String.fromCharCode(t3[n3 >>> 2] >>> 24 - n3 % 4 * 8 & 255));
          return s3.join("");
        }, parse: function(e3) {
          for (var t3 = e3.length, s3 = [], n3 = 0; n3 < t3; n3++) s3[n3 >>> 2] |= (255 & e3.charCodeAt(n3)) << 24 - n3 % 4 * 8;
          return new i2.init(s3, t3);
        } }, u2 = a2.Utf8 = { stringify: function(e3) {
          try {
            return decodeURIComponent(escape(c2.stringify(e3)));
          } catch (e4) {
            throw Error("Malformed UTF-8 data");
          }
        }, parse: function(e3) {
          return c2.parse(unescape(encodeURIComponent(e3)));
        } }, l2 = s2.BufferedBlockAlgorithm = r2.extend({ reset: function() {
          this._data = new i2.init(), this._nDataBytes = 0;
        }, _append: function(e3) {
          "string" == typeof e3 && (e3 = u2.parse(e3)), this._data.concat(e3), this._nDataBytes += e3.sigBytes;
        }, _process: function(t3) {
          var s3 = this._data, n3 = s3.words, r3 = s3.sigBytes, a3 = this.blockSize, o3 = r3 / (4 * a3);
          if (t3 = (o3 = t3 ? e2.ceil(o3) : e2.max((0 | o3) - this._minBufferSize, 0)) * a3, r3 = e2.min(4 * t3, r3), t3) {
            for (var c3 = 0; c3 < t3; c3 += a3) this._doProcessBlock(n3, c3);
            c3 = n3.splice(0, t3), s3.sigBytes -= r3;
          }
          return new i2.init(c3, r3);
        }, clone: function() {
          var e3 = r2.clone.call(this);
          return e3._data = this._data.clone(), e3;
        }, _minBufferSize: 0 });
        s2.Hasher = l2.extend({ cfg: r2.extend(), init: function(e3) {
          this.cfg = this.cfg.extend(e3), this.reset();
        }, reset: function() {
          l2.reset.call(this), this._doReset();
        }, update: function(e3) {
          return this._append(e3), this._process(), this;
        }, finalize: function(e3) {
          return e3 && this._append(e3), this._doFinalize();
        }, blockSize: 16, _createHelper: function(e3) {
          return function(t3, s3) {
            return new e3.init(s3).finalize(t3);
          };
        }, _createHmacHelper: function(e3) {
          return function(t3, s3) {
            return new h2.HMAC.init(e3, s3).finalize(t3);
          };
        } });
        var h2 = t2.algo = {};
        return t2;
      })(Math);
      !(function(e2) {
        for (var t2 = S, s2 = (r2 = t2.lib).WordArray, n2 = r2.Hasher, r2 = t2.algo, i2 = [], a2 = [], o2 = function(e3) {
          return 4294967296 * (e3 - (0 | e3)) | 0;
        }, c2 = 2, u2 = 0; 64 > u2; ) {
          var l2;
          e: {
            l2 = c2;
            for (var h2 = e2.sqrt(l2), d2 = 2; d2 <= h2; d2++) if (!(l2 % d2)) {
              l2 = false;
              break e;
            }
            l2 = true;
          }
          l2 && (8 > u2 && (i2[u2] = o2(e2.pow(c2, 0.5))), a2[u2] = o2(e2.pow(c2, 1 / 3)), u2++), c2++;
        }
        var p2 = [];
        r2 = r2.SHA256 = n2.extend({ _doReset: function() {
          this._hash = new s2.init(i2.slice(0));
        }, _doProcessBlock: function(e3, t3) {
          for (var s3 = this._hash.words, n3 = s3[0], r3 = s3[1], i3 = s3[2], o3 = s3[3], c3 = s3[4], u3 = s3[5], l3 = s3[6], h3 = s3[7], d3 = 0; 64 > d3; d3++) {
            if (16 > d3) p2[d3] = 0 | e3[t3 + d3];
            else {
              var g2 = p2[d3 - 15], b2 = p2[d3 - 2];
              p2[d3] = ((g2 << 25 | g2 >>> 7) ^ (g2 << 14 | g2 >>> 18) ^ g2 >>> 3) + p2[d3 - 7] + ((b2 << 15 | b2 >>> 17) ^ (b2 << 13 | b2 >>> 19) ^ b2 >>> 10) + p2[d3 - 16];
            }
            g2 = h3 + ((c3 << 26 | c3 >>> 6) ^ (c3 << 21 | c3 >>> 11) ^ (c3 << 7 | c3 >>> 25)) + (c3 & u3 ^ ~c3 & l3) + a2[d3] + p2[d3], b2 = ((n3 << 30 | n3 >>> 2) ^ (n3 << 19 | n3 >>> 13) ^ (n3 << 10 | n3 >>> 22)) + (n3 & r3 ^ n3 & i3 ^ r3 & i3), h3 = l3, l3 = u3, u3 = c3, c3 = o3 + g2 | 0, o3 = i3, i3 = r3, r3 = n3, n3 = g2 + b2 | 0;
          }
          s3[0] = s3[0] + n3 | 0, s3[1] = s3[1] + r3 | 0, s3[2] = s3[2] + i3 | 0, s3[3] = s3[3] + o3 | 0, s3[4] = s3[4] + c3 | 0, s3[5] = s3[5] + u3 | 0, s3[6] = s3[6] + l3 | 0, s3[7] = s3[7] + h3 | 0;
        }, _doFinalize: function() {
          var t3 = this._data, s3 = t3.words, n3 = 8 * this._nDataBytes, r3 = 8 * t3.sigBytes;
          return s3[r3 >>> 5] |= 128 << 24 - r3 % 32, s3[14 + (r3 + 64 >>> 9 << 4)] = e2.floor(n3 / 4294967296), s3[15 + (r3 + 64 >>> 9 << 4)] = n3, t3.sigBytes = 4 * s3.length, this._process(), this._hash;
        }, clone: function() {
          var e3 = n2.clone.call(this);
          return e3._hash = this._hash.clone(), e3;
        } });
        t2.SHA256 = n2._createHelper(r2), t2.HmacSHA256 = n2._createHmacHelper(r2);
      })(Math), y = (b = S).enc.Utf8, b.algo.HMAC = b.lib.Base.extend({ init: function(e2, t2) {
        e2 = this._hasher = new e2.init(), "string" == typeof t2 && (t2 = y.parse(t2));
        var s2 = e2.blockSize, n2 = 4 * s2;
        t2.sigBytes > n2 && (t2 = e2.finalize(t2)), t2.clamp();
        for (var r2 = this._oKey = t2.clone(), i2 = this._iKey = t2.clone(), a2 = r2.words, o2 = i2.words, c2 = 0; c2 < s2; c2++) a2[c2] ^= 1549556828, o2[c2] ^= 909522486;
        r2.sigBytes = i2.sigBytes = n2, this.reset();
      }, reset: function() {
        var e2 = this._hasher;
        e2.reset(), e2.update(this._iKey);
      }, update: function(e2) {
        return this._hasher.update(e2), this;
      }, finalize: function(e2) {
        var t2 = this._hasher;
        return e2 = t2.finalize(e2), t2.reset(), t2.finalize(this._oKey.clone().concat(e2));
      } }), f = (m = S).lib.WordArray, m.enc.Base64 = { stringify: function(e2) {
        var t2 = e2.words, s2 = e2.sigBytes, n2 = this._map;
        e2.clamp(), e2 = [];
        for (var r2 = 0; r2 < s2; r2 += 3) for (var i2 = (t2[r2 >>> 2] >>> 24 - r2 % 4 * 8 & 255) << 16 | (t2[r2 + 1 >>> 2] >>> 24 - (r2 + 1) % 4 * 8 & 255) << 8 | t2[r2 + 2 >>> 2] >>> 24 - (r2 + 2) % 4 * 8 & 255, a2 = 0; 4 > a2 && r2 + 0.75 * a2 < s2; a2++) e2.push(n2.charAt(i2 >>> 6 * (3 - a2) & 63));
        if (t2 = n2.charAt(64)) for (; e2.length % 4; ) e2.push(t2);
        return e2.join("");
      }, parse: function(e2) {
        var t2 = e2.length, s2 = this._map;
        (n2 = s2.charAt(64)) && -1 != (n2 = e2.indexOf(n2)) && (t2 = n2);
        for (var n2 = [], r2 = 0, i2 = 0; i2 < t2; i2++) if (i2 % 4) {
          var a2 = s2.indexOf(e2.charAt(i2 - 1)) << i2 % 4 * 2, o2 = s2.indexOf(e2.charAt(i2)) >>> 6 - i2 % 4 * 2;
          n2[r2 >>> 2] |= (a2 | o2) << 24 - r2 % 4 * 8, r2++;
        }
        return f.create(n2, r2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" }, (function(e2) {
        function t2(e3, t3, s3, n3, r3, i3, a3) {
          return ((e3 = e3 + (t3 & s3 | ~t3 & n3) + r3 + a3) << i3 | e3 >>> 32 - i3) + t3;
        }
        function s2(e3, t3, s3, n3, r3, i3, a3) {
          return ((e3 = e3 + (t3 & n3 | s3 & ~n3) + r3 + a3) << i3 | e3 >>> 32 - i3) + t3;
        }
        function n2(e3, t3, s3, n3, r3, i3, a3) {
          return ((e3 = e3 + (t3 ^ s3 ^ n3) + r3 + a3) << i3 | e3 >>> 32 - i3) + t3;
        }
        function r2(e3, t3, s3, n3, r3, i3, a3) {
          return ((e3 = e3 + (s3 ^ (t3 | ~n3)) + r3 + a3) << i3 | e3 >>> 32 - i3) + t3;
        }
        for (var i2 = S, a2 = (c2 = i2.lib).WordArray, o2 = c2.Hasher, c2 = i2.algo, u2 = [], l2 = 0; 64 > l2; l2++) u2[l2] = 4294967296 * e2.abs(e2.sin(l2 + 1)) | 0;
        c2 = c2.MD5 = o2.extend({ _doReset: function() {
          this._hash = new a2.init([1732584193, 4023233417, 2562383102, 271733878]);
        }, _doProcessBlock: function(e3, i3) {
          for (var a3 = 0; 16 > a3; a3++) {
            var o3 = e3[c3 = i3 + a3];
            e3[c3] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8);
          }
          a3 = this._hash.words;
          var c3 = e3[i3 + 0], l3 = (o3 = e3[i3 + 1], e3[i3 + 2]), h2 = e3[i3 + 3], d2 = e3[i3 + 4], p2 = e3[i3 + 5], g2 = e3[i3 + 6], b2 = e3[i3 + 7], y2 = e3[i3 + 8], m2 = e3[i3 + 9], f2 = e3[i3 + 10], v2 = e3[i3 + 11], S2 = e3[i3 + 12], w2 = e3[i3 + 13], O2 = e3[i3 + 14], k2 = e3[i3 + 15], C2 = t2(C2 = a3[0], E2 = a3[1], j2 = a3[2], P2 = a3[3], c3, 7, u2[0]), P2 = t2(P2, C2, E2, j2, o3, 12, u2[1]), j2 = t2(j2, P2, C2, E2, l3, 17, u2[2]), E2 = t2(E2, j2, P2, C2, h2, 22, u2[3]);
          C2 = t2(C2, E2, j2, P2, d2, 7, u2[4]), P2 = t2(P2, C2, E2, j2, p2, 12, u2[5]), j2 = t2(j2, P2, C2, E2, g2, 17, u2[6]), E2 = t2(E2, j2, P2, C2, b2, 22, u2[7]), C2 = t2(C2, E2, j2, P2, y2, 7, u2[8]), P2 = t2(P2, C2, E2, j2, m2, 12, u2[9]), j2 = t2(j2, P2, C2, E2, f2, 17, u2[10]), E2 = t2(E2, j2, P2, C2, v2, 22, u2[11]), C2 = t2(C2, E2, j2, P2, S2, 7, u2[12]), P2 = t2(P2, C2, E2, j2, w2, 12, u2[13]), j2 = t2(j2, P2, C2, E2, O2, 17, u2[14]), C2 = s2(C2, E2 = t2(E2, j2, P2, C2, k2, 22, u2[15]), j2, P2, o3, 5, u2[16]), P2 = s2(P2, C2, E2, j2, g2, 9, u2[17]), j2 = s2(j2, P2, C2, E2, v2, 14, u2[18]), E2 = s2(E2, j2, P2, C2, c3, 20, u2[19]), C2 = s2(C2, E2, j2, P2, p2, 5, u2[20]), P2 = s2(P2, C2, E2, j2, f2, 9, u2[21]), j2 = s2(j2, P2, C2, E2, k2, 14, u2[22]), E2 = s2(E2, j2, P2, C2, d2, 20, u2[23]), C2 = s2(C2, E2, j2, P2, m2, 5, u2[24]), P2 = s2(P2, C2, E2, j2, O2, 9, u2[25]), j2 = s2(j2, P2, C2, E2, h2, 14, u2[26]), E2 = s2(E2, j2, P2, C2, y2, 20, u2[27]), C2 = s2(C2, E2, j2, P2, w2, 5, u2[28]), P2 = s2(P2, C2, E2, j2, l3, 9, u2[29]), j2 = s2(j2, P2, C2, E2, b2, 14, u2[30]), C2 = n2(C2, E2 = s2(E2, j2, P2, C2, S2, 20, u2[31]), j2, P2, p2, 4, u2[32]), P2 = n2(P2, C2, E2, j2, y2, 11, u2[33]), j2 = n2(j2, P2, C2, E2, v2, 16, u2[34]), E2 = n2(E2, j2, P2, C2, O2, 23, u2[35]), C2 = n2(C2, E2, j2, P2, o3, 4, u2[36]), P2 = n2(P2, C2, E2, j2, d2, 11, u2[37]), j2 = n2(j2, P2, C2, E2, b2, 16, u2[38]), E2 = n2(E2, j2, P2, C2, f2, 23, u2[39]), C2 = n2(C2, E2, j2, P2, w2, 4, u2[40]), P2 = n2(P2, C2, E2, j2, c3, 11, u2[41]), j2 = n2(j2, P2, C2, E2, h2, 16, u2[42]), E2 = n2(E2, j2, P2, C2, g2, 23, u2[43]), C2 = n2(C2, E2, j2, P2, m2, 4, u2[44]), P2 = n2(P2, C2, E2, j2, S2, 11, u2[45]), j2 = n2(j2, P2, C2, E2, k2, 16, u2[46]), C2 = r2(C2, E2 = n2(E2, j2, P2, C2, l3, 23, u2[47]), j2, P2, c3, 6, u2[48]), P2 = r2(P2, C2, E2, j2, b2, 10, u2[49]), j2 = r2(j2, P2, C2, E2, O2, 15, u2[50]), E2 = r2(E2, j2, P2, C2, p2, 21, u2[51]), C2 = r2(C2, E2, j2, P2, S2, 6, u2[52]), P2 = r2(P2, C2, E2, j2, h2, 10, u2[53]), j2 = r2(j2, P2, C2, E2, f2, 15, u2[54]), E2 = r2(E2, j2, P2, C2, o3, 21, u2[55]), C2 = r2(C2, E2, j2, P2, y2, 6, u2[56]), P2 = r2(P2, C2, E2, j2, k2, 10, u2[57]), j2 = r2(j2, P2, C2, E2, g2, 15, u2[58]), E2 = r2(E2, j2, P2, C2, w2, 21, u2[59]), C2 = r2(C2, E2, j2, P2, d2, 6, u2[60]), P2 = r2(P2, C2, E2, j2, v2, 10, u2[61]), j2 = r2(j2, P2, C2, E2, l3, 15, u2[62]), E2 = r2(E2, j2, P2, C2, m2, 21, u2[63]);
          a3[0] = a3[0] + C2 | 0, a3[1] = a3[1] + E2 | 0, a3[2] = a3[2] + j2 | 0, a3[3] = a3[3] + P2 | 0;
        }, _doFinalize: function() {
          var t3 = this._data, s3 = t3.words, n3 = 8 * this._nDataBytes, r3 = 8 * t3.sigBytes;
          s3[r3 >>> 5] |= 128 << 24 - r3 % 32;
          var i3 = e2.floor(n3 / 4294967296);
          for (s3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), s3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (n3 << 8 | n3 >>> 24) | 4278255360 & (n3 << 24 | n3 >>> 8), t3.sigBytes = 4 * (s3.length + 1), this._process(), s3 = (t3 = this._hash).words, n3 = 0; 4 > n3; n3++) r3 = s3[n3], s3[n3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
          return t3;
        }, clone: function() {
          var e3 = o2.clone.call(this);
          return e3._hash = this._hash.clone(), e3;
        } }), i2.MD5 = o2._createHelper(c2), i2.HmacMD5 = o2._createHmacHelper(c2);
      })(Math), (function() {
        var e2, t2 = S, s2 = (e2 = t2.lib).Base, n2 = e2.WordArray, r2 = (e2 = t2.algo).EvpKDF = s2.extend({ cfg: s2.extend({ keySize: 4, hasher: e2.MD5, iterations: 1 }), init: function(e3) {
          this.cfg = this.cfg.extend(e3);
        }, compute: function(e3, t3) {
          for (var s3 = (o2 = this.cfg).hasher.create(), r3 = n2.create(), i2 = r3.words, a2 = o2.keySize, o2 = o2.iterations; i2.length < a2; ) {
            c2 && s3.update(c2);
            var c2 = s3.update(e3).finalize(t3);
            s3.reset();
            for (var u2 = 1; u2 < o2; u2++) c2 = s3.finalize(c2), s3.reset();
            r3.concat(c2);
          }
          return r3.sigBytes = 4 * a2, r3;
        } });
        t2.EvpKDF = function(e3, t3, s3) {
          return r2.create(s3).compute(e3, t3);
        };
      })(), S.lib.Cipher || (function() {
        var e2 = (d2 = S).lib, t2 = e2.Base, s2 = e2.WordArray, n2 = e2.BufferedBlockAlgorithm, r2 = d2.enc.Base64, i2 = d2.algo.EvpKDF, a2 = e2.Cipher = n2.extend({ cfg: t2.extend(), createEncryptor: function(e3, t3) {
          return this.create(this._ENC_XFORM_MODE, e3, t3);
        }, createDecryptor: function(e3, t3) {
          return this.create(this._DEC_XFORM_MODE, e3, t3);
        }, init: function(e3, t3, s3) {
          this.cfg = this.cfg.extend(s3), this._xformMode = e3, this._key = t3, this.reset();
        }, reset: function() {
          n2.reset.call(this), this._doReset();
        }, process: function(e3) {
          return this._append(e3), this._process();
        }, finalize: function(e3) {
          return e3 && this._append(e3), this._doFinalize();
        }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function(e3) {
          return { encrypt: function(t3, s3, n3) {
            return ("string" == typeof s3 ? p2 : h2).encrypt(e3, t3, s3, n3);
          }, decrypt: function(t3, s3, n3) {
            return ("string" == typeof s3 ? p2 : h2).decrypt(e3, t3, s3, n3);
          } };
        } });
        e2.StreamCipher = a2.extend({ _doFinalize: function() {
          return this._process(true);
        }, blockSize: 1 });
        var o2 = d2.mode = {}, c2 = function(e3, t3, s3) {
          var n3 = this._iv;
          n3 ? this._iv = void 0 : n3 = this._prevBlock;
          for (var r3 = 0; r3 < s3; r3++) e3[t3 + r3] ^= n3[r3];
        }, u2 = (e2.BlockCipherMode = t2.extend({ createEncryptor: function(e3, t3) {
          return this.Encryptor.create(e3, t3);
        }, createDecryptor: function(e3, t3) {
          return this.Decryptor.create(e3, t3);
        }, init: function(e3, t3) {
          this._cipher = e3, this._iv = t3;
        } })).extend();
        u2.Encryptor = u2.extend({ processBlock: function(e3, t3) {
          var s3 = this._cipher, n3 = s3.blockSize;
          c2.call(this, e3, t3, n3), s3.encryptBlock(e3, t3), this._prevBlock = e3.slice(t3, t3 + n3);
        } }), u2.Decryptor = u2.extend({ processBlock: function(e3, t3) {
          var s3 = this._cipher, n3 = s3.blockSize, r3 = e3.slice(t3, t3 + n3);
          s3.decryptBlock(e3, t3), c2.call(this, e3, t3, n3), this._prevBlock = r3;
        } }), o2 = o2.CBC = u2, u2 = (d2.pad = {}).Pkcs7 = { pad: function(e3, t3) {
          for (var n3, r3 = (n3 = (n3 = 4 * t3) - e3.sigBytes % n3) << 24 | n3 << 16 | n3 << 8 | n3, i3 = [], a3 = 0; a3 < n3; a3 += 4) i3.push(r3);
          n3 = s2.create(i3, n3), e3.concat(n3);
        }, unpad: function(e3) {
          e3.sigBytes -= 255 & e3.words[e3.sigBytes - 1 >>> 2];
        } }, e2.BlockCipher = a2.extend({ cfg: a2.cfg.extend({ mode: o2, padding: u2 }), reset: function() {
          a2.reset.call(this);
          var e3 = (t3 = this.cfg).iv, t3 = t3.mode;
          if (this._xformMode == this._ENC_XFORM_MODE) var s3 = t3.createEncryptor;
          else s3 = t3.createDecryptor, this._minBufferSize = 1;
          this._mode = s3.call(t3, this, e3 && e3.words);
        }, _doProcessBlock: function(e3, t3) {
          this._mode.processBlock(e3, t3);
        }, _doFinalize: function() {
          var e3 = this.cfg.padding;
          if (this._xformMode == this._ENC_XFORM_MODE) {
            e3.pad(this._data, this.blockSize);
            var t3 = this._process(true);
          } else t3 = this._process(true), e3.unpad(t3);
          return t3;
        }, blockSize: 4 });
        var l2 = e2.CipherParams = t2.extend({ init: function(e3) {
          this.mixIn(e3);
        }, toString: function(e3) {
          return (e3 || this.formatter).stringify(this);
        } }), h2 = (o2 = (d2.format = {}).OpenSSL = { stringify: function(e3) {
          var t3 = e3.ciphertext;
          return ((e3 = e3.salt) ? s2.create([1398893684, 1701076831]).concat(e3).concat(t3) : t3).toString(r2);
        }, parse: function(e3) {
          var t3 = (e3 = r2.parse(e3)).words;
          if (1398893684 == t3[0] && 1701076831 == t3[1]) {
            var n3 = s2.create(t3.slice(2, 4));
            t3.splice(0, 4), e3.sigBytes -= 16;
          }
          return l2.create({ ciphertext: e3, salt: n3 });
        } }, e2.SerializableCipher = t2.extend({ cfg: t2.extend({ format: o2 }), encrypt: function(e3, t3, s3, n3) {
          n3 = this.cfg.extend(n3);
          var r3 = e3.createEncryptor(s3, n3);
          return t3 = r3.finalize(t3), r3 = r3.cfg, l2.create({ ciphertext: t3, key: s3, iv: r3.iv, algorithm: e3, mode: r3.mode, padding: r3.padding, blockSize: e3.blockSize, formatter: n3.format });
        }, decrypt: function(e3, t3, s3, n3) {
          return n3 = this.cfg.extend(n3), t3 = this._parse(t3, n3.format), e3.createDecryptor(s3, n3).finalize(t3.ciphertext);
        }, _parse: function(e3, t3) {
          return "string" == typeof e3 ? t3.parse(e3, this) : e3;
        } })), d2 = (d2.kdf = {}).OpenSSL = { execute: function(e3, t3, n3, r3) {
          return r3 || (r3 = s2.random(8)), e3 = i2.create({ keySize: t3 + n3 }).compute(e3, r3), n3 = s2.create(e3.words.slice(t3), 4 * n3), e3.sigBytes = 4 * t3, l2.create({ key: e3, iv: n3, salt: r3 });
        } }, p2 = e2.PasswordBasedCipher = h2.extend({ cfg: h2.cfg.extend({ kdf: d2 }), encrypt: function(e3, t3, s3, n3) {
          return s3 = (n3 = this.cfg.extend(n3)).kdf.execute(s3, e3.keySize, e3.ivSize), n3.iv = s3.iv, (e3 = h2.encrypt.call(this, e3, t3, s3.key, n3)).mixIn(s3), e3;
        }, decrypt: function(e3, t3, s3, n3) {
          return n3 = this.cfg.extend(n3), t3 = this._parse(t3, n3.format), s3 = n3.kdf.execute(s3, e3.keySize, e3.ivSize, t3.salt), n3.iv = s3.iv, h2.decrypt.call(this, e3, t3, s3.key, n3);
        } });
      })(), (function() {
        for (var e2 = S, t2 = e2.lib.BlockCipher, s2 = e2.algo, n2 = [], r2 = [], i2 = [], a2 = [], o2 = [], c2 = [], u2 = [], l2 = [], h2 = [], d2 = [], p2 = [], g2 = 0; 256 > g2; g2++) p2[g2] = 128 > g2 ? g2 << 1 : g2 << 1 ^ 283;
        var b2 = 0, y2 = 0;
        for (g2 = 0; 256 > g2; g2++) {
          var m2 = (m2 = y2 ^ y2 << 1 ^ y2 << 2 ^ y2 << 3 ^ y2 << 4) >>> 8 ^ 255 & m2 ^ 99;
          n2[b2] = m2, r2[m2] = b2;
          var f2 = p2[b2], v2 = p2[f2], w2 = p2[v2], O2 = 257 * p2[m2] ^ 16843008 * m2;
          i2[b2] = O2 << 24 | O2 >>> 8, a2[b2] = O2 << 16 | O2 >>> 16, o2[b2] = O2 << 8 | O2 >>> 24, c2[b2] = O2, O2 = 16843009 * w2 ^ 65537 * v2 ^ 257 * f2 ^ 16843008 * b2, u2[m2] = O2 << 24 | O2 >>> 8, l2[m2] = O2 << 16 | O2 >>> 16, h2[m2] = O2 << 8 | O2 >>> 24, d2[m2] = O2, b2 ? (b2 = f2 ^ p2[p2[p2[w2 ^ f2]]], y2 ^= p2[p2[y2]]) : b2 = y2 = 1;
        }
        var k2 = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
        s2 = s2.AES = t2.extend({ _doReset: function() {
          for (var e3 = (s3 = this._key).words, t3 = s3.sigBytes / 4, s3 = 4 * ((this._nRounds = t3 + 6) + 1), r3 = this._keySchedule = [], i3 = 0; i3 < s3; i3++) if (i3 < t3) r3[i3] = e3[i3];
          else {
            var a3 = r3[i3 - 1];
            i3 % t3 ? 6 < t3 && 4 == i3 % t3 && (a3 = n2[a3 >>> 24] << 24 | n2[a3 >>> 16 & 255] << 16 | n2[a3 >>> 8 & 255] << 8 | n2[255 & a3]) : (a3 = n2[(a3 = a3 << 8 | a3 >>> 24) >>> 24] << 24 | n2[a3 >>> 16 & 255] << 16 | n2[a3 >>> 8 & 255] << 8 | n2[255 & a3], a3 ^= k2[i3 / t3 | 0] << 24), r3[i3] = r3[i3 - t3] ^ a3;
          }
          for (e3 = this._invKeySchedule = [], t3 = 0; t3 < s3; t3++) i3 = s3 - t3, a3 = t3 % 4 ? r3[i3] : r3[i3 - 4], e3[t3] = 4 > t3 || 4 >= i3 ? a3 : u2[n2[a3 >>> 24]] ^ l2[n2[a3 >>> 16 & 255]] ^ h2[n2[a3 >>> 8 & 255]] ^ d2[n2[255 & a3]];
        }, encryptBlock: function(e3, t3) {
          this._doCryptBlock(e3, t3, this._keySchedule, i2, a2, o2, c2, n2);
        }, decryptBlock: function(e3, t3) {
          var s3 = e3[t3 + 1];
          e3[t3 + 1] = e3[t3 + 3], e3[t3 + 3] = s3, this._doCryptBlock(e3, t3, this._invKeySchedule, u2, l2, h2, d2, r2), s3 = e3[t3 + 1], e3[t3 + 1] = e3[t3 + 3], e3[t3 + 3] = s3;
        }, _doCryptBlock: function(e3, t3, s3, n3, r3, i3, a3, o3) {
          for (var c3 = this._nRounds, u3 = e3[t3] ^ s3[0], l3 = e3[t3 + 1] ^ s3[1], h3 = e3[t3 + 2] ^ s3[2], d3 = e3[t3 + 3] ^ s3[3], p3 = 4, g3 = 1; g3 < c3; g3++) {
            var b3 = n3[u3 >>> 24] ^ r3[l3 >>> 16 & 255] ^ i3[h3 >>> 8 & 255] ^ a3[255 & d3] ^ s3[p3++], y3 = n3[l3 >>> 24] ^ r3[h3 >>> 16 & 255] ^ i3[d3 >>> 8 & 255] ^ a3[255 & u3] ^ s3[p3++], m3 = n3[h3 >>> 24] ^ r3[d3 >>> 16 & 255] ^ i3[u3 >>> 8 & 255] ^ a3[255 & l3] ^ s3[p3++];
            d3 = n3[d3 >>> 24] ^ r3[u3 >>> 16 & 255] ^ i3[l3 >>> 8 & 255] ^ a3[255 & h3] ^ s3[p3++], u3 = b3, l3 = y3, h3 = m3;
          }
          b3 = (o3[u3 >>> 24] << 24 | o3[l3 >>> 16 & 255] << 16 | o3[h3 >>> 8 & 255] << 8 | o3[255 & d3]) ^ s3[p3++], y3 = (o3[l3 >>> 24] << 24 | o3[h3 >>> 16 & 255] << 16 | o3[d3 >>> 8 & 255] << 8 | o3[255 & u3]) ^ s3[p3++], m3 = (o3[h3 >>> 24] << 24 | o3[d3 >>> 16 & 255] << 16 | o3[u3 >>> 8 & 255] << 8 | o3[255 & l3]) ^ s3[p3++], d3 = (o3[d3 >>> 24] << 24 | o3[u3 >>> 16 & 255] << 16 | o3[l3 >>> 8 & 255] << 8 | o3[255 & h3]) ^ s3[p3++], e3[t3] = b3, e3[t3 + 1] = y3, e3[t3 + 2] = m3, e3[t3 + 3] = d3;
        }, keySize: 8 });
        e2.AES = t2._createHelper(s2);
      })(), S.mode.ECB = ((v = S.lib.BlockCipherMode.extend()).Encryptor = v.extend({ processBlock: function(e2, t2) {
        this._cipher.encryptBlock(e2, t2);
      } }), v.Decryptor = v.extend({ processBlock: function(e2, t2) {
        this._cipher.decryptBlock(e2, t2);
      } }), v);
      var w = t(S);
      class O {
        constructor({ cipherKey: e2 }) {
          this.cipherKey = e2, this.CryptoJS = w, this.encryptedKey = this.CryptoJS.SHA256(e2);
        }
        encrypt(e2) {
          if (0 === ("string" == typeof e2 ? e2 : O.decoder.decode(e2)).length) throw new Error("encryption error. empty content");
          const t2 = this.getIv();
          return { metadata: t2, data: c(this.CryptoJS.AES.encrypt(e2, this.encryptedKey, { iv: this.bufferToWordArray(t2), mode: this.CryptoJS.mode.CBC }).ciphertext.toString(this.CryptoJS.enc.Base64)) };
        }
        encryptFileData(e2) {
          return i(this, void 0, void 0, (function* () {
            const t2 = yield this.getKey(), s2 = this.getIv();
            return { data: yield crypto.subtle.encrypt({ name: this.algo, iv: s2 }, t2, e2), metadata: s2 };
          }));
        }
        decrypt(e2) {
          if ("string" == typeof e2.data) throw new Error("Decryption error: data for decryption should be ArrayBuffed.");
          const t2 = this.bufferToWordArray(new Uint8ClampedArray(e2.metadata)), s2 = this.bufferToWordArray(new Uint8ClampedArray(e2.data));
          return O.encoder.encode(this.CryptoJS.AES.decrypt({ ciphertext: s2 }, this.encryptedKey, { iv: t2, mode: this.CryptoJS.mode.CBC }).toString(this.CryptoJS.enc.Utf8)).buffer;
        }
        decryptFileData(e2) {
          return i(this, void 0, void 0, (function* () {
            if ("string" == typeof e2.data) throw new Error("Decryption error: data for decryption should be ArrayBuffed.");
            const t2 = yield this.getKey();
            return crypto.subtle.decrypt({ name: this.algo, iv: e2.metadata }, t2, e2.data);
          }));
        }
        get identifier() {
          return "ACRH";
        }
        get algo() {
          return "AES-CBC";
        }
        getIv() {
          return crypto.getRandomValues(new Uint8Array(O.BLOCK_SIZE));
        }
        getKey() {
          return i(this, void 0, void 0, (function* () {
            const e2 = O.encoder.encode(this.cipherKey), t2 = yield crypto.subtle.digest("SHA-256", e2.buffer);
            return crypto.subtle.importKey("raw", t2, this.algo, true, ["encrypt", "decrypt"]);
          }));
        }
        bufferToWordArray(e2) {
          const t2 = [];
          let s2;
          for (s2 = 0; s2 < e2.length; s2 += 1) t2[s2 / 4 | 0] |= e2[s2] << 24 - 8 * s2;
          return this.CryptoJS.lib.WordArray.create(t2, e2.length);
        }
        toString() {
          return "AesCbcCryptor {}";
        }
      }
      O.BLOCK_SIZE = 16, O.encoder = new TextEncoder(), O.decoder = new TextDecoder();
      const k = /* @__PURE__ */ new Set(["authKey", "authKeys", "secretKey", "cipherKey", "token", "auth"]), C = (e2) => k.has(e2), P = (e2) => encodeURIComponent(e2).replace(/[!~*'()]/g, ((e3) => `%${e3.charCodeAt(0).toString(16).toUpperCase()}`)), j = (e2, t2) => {
        const s2 = e2.map(((e3) => P(e3)));
        return s2.length ? s2.join(",") : null != t2 ? t2 : "";
      }, E = (e2, t2) => {
        const s2 = Object.fromEntries(t2.map(((e3) => [e3, false])));
        return e2.filter(((e3) => !(t2.includes(e3) && !s2[e3]) || (s2[e3] = true, false)));
      }, N = (e2, t2) => [...e2].filter(((s2) => t2.includes(s2) && e2.indexOf(s2) === e2.lastIndexOf(s2) && t2.indexOf(s2) === t2.lastIndexOf(s2))), T = (e2) => Object.keys(e2).map(((t2) => {
        const s2 = e2[t2];
        return Array.isArray(s2) ? s2.map(((e3) => `${t2}=${P(e3)}`)).join("&") : `${t2}=${P(s2)}`;
      })).join("&"), _ = (e2, t2) => {
        if ("0" === t2 || "0" === e2) return;
        const s2 = M(`${Date.now()}0000`, t2, false);
        return M(e2, s2, true);
      }, I = (e2, t2, s2) => {
        if (e2 && 0 !== e2.length) {
          if (t2 && t2.length > 0 && "0" !== t2) {
            const n2 = M(e2, t2, false);
            return M(null != s2 ? s2 : `${Date.now()}0000`, n2.replace("-", ""), Number(n2) < 0);
          }
          return s2 && s2.length > 0 && "0" !== s2 ? s2 : `${Date.now()}0000`;
        }
      }, M = (e2, t2, s2) => {
        t2.startsWith("-") && (t2 = t2.replace("-", ""), s2 = false), t2 = t2.padStart(17, "0");
        const n2 = e2.slice(0, 10), r2 = e2.slice(10, 17), i2 = t2.slice(0, 10), a2 = t2.slice(10, 17);
        let o2 = Number(n2), c2 = Number(r2);
        return o2 += Number(i2) * (s2 ? 1 : -1), c2 += Number(a2) * (s2 ? 1 : -1), c2 >= 1e7 ? (o2 += Math.floor(c2 / 1e7), c2 %= 1e7) : c2 < 0 ? o2 > 0 ? (o2 -= 1, c2 += 1e7) : o2 < 0 && (c2 *= -1) : o2 < 0 && c2 > 0 && (o2 += 1, c2 = 1e7 - c2), 0 !== o2 ? `${o2}${`${c2}`.padStart(7, "0")}` : `${c2}`;
      }, A = (e2) => {
        const t2 = "string" != typeof e2 ? JSON.stringify(e2) : e2, s2 = new Uint32Array(1);
        let n2 = 0, r2 = t2.length;
        for (; r2-- > 0; ) s2[0] = (s2[0] << 5) - s2[0] + t2.charCodeAt(n2++);
        return s2[0].toString(16).padStart(8, "0");
      };
      function U(e2) {
        const t2 = [];
        let s2;
        for (s2 = 0; s2 < e2.length; s2 += 1) t2[s2 / 4 | 0] |= e2[s2] << 24 - 8 * s2;
        return w.lib.WordArray.create(t2, e2.length);
      }
      class D {
        constructor(e2) {
          this.configuration = e2, this.iv = "0123456789012345", this.allowedKeyEncodings = ["hex", "utf8", "base64", "binary"], this.allowedKeyLengths = [128, 256], this.allowedModes = ["ecb", "cbc"], this.logger = e2.logger, this.defaultOptions = { encryptKey: true, keyEncoding: "utf8", keyLength: 256, mode: "cbc" };
        }
        set logger(e2) {
          this._logger = e2, this.logger && this.logger.debug("Crypto", (() => ({ messageType: "object", message: this.configuration, details: "Create with configuration:", ignoredKeys: (e3, t2) => "function" == typeof t2[e3] || "logger" === e3 || C(e3) })));
        }
        get logger() {
          return this._logger;
        }
        HMACSHA256(e2) {
          return w.HmacSHA256(e2, this.configuration.secretKey).toString(w.enc.Base64);
        }
        SHA256(e2) {
          return w.SHA256(e2).toString(w.enc.Hex);
        }
        encrypt(e2, t2, s2) {
          return this.configuration.customEncrypt ? (this.logger && this.logger.warn("Crypto", "'customEncrypt' is deprecated. Consult docs for better alternative."), this.configuration.customEncrypt(e2)) : this.pnEncrypt(e2, t2, s2);
        }
        decrypt(e2, t2, s2) {
          return this.configuration.customDecrypt ? (this.logger && this.logger.warn("Crypto", "'customDecrypt' is deprecated. Consult docs for better alternative."), this.configuration.customDecrypt(e2)) : this.pnDecrypt(e2, t2, s2);
        }
        pnEncrypt(e2, t2, s2) {
          const n2 = null != t2 ? t2 : this.configuration.cipherKey;
          if (!n2) return e2;
          this.logger && this.logger.debug("Crypto", (() => ({ messageType: "object", message: Object.assign({ data: e2 }, null != s2 ? s2 : {}), details: "Encrypt with parameters:", ignoredKeys: C }))), s2 = this.parseOptions(s2);
          const r2 = this.getMode(s2), i2 = this.getPaddedKey(n2, s2);
          if (this.configuration.useRandomIVs) {
            const t3 = this.getRandomIV(), s3 = w.AES.encrypt(e2, i2, { iv: t3, mode: r2 }).ciphertext;
            return t3.clone().concat(s3.clone()).toString(w.enc.Base64);
          }
          const a2 = this.getIV(s2);
          return w.AES.encrypt(e2, i2, { iv: a2, mode: r2 }).ciphertext.toString(w.enc.Base64) || e2;
        }
        pnDecrypt(e2, t2, s2) {
          const n2 = null != t2 ? t2 : this.configuration.cipherKey;
          if (!n2) return e2;
          this.logger && this.logger.debug("Crypto", (() => ({ messageType: "object", message: Object.assign({ data: e2 }, null != s2 ? s2 : {}), details: "Decrypt with parameters:", ignoredKeys: C }))), s2 = this.parseOptions(s2);
          const r2 = this.getMode(s2), i2 = this.getPaddedKey(n2, s2);
          if (this.configuration.useRandomIVs) {
            const t3 = new Uint8ClampedArray(c(e2)), s3 = U(t3.slice(0, 16)), n3 = U(t3.slice(16));
            try {
              const e3 = w.AES.decrypt({ ciphertext: n3 }, i2, { iv: s3, mode: r2 }).toString(w.enc.Utf8);
              return JSON.parse(e3);
            } catch (e3) {
              return this.logger && this.logger.error("Crypto", (() => ({ messageType: "error", message: e3 }))), null;
            }
          } else {
            const t3 = this.getIV(s2);
            try {
              const s3 = w.enc.Base64.parse(e2), n3 = w.AES.decrypt({ ciphertext: s3 }, i2, { iv: t3, mode: r2 }).toString(w.enc.Utf8);
              return JSON.parse(n3);
            } catch (e3) {
              return this.logger && this.logger.error("Crypto", (() => ({ messageType: "error", message: e3 }))), null;
            }
          }
        }
        parseOptions(e2) {
          var t2, s2, n2, r2;
          if (!e2) return this.defaultOptions;
          const i2 = { encryptKey: null !== (t2 = e2.encryptKey) && void 0 !== t2 ? t2 : this.defaultOptions.encryptKey, keyEncoding: null !== (s2 = e2.keyEncoding) && void 0 !== s2 ? s2 : this.defaultOptions.keyEncoding, keyLength: null !== (n2 = e2.keyLength) && void 0 !== n2 ? n2 : this.defaultOptions.keyLength, mode: null !== (r2 = e2.mode) && void 0 !== r2 ? r2 : this.defaultOptions.mode };
          return -1 === this.allowedKeyEncodings.indexOf(i2.keyEncoding.toLowerCase()) && (i2.keyEncoding = this.defaultOptions.keyEncoding), -1 === this.allowedKeyLengths.indexOf(i2.keyLength) && (i2.keyLength = this.defaultOptions.keyLength), -1 === this.allowedModes.indexOf(i2.mode.toLowerCase()) && (i2.mode = this.defaultOptions.mode), i2;
        }
        decodeKey(e2, t2) {
          return "base64" === t2.keyEncoding ? w.enc.Base64.parse(e2) : "hex" === t2.keyEncoding ? w.enc.Hex.parse(e2) : e2;
        }
        getPaddedKey(e2, t2) {
          return e2 = this.decodeKey(e2, t2), t2.encryptKey ? w.enc.Utf8.parse(this.SHA256(e2).slice(0, 32)) : e2;
        }
        getMode(e2) {
          return "ecb" === e2.mode ? w.mode.ECB : w.mode.CBC;
        }
        getIV(e2) {
          return "cbc" === e2.mode ? w.enc.Utf8.parse(this.iv) : null;
        }
        getRandomIV() {
          return w.lib.WordArray.random(16);
        }
      }
      class R {
        encrypt(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            if (!(t2 instanceof ArrayBuffer) && "string" != typeof t2) throw new Error("Cannot encrypt this file. In browsers file encryption supports only string or ArrayBuffer");
            const s2 = yield this.getKey(e2);
            return t2 instanceof ArrayBuffer ? this.encryptArrayBuffer(s2, t2) : this.encryptString(s2, t2);
          }));
        }
        encryptArrayBuffer(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = crypto.getRandomValues(new Uint8Array(16));
            return this.concatArrayBuffer(s2.buffer, yield crypto.subtle.encrypt({ name: "AES-CBC", iv: s2 }, e2, t2));
          }));
        }
        encryptString(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = crypto.getRandomValues(new Uint8Array(16)), n2 = R.encoder.encode(t2).buffer, r2 = yield crypto.subtle.encrypt({ name: "AES-CBC", iv: s2 }, e2, n2), i2 = this.concatArrayBuffer(s2.buffer, r2);
            return R.decoder.decode(i2);
          }));
        }
        encryptFile(e2, t2, s2) {
          return i(this, void 0, void 0, (function* () {
            var n2, r2;
            if ((null !== (n2 = t2.contentLength) && void 0 !== n2 ? n2 : 0) <= 0) throw new Error("encryption error. empty content");
            const i2 = yield this.getKey(e2), a2 = yield t2.toArrayBuffer(), o2 = yield this.encryptArrayBuffer(i2, a2);
            return s2.create({ name: t2.name, mimeType: null !== (r2 = t2.mimeType) && void 0 !== r2 ? r2 : "application/octet-stream", data: o2 });
          }));
        }
        decrypt(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            if (!(t2 instanceof ArrayBuffer) && "string" != typeof t2) throw new Error("Cannot decrypt this file. In browsers file decryption supports only string or ArrayBuffer");
            const s2 = yield this.getKey(e2);
            return t2 instanceof ArrayBuffer ? this.decryptArrayBuffer(s2, t2) : this.decryptString(s2, t2);
          }));
        }
        decryptArrayBuffer(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = t2.slice(0, 16);
            if (t2.slice(R.IV_LENGTH).byteLength <= 0) throw new Error("decryption error: empty content");
            return yield crypto.subtle.decrypt({ name: "AES-CBC", iv: s2 }, e2, t2.slice(R.IV_LENGTH));
          }));
        }
        decryptString(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = R.encoder.encode(t2).buffer, n2 = s2.slice(0, 16), r2 = s2.slice(16), i2 = yield crypto.subtle.decrypt({ name: "AES-CBC", iv: n2 }, e2, r2);
            return R.decoder.decode(i2);
          }));
        }
        decryptFile(e2, t2, s2) {
          return i(this, void 0, void 0, (function* () {
            const n2 = yield this.getKey(e2), r2 = yield t2.toArrayBuffer(), i2 = yield this.decryptArrayBuffer(n2, r2);
            return s2.create({ name: t2.name, mimeType: t2.mimeType, data: i2 });
          }));
        }
        getKey(e2) {
          return i(this, void 0, void 0, (function* () {
            const t2 = yield crypto.subtle.digest("SHA-256", R.encoder.encode(e2)), s2 = Array.from(new Uint8Array(t2)).map(((e3) => e3.toString(16).padStart(2, "0"))).join(""), n2 = R.encoder.encode(s2.slice(0, 32)).buffer;
            return crypto.subtle.importKey("raw", n2, "AES-CBC", true, ["encrypt", "decrypt"]);
          }));
        }
        concatArrayBuffer(e2, t2) {
          const s2 = new Uint8Array(e2.byteLength + t2.byteLength);
          return s2.set(new Uint8Array(e2), 0), s2.set(new Uint8Array(t2), e2.byteLength), s2.buffer;
        }
      }
      R.IV_LENGTH = 16, R.encoder = new TextEncoder(), R.decoder = new TextDecoder();
      class $ {
        constructor(e2) {
          this.config = e2, this.cryptor = new D(Object.assign({}, e2)), this.fileCryptor = new R();
        }
        set logger(e2) {
          this.cryptor.logger = e2, false === this.config.useRandomIVs && e2.warn("LegacyCryptor", "Setting 'useRandomIVs' to false is insecure and should only be used to support legacy clients.\n         Do not disable random IVs in new applications.");
        }
        encrypt(e2) {
          const t2 = "string" == typeof e2 ? e2 : $.decoder.decode(e2);
          return { data: this.cryptor.encrypt(t2), metadata: null };
        }
        encryptFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            if (!this.config.cipherKey) throw new d("File encryption error: cipher key not set.");
            return this.fileCryptor.encryptFile(null === (s2 = this.config) || void 0 === s2 ? void 0 : s2.cipherKey, e2, t2);
          }));
        }
        decrypt(e2) {
          const t2 = "string" == typeof e2.data ? e2.data : u(e2.data);
          return this.cryptor.decrypt(t2);
        }
        decryptFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            if (!this.config.cipherKey) throw new d("File encryption error: cipher key not set.");
            return this.fileCryptor.decryptFile(this.config.cipherKey, e2, t2);
          }));
        }
        get identifier() {
          return "";
        }
        toString() {
          return `LegacyCryptor { ${Object.entries(this.config).reduce(((e2, [t2, s2]) => ("logger" === t2 || C(t2) || e2.push(`${t2}: ${"function" == typeof s2 ? "<function>" : s2}`), e2)), []).join(", ")} }`;
        }
      }
      $.encoder = new TextEncoder(), $.decoder = new TextDecoder();
      class F extends a {
        set logger(e2) {
          if (this.defaultCryptor.identifier === F.LEGACY_IDENTIFIER) e2.warn("CryptoModule", "'legacyCryptoModule' is deprecated. Use 'aesCbcCryptoModule' instead for new applications."), this.defaultCryptor.logger = e2;
          else {
            const t2 = this.cryptors.find(((e3) => e3.identifier === F.LEGACY_IDENTIFIER));
            t2 && (t2.logger = e2);
          }
        }
        static legacyCryptoModule(e2) {
          var t2;
          if (!e2.cipherKey) throw new d("Crypto module error: cipher key not set.");
          return e2.logger && (e2.logger.warn("CryptoModule", "'legacyCryptoModule' is deprecated. Use 'aesCbcCryptoModule' instead for new applications."), false === e2.useRandomIVs && e2.logger.warn("CryptoModule", "Setting 'useRandomIVs' to false is insecure and should only be used to support legacy clients.\n          Do not disable random IVs in new applications.")), new F({ default: new $(Object.assign(Object.assign({}, e2), { useRandomIVs: null === (t2 = e2.useRandomIVs) || void 0 === t2 || t2 })), cryptors: [new O({ cipherKey: e2.cipherKey })] });
        }
        static aesCbcCryptoModule(e2) {
          var t2;
          if (!e2.cipherKey) throw new d("Crypto module error: cipher key not set.");
          return new F({ default: new O({ cipherKey: e2.cipherKey }), cryptors: [new $(Object.assign(Object.assign({}, e2), { useRandomIVs: null === (t2 = e2.useRandomIVs) || void 0 === t2 || t2 }))] });
        }
        static withDefaultCryptor(e2) {
          return new this({ default: e2 });
        }
        encrypt(e2) {
          const t2 = e2 instanceof ArrayBuffer && this.defaultCryptor.identifier === F.LEGACY_IDENTIFIER ? this.defaultCryptor.encrypt(F.decoder.decode(e2)) : this.defaultCryptor.encrypt(e2);
          if (!t2.metadata) return t2.data;
          if ("string" == typeof t2.data) throw new Error("Encryption error: encrypted data should be ArrayBuffed.");
          const s2 = this.getHeaderData(t2);
          return this.concatArrayBuffer(s2, t2.data);
        }
        encryptFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            if (this.defaultCryptor.identifier === x.LEGACY_IDENTIFIER) return this.defaultCryptor.encryptFile(e2, t2);
            const s2 = yield this.getFileData(e2), n2 = yield this.defaultCryptor.encryptFileData(s2);
            if ("string" == typeof n2.data) throw new Error("Encryption error: encrypted data should be ArrayBuffed.");
            return t2.create({ name: e2.name, mimeType: "application/octet-stream", data: this.concatArrayBuffer(this.getHeaderData(n2), n2.data) });
          }));
        }
        decrypt(e2) {
          const t2 = "string" == typeof e2 ? c(e2) : e2, s2 = x.tryParse(t2), n2 = this.getCryptor(s2), r2 = s2.length > 0 ? t2.slice(s2.length - s2.metadataLength, s2.length) : null;
          if (t2.slice(s2.length).byteLength <= 0) throw new Error("Decryption error: empty content");
          return n2.decrypt({ data: t2.slice(s2.length), metadata: r2 });
        }
        decryptFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = yield e2.data.arrayBuffer(), n2 = x.tryParse(s2), r2 = this.getCryptor(n2);
            if ((null == r2 ? void 0 : r2.identifier) === x.LEGACY_IDENTIFIER) return r2.decryptFile(e2, t2);
            const i2 = (yield this.getFileData(s2)).slice(n2.length - n2.metadataLength, n2.length);
            return t2.create({ name: e2.name, data: yield this.defaultCryptor.decryptFileData({ data: s2.slice(n2.length), metadata: i2 }) });
          }));
        }
        getCryptorFromId(e2) {
          const t2 = this.getAllCryptors().find(((t3) => e2 === t3.identifier));
          if (t2) return t2;
          throw Error("Unknown cryptor error");
        }
        getCryptor(e2) {
          if ("string" == typeof e2) {
            const t2 = this.getAllCryptors().find(((t3) => t3.identifier === e2));
            if (t2) return t2;
            throw new Error("Unknown cryptor error");
          }
          if (e2 instanceof L) return this.getCryptorFromId(e2.identifier);
        }
        getHeaderData(e2) {
          if (!e2.metadata) return;
          const t2 = x.from(this.defaultCryptor.identifier, e2.metadata), s2 = new Uint8Array(t2.length);
          let n2 = 0;
          return s2.set(t2.data, n2), n2 += t2.length - e2.metadata.byteLength, s2.set(new Uint8Array(e2.metadata), n2), s2.buffer;
        }
        concatArrayBuffer(e2, t2) {
          const s2 = new Uint8Array(e2.byteLength + t2.byteLength);
          return s2.set(new Uint8Array(e2), 0), s2.set(new Uint8Array(t2), e2.byteLength), s2.buffer;
        }
        getFileData(e2) {
          return i(this, void 0, void 0, (function* () {
            if (e2 instanceof ArrayBuffer) return e2;
            if (e2 instanceof o) return e2.toArrayBuffer();
            throw new Error("Cannot decrypt/encrypt file. In browsers file encrypt/decrypt supported for string, ArrayBuffer or Blob");
          }));
        }
      }
      F.LEGACY_IDENTIFIER = "";
      class x {
        static from(e2, t2) {
          if (e2 !== x.LEGACY_IDENTIFIER) return new L(e2, t2.byteLength);
        }
        static tryParse(e2) {
          const t2 = new Uint8Array(e2);
          let s2, n2, r2 = null;
          if (t2.byteLength >= 4 && (s2 = t2.slice(0, 4), this.decoder.decode(s2) !== x.SENTINEL)) return F.LEGACY_IDENTIFIER;
          if (!(t2.byteLength >= 5)) throw new Error("Decryption error: invalid header version");
          if (r2 = t2[4], r2 > x.MAX_VERSION) throw new Error("Decryption error: Unknown cryptor error");
          let i2 = 5 + x.IDENTIFIER_LENGTH;
          if (!(t2.byteLength >= i2)) throw new Error("Decryption error: invalid crypto identifier");
          n2 = t2.slice(5, i2);
          let a2 = null;
          if (!(t2.byteLength >= i2 + 1)) throw new Error("Decryption error: invalid metadata length");
          return a2 = t2[i2], i2 += 1, 255 === a2 && t2.byteLength >= i2 + 2 && (a2 = new Uint16Array(t2.slice(i2, i2 + 2)).reduce(((e3, t3) => (e3 << 8) + t3), 0)), new L(this.decoder.decode(n2), a2);
        }
      }
      x.SENTINEL = "PNED", x.LEGACY_IDENTIFIER = "", x.IDENTIFIER_LENGTH = 4, x.VERSION = 1, x.MAX_VERSION = 1, x.decoder = new TextDecoder();
      class L {
        constructor(e2, t2) {
          this._identifier = e2, this._metadataLength = t2;
        }
        get identifier() {
          return this._identifier;
        }
        set identifier(e2) {
          this._identifier = e2;
        }
        get metadataLength() {
          return this._metadataLength;
        }
        set metadataLength(e2) {
          this._metadataLength = e2;
        }
        get version() {
          return x.VERSION;
        }
        get length() {
          return x.SENTINEL.length + 1 + x.IDENTIFIER_LENGTH + (this.metadataLength < 255 ? 1 : 3) + this.metadataLength;
        }
        get data() {
          let e2 = 0;
          const t2 = new Uint8Array(this.length), s2 = new TextEncoder();
          t2.set(s2.encode(x.SENTINEL)), e2 += x.SENTINEL.length, t2[e2] = this.version, e2++, this.identifier && t2.set(s2.encode(this.identifier), e2);
          const n2 = this.metadataLength;
          return e2 += x.IDENTIFIER_LENGTH, n2 < 255 ? t2[e2] = n2 : t2.set([255, n2 >> 8, 255 & n2], e2), t2;
        }
      }
      L.IDENTIFIER_LENGTH = 4, L.SENTINEL = "PNED";
      class q extends Error {
        static create(e2, t2) {
          return q.isErrorObject(e2) ? q.createFromError(e2) : q.createFromServiceResponse(e2, t2);
        }
        static createFromError(e2) {
          let t2 = h.PNUnknownCategory, s2 = "Unknown error", n2 = "Error";
          if (!e2) return new q(s2, t2, 0);
          if (e2 instanceof q) return e2;
          if (q.isErrorObject(e2) && (s2 = e2.message, n2 = e2.name), "AbortError" === n2 || -1 !== s2.indexOf("Aborted")) t2 = h.PNCancelledCategory, s2 = "Request cancelled";
          else if (-1 !== s2.toLowerCase().indexOf("timeout")) t2 = h.PNTimeoutCategory, s2 = "Request timeout";
          else if (-1 !== s2.toLowerCase().indexOf("network")) t2 = h.PNNetworkIssuesCategory, s2 = "Network issues";
          else if ("TypeError" === n2) t2 = -1 !== s2.indexOf("Load failed") || -1 != s2.indexOf("Failed to fetch") ? h.PNNetworkIssuesCategory : h.PNBadRequestCategory;
          else if ("FetchError" === n2) {
            const n3 = e2.code;
            ["ECONNREFUSED", "ENETUNREACH", "ENOTFOUND", "ECONNRESET", "EAI_AGAIN"].includes(n3) && (t2 = h.PNNetworkIssuesCategory), "ECONNREFUSED" === n3 ? s2 = "Connection refused" : "ENETUNREACH" === n3 ? s2 = "Network not reachable" : "ENOTFOUND" === n3 ? s2 = "Server not found" : "ECONNRESET" === n3 ? s2 = "Connection reset by peer" : "EAI_AGAIN" === n3 ? s2 = "Name resolution error" : "ETIMEDOUT" === n3 ? (t2 = h.PNTimeoutCategory, s2 = "Request timeout") : s2 = `Unknown system error: ${e2}`;
          } else "Request timeout" === s2 && (t2 = h.PNTimeoutCategory);
          return new q(s2, t2, 0, e2);
        }
        static createFromServiceResponse(e2, t2) {
          let s2, n2 = h.PNUnknownCategory, r2 = "Unknown error", { status: i2 } = e2;
          if (null != t2 || (t2 = e2.body), 402 === i2 ? r2 = "Not available for used key set. Contact support@pubnub.com" : 404 === i2 ? r2 = "Resource not found" : 400 === i2 ? (n2 = h.PNBadRequestCategory, r2 = "Bad request") : 403 === i2 ? (n2 = h.PNAccessDeniedCategory, r2 = "Access denied") : i2 >= 500 && (n2 = h.PNServerErrorCategory, r2 = "Internal server error"), "object" == typeof e2 && 0 === Object.keys(e2).length && (n2 = h.PNMalformedResponseCategory, r2 = "Malformed response (network issues)", i2 = 400), t2 && t2.byteLength > 0) {
            const n3 = new TextDecoder().decode(t2);
            if (-1 !== e2.headers["content-type"].indexOf("text/javascript") || -1 !== e2.headers["content-type"].indexOf("application/json")) try {
              const e3 = JSON.parse(n3);
              "object" == typeof e3 && (Array.isArray(e3) ? "number" == typeof e3[0] && 0 === e3[0] && e3.length > 1 && "string" == typeof e3[1] && (s2 = e3[1]) : ("error" in e3 && (1 === e3.error || true === e3.error) && "status" in e3 && "number" == typeof e3.status && "message" in e3 && "service" in e3 ? (s2 = e3, i2 = e3.status) : s2 = e3, "error" in e3 && e3.error instanceof Error && (s2 = e3.error)));
            } catch (e3) {
              s2 = n3;
            }
            else if (-1 !== e2.headers["content-type"].indexOf("xml")) {
              const e3 = /<Message>(.*)<\/Message>/gi.exec(n3);
              r2 = e3 ? `Upload to bucket failed: ${e3[1]}` : "Upload to bucket failed.";
            } else s2 = n3;
          }
          return new q(r2, n2, i2, s2);
        }
        constructor(e2, t2, s2, n2) {
          super(e2), this.category = t2, this.statusCode = s2, this.errorData = n2, this.name = "PubNubAPIError";
        }
        toStatus(e2) {
          return { error: true, category: this.category, operation: e2, statusCode: this.statusCode, errorData: this.errorData, toJSON: function() {
            let e3;
            const t2 = this.errorData;
            if (t2) try {
              if ("object" == typeof t2) {
                const s3 = Object.assign(Object.assign(Object.assign(Object.assign({}, "name" in t2 ? { name: t2.name } : {}), "message" in t2 ? { message: t2.message } : {}), "stack" in t2 ? { stack: t2.stack } : {}), t2);
                e3 = JSON.parse(JSON.stringify(s3, q.circularReplacer()));
              } else e3 = t2;
            } catch (t3) {
              e3 = { error: "Could not serialize the error object" };
            }
            const s2 = r(this, ["toJSON"]);
            return JSON.stringify(Object.assign(Object.assign({}, s2), { errorData: e3 }));
          } };
        }
        toPubNubError(e2, t2) {
          return new d(null != t2 ? t2 : this.message, this.toStatus(e2));
        }
        static circularReplacer() {
          const e2 = /* @__PURE__ */ new WeakSet();
          return function(t2, s2) {
            if ("object" == typeof s2 && null !== s2) {
              if (e2.has(s2)) return "[Circular]";
              e2.add(s2);
            }
            return s2;
          };
        }
        static isErrorObject(e2) {
          return !(!e2 || "object" != typeof e2) && (e2 instanceof Error || ("name" in e2 && "message" in e2 && "string" == typeof e2.name && "string" == typeof e2.message || "[object Error]" === Object.prototype.toString.call(e2)));
        }
      }
      var G;
      !(function(e2) {
        e2.PNPublishOperation = "PNPublishOperation", e2.PNSignalOperation = "PNSignalOperation", e2.PNSubscribeOperation = "PNSubscribeOperation", e2.PNUnsubscribeOperation = "PNUnsubscribeOperation", e2.PNWhereNowOperation = "PNWhereNowOperation", e2.PNHereNowOperation = "PNHereNowOperation", e2.PNGlobalHereNowOperation = "PNGlobalHereNowOperation", e2.PNSetStateOperation = "PNSetStateOperation", e2.PNGetStateOperation = "PNGetStateOperation", e2.PNHeartbeatOperation = "PNHeartbeatOperation", e2.PNAddMessageActionOperation = "PNAddActionOperation", e2.PNRemoveMessageActionOperation = "PNRemoveMessageActionOperation", e2.PNGetMessageActionsOperation = "PNGetMessageActionsOperation", e2.PNTimeOperation = "PNTimeOperation", e2.PNHistoryOperation = "PNHistoryOperation", e2.PNDeleteMessagesOperation = "PNDeleteMessagesOperation", e2.PNFetchMessagesOperation = "PNFetchMessagesOperation", e2.PNMessageCounts = "PNMessageCountsOperation", e2.PNGetAllUUIDMetadataOperation = "PNGetAllUUIDMetadataOperation", e2.PNGetUUIDMetadataOperation = "PNGetUUIDMetadataOperation", e2.PNSetUUIDMetadataOperation = "PNSetUUIDMetadataOperation", e2.PNRemoveUUIDMetadataOperation = "PNRemoveUUIDMetadataOperation", e2.PNGetAllChannelMetadataOperation = "PNGetAllChannelMetadataOperation", e2.PNGetChannelMetadataOperation = "PNGetChannelMetadataOperation", e2.PNSetChannelMetadataOperation = "PNSetChannelMetadataOperation", e2.PNRemoveChannelMetadataOperation = "PNRemoveChannelMetadataOperation", e2.PNGetMembersOperation = "PNGetMembersOperation", e2.PNSetMembersOperation = "PNSetMembersOperation", e2.PNGetMembershipsOperation = "PNGetMembershipsOperation", e2.PNSetMembershipsOperation = "PNSetMembershipsOperation", e2.PNListFilesOperation = "PNListFilesOperation", e2.PNGenerateUploadUrlOperation = "PNGenerateUploadUrlOperation", e2.PNPublishFileOperation = "PNPublishFileOperation", e2.PNPublishFileMessageOperation = "PNPublishFileMessageOperation", e2.PNGetFileUrlOperation = "PNGetFileUrlOperation", e2.PNDownloadFileOperation = "PNDownloadFileOperation", e2.PNDeleteFileOperation = "PNDeleteFileOperation", e2.PNAddPushNotificationEnabledChannelsOperation = "PNAddPushNotificationEnabledChannelsOperation", e2.PNRemovePushNotificationEnabledChannelsOperation = "PNRemovePushNotificationEnabledChannelsOperation", e2.PNPushNotificationEnabledChannelsOperation = "PNPushNotificationEnabledChannelsOperation", e2.PNRemoveAllPushNotificationsOperation = "PNRemoveAllPushNotificationsOperation", e2.PNChannelGroupsOperation = "PNChannelGroupsOperation", e2.PNRemoveGroupOperation = "PNRemoveGroupOperation", e2.PNChannelsForGroupOperation = "PNChannelsForGroupOperation", e2.PNAddChannelsToGroupOperation = "PNAddChannelsToGroupOperation", e2.PNRemoveChannelsFromGroupOperation = "PNRemoveChannelsFromGroupOperation", e2.PNAccessManagerGrant = "PNAccessManagerGrant", e2.PNAccessManagerGrantToken = "PNAccessManagerGrantToken", e2.PNAccessManagerAudit = "PNAccessManagerAudit", e2.PNAccessManagerRevokeToken = "PNAccessManagerRevokeToken", e2.PNHandshakeOperation = "PNHandshakeOperation", e2.PNReceiveMessagesOperation = "PNReceiveMessagesOperation";
      })(G || (G = {}));
      var K = G;
      class H {
        constructor(e2) {
          this.configuration = e2, this.subscriptionWorkerReady = false, this.accessTokensMap = {}, this.workerEventsQueue = [], this.callbacks = /* @__PURE__ */ new Map(), this.setupSubscriptionWorker();
        }
        set emitStatus(e2) {
          this._emitStatus = e2;
        }
        onUserIdChange(e2) {
          this.configuration.userId = e2, this.scheduleEventPost({ type: "client-update", heartbeatInterval: this.configuration.heartbeatInterval, clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, userId: this.configuration.userId, workerLogLevel: this.configuration.workerLogLevel });
        }
        onPresenceStateChange(e2) {
          this.scheduleEventPost({ type: "client-presence-state-update", clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, workerLogLevel: this.configuration.workerLogLevel, state: e2 });
        }
        onHeartbeatIntervalChange(e2) {
          this.configuration.heartbeatInterval = e2, this.scheduleEventPost({ type: "client-update", heartbeatInterval: this.configuration.heartbeatInterval, clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, userId: this.configuration.userId, workerLogLevel: this.configuration.workerLogLevel });
        }
        onTokenChange(e2) {
          const t2 = { type: "client-update", heartbeatInterval: this.configuration.heartbeatInterval, clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, userId: this.configuration.userId, workerLogLevel: this.configuration.workerLogLevel };
          this.parsedAccessToken(e2).then(((s2) => {
            t2.preProcessedToken = s2, t2.accessToken = e2;
          })).then((() => this.scheduleEventPost(t2)));
        }
        disconnect() {
          this.scheduleEventPost({ type: "client-disconnect", clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, workerLogLevel: this.configuration.workerLogLevel });
        }
        terminate() {
          this.scheduleEventPost({ type: "client-unregister", clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, workerLogLevel: this.configuration.workerLogLevel });
        }
        makeSendable(e2) {
          if (!e2.path.startsWith("/v2/subscribe") && !e2.path.endsWith("/heartbeat") && !e2.path.endsWith("/leave")) return this.configuration.transport.makeSendable(e2);
          let t2;
          this.configuration.logger.debug("SubscriptionWorkerMiddleware", "Process request with SharedWorker transport.");
          const s2 = { type: "send-request", clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, request: e2, workerLogLevel: this.configuration.workerLogLevel };
          return e2.cancellable && (t2 = { abort: () => {
            const t3 = { type: "cancel-request", clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, identifier: e2.identifier, workerLogLevel: this.configuration.workerLogLevel };
            this.scheduleEventPost(t3);
          } }), [new Promise(((t3, n2) => {
            this.callbacks.set(e2.identifier, { resolve: t3, reject: n2 }), this.parsedAccessTokenForRequest(e2).then(((e3) => s2.preProcessedToken = e3)).then((() => this.scheduleEventPost(s2)));
          })), t2];
        }
        request(e2) {
          return e2;
        }
        scheduleEventPost(e2, t2 = false) {
          const s2 = this.sharedSubscriptionWorker;
          s2 ? s2.port.postMessage(e2) : t2 ? this.workerEventsQueue.splice(0, 0, e2) : this.workerEventsQueue.push(e2);
        }
        flushScheduledEvents() {
          const e2 = this.sharedSubscriptionWorker;
          if (!e2 || 0 === this.workerEventsQueue.length) return;
          const t2 = [];
          for (let e3 = 0; e3 < this.workerEventsQueue.length; e3++) {
            const s2 = this.workerEventsQueue[e3];
            if ("cancel-request" === s2.type && 0 !== e3) for (let n2 = 0; n2 < e3; n2++) {
              const e4 = this.workerEventsQueue[n2];
              if ("send-request" === e4.type && e4.request.identifier === s2.identifier) {
                t2.push(s2, e4);
                break;
              }
            }
          }
          this.workerEventsQueue = this.workerEventsQueue.filter(((e3) => !t2.includes(e3))), this.workerEventsQueue.forEach(((t3) => e2.port.postMessage(t3))), this.workerEventsQueue = [];
        }
        get sharedSubscriptionWorker() {
          return this.subscriptionWorkerReady ? this.subscriptionWorker : null;
        }
        setupSubscriptionWorker() {
          if ("undefined" != typeof SharedWorker) {
            try {
              this.subscriptionWorker = new SharedWorker(this.configuration.workerUrl, `/pubnub-${this.configuration.sdkVersion}`);
            } catch (e2) {
              throw this.configuration.logger.error("SubscriptionWorkerMiddleware", (() => ({ messageType: "error", message: e2 }))), e2;
            }
            this.subscriptionWorker.port.start(), this.scheduleEventPost({ type: "client-register", clientIdentifier: this.configuration.clientIdentifier, subscriptionKey: this.configuration.subscriptionKey, userId: this.configuration.userId, heartbeatInterval: this.configuration.heartbeatInterval, workerOfflineClientsCheckInterval: this.configuration.workerOfflineClientsCheckInterval, workerUnsubscribeOfflineClients: this.configuration.workerUnsubscribeOfflineClients, workerLogLevel: this.configuration.workerLogLevel }, true), this.subscriptionWorker.port.onmessage = (e2) => this.handleWorkerEvent(e2), this.shouldAnnounceNewerSharedWorkerVersionAvailability() && localStorage.setItem("PNSubscriptionSharedWorkerVersion", this.configuration.sdkVersion), window.addEventListener("storage", ((e2) => {
              "PNSubscriptionSharedWorkerVersion" === e2.key && e2.newValue && this._emitStatus && this.isNewerSharedWorkerVersion(e2.newValue) && this._emitStatus({ error: false, category: h.PNSharedWorkerUpdatedCategory });
            }));
          }
        }
        handleWorkerEvent(e2) {
          const { data: t2 } = e2;
          if ("shared-worker-ping" === t2.type || "shared-worker-connected" === t2.type || "shared-worker-console-log" === t2.type || "shared-worker-console-dir" === t2.type || t2.clientIdentifier === this.configuration.clientIdentifier) {
            if ("shared-worker-connected" === t2.type) this.configuration.logger.trace("SharedWorker", "Ready for events processing."), this.subscriptionWorkerReady = true, this.flushScheduledEvents();
            else if ("shared-worker-console-log" === t2.type) this.configuration.logger.debug("SharedWorker", (() => "string" == typeof t2.message || "number" == typeof t2.message || "boolean" == typeof t2.message ? { messageType: "text", message: t2.message } : t2.message));
            else if ("shared-worker-console-dir" === t2.type) this.configuration.logger.debug("SharedWorker", (() => ({ messageType: "object", message: t2.data, details: t2.message ? t2.message : void 0 })));
            else if ("shared-worker-ping" === t2.type) {
              const { subscriptionKey: e3, clientIdentifier: t3 } = this.configuration;
              this.scheduleEventPost({ type: "client-pong", subscriptionKey: e3, clientIdentifier: t3, workerLogLevel: this.configuration.workerLogLevel });
            } else if ("request-process-success" === t2.type || "request-process-error" === t2.type) if (this.callbacks.has(t2.identifier)) {
              const { resolve: e3, reject: s2 } = this.callbacks.get(t2.identifier);
              this.callbacks.delete(t2.identifier), "request-process-success" === t2.type ? e3({ status: t2.response.status, url: t2.url, headers: t2.response.headers, body: t2.response.body }) : s2(this.errorFromRequestSendingError(t2));
            } else this._emitStatus && t2.url.indexOf("/v2/presence") >= 0 && t2.url.indexOf("/heartbeat") >= 0 && ("request-process-success" === t2.type && this.configuration.announceSuccessfulHeartbeats ? this._emitStatus({ statusCode: t2.response.status, error: false, operation: K.PNHeartbeatOperation, category: h.PNAcknowledgmentCategory }) : "request-process-error" === t2.type && this.configuration.announceFailedHeartbeats && this._emitStatus(this.errorFromRequestSendingError(t2).toStatus(K.PNHeartbeatOperation)));
          }
        }
        parsedAccessTokenForRequest(e2) {
          return i(this, void 0, void 0, (function* () {
            var t2;
            return this.parsedAccessToken(e2.queryParameters ? null !== (t2 = e2.queryParameters.auth) && void 0 !== t2 ? t2 : "" : void 0);
          }));
        }
        parsedAccessToken(e2) {
          return i(this, void 0, void 0, (function* () {
            if (e2) return this.accessTokensMap[e2] ? this.accessTokensMap[e2] : this.stringifyAccessToken(e2).then((([t2, s2]) => {
              if (t2 && s2) return (this.accessTokensMap = { [e2]: { token: s2, expiration: t2.timestamp + 60 * t2.ttl } })[e2];
            }));
          }));
        }
        stringifyAccessToken(e2) {
          return i(this, void 0, void 0, (function* () {
            if (!this.configuration.tokenManager) return [void 0, void 0];
            const t2 = this.configuration.tokenManager.parseToken(e2);
            if (!t2) return [void 0, void 0];
            const s2 = (e3) => e3 ? Object.entries(e3).sort((([e4], [t3]) => e4.localeCompare(t3))).map((([e4, t3]) => Object.entries(t3 || {}).sort((([e5], [t4]) => e5.localeCompare(t4))).map((([t4, s3]) => {
              return `${e4}:${t4}=${s3 ? (n3 = s3, Object.entries(n3).filter((([e5, t5]) => t5)).map((([e5]) => e5[0])).sort().join("")) : ""}`;
              var n3;
            })).join(","))).join(";") : "";
            let n2 = [s2(t2.resources), s2(t2.patterns), t2.authorized_uuid].filter(Boolean).join("|");
            if ("undefined" != typeof crypto && crypto.subtle) {
              const e3 = yield crypto.subtle.digest("SHA-256", new TextEncoder().encode(n2));
              n2 = String.fromCharCode(...Array.from(new Uint8Array(e3)));
            }
            return [t2, "undefined" != typeof btoa ? btoa(n2) : n2];
          }));
        }
        errorFromRequestSendingError(e2) {
          let t2 = h.PNUnknownCategory, s2 = "Unknown error";
          if (e2.error) "NETWORK_ISSUE" === e2.error.type ? t2 = h.PNNetworkIssuesCategory : "TIMEOUT" === e2.error.type ? t2 = h.PNTimeoutCategory : "ABORTED" === e2.error.type && (t2 = h.PNCancelledCategory), s2 = `${e2.error.message} (${e2.identifier})`;
          else if (e2.response) {
            const { url: t3, response: s3 } = e2;
            return q.create({ url: t3, headers: s3.headers, body: s3.body, status: s3.status }, s3.body);
          }
          return new q(s2, t2, 0, new Error(s2));
        }
        shouldAnnounceNewerSharedWorkerVersionAvailability() {
          const e2 = localStorage.getItem("PNSubscriptionSharedWorkerVersion");
          return !e2 || !this.isNewerSharedWorkerVersion(e2);
        }
        isNewerSharedWorkerVersion(e2) {
          const [t2, s2, n2] = this.configuration.sdkVersion.split(".").map(Number), [r2, i2, a2] = e2.split(".").map(Number);
          return r2 > t2 || i2 > s2 || a2 > n2;
        }
      }
      function B(e2, t2 = 0) {
        const s2 = (e3) => "object" == typeof e3 && null !== e3 && e3.constructor === Object, n2 = (e3) => "number" == typeof e3 && isFinite(e3);
        if (!s2(e2)) return e2;
        const r2 = {};
        return Object.keys(e2).forEach(((i2) => {
          const a2 = ((e3) => "string" == typeof e3 || e3 instanceof String)(i2);
          let o2 = i2;
          const c2 = e2[i2];
          if (t2 < 2) if (a2 && i2.indexOf(",") >= 0) {
            o2 = i2.split(",").map(Number).reduce(((e3, t3) => e3 + String.fromCharCode(t3)), "");
          } else (n2(i2) || a2 && !isNaN(Number(i2))) && (o2 = String.fromCharCode(n2(i2) ? i2 : parseInt(i2, 10)));
          r2[o2] = s2(c2) ? B(c2, t2 + 1) : c2;
        })), r2;
      }
      const W = (e2) => {
        var t2, s2, n2, r2, i2, a2;
        return e2.subscriptionWorkerUrl && "undefined" == typeof SharedWorker && (e2.subscriptionWorkerUrl = null), Object.assign(Object.assign({}, ((e3) => {
          var t3, s3, n3, r3, i3, a3, o2, c2, u2, l2, h2, p2, g2, b2, y2;
          const m2 = Object.assign({}, e3);
          if (null !== (t3 = m2.ssl) && void 0 !== t3 || (m2.ssl = true), null !== (s3 = m2.transactionalRequestTimeout) && void 0 !== s3 || (m2.transactionalRequestTimeout = 15), null !== (n3 = m2.subscribeRequestTimeout) && void 0 !== n3 || (m2.subscribeRequestTimeout = 310), null !== (r3 = m2.fileRequestTimeout) && void 0 !== r3 || (m2.fileRequestTimeout = 300), null !== (i3 = m2.restore) && void 0 !== i3 || (m2.restore = true), null !== (a3 = m2.useInstanceId) && void 0 !== a3 || (m2.useInstanceId = false), null !== (o2 = m2.suppressLeaveEvents) && void 0 !== o2 || (m2.suppressLeaveEvents = false), null !== (c2 = m2.requestMessageCountThreshold) && void 0 !== c2 || (m2.requestMessageCountThreshold = 100), null !== (u2 = m2.autoNetworkDetection) && void 0 !== u2 || (m2.autoNetworkDetection = false), null !== (l2 = m2.enableEventEngine) && void 0 !== l2 || (m2.enableEventEngine = true), null !== (h2 = m2.maintainPresenceState) && void 0 !== h2 || (m2.maintainPresenceState = true), null !== (p2 = m2.useSmartHeartbeat) && void 0 !== p2 || (m2.useSmartHeartbeat = false), null !== (g2 = m2.keepAlive) && void 0 !== g2 || (m2.keepAlive = false), m2.userId && m2.uuid) throw new d("PubNub client configuration error: use only 'userId'");
          if (null !== (b2 = m2.userId) && void 0 !== b2 || (m2.userId = m2.uuid), !m2.userId) throw new d("PubNub client configuration error: 'userId' not set");
          if (0 === (null === (y2 = m2.userId) || void 0 === y2 ? void 0 : y2.trim().length)) throw new d("PubNub client configuration error: 'userId' is empty");
          m2.origin || (m2.origin = Array.from({ length: 20 }, ((e4, t4) => `ps${t4 + 1}.pndsn.com`)));
          const f2 = { subscribeKey: m2.subscribeKey, publishKey: m2.publishKey, secretKey: m2.secretKey };
          void 0 !== m2.presenceTimeout && (m2.presenceTimeout > 320 ? (m2.presenceTimeout = 320, console.warn("WARNING: Presence timeout is larger than the maximum. Using maximum value: ", 320)) : m2.presenceTimeout <= 0 && (console.warn("WARNING: Presence timeout should be larger than zero."), delete m2.presenceTimeout)), void 0 !== m2.presenceTimeout ? m2.heartbeatInterval = m2.presenceTimeout / 2 - 1 : m2.presenceTimeout = 300;
          let v2 = false, S2 = true, w2 = 5, O2 = false, k2 = 100, C2 = true;
          return void 0 !== m2.dedupeOnSubscribe && "boolean" == typeof m2.dedupeOnSubscribe && (O2 = m2.dedupeOnSubscribe), void 0 !== m2.maximumCacheSize && "number" == typeof m2.maximumCacheSize && (k2 = m2.maximumCacheSize), void 0 !== m2.useRequestId && "boolean" == typeof m2.useRequestId && (C2 = m2.useRequestId), void 0 !== m2.announceSuccessfulHeartbeats && "boolean" == typeof m2.announceSuccessfulHeartbeats && (v2 = m2.announceSuccessfulHeartbeats), void 0 !== m2.announceFailedHeartbeats && "boolean" == typeof m2.announceFailedHeartbeats && (S2 = m2.announceFailedHeartbeats), void 0 !== m2.fileUploadPublishRetryLimit && "number" == typeof m2.fileUploadPublishRetryLimit && (w2 = m2.fileUploadPublishRetryLimit), Object.assign(Object.assign({}, m2), { keySet: f2, dedupeOnSubscribe: O2, maximumCacheSize: k2, useRequestId: C2, announceSuccessfulHeartbeats: v2, announceFailedHeartbeats: S2, fileUploadPublishRetryLimit: w2 });
        })(e2)), { listenToBrowserNetworkEvents: null === (t2 = e2.listenToBrowserNetworkEvents) || void 0 === t2 || t2, subscriptionWorkerUrl: e2.subscriptionWorkerUrl, subscriptionWorkerOfflineClientsCheckInterval: null !== (s2 = e2.subscriptionWorkerOfflineClientsCheckInterval) && void 0 !== s2 ? s2 : 10, subscriptionWorkerUnsubscribeOfflineClients: null !== (n2 = e2.subscriptionWorkerUnsubscribeOfflineClients) && void 0 !== n2 && n2, subscriptionWorkerLogVerbosity: null !== (r2 = e2.subscriptionWorkerLogVerbosity) && void 0 !== r2 && r2, transport: null !== (i2 = e2.transport) && void 0 !== i2 ? i2 : "fetch", keepAlive: null === (a2 = e2.keepAlive) || void 0 === a2 || a2 });
      };
      var V, z;
      !(function(e2) {
        e2[e2.Trace = 0] = "Trace", e2[e2.Debug = 1] = "Debug", e2[e2.Info = 2] = "Info", e2[e2.Warn = 3] = "Warn", e2[e2.Error = 4] = "Error", e2[e2.None = 5] = "None";
      })(V || (V = {}));
      class J {
        debug(e2) {
          this.log(e2);
        }
        error(e2) {
          this.log(e2);
        }
        info(e2) {
          this.log(e2);
        }
        trace(e2) {
          this.log(e2);
        }
        warn(e2) {
          this.log(e2);
        }
        toString() {
          return "ConsoleLogger {}";
        }
        log(e2) {
          const t2 = V[e2.level], s2 = t2.toLowerCase();
          console["trace" === s2 ? "debug" : s2](`${e2.timestamp.toISOString()} PubNub-${e2.pubNubId} ${t2.padEnd(5, " ")}${e2.location ? ` ${e2.location}` : ""} ${this.logMessage(e2)}`);
        }
        logMessage(e2) {
          if ("text" === e2.messageType) return e2.message;
          if ("object" === e2.messageType) return `${e2.details ? `${e2.details}
` : ""}${this.formattedObject(e2)}`;
          if ("network-request" === e2.messageType) {
            const t2 = !!e2.canceled || !!e2.failed, s2 = e2.minimumLevel !== V.Trace || t2 ? void 0 : this.formattedHeaders(e2), n2 = e2.message, r2 = n2.queryParameters && Object.keys(n2.queryParameters).length > 0 ? T(n2.queryParameters) : void 0, i2 = `${n2.origin}${n2.path}${r2 ? `?${r2}` : ""}`, a2 = t2 ? void 0 : this.formattedBody(e2);
            let o2 = "Sending";
            t2 && (o2 = `${e2.canceled ? "Canceled" : "Failed"}${e2.details ? ` (${e2.details})` : ""}`);
            const c2 = ((null == a2 ? void 0 : a2.formData) ? "FormData" : "Method").length;
            return `${o2} HTTP request:
  ${this.paddedString("Method", c2)}: ${n2.method}
  ${this.paddedString("URL", c2)}: ${i2}${s2 ? `
  ${this.paddedString("Headers", c2)}:
${s2}` : ""}${(null == a2 ? void 0 : a2.formData) ? `
  ${this.paddedString("FormData", c2)}:
${a2.formData}` : ""}${(null == a2 ? void 0 : a2.body) ? `
  ${this.paddedString("Body", c2)}:
${a2.body}` : ""}`;
          }
          if ("network-response" === e2.messageType) {
            const t2 = e2.minimumLevel === V.Trace ? this.formattedHeaders(e2) : void 0, s2 = this.formattedBody(e2), n2 = ((null == s2 ? void 0 : s2.formData) ? "Headers" : "Status").length, r2 = e2.message;
            return `Received HTTP response:
  ${this.paddedString("URL", n2)}: ${r2.url}
  ${this.paddedString("Status", n2)}: ${r2.status}${e2.details ? `
  ${this.paddedString("Details", n2)}: ${e2.details}` : ""}${t2 ? `
  ${this.paddedString("Headers", n2)}:
${t2}` : ""}${(null == s2 ? void 0 : s2.body) ? `
  ${this.paddedString("Body", n2)}:
${s2.body}` : ""}`;
          }
          if ("error" === e2.messageType) {
            const t2 = this.formattedErrorStatus(e2), s2 = e2.message;
            return `${s2.name}: ${s2.message}${t2 ? `
${t2}` : ""}`;
          }
          return "<unknown log message data>";
        }
        formattedObject(e2) {
          const t2 = (s2, n2 = 1, r2 = false) => {
            const i2 = 10 === n2, a2 = " ".repeat(2 * n2), o2 = [], c2 = (t3, s3) => !!e2.ignoredKeys && ("function" == typeof e2.ignoredKeys ? e2.ignoredKeys(t3, s3) : e2.ignoredKeys.includes(t3));
            if ("string" == typeof s2) o2.push(`${a2}- ${s2}`);
            else if ("number" == typeof s2) o2.push(`${a2}- ${s2}`);
            else if ("boolean" == typeof s2) o2.push(`${a2}- ${s2}`);
            else if (null === s2) o2.push(`${a2}- null`);
            else if (void 0 === s2) o2.push(`${a2}- undefined`);
            else if ("function" == typeof s2) o2.push(`${a2}- <function>`);
            else if ("object" == typeof s2) if (Array.isArray(s2) || "function" != typeof s2.toString || 0 === s2.toString().indexOf("[object")) if (Array.isArray(s2)) for (const e3 of s2) {
              const s3 = r2 ? "" : a2;
              if (null === e3) o2.push(`${s3}- null`);
              else if (void 0 === e3) o2.push(`${s3}- undefined`);
              else if ("function" == typeof e3) o2.push(`${s3}- <function>`);
              else if ("object" == typeof e3) {
                const r3 = Array.isArray(e3), a3 = i2 ? "..." : t2(e3, n2 + 1, !r3);
                o2.push(`${s3}-${r3 && !i2 ? "\n" : " "}${a3}`);
              } else o2.push(`${s3}- ${e3}`);
              r2 = false;
            }
            else {
              const e3 = s2, u2 = Object.keys(e3), l2 = u2.reduce(((t3, s3) => Math.max(t3, c2(s3, e3) ? t3 : s3.length)), 0);
              for (const s3 of u2) {
                if (c2(s3, e3)) continue;
                const u3 = r2 ? "" : a2, h2 = e3[s3], d2 = s3.padEnd(l2, " ");
                if (null === h2) o2.push(`${u3}${d2}: null`);
                else if (void 0 === h2) o2.push(`${u3}${d2}: undefined`);
                else if ("function" == typeof h2) o2.push(`${u3}${d2}: <function>`);
                else if ("object" == typeof h2) {
                  const e4 = Array.isArray(h2), s4 = e4 && 0 === h2.length, r3 = !(e4 || h2 instanceof String || 0 !== Object.keys(h2).length), a3 = !e4 && "function" == typeof h2.toString && 0 !== h2.toString().indexOf("[object"), c3 = i2 ? "..." : s4 ? "[]" : r3 ? "{}" : t2(h2, n2 + 1, a3);
                  o2.push(`${u3}${d2}:${i2 || a3 || s4 || r3 ? " " : "\n"}${c3}`);
                } else o2.push(`${u3}${d2}: ${h2}`);
                r2 = false;
              }
            }
            else o2.push(`${r2 ? "" : a2}${s2.toString()}`), r2 = false;
            return o2.join("\n");
          };
          return t2(e2.message);
        }
        formattedHeaders(e2) {
          if (!e2.message.headers) return;
          const t2 = e2.message.headers, s2 = Object.keys(t2).reduce(((e3, t3) => Math.max(e3, t3.length)), 0);
          return Object.keys(t2).map(((e3) => `    - ${e3.toLowerCase().padEnd(s2, " ")}: ${t2[e3]}`)).join("\n");
        }
        formattedBody(e2) {
          var t2;
          if (!e2.message.headers) return;
          let s2, n2;
          const r2 = e2.message.headers, i2 = null !== (t2 = r2["content-type"]) && void 0 !== t2 ? t2 : r2["Content-Type"], a2 = "formData" in e2.message ? e2.message.formData : void 0, o2 = e2.message.body;
          if (a2) {
            const e3 = a2.reduce(((e4, { key: t3 }) => Math.max(e4, t3.length)), 0);
            s2 = a2.map((({ key: t3, value: s3 }) => `    - ${t3.padEnd(e3, " ")}: ${s3}`)).join("\n");
          }
          return o2 ? (n2 = "string" == typeof o2 ? `    ${o2}` : o2 instanceof ArrayBuffer || "[object ArrayBuffer]" === Object.prototype.toString.call(o2) ? !i2 || -1 === i2.indexOf("javascript") && -1 === i2.indexOf("json") ? `    ArrayBuffer { byteLength: ${o2.byteLength} }` : `    ${J.decoder.decode(o2)}` : `    File { name: ${o2.name}${o2.contentLength ? `, contentLength: ${o2.contentLength}` : ""}${o2.mimeType ? `, mimeType: ${o2.mimeType}` : ""} }`, { body: n2, formData: s2 }) : { formData: s2 };
        }
        formattedErrorStatus(e2) {
          if (!e2.message.status) return;
          const t2 = e2.message.status, s2 = t2.errorData;
          let n2;
          if (J.isError(s2)) n2 = `    ${s2.name}: ${s2.message}`, s2.stack && (n2 += `
${s2.stack.split("\n").map(((e3) => `      ${e3}`)).join("\n")}`);
          else if (s2) try {
            n2 = `    ${JSON.stringify(s2)}`;
          } catch (e3) {
            n2 = `    ${s2}`;
          }
          return `  Category  : ${t2.category}
  Operation : ${t2.operation}
  Status    : ${t2.statusCode}${n2 ? `
  Error data:
${n2}` : ""}`;
        }
        paddedString(e2, t2) {
          return e2.padEnd(t2 - e2.length, " ");
        }
        static isError(e2) {
          return !!e2 && (e2 instanceof Error || "[object Error]" === Object.prototype.toString.call(e2));
        }
      }
      J.decoder = new TextDecoder(), (function(e2) {
        e2.Unknown = "UnknownEndpoint", e2.MessageSend = "MessageSendEndpoint", e2.Subscribe = "SubscribeEndpoint", e2.Presence = "PresenceEndpoint", e2.Files = "FilesEndpoint", e2.MessageStorage = "MessageStorageEndpoint", e2.ChannelGroups = "ChannelGroupsEndpoint", e2.DevicePushNotifications = "DevicePushNotificationsEndpoint", e2.AppContext = "AppContextEndpoint", e2.MessageReactions = "MessageReactionsEndpoint";
      })(z || (z = {}));
      class X {
        static None() {
          return { shouldRetry: (e2, t2, s2, n2) => false, getDelay: (e2, t2) => -1, validate: () => true };
        }
        static LinearRetryPolicy(e2) {
          var t2;
          return { delay: e2.delay, maximumRetry: e2.maximumRetry, excluded: null !== (t2 = e2.excluded) && void 0 !== t2 ? t2 : [], shouldRetry(e3, t3, s2, n2) {
            return Q(e3, t3, s2, null != n2 ? n2 : 0, this.maximumRetry, this.excluded);
          }, getDelay(e3, t3) {
            let s2 = -1;
            return t3 && void 0 !== t3.headers["retry-after"] && (s2 = parseInt(t3.headers["retry-after"], 10)), -1 === s2 && (s2 = this.delay), 1e3 * (s2 + Math.random());
          }, validate() {
            if (this.delay < 2) throw new Error("Delay can not be set less than 2 seconds for retry");
          } };
        }
        static ExponentialRetryPolicy(e2) {
          var t2;
          return { minimumDelay: e2.minimumDelay, maximumDelay: e2.maximumDelay, maximumRetry: e2.maximumRetry, excluded: null !== (t2 = e2.excluded) && void 0 !== t2 ? t2 : [], shouldRetry(e3, t3, s2, n2) {
            return Q(e3, t3, s2, null != n2 ? n2 : 0, this.maximumRetry, this.excluded);
          }, getDelay(e3, t3) {
            let s2 = -1;
            return t3 && void 0 !== t3.headers["retry-after"] && (s2 = parseInt(t3.headers["retry-after"], 10)), -1 === s2 && (s2 = Math.min(this.minimumDelay * Math.pow(2, e3), this.maximumDelay)), 1e3 * (s2 + Math.random());
          }, validate() {
            if (this.minimumDelay < 2) throw new Error("Minimum delay can not be set less than 2 seconds for retry");
          } };
        }
      }
      const Q = (e2, t2, s2, n2, r2, i2) => (!s2 || s2 !== h.PNCancelledCategory && s2 !== h.PNBadRequestCategory && s2 !== h.PNAccessDeniedCategory) && (!Y(e2, i2) && (!(n2 > r2) && (!t2 || (429 === t2.status || t2.status >= 500)))), Y = (e2, t2) => !!(t2 && t2.length > 0) && t2.includes(Z(e2)), Z = (e2) => {
        let t2 = z.Unknown;
        return e2.path.startsWith("/v2/subscribe") ? t2 = z.Subscribe : e2.path.startsWith("/publish/") || e2.path.startsWith("/signal/") ? t2 = z.MessageSend : e2.path.startsWith("/v2/presence") ? t2 = z.Presence : e2.path.startsWith("/v2/history") || e2.path.startsWith("/v3/history") ? t2 = z.MessageStorage : e2.path.startsWith("/v1/message-actions/") ? t2 = z.MessageReactions : e2.path.startsWith("/v1/channel-registration/") || e2.path.startsWith("/v2/objects/") ? t2 = z.ChannelGroups : e2.path.startsWith("/v1/push/") || e2.path.startsWith("/v2/push/") ? t2 = z.DevicePushNotifications : e2.path.startsWith("/v1/files/") && (t2 = z.Files), t2;
      };
      class ee {
        constructor(e2, t2, s2) {
          this.previousEntryTimestamp = 0, this.pubNubId = e2, this.minLogLevel = t2, this.loggers = s2;
        }
        get logLevel() {
          return this.minLogLevel;
        }
        trace(e2, t2) {
          this.log(V.Trace, e2, t2);
        }
        debug(e2, t2) {
          this.log(V.Debug, e2, t2);
        }
        info(e2, t2) {
          this.log(V.Info, e2, t2);
        }
        warn(e2, t2) {
          this.log(V.Warn, e2, t2);
        }
        error(e2, t2) {
          this.log(V.Error, e2, t2);
        }
        log(e2, t2, s2) {
          if (e2 < this.minLogLevel || 0 === this.loggers.length) return;
          const n2 = /* @__PURE__ */ new Date();
          n2.getTime() <= this.previousEntryTimestamp ? (this.previousEntryTimestamp++, n2.setTime(this.previousEntryTimestamp)) : this.previousEntryTimestamp = n2.getTime();
          const r2 = V[e2].toLowerCase(), i2 = Object.assign({ timestamp: n2, pubNubId: this.pubNubId, level: e2, minimumLevel: this.minLogLevel, location: t2 }, "function" == typeof s2 ? s2() : { messageType: "text", message: s2 });
          this.loggers.forEach(((e3) => e3[r2](i2)));
        }
      }
      var te = { exports: {} };
      !(function(e2, t2) {
        !(function(e3) {
          var t3 = "0.1.0", s2 = { 3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i, 4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, 5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i, all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i };
          function n2() {
            var e4, t4, s3 = "";
            for (e4 = 0; e4 < 32; e4++) t4 = 16 * Math.random() | 0, 8 !== e4 && 12 !== e4 && 16 !== e4 && 20 !== e4 || (s3 += "-"), s3 += (12 === e4 ? 4 : 16 === e4 ? 3 & t4 | 8 : t4).toString(16);
            return s3;
          }
          function r2(e4, t4) {
            var n3 = s2[t4 || "all"];
            return n3 && n3.test(e4) || false;
          }
          n2.isUUID = r2, n2.VERSION = t3, e3.uuid = n2, e3.isUUID = r2;
        })(t2), null !== e2 && (e2.exports = t2.uuid);
      })(te, te.exports);
      var se = t(te.exports), ne = { createUUID: () => se.uuid ? se.uuid() : se() };
      const re = (e2, t2) => {
        var s2, n2, r2, i2;
        !e2.retryConfiguration && e2.enableEventEngine && (e2.retryConfiguration = X.ExponentialRetryPolicy({ minimumDelay: 2, maximumDelay: 150, maximumRetry: 6, excluded: [z.MessageSend, z.Presence, z.Files, z.MessageStorage, z.ChannelGroups, z.DevicePushNotifications, z.AppContext, z.MessageReactions] }));
        const a2 = `pn-${ne.createUUID()}`;
        e2.logVerbosity ? e2.logLevel = V.Debug : void 0 === e2.logLevel && (e2.logLevel = V.None);
        const o2 = new ee(ae(a2), e2.logLevel, [...null !== (s2 = e2.loggers) && void 0 !== s2 ? s2 : [], new J()]);
        void 0 !== e2.logVerbosity && o2.warn("Configuration", "'logVerbosity' is deprecated. Use 'logLevel' instead."), null === (n2 = e2.retryConfiguration) || void 0 === n2 || n2.validate();
        const c2 = e2.useRandomIVs;
        null !== (r2 = e2.useRandomIVs) && void 0 !== r2 || (e2.useRandomIVs = true), void 0 !== c2 && (o2.warn("Configuration", "'useRandomIVs' is deprecated. Pass it to 'cryptoModule' instead."), false === c2 && o2.warn("Configuration", "Setting 'useRandomIVs' to false is insecure and should only be used to support legacy clients.\n        Do not disable random IVs in new applications.")), e2.origin = ie(null !== (i2 = e2.ssl) && void 0 !== i2 && i2, e2.origin);
        const u2 = e2.cryptoModule;
        u2 && delete e2.cryptoModule;
        const l2 = Object.assign(Object.assign({}, e2), { _pnsdkSuffix: {}, _loggerManager: o2, _instanceId: a2, _cryptoModule: void 0, _cipherKey: void 0, _setupCryptoModule: t2, get instanceId() {
          if (e2.useInstanceId) return this._instanceId;
        }, getInstanceId() {
          if (e2.useInstanceId) return this._instanceId;
        }, getUserId() {
          return this.userId;
        }, setUserId(e3) {
          if (!e3 || "string" != typeof e3 || 0 === e3.trim().length) throw new Error("Missing or invalid userId parameter. Provide a valid string userId");
          this.userId = e3;
        }, logger() {
          return this._loggerManager;
        }, getAuthKey() {
          return this.authKey;
        }, setAuthKey(e3) {
          this.authKey = e3;
        }, getFilterExpression() {
          return this.filterExpression;
        }, setFilterExpression(e3) {
          this.filterExpression = e3;
        }, getCipherKey() {
          return this._cipherKey;
        }, setCipherKey(t3) {
          this._cipherKey = t3, t3 || !this._cryptoModule ? t3 && this._setupCryptoModule && (this._cryptoModule = this._setupCryptoModule({ cipherKey: t3, useRandomIVs: e2.useRandomIVs, customEncrypt: this.getCustomEncrypt(), customDecrypt: this.getCustomDecrypt(), logger: this.logger() })) : this._cryptoModule = void 0;
        }, getCryptoModule() {
          return this._cryptoModule;
        }, getUseRandomIVs: () => e2.useRandomIVs, isSharedWorkerEnabled: () => "Web" === e2.sdkFamily && e2.subscriptionWorkerUrl, getKeepPresenceChannelsInPresenceRequests: () => "Web" === e2.sdkFamily && e2.subscriptionWorkerUrl, setPresenceTimeout(e3) {
          this.heartbeatInterval = e3 / 2 - 1, this.presenceTimeout = e3;
        }, getPresenceTimeout() {
          return this.presenceTimeout;
        }, getHeartbeatInterval() {
          return this.heartbeatInterval;
        }, setHeartbeatInterval(e3) {
          this.heartbeatInterval = e3;
        }, getTransactionTimeout() {
          return this.transactionalRequestTimeout;
        }, getSubscribeTimeout() {
          return this.subscribeRequestTimeout;
        }, getFileTimeout() {
          return this.fileRequestTimeout;
        }, get PubNubFile() {
          return e2.PubNubFile;
        }, get version() {
          return "12.0.2";
        }, getVersion() {
          return this.version;
        }, _addPnsdkSuffix(e3, t3) {
          this._pnsdkSuffix[e3] = `${t3}`;
        }, _getPnsdkSuffix(e3) {
          const t3 = Object.values(this._pnsdkSuffix).join(e3);
          return t3.length > 0 ? e3 + t3 : "";
        }, getUUID() {
          return this.getUserId();
        }, setUUID(e3) {
          this.setUserId(e3);
        }, getCustomEncrypt: () => e2.customEncrypt, getCustomDecrypt: () => e2.customDecrypt });
        return e2.cipherKey ? (o2.warn("Configuration", "'cipherKey' is deprecated. Use 'cryptoModule' instead."), l2.setCipherKey(e2.cipherKey)) : u2 && (l2._cryptoModule = u2), l2;
      }, ie = (e2, t2) => {
        const s2 = e2 ? "https://" : "http://";
        return "string" == typeof t2 ? `${s2}${t2}` : `${s2}${t2[Math.floor(Math.random() * t2.length)]}`;
      }, ae = (e2) => {
        let t2 = 2166136261;
        for (let s2 = 0; s2 < e2.length; s2++) t2 ^= e2.charCodeAt(s2), t2 = t2 + ((t2 << 1) + (t2 << 4) + (t2 << 7) + (t2 << 8) + (t2 << 24)) >>> 0;
        return t2.toString(16).padStart(8, "0");
      };
      class oe {
        constructor(e2) {
          this.cbor = e2;
        }
        setToken(e2) {
          e2 && e2.length > 0 ? this.token = e2 : this.token = void 0;
        }
        getToken() {
          return this.token;
        }
        parseToken(e2) {
          const t2 = this.cbor.decodeToken(e2);
          if (void 0 !== t2) {
            const e3 = t2.res.uuid ? Object.keys(t2.res.uuid) : [], s2 = Object.keys(t2.res.chan), n2 = Object.keys(t2.res.grp), r2 = t2.pat.uuid ? Object.keys(t2.pat.uuid) : [], i2 = Object.keys(t2.pat.chan), a2 = Object.keys(t2.pat.grp), o2 = { version: t2.v, timestamp: t2.t, ttl: t2.ttl, authorized_uuid: t2.uuid, signature: t2.sig }, c2 = e3.length > 0, u2 = s2.length > 0, l2 = n2.length > 0;
            if (c2 || u2 || l2) {
              if (o2.resources = {}, c2) {
                const s3 = o2.resources.uuids = {};
                e3.forEach(((e4) => s3[e4] = this.extractPermissions(t2.res.uuid[e4])));
              }
              if (u2) {
                const e4 = o2.resources.channels = {};
                s2.forEach(((s3) => e4[s3] = this.extractPermissions(t2.res.chan[s3])));
              }
              if (l2) {
                const e4 = o2.resources.groups = {};
                n2.forEach(((s3) => e4[s3] = this.extractPermissions(t2.res.grp[s3])));
              }
            }
            const h2 = r2.length > 0, d2 = i2.length > 0, p2 = a2.length > 0;
            if (h2 || d2 || p2) {
              if (o2.patterns = {}, h2) {
                const e4 = o2.patterns.uuids = {};
                r2.forEach(((s3) => e4[s3] = this.extractPermissions(t2.pat.uuid[s3])));
              }
              if (d2) {
                const e4 = o2.patterns.channels = {};
                i2.forEach(((s3) => e4[s3] = this.extractPermissions(t2.pat.chan[s3])));
              }
              if (p2) {
                const e4 = o2.patterns.groups = {};
                a2.forEach(((s3) => e4[s3] = this.extractPermissions(t2.pat.grp[s3])));
              }
            }
            return t2.meta && Object.keys(t2.meta).length > 0 && (o2.meta = t2.meta), o2;
          }
        }
        extractPermissions(e2) {
          const t2 = { read: false, write: false, manage: false, delete: false, get: false, update: false, join: false };
          return 128 & ~e2 || (t2.join = true), 64 & ~e2 || (t2.update = true), 32 & ~e2 || (t2.get = true), 8 & ~e2 || (t2.delete = true), 4 & ~e2 || (t2.manage = true), 2 & ~e2 || (t2.write = true), 1 & ~e2 || (t2.read = true), t2;
        }
      }
      var ce;
      !(function(e2) {
        e2.GET = "GET", e2.POST = "POST", e2.PATCH = "PATCH", e2.DELETE = "DELETE", e2.LOCAL = "LOCAL";
      })(ce || (ce = {}));
      class ue {
        constructor(e2, t2, s2, n2) {
          this.publishKey = e2, this.secretKey = t2, this.hasher = s2, this.logger = n2;
        }
        signature(e2) {
          const t2 = e2.path.startsWith("/publish") ? ce.GET : e2.method;
          let s2 = `${t2}
${this.publishKey}
${e2.path}
${this.queryParameters(e2.queryParameters)}
`;
          if (t2 === ce.POST || t2 === ce.PATCH) {
            const t3 = e2.body;
            let n2;
            t3 && t3 instanceof ArrayBuffer ? n2 = ue.textDecoder.decode(t3) : t3 && "object" != typeof t3 && (n2 = t3), n2 && (s2 += n2);
          }
          return this.logger.trace("RequestSignature", (() => ({ messageType: "text", message: `Request signature input:
${s2}` }))), `v2.${this.hasher(s2, this.secretKey)}`.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }
        queryParameters(e2) {
          return Object.keys(e2).sort().map(((t2) => {
            const s2 = e2[t2];
            return Array.isArray(s2) ? s2.sort().map(((e3) => `${t2}=${P(e3)}`)).join("&") : `${t2}=${P(s2)}`;
          })).join("&");
        }
      }
      ue.textDecoder = new TextDecoder("utf-8");
      class le {
        constructor(e2) {
          this.configuration = e2;
          const { clientConfiguration: { keySet: t2 }, shaHMAC: s2 } = e2;
          t2.secretKey && s2 && (this.signatureGenerator = new ue(t2.publishKey, t2.secretKey, s2, this.logger));
        }
        get logger() {
          return this.configuration.clientConfiguration.logger();
        }
        makeSendable(e2) {
          const t2 = this.configuration.clientConfiguration.retryConfiguration, s2 = this.configuration.transport;
          if (void 0 !== t2) {
            let n2, r2, i2 = false, a2 = 0;
            const o2 = { abort: (e3) => {
              i2 = true, n2 && clearTimeout(n2), r2 && r2.abort(e3);
            } };
            return [new Promise(((o3, c2) => {
              const u2 = () => {
                if (i2) return;
                const [l2, d2] = s2.makeSendable(this.request(e2));
                r2 = d2;
                const p2 = (s3, r3) => {
                  const i3 = !r3 || r3.category !== h.PNCancelledCategory, l3 = (!s3 || s3.status >= 400) && 404 !== (null == r3 ? void 0 : r3.statusCode);
                  let d3 = -1;
                  i3 && l3 && t2.shouldRetry(e2, s3, null == r3 ? void 0 : r3.category, a2 + 1) && (d3 = t2.getDelay(a2, s3)), d3 > 0 ? (a2++, this.logger.warn("PubNubMiddleware", `HTTP request retry #${a2} in ${d3}ms.`), n2 = setTimeout((() => u2()), d3)) : s3 ? o3(s3) : r3 && c2(r3);
                };
                l2.then(((e3) => p2(e3))).catch(((e3) => p2(void 0, e3)));
              };
              u2();
            })), r2 ? o2 : void 0];
          }
          return s2.makeSendable(this.request(e2));
        }
        request(e2) {
          var t2;
          const { clientConfiguration: s2 } = this.configuration;
          return (e2 = this.configuration.transport.request(e2)).queryParameters || (e2.queryParameters = {}), s2.useInstanceId && (e2.queryParameters.instanceid = s2.getInstanceId()), e2.queryParameters.uuid || (e2.queryParameters.uuid = s2.userId), s2.useRequestId && (e2.queryParameters.requestid = e2.identifier), e2.queryParameters.pnsdk = this.generatePNSDK(), null !== (t2 = e2.origin) && void 0 !== t2 || (e2.origin = s2.origin), this.authenticateRequest(e2), this.signRequest(e2), e2;
        }
        authenticateRequest(e2) {
          var t2;
          if (e2.path.startsWith("/v2/auth/") || e2.path.startsWith("/v3/pam/") || e2.path.startsWith("/time")) return;
          const { clientConfiguration: s2, tokenManager: n2 } = this.configuration, r2 = null !== (t2 = n2 && n2.getToken()) && void 0 !== t2 ? t2 : s2.authKey;
          r2 && (e2.queryParameters.auth = r2);
        }
        signRequest(e2) {
          this.signatureGenerator && !e2.path.startsWith("/time") && (e2.queryParameters.timestamp = String(Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3)), e2.queryParameters.signature = this.signatureGenerator.signature(e2));
        }
        generatePNSDK() {
          const { clientConfiguration: e2 } = this.configuration;
          if (e2.sdkName) return e2.sdkName;
          let t2 = `PubNub-JS-${e2.sdkFamily}`;
          e2.partnerId && (t2 += `-${e2.partnerId}`), t2 += `/${e2.getVersion()}`;
          const s2 = e2._getPnsdkSuffix(" ");
          return s2.length > 0 && (t2 += s2), t2;
        }
      }
      class he {
        constructor(e2, t2 = "fetch") {
          this.logger = e2, this.transport = t2, e2.debug("WebTransport", `Create with configuration:
  - transport: ${t2}`), "fetch" === t2 && "undefined" == typeof fetch && (e2.warn("WebTransport", `'${t2}' not supported in this browser. Fallback to the 'xhr' transport.`), this.transport = "xhr"), "fetch" === this.transport && (he.originalFetch = he.getOriginalFetch(), this.isFetchMonkeyPatched() && e2.warn("WebTransport", "Native Web Fetch API 'fetch' function monkey patched."));
        }
        makeSendable(e2) {
          const t2 = new AbortController(), s2 = { abortController: t2, abort: (e3) => {
            t2.signal.aborted || (this.logger.trace("WebTransport", `On-demand request aborting: ${e3}`), t2.abort(e3));
          } };
          return [this.webTransportRequestFromTransportRequest(e2).then(((t3) => (this.logger.debug("WebTransport", (() => ({ messageType: "network-request", message: e2 }))), this.sendRequest(t3, s2).then(((e3) => e3.arrayBuffer().then(((t4) => [e3, t4])))).then(((e3) => {
            const s3 = e3[1].byteLength > 0 ? e3[1] : void 0, { status: n2, headers: r2 } = e3[0], i2 = {};
            r2.forEach(((e4, t4) => i2[t4] = e4.toLowerCase()));
            const a2 = { status: n2, url: t3.url, headers: i2, body: s3 };
            if (this.logger.debug("WebTransport", (() => ({ messageType: "network-response", message: a2 }))), n2 >= 400) throw q.create(a2);
            return a2;
          })).catch(((t4) => {
            const s3 = ("string" == typeof t4 ? t4 : t4.message).toLowerCase();
            let n2 = "string" == typeof t4 ? new Error(t4) : t4;
            throw s3.includes("timeout") ? this.logger.warn("WebTransport", (() => ({ messageType: "network-request", message: e2, details: "Timeout", canceled: true }))) : s3.includes("cancel") || s3.includes("abort") ? (this.logger.debug("WebTransport", (() => ({ messageType: "network-request", message: e2, details: "Aborted", canceled: true }))), n2 = new Error("Aborted"), n2.name = "AbortError") : s3.includes("network") ? this.logger.warn("WebTransport", (() => ({ messageType: "network-request", message: e2, details: "Network error", failed: true }))) : this.logger.warn("WebTransport", (() => ({ messageType: "network-request", message: e2, details: q.create(n2).message, failed: true }))), q.create(n2);
          }))))), s2];
        }
        request(e2) {
          return e2;
        }
        sendRequest(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return "fetch" === this.transport ? this.sendFetchRequest(e2, t2) : this.sendXHRRequest(e2, t2);
          }));
        }
        sendFetchRequest(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            let s2;
            const n2 = new Promise(((n3, r3) => {
              s2 = setTimeout((() => {
                clearTimeout(s2), r3(new Error("Request timeout")), t2.abort("Cancel because of timeout");
              }), 1e3 * e2.timeout);
            })), r2 = new Request(e2.url, { method: e2.method, headers: e2.headers, redirect: "follow", body: e2.body });
            return Promise.race([he.originalFetch(r2, { signal: t2.abortController.signal, credentials: "omit", cache: "no-cache" }).then(((e3) => (s2 && clearTimeout(s2), e3))), n2]);
          }));
        }
        sendXHRRequest(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return new Promise(((s2, n2) => {
              var r2;
              const i2 = new XMLHttpRequest();
              i2.open(e2.method, e2.url, true);
              let a2 = false;
              i2.responseType = "arraybuffer", i2.timeout = 1e3 * e2.timeout, t2.abortController.signal.onabort = () => {
                i2.readyState != XMLHttpRequest.DONE && i2.readyState != XMLHttpRequest.UNSENT && (a2 = true, i2.abort());
              }, Object.entries(null !== (r2 = e2.headers) && void 0 !== r2 ? r2 : {}).forEach((([e3, t3]) => i2.setRequestHeader(e3, t3))), i2.onabort = () => {
                n2(new Error("Aborted"));
              }, i2.ontimeout = () => {
                n2(new Error("Request timeout"));
              }, i2.onerror = () => {
                if (!a2) {
                  const t3 = this.transportResponseFromXHR(e2.url, i2);
                  n2(new Error(q.create(t3).message));
                }
              }, i2.onload = () => {
                const e3 = new Headers();
                i2.getAllResponseHeaders().split("\r\n").forEach(((t3) => {
                  const [s3, n3] = t3.split(": ");
                  s3.length > 1 && n3.length > 1 && e3.append(s3, n3);
                })), s2(new Response(i2.response, { status: i2.status, headers: e3, statusText: i2.statusText }));
              }, i2.send(e2.body);
            }));
          }));
        }
        webTransportRequestFromTransportRequest(e2) {
          return i(this, void 0, void 0, (function* () {
            let t2, s2 = e2.path;
            if (e2.formData && e2.formData.length > 0) {
              e2.queryParameters = {};
              const s3 = e2.body, n2 = new FormData();
              for (const { key: t3, value: s4 } of e2.formData) n2.append(t3, s4);
              try {
                const e3 = yield s3.toArrayBuffer();
                n2.append("file", new Blob([e3], { type: "application/octet-stream" }), s3.name);
              } catch (e3) {
                this.logger.warn("WebTransport", (() => ({ messageType: "error", message: e3 })));
                try {
                  const e4 = yield s3.toFileUri();
                  n2.append("file", e4, s3.name);
                } catch (e4) {
                  this.logger.error("WebTransport", (() => ({ messageType: "error", message: e4 })));
                }
              }
              t2 = n2;
            } else if (e2.body && ("string" == typeof e2.body || e2.body instanceof ArrayBuffer)) if (e2.compressible && "undefined" != typeof CompressionStream) {
              const s3 = "string" == typeof e2.body ? he.encoder.encode(e2.body) : e2.body, n2 = s3.byteLength, r2 = new ReadableStream({ start(e3) {
                e3.enqueue(s3), e3.close();
              } });
              t2 = yield new Response(r2.pipeThrough(new CompressionStream("deflate"))).arrayBuffer(), this.logger.trace("WebTransport", (() => {
                const e3 = t2.byteLength, s4 = (e3 / n2).toFixed(2);
                return { messageType: "text", message: `Body of ${n2} bytes, compressed by ${s4}x to ${e3} bytes.` };
              }));
            } else t2 = e2.body;
            return e2.queryParameters && 0 !== Object.keys(e2.queryParameters).length && (s2 = `${s2}?${T(e2.queryParameters)}`), { url: `${e2.origin}${s2}`, method: e2.method, headers: e2.headers, timeout: e2.timeout, body: t2 };
          }));
        }
        isFetchMonkeyPatched(e2) {
          return !(null != e2 ? e2 : fetch).toString().includes("[native code]") && "fetch" !== fetch.name;
        }
        transportResponseFromXHR(e2, t2) {
          const s2 = t2.getAllResponseHeaders().split("\n"), n2 = {};
          for (const e3 of s2) {
            const [t3, s3] = e3.trim().split(":");
            t3 && s3 && (n2[t3.toLowerCase()] = s3.trim());
          }
          return { status: t2.status, url: e2, headers: n2, body: t2.response };
        }
        static getOriginalFetch() {
          if ("undefined" == typeof document || !document.body) return fetch;
          let e2 = document.querySelector('iframe[name="pubnub-context-unpatched-fetch"]');
          return e2 || (e2 = document.createElement("iframe"), e2.style.display = "none", e2.name = "pubnub-context-unpatched-fetch", e2.src = "about:blank", document.body.appendChild(e2)), e2.contentWindow ? e2.contentWindow.fetch.bind(e2.contentWindow) : fetch;
        }
      }
      he.encoder = new TextEncoder(), he.decoder = new TextDecoder();
      class de {
        constructor(e2) {
          this.params = e2, this.requestIdentifier = ne.createUUID(), this._cancellationController = null;
        }
        get cancellationController() {
          return this._cancellationController;
        }
        set cancellationController(e2) {
          this._cancellationController = e2;
        }
        abort(e2) {
          this && this.cancellationController && this.cancellationController.abort(e2);
        }
        operation() {
          throw Error("Should be implemented by subclass.");
        }
        validate() {
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return this.deserializeResponse(e2);
          }));
        }
        request() {
          var e2, t2, s2, n2, r2, i2;
          const a2 = { method: null !== (t2 = null === (e2 = this.params) || void 0 === e2 ? void 0 : e2.method) && void 0 !== t2 ? t2 : ce.GET, path: this.path, queryParameters: this.queryParameters, cancellable: null !== (n2 = null === (s2 = this.params) || void 0 === s2 ? void 0 : s2.cancellable) && void 0 !== n2 && n2, compressible: null !== (i2 = null === (r2 = this.params) || void 0 === r2 ? void 0 : r2.compressible) && void 0 !== i2 && i2, timeout: 10, identifier: this.requestIdentifier }, o2 = this.headers;
          if (o2 && (a2.headers = o2), a2.method === ce.POST || a2.method === ce.PATCH) {
            const [e3, t3] = [this.body, this.formData];
            t3 && (a2.formData = t3), e3 && (a2.body = e3);
          }
          return a2;
        }
        get headers() {
          var e2, t2;
          return Object.assign({ "Accept-Encoding": "gzip, deflate" }, null !== (t2 = null === (e2 = this.params) || void 0 === e2 ? void 0 : e2.compressible) && void 0 !== t2 && t2 ? { "Content-Encoding": "deflate" } : {});
        }
        get path() {
          throw Error("`path` getter should be implemented by subclass.");
        }
        get queryParameters() {
          return {};
        }
        get formData() {
        }
        get body() {
        }
        deserializeResponse(e2) {
          const t2 = de.decoder.decode(e2.body), s2 = e2.headers["content-type"];
          let n2;
          if (!s2 || -1 === s2.indexOf("javascript") && -1 === s2.indexOf("json")) throw new d("Service response error, check status for details", g(t2, e2.status));
          try {
            n2 = JSON.parse(t2);
          } catch (s3) {
            throw console.error("Error parsing JSON response:", s3), new d("Service response error, check status for details", g(t2, e2.status));
          }
          if ("status" in n2 && "number" == typeof n2.status && n2.status >= 400) throw q.create(e2);
          return n2;
        }
      }
      de.decoder = new TextDecoder();
      var pe;
      !(function(e2) {
        e2[e2.Presence = -2] = "Presence", e2[e2.Message = -1] = "Message", e2[e2.Signal = 1] = "Signal", e2[e2.AppContext = 2] = "AppContext", e2[e2.MessageAction = 3] = "MessageAction", e2[e2.Files = 4] = "Files";
      })(pe || (pe = {}));
      class ge extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2, a2;
          super({ cancellable: true }), this.parameters = e2, null !== (t2 = (r2 = this.parameters).withPresence) && void 0 !== t2 || (r2.withPresence = false), null !== (s2 = (i2 = this.parameters).channelGroups) && void 0 !== s2 || (i2.channelGroups = []), null !== (n2 = (a2 = this.parameters).channels) && void 0 !== n2 || (a2.channels = []);
        }
        operation() {
          return K.PNSubscribeOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2, channelGroups: s2 } = this.parameters;
          return e2 ? t2 || s2 ? void 0 : "`channels` and `channelGroups` both should not be empty" : "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            let t2, s2;
            try {
              s2 = de.decoder.decode(e2.body);
              t2 = JSON.parse(s2);
            } catch (e3) {
              console.error("Error parsing JSON response:", e3);
            }
            if (!t2) throw new d("Service response error, check status for details", g(s2, e2.status));
            const n2 = t2.m.filter(((e3) => {
              const t3 = void 0 === e3.b ? e3.c : e3.b;
              return this.parameters.channels && this.parameters.channels.includes(t3) || this.parameters.channelGroups && this.parameters.channelGroups.includes(t3);
            })).map(((e3) => {
              let { e: t3 } = e3;
              null != t3 || (t3 = e3.c.endsWith("-pnpres") ? pe.Presence : pe.Message);
              const s3 = A(e3.d);
              return t3 != pe.Signal && "string" == typeof e3.d ? t3 == pe.Message ? { type: pe.Message, data: this.messageFromEnvelope(e3), pn_mfp: s3 } : { type: pe.Files, data: this.fileFromEnvelope(e3), pn_mfp: s3 } : t3 == pe.Message ? { type: pe.Message, data: this.messageFromEnvelope(e3), pn_mfp: s3 } : t3 === pe.Presence ? { type: pe.Presence, data: this.presenceEventFromEnvelope(e3), pn_mfp: s3 } : t3 == pe.Signal ? { type: pe.Signal, data: this.signalFromEnvelope(e3), pn_mfp: s3 } : t3 === pe.AppContext ? { type: pe.AppContext, data: this.appContextFromEnvelope(e3), pn_mfp: s3 } : t3 === pe.MessageAction ? { type: pe.MessageAction, data: this.messageActionFromEnvelope(e3), pn_mfp: s3 } : { type: pe.Files, data: this.fileFromEnvelope(e3), pn_mfp: s3 };
            }));
            return { cursor: { timetoken: t2.t.t, region: t2.t.r }, messages: n2 };
          }));
        }
        get headers() {
          var e2;
          return Object.assign(Object.assign({}, null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {}), { accept: "text/javascript" });
        }
        presenceEventFromEnvelope(e2) {
          var t2;
          const { d: s2 } = e2, [n2, r2] = this.subscriptionChannelFromEnvelope(e2), i2 = n2.replace("-pnpres", ""), a2 = null !== r2 ? i2 : null, o2 = null !== r2 ? r2 : i2;
          return "string" != typeof s2 && ("data" in s2 ? (s2.state = s2.data, delete s2.data) : "action" in s2 && "interval" === s2.action && (s2.hereNowRefresh = null !== (t2 = s2.here_now_refresh) && void 0 !== t2 && t2, delete s2.here_now_refresh)), Object.assign({ channel: i2, subscription: r2, actualChannel: a2, subscribedChannel: o2, timetoken: e2.p.t }, s2);
        }
        messageFromEnvelope(e2) {
          const [t2, s2] = this.subscriptionChannelFromEnvelope(e2), [n2, r2] = this.decryptedData(e2.d), i2 = { channel: t2, subscription: s2, actualChannel: null !== s2 ? t2 : null, subscribedChannel: null !== s2 ? s2 : t2, timetoken: e2.p.t, publisher: e2.i, message: n2 };
          return e2.u && (i2.userMetadata = e2.u), e2.cmt && (i2.customMessageType = e2.cmt), r2 && (i2.error = r2), i2;
        }
        signalFromEnvelope(e2) {
          const [t2, s2] = this.subscriptionChannelFromEnvelope(e2), n2 = { channel: t2, subscription: s2, timetoken: e2.p.t, publisher: e2.i, message: e2.d };
          return e2.u && (n2.userMetadata = e2.u), e2.cmt && (n2.customMessageType = e2.cmt), n2;
        }
        messageActionFromEnvelope(e2) {
          const [t2, s2] = this.subscriptionChannelFromEnvelope(e2), n2 = e2.d;
          return { channel: t2, subscription: s2, timetoken: e2.p.t, publisher: e2.i, event: n2.event, data: Object.assign(Object.assign({}, n2.data), { uuid: e2.i }) };
        }
        appContextFromEnvelope(e2) {
          const [t2, s2] = this.subscriptionChannelFromEnvelope(e2), n2 = e2.d;
          return { channel: t2, subscription: s2, timetoken: e2.p.t, message: n2 };
        }
        fileFromEnvelope(e2) {
          const [t2, s2] = this.subscriptionChannelFromEnvelope(e2), [n2, r2] = this.decryptedData(e2.d);
          let i2 = r2;
          const a2 = { channel: t2, subscription: s2, timetoken: e2.p.t, publisher: e2.i };
          return e2.u && (a2.userMetadata = e2.u), n2 ? "string" == typeof n2 ? null != i2 || (i2 = "Unexpected file information payload data type.") : (a2.message = n2.message, n2.file && (a2.file = { id: n2.file.id, name: n2.file.name, url: this.parameters.getFileUrl({ id: n2.file.id, name: n2.file.name, channel: t2 }) })) : null != i2 || (i2 = "File information payload is missing."), e2.cmt && (a2.customMessageType = e2.cmt), i2 && (a2.error = i2), a2;
        }
        subscriptionChannelFromEnvelope(e2) {
          return [e2.c, void 0 === e2.b ? e2.c : e2.b];
        }
        decryptedData(e2) {
          if (!this.parameters.crypto || "string" != typeof e2) return [e2, void 0];
          let t2, s2;
          try {
            const s3 = this.parameters.crypto.decrypt(e2);
            t2 = s3 instanceof ArrayBuffer ? JSON.parse(be.decoder.decode(s3)) : s3;
          } catch (e3) {
            t2 = null, s2 = `Error while decrypting message content: ${e3.message}`;
          }
          return [null != t2 ? t2 : e2, s2];
        }
      }
      class be extends ge {
        get path() {
          var e2;
          const { keySet: { subscribeKey: t2 }, channels: s2 } = this.parameters;
          return `/v2/subscribe/${t2}/${j(null !== (e2 = null == s2 ? void 0 : s2.sort()) && void 0 !== e2 ? e2 : [], ",")}/0`;
        }
        get queryParameters() {
          const { channelGroups: e2, filterExpression: t2, heartbeat: s2, state: n2, timetoken: r2, region: i2, onDemand: a2 } = this.parameters, o2 = {};
          return a2 && (o2["on-demand"] = 1), e2 && e2.length > 0 && (o2["channel-group"] = e2.sort().join(",")), t2 && t2.length > 0 && (o2["filter-expr"] = t2), s2 && (o2.heartbeat = s2), n2 && Object.keys(n2).length > 0 && (o2.state = JSON.stringify(n2)), void 0 !== r2 && "string" == typeof r2 ? r2.length > 0 && "0" !== r2 && (o2.tt = r2) : void 0 !== r2 && r2 > 0 && (o2.tt = r2), i2 && (o2.tr = i2), o2;
        }
      }
      class ye {
        constructor() {
          this.hasListeners = false, this.listeners = [{ count: -1, listener: {} }];
        }
        set onStatus(e2) {
          this.updateTypeOrObjectListener({ add: !!e2, listener: e2, type: "status" });
        }
        set onMessage(e2) {
          this.updateTypeOrObjectListener({ add: !!e2, listener: e2, type: "message" });
        }
        set onPresence(e2) {
          this.updateTypeOrObjectListener({ add: !!e2, listener: e2, type: "presence" });
        }
        set onSignal(e2) {
          this.updateTypeOrObjectListener({ add: !!e2, listener: e2, type: "signal" });
        }
        set onObjects(e2) {
          this.updateTypeOrObjectListener({ add: !!e2, listener: e2, type: "objects" });
        }
        set onMessageAction(e2) {
          this.updateTypeOrObjectListener({ add: !!e2, listener: e2, type: "messageAction" });
        }
        set onFile(e2) {
          this.updateTypeOrObjectListener({ add: !!e2, listener: e2, type: "file" });
        }
        handleEvent(e2) {
          if (this.hasListeners) if (e2.type === pe.Message) this.announce("message", e2.data);
          else if (e2.type === pe.Signal) this.announce("signal", e2.data);
          else if (e2.type === pe.Presence) this.announce("presence", e2.data);
          else if (e2.type === pe.AppContext) {
            const { data: t2 } = e2, { message: s2 } = t2;
            if (this.announce("objects", t2), "uuid" === s2.type) {
              const { message: e3, channel: n2 } = t2, i2 = r(t2, ["message", "channel"]), { event: a2, type: o2 } = s2, c2 = r(s2, ["event", "type"]), u2 = Object.assign(Object.assign({}, i2), { spaceId: n2, message: Object.assign(Object.assign({}, c2), { event: "set" === a2 ? "updated" : "removed", type: "user" }) });
              this.announce("user", u2);
            } else if ("channel" === s2.type) {
              const { message: e3, channel: n2 } = t2, i2 = r(t2, ["message", "channel"]), { event: a2, type: o2 } = s2, c2 = r(s2, ["event", "type"]), u2 = Object.assign(Object.assign({}, i2), { spaceId: n2, message: Object.assign(Object.assign({}, c2), { event: "set" === a2 ? "updated" : "removed", type: "space" }) });
              this.announce("space", u2);
            } else if ("membership" === s2.type) {
              const { message: e3, channel: n2 } = t2, i2 = r(t2, ["message", "channel"]), { event: a2, data: o2 } = s2, c2 = r(s2, ["event", "data"]), { uuid: u2, channel: l2 } = o2, h2 = r(o2, ["uuid", "channel"]), d2 = Object.assign(Object.assign({}, i2), { spaceId: n2, message: Object.assign(Object.assign({}, c2), { event: "set" === a2 ? "updated" : "removed", data: Object.assign(Object.assign({}, h2), { user: u2, space: l2 }) }) });
              this.announce("membership", d2);
            }
          } else e2.type === pe.MessageAction ? this.announce("messageAction", e2.data) : e2.type === pe.Files && this.announce("file", e2.data);
        }
        handleStatus(e2) {
          this.hasListeners && this.announce("status", e2);
        }
        addListener(e2) {
          this.updateTypeOrObjectListener({ add: true, listener: e2 });
        }
        removeListener(e2) {
          this.updateTypeOrObjectListener({ add: false, listener: e2 });
        }
        removeAllListeners() {
          this.listeners = [{ count: -1, listener: {} }], this.hasListeners = false;
        }
        updateTypeOrObjectListener(e2) {
          if (e2.type) "function" == typeof e2.listener ? this.listeners[0].listener[e2.type] = e2.listener : delete this.listeners[0].listener[e2.type];
          else if (e2.listener && "function" != typeof e2.listener) {
            let t2, s2 = false;
            for (t2 of this.listeners) if (t2.listener === e2.listener) {
              e2.add ? (t2.count++, s2 = true) : (t2.count--, 0 === t2.count && this.listeners.splice(this.listeners.indexOf(t2), 1));
              break;
            }
            e2.add && !s2 && this.listeners.push({ count: 1, listener: e2.listener });
          }
          this.hasListeners = this.listeners.length > 1 || Object.keys(this.listeners[0]).length > 0;
        }
        announce(e2, t2) {
          this.listeners.forEach((({ listener: s2 }) => {
            const n2 = s2[e2];
            n2 && n2(t2);
          }));
        }
      }
      class me {
        constructor(e2) {
          this.time = e2;
        }
        onReconnect(e2) {
          this.callback = e2;
        }
        startPolling() {
          this.timeTimer = setInterval((() => this.callTime()), 3e3);
        }
        stopPolling() {
          this.timeTimer && clearInterval(this.timeTimer), this.timeTimer = null;
        }
        callTime() {
          this.time(((e2) => {
            e2.error || (this.stopPolling(), this.callback && this.callback());
          }));
        }
      }
      class fe {
        constructor(e2) {
          this.config = e2, e2.logger().debug("DedupingManager", (() => ({ messageType: "object", message: { maximumCacheSize: e2.maximumCacheSize }, details: "Create with configuration:" }))), this.maximumCacheSize = e2.maximumCacheSize, this.hashHistory = [];
        }
        getKey(e2) {
          var t2;
          return `${e2.timetoken}-${this.hashCode(JSON.stringify(null !== (t2 = e2.message) && void 0 !== t2 ? t2 : "")).toString()}`;
        }
        isDuplicate(e2) {
          return this.hashHistory.includes(this.getKey(e2));
        }
        addEntry(e2) {
          this.hashHistory.length >= this.maximumCacheSize && this.hashHistory.shift(), this.hashHistory.push(this.getKey(e2));
        }
        clearHistory() {
          this.hashHistory = [];
        }
        hashCode(e2) {
          let t2 = 0;
          if (0 === e2.length) return t2;
          for (let s2 = 0; s2 < e2.length; s2 += 1) {
            t2 = (t2 << 5) - t2 + e2.charCodeAt(s2), t2 |= 0;
          }
          return t2;
        }
      }
      class ve {
        constructor(e2, t2, s2, n2, r2, i2, a2) {
          this.configuration = e2, this.emitEvent = t2, this.emitStatus = s2, this.subscribeCall = n2, this.heartbeatCall = r2, this.leaveCall = i2, this.disconnectedWhileHandledEvent = false, e2.logger().trace("SubscriptionManager", "Create manager."), this.reconnectionManager = new me(a2), this.dedupingManager = new fe(this.configuration), this.heartbeatChannelGroups = {}, this.heartbeatChannels = {}, this.presenceChannelGroups = {}, this.presenceChannels = {}, this.heartbeatTimer = null, this.presenceState = {}, this.pendingChannelGroupSubscriptions = /* @__PURE__ */ new Set(), this.pendingChannelSubscriptions = /* @__PURE__ */ new Set(), this.channelGroups = {}, this.channels = {}, this.currentTimetoken = "0", this.lastTimetoken = "0", this.storedTimetoken = null, this.referenceTimetoken = null, this.subscriptionStatusAnnounced = false, this.isOnline = true;
        }
        get subscriptionTimetoken() {
          var e2;
          return _(this.currentTimetoken, null !== (e2 = this.referenceTimetoken) && void 0 !== e2 ? e2 : "0");
        }
        get subscribedChannels() {
          return Object.keys(this.channels);
        }
        get subscribedChannelGroups() {
          return Object.keys(this.channelGroups);
        }
        get abort() {
          return this._subscribeAbort;
        }
        set abort(e2) {
          this._subscribeAbort = e2;
        }
        disconnect() {
          this.disconnectedWhileHandledEvent = true, this.stopSubscribeLoop(), this.stopHeartbeatTimer(), this.reconnectionManager.stopPolling();
        }
        reconnect(e2 = false) {
          this.startSubscribeLoop(e2), e2 || this.configuration.useSmartHeartbeat || this.startHeartbeatTimer();
        }
        subscribe(e2) {
          const { channels: t2, channelGroups: s2, timetoken: n2, withPresence: r2 = false, withHeartbeats: i2 = false } = e2;
          n2 && (this.lastTimetoken = this.currentTimetoken, this.currentTimetoken = `${n2}`), "0" !== this.currentTimetoken && (this.storedTimetoken = this.currentTimetoken, this.currentTimetoken = "0"), null == t2 || t2.forEach(((e3) => {
            this.pendingChannelSubscriptions.add(e3), this.channels[e3] = {}, r2 && (this.presenceChannels[e3] = {}), (i2 || this.configuration.getHeartbeatInterval()) && (this.heartbeatChannels[e3] = {});
          })), null == s2 || s2.forEach(((e3) => {
            this.pendingChannelGroupSubscriptions.add(e3), this.channelGroups[e3] = {}, r2 && (this.presenceChannelGroups[e3] = {}), (i2 || this.configuration.getHeartbeatInterval()) && (this.heartbeatChannelGroups[e3] = {});
          })), this.subscriptionStatusAnnounced = false, this.reconnect();
        }
        unsubscribe(e2, t2 = false) {
          let { channels: s2, channelGroups: n2 } = e2;
          const i2 = /* @__PURE__ */ new Set(), a2 = /* @__PURE__ */ new Set();
          if (null == s2 || s2.forEach(((e3) => {
            e3 in this.channels && (delete this.channels[e3], a2.add(e3), e3 in this.heartbeatChannels && delete this.heartbeatChannels[e3]), e3 in this.presenceState && delete this.presenceState[e3], e3 in this.presenceChannels && (delete this.presenceChannels[e3], a2.add(e3));
          })), null == n2 || n2.forEach(((e3) => {
            e3 in this.channelGroups && (delete this.channelGroups[e3], i2.add(e3), e3 in this.heartbeatChannelGroups && delete this.heartbeatChannelGroups[e3]), e3 in this.presenceState && delete this.presenceState[e3], e3 in this.presenceChannelGroups && (delete this.presenceChannelGroups[e3], i2.add(e3));
          })), 0 === a2.size && 0 === i2.size) return;
          const o2 = this.lastTimetoken, c2 = this.currentTimetoken;
          0 === Object.keys(this.channels).length && 0 === Object.keys(this.presenceChannels).length && 0 === Object.keys(this.channelGroups).length && 0 === Object.keys(this.presenceChannelGroups).length && (this.lastTimetoken = "0", this.currentTimetoken = "0", this.referenceTimetoken = null, this.storedTimetoken = null, this.region = null, this.reconnectionManager.stopPolling()), this.reconnect(true), false !== this.configuration.suppressLeaveEvents || t2 || (n2 = Array.from(i2), s2 = Array.from(a2), this.leaveCall({ channels: s2, channelGroups: n2 }, ((e3) => {
            const { error: t3 } = e3, i3 = r(e3, ["error"]);
            let a3;
            t3 && (e3.errorData && "object" == typeof e3.errorData && "message" in e3.errorData && "string" == typeof e3.errorData.message ? a3 = e3.errorData.message : "message" in e3 && "string" == typeof e3.message && (a3 = e3.message)), this.emitStatus(Object.assign(Object.assign({}, i3), { error: null != a3 && a3, affectedChannels: s2, affectedChannelGroups: n2, currentTimetoken: c2, lastTimetoken: o2 }));
          })));
        }
        unsubscribeAll(e2 = false) {
          this.disconnectedWhileHandledEvent = true, this.unsubscribe({ channels: this.subscribedChannels, channelGroups: this.subscribedChannelGroups }, e2);
        }
        startSubscribeLoop(e2 = false) {
          this.disconnectedWhileHandledEvent = false, this.stopSubscribeLoop();
          const t2 = [...Object.keys(this.channelGroups)], s2 = [...Object.keys(this.channels)];
          Object.keys(this.presenceChannelGroups).forEach(((e3) => t2.push(`${e3}-pnpres`))), Object.keys(this.presenceChannels).forEach(((e3) => s2.push(`${e3}-pnpres`))), 0 === s2.length && 0 === t2.length || (this.subscribeCall(Object.assign(Object.assign(Object.assign({ channels: s2, channelGroups: t2, state: this.presenceState, heartbeat: this.configuration.getPresenceTimeout(), timetoken: this.currentTimetoken }, null !== this.region ? { region: this.region } : {}), this.configuration.filterExpression ? { filterExpression: this.configuration.filterExpression } : {}), { onDemand: !this.subscriptionStatusAnnounced || e2 }), ((e3, t3) => {
            this.processSubscribeResponse(e3, t3);
          })), !e2 && this.configuration.useSmartHeartbeat && this.startHeartbeatTimer());
        }
        stopSubscribeLoop() {
          this._subscribeAbort && (this._subscribeAbort(), this._subscribeAbort = null);
        }
        processSubscribeResponse(e2, t2) {
          if (e2.error) {
            if ("object" == typeof e2.errorData && "name" in e2.errorData && "AbortError" === e2.errorData.name || e2.category === h.PNCancelledCategory) return;
            return void (e2.category === h.PNTimeoutCategory ? this.startSubscribeLoop() : e2.category === h.PNNetworkIssuesCategory || e2.category === h.PNMalformedResponseCategory ? (this.disconnect(), e2.error && this.configuration.autoNetworkDetection && this.isOnline && (this.isOnline = false, this.emitStatus({ category: h.PNNetworkDownCategory })), this.reconnectionManager.onReconnect((() => {
              this.configuration.autoNetworkDetection && !this.isOnline && (this.isOnline = true, this.emitStatus({ category: h.PNNetworkUpCategory })), this.reconnect(), this.subscriptionStatusAnnounced = true;
              const t3 = { category: h.PNReconnectedCategory, operation: e2.operation, lastTimetoken: this.lastTimetoken, currentTimetoken: this.currentTimetoken };
              this.emitStatus(t3);
            })), this.reconnectionManager.startPolling(), this.emitStatus(Object.assign(Object.assign({}, e2), { category: h.PNNetworkIssuesCategory }))) : e2.category === h.PNBadRequestCategory ? (this.stopHeartbeatTimer(), this.emitStatus(e2)) : this.emitStatus(e2));
          }
          if (this.referenceTimetoken = I(t2.cursor.timetoken, this.storedTimetoken), this.storedTimetoken ? (this.currentTimetoken = this.storedTimetoken, this.storedTimetoken = null) : (this.lastTimetoken = this.currentTimetoken, this.currentTimetoken = t2.cursor.timetoken), !this.subscriptionStatusAnnounced) {
            const t3 = { category: h.PNConnectedCategory, operation: e2.operation, affectedChannels: Array.from(this.pendingChannelSubscriptions), subscribedChannels: this.subscribedChannels, affectedChannelGroups: Array.from(this.pendingChannelGroupSubscriptions), lastTimetoken: this.lastTimetoken, currentTimetoken: this.currentTimetoken };
            this.subscriptionStatusAnnounced = true, this.emitStatus(t3), this.pendingChannelGroupSubscriptions.clear(), this.pendingChannelSubscriptions.clear();
          }
          const { messages: s2 } = t2, { requestMessageCountThreshold: n2, dedupeOnSubscribe: r2 } = this.configuration;
          n2 && s2.length >= n2 && this.emitStatus({ category: h.PNRequestMessageCountExceededCategory, operation: e2.operation });
          try {
            const e3 = { timetoken: this.currentTimetoken, region: this.region ? this.region : void 0 };
            this.configuration.logger().debug("SubscriptionManager", (() => ({ messageType: "object", message: s2.map(((e4) => ({ type: e4.type, data: Object.assign(Object.assign({}, e4.data), { pn_mfp: e4.pn_mfp }) }))), details: "Received events:" }))), s2.forEach(((t3) => {
              if (r2 && "message" in t3.data && "timetoken" in t3.data) {
                if (this.dedupingManager.isDuplicate(t3.data)) return void this.configuration.logger().warn("SubscriptionManager", (() => ({ messageType: "object", message: t3.data, details: "Duplicate message detected (skipped):" })));
                this.dedupingManager.addEntry(t3.data);
              }
              this.emitEvent(e3, t3);
            }));
          } catch (e3) {
            const t3 = { error: true, category: h.PNUnknownCategory, errorData: e3, statusCode: 0 };
            this.emitStatus(t3);
          }
          this.region = t2.cursor.region, this.disconnectedWhileHandledEvent ? this.disconnectedWhileHandledEvent = false : this.startSubscribeLoop();
        }
        setState(e2) {
          const { state: t2, channels: s2, channelGroups: n2 } = e2;
          null == s2 || s2.forEach(((e3) => e3 in this.channels && (this.presenceState[e3] = t2))), null == n2 || n2.forEach(((e3) => e3 in this.channelGroups && (this.presenceState[e3] = t2)));
        }
        changePresence(e2) {
          const { connected: t2, channels: s2, channelGroups: n2 } = e2;
          t2 ? (null == s2 || s2.forEach(((e3) => this.heartbeatChannels[e3] = {})), null == n2 || n2.forEach(((e3) => this.heartbeatChannelGroups[e3] = {}))) : (null == s2 || s2.forEach(((e3) => {
            e3 in this.heartbeatChannels && delete this.heartbeatChannels[e3];
          })), null == n2 || n2.forEach(((e3) => {
            e3 in this.heartbeatChannelGroups && delete this.heartbeatChannelGroups[e3];
          })), false === this.configuration.suppressLeaveEvents && this.leaveCall({ channels: s2, channelGroups: n2 }, ((e3) => this.emitStatus(e3)))), this.reconnect();
        }
        startHeartbeatTimer() {
          this.stopHeartbeatTimer();
          const e2 = this.configuration.getHeartbeatInterval();
          e2 && 0 !== e2 && (this.configuration.useSmartHeartbeat || this.sendHeartbeat(), this.heartbeatTimer = setInterval((() => this.sendHeartbeat()), 1e3 * e2));
        }
        stopHeartbeatTimer() {
          this.heartbeatTimer && (clearInterval(this.heartbeatTimer), this.heartbeatTimer = null);
        }
        sendHeartbeat() {
          const e2 = Object.keys(this.heartbeatChannelGroups), t2 = Object.keys(this.heartbeatChannels);
          0 === t2.length && 0 === e2.length || this.heartbeatCall({ channels: t2, channelGroups: e2, heartbeat: this.configuration.getPresenceTimeout(), state: this.presenceState }, ((e3) => {
            e3.error && this.configuration.announceFailedHeartbeats && this.emitStatus(e3), e3.error && this.configuration.autoNetworkDetection && this.isOnline && (this.isOnline = false, this.disconnect(), this.emitStatus({ category: h.PNNetworkDownCategory }), this.reconnect()), !e3.error && this.configuration.announceSuccessfulHeartbeats && this.emitStatus(e3);
          }));
        }
      }
      class Se {
        constructor(e2, t2, s2) {
          this._payload = e2, this.setDefaultPayloadStructure(), this.title = t2, this.body = s2;
        }
        get payload() {
          return this._payload;
        }
        set title(e2) {
          this._title = e2;
        }
        set subtitle(e2) {
          this._subtitle = e2;
        }
        set body(e2) {
          this._body = e2;
        }
        set badge(e2) {
          this._badge = e2;
        }
        set sound(e2) {
          this._sound = e2;
        }
        setDefaultPayloadStructure() {
        }
        toObject() {
          return {};
        }
      }
      class we extends Se {
        constructor() {
          super(...arguments), this._apnsPushType = "apns", this._isSilent = false;
        }
        get payload() {
          return this._payload;
        }
        set configurations(e2) {
          e2 && e2.length && (this._configurations = e2);
        }
        get notification() {
          return this.payload.aps;
        }
        get title() {
          return this._title;
        }
        set title(e2) {
          e2 && e2.length && (this.payload.aps.alert.title = e2, this._title = e2);
        }
        get subtitle() {
          return this._subtitle;
        }
        set subtitle(e2) {
          e2 && e2.length && (this.payload.aps.alert.subtitle = e2, this._subtitle = e2);
        }
        get body() {
          return this._body;
        }
        set body(e2) {
          e2 && e2.length && (this.payload.aps.alert.body = e2, this._body = e2);
        }
        get badge() {
          return this._badge;
        }
        set badge(e2) {
          null != e2 && (this.payload.aps.badge = e2, this._badge = e2);
        }
        get sound() {
          return this._sound;
        }
        set sound(e2) {
          e2 && e2.length && (this.payload.aps.sound = e2, this._sound = e2);
        }
        set silent(e2) {
          this._isSilent = e2;
        }
        setDefaultPayloadStructure() {
          this.payload.aps = { alert: {} };
        }
        toObject() {
          const e2 = Object.assign({}, this.payload), { aps: t2 } = e2;
          let { alert: s2 } = t2;
          if (this._isSilent && (t2["content-available"] = 1), "apns2" === this._apnsPushType) {
            if (!this._configurations || !this._configurations.length) throw new ReferenceError("APNS2 configuration is missing");
            const t3 = [];
            this._configurations.forEach(((e3) => {
              t3.push(this.objectFromAPNS2Configuration(e3));
            })), t3.length && (e2.pn_push = t3);
          }
          return s2 && Object.keys(s2).length || delete t2.alert, this._isSilent && (delete t2.alert, delete t2.badge, delete t2.sound, s2 = {}), this._isSilent || s2 && Object.keys(s2).length ? e2 : null;
        }
        objectFromAPNS2Configuration(e2) {
          if (!e2.targets || !e2.targets.length) throw new ReferenceError("At least one APNS2 target should be provided");
          const { collapseId: t2, expirationDate: s2 } = e2, n2 = { auth_method: "token", targets: e2.targets.map(((e3) => this.objectFromAPNSTarget(e3))), version: "v2" };
          return t2 && t2.length && (n2.collapse_id = t2), s2 && (n2.expiration = s2.toISOString()), n2;
        }
        objectFromAPNSTarget(e2) {
          if (!e2.topic || !e2.topic.length) throw new TypeError("Target 'topic' undefined.");
          const { topic: t2, environment: s2 = "development", excludedDevices: n2 = [] } = e2, r2 = { topic: t2, environment: s2 };
          return n2.length && (r2.excluded_devices = n2), r2;
        }
      }
      class Oe extends Se {
        get payload() {
          return this._payload;
        }
        get notification() {
          return this.payload.notification;
        }
        get data() {
          return this.payload.data;
        }
        get androidNotification() {
          var e2;
          return null === (e2 = this.payload.android) || void 0 === e2 ? void 0 : e2.notification;
        }
        get title() {
          return this._title;
        }
        set title(e2) {
          e2 && e2.length && (this.payload.notification.title = e2, this.androidNotification.title = e2, this._title = e2);
        }
        get body() {
          return this._body;
        }
        set body(e2) {
          e2 && e2.length && (this.payload.notification.body = e2, this.androidNotification.body = e2, this._body = e2);
        }
        get badge() {
          return this._badge;
        }
        set badge(e2) {
          null != e2 && (this.androidNotification.notification_count = e2, this._badge = e2);
        }
        get sound() {
          return this._sound;
        }
        set sound(e2) {
          e2 && e2.length && (this.androidNotification.sound = e2, this._sound = e2);
        }
        get icon() {
          return this._icon;
        }
        set icon(e2) {
          e2 && e2.length && (this.androidNotification.icon = e2, this._icon = e2);
        }
        get tag() {
          return this._tag;
        }
        set tag(e2) {
          e2 && e2.length && (this.androidNotification.tag = e2, this._tag = e2);
        }
        set silent(e2) {
          this._isSilent = e2;
        }
        setDefaultPayloadStructure() {
          this.payload.notification = {}, this.payload.data = {}, this.payload.android = { notification: {} };
        }
        toObject() {
          var e2, t2;
          const s2 = {}, n2 = Object.assign({}, this.payload.notification), i2 = Object.assign({}, this.payload.android), a2 = r(Object.assign({}, null !== (e2 = i2.notification) && void 0 !== e2 ? e2 : {}), ["title", "body"]);
          if (this._isSilent) {
            const e3 = {};
            this._title && (e3.title = this._title), this._body && (e3.body = this._body);
            for (const [t3, s3] of Object.entries(a2)) null != s3 && (e3[t3] = String(s3));
            this.payload.data && Object.assign(e3, this.payload.data), Object.keys(e3).length && (s2.data = e3), delete i2.notification, Object.keys(i2).length && (s2.android = i2);
          } else if (Object.keys(n2).length && (s2.notification = n2), this.payload.data && Object.keys(this.payload.data).length && (s2.data = Object.assign({}, this.payload.data)), Object.keys(a2).length) {
            const e3 = r(i2, ["notification"]);
            s2.android = Object.assign(Object.assign({}, e3), { notification: a2 });
          } else {
            const e3 = r(i2, ["notification"]);
            Object.keys(e3).length && (s2.android = e3);
          }
          const o2 = r(this.payload, ["notification", "android", "data", "pn_exceptions"]);
          return Object.assign(s2, o2), (null === (t2 = this.payload.pn_exceptions) || void 0 === t2 ? void 0 : t2.length) && (s2.pn_exceptions = this.payload.pn_exceptions), Object.keys(s2).length ? s2 : null;
        }
      }
      class ke {
        constructor(e2, t2) {
          this._payload = { apns: {}, fcm: {} }, this._title = e2, this._body = t2, this.apns = new we(this._payload.apns, e2, t2), this.fcm = new Oe(this._payload.fcm, e2, t2);
        }
        set debugging(e2) {
          this._debugging = e2;
        }
        get title() {
          return this._title;
        }
        get subtitle() {
          return this._subtitle;
        }
        set subtitle(e2) {
          this._subtitle = e2, this.apns.subtitle = e2, this.fcm.subtitle = e2;
        }
        get body() {
          return this._body;
        }
        get badge() {
          return this._badge;
        }
        set badge(e2) {
          this._badge = e2, this.apns.badge = e2, this.fcm.badge = e2;
        }
        get sound() {
          return this._sound;
        }
        set sound(e2) {
          this._sound = e2, this.apns.sound = e2, this.fcm.sound = e2;
        }
        buildPayload(e2) {
          const t2 = {};
          if (e2.includes("apns") || e2.includes("apns2")) {
            this.apns._apnsPushType = e2.includes("apns") ? "apns" : "apns2";
            const s2 = this.apns.toObject();
            s2 && Object.keys(s2).length && (t2.pn_apns = s2);
          }
          if (e2.includes("fcm")) {
            const e3 = this.fcm.toObject();
            e3 && Object.keys(e3).length && (t2.pn_fcm = e3);
          }
          return Object.keys(t2).length && this._debugging && (t2.pn_debug = true), t2;
        }
      }
      class Ce {
        constructor(e2 = false) {
          this.sync = e2, this.listeners = /* @__PURE__ */ new Set();
        }
        subscribe(e2) {
          return this.listeners.add(e2), () => {
            this.listeners.delete(e2);
          };
        }
        notify(e2) {
          const t2 = () => {
            this.listeners.forEach(((t3) => {
              t3(e2);
            }));
          };
          this.sync ? t2() : setTimeout(t2, 0);
        }
      }
      class Pe {
        transition(e2, t2) {
          var s2;
          if (this.transitionMap.has(t2.type)) return null === (s2 = this.transitionMap.get(t2.type)) || void 0 === s2 ? void 0 : s2(e2, t2);
        }
        constructor(e2) {
          this.label = e2, this.transitionMap = /* @__PURE__ */ new Map(), this.enterEffects = [], this.exitEffects = [];
        }
        on(e2, t2) {
          return this.transitionMap.set(e2, t2), this;
        }
        with(e2, t2) {
          return [this, e2, null != t2 ? t2 : []];
        }
        onEnter(e2) {
          return this.enterEffects.push(e2), this;
        }
        onExit(e2) {
          return this.exitEffects.push(e2), this;
        }
      }
      class je extends Ce {
        constructor(e2) {
          super(true), this.logger = e2, this._pendingEvents = [], this._inTransition = false;
        }
        get currentState() {
          return this._currentState;
        }
        get currentContext() {
          return this._currentContext;
        }
        describe(e2) {
          return new Pe(e2);
        }
        start(e2, t2) {
          this._currentState = e2, this._currentContext = t2, this.notify({ type: "engineStarted", state: e2, context: t2 });
        }
        transition(e2) {
          if (!this._currentState) throw this.logger.error("Engine", "Finite state machine is not started"), new Error("Start the engine first");
          if (this._inTransition) return this.logger.trace("Engine", (() => ({ messageType: "object", message: e2, details: "Event engine in transition. Enqueue received event:" }))), void this._pendingEvents.push(e2);
          this._inTransition = true, this.logger.trace("Engine", (() => ({ messageType: "object", message: e2, details: "Event engine received event:" }))), this.notify({ type: "eventReceived", event: e2 });
          const t2 = this._currentState.transition(this._currentContext, e2);
          if (t2) {
            const [s2, n2, r2] = t2;
            this.logger.trace("Engine", `Exiting state: ${this._currentState.label}`);
            for (const e3 of this._currentState.exitEffects) this.notify({ type: "invocationDispatched", invocation: e3(this._currentContext) });
            this.logger.trace("Engine", (() => ({ messageType: "object", details: `Entering '${s2.label}' state with context:`, message: n2 })));
            const i2 = this._currentState;
            this._currentState = s2;
            const a2 = this._currentContext;
            this._currentContext = n2, this.notify({ type: "transitionDone", fromState: i2, fromContext: a2, toState: s2, toContext: n2, event: e2 });
            for (const e3 of r2) this.notify({ type: "invocationDispatched", invocation: e3 });
            for (const e3 of this._currentState.enterEffects) this.notify({ type: "invocationDispatched", invocation: e3(this._currentContext) });
          } else this.logger.warn("Engine", `No transition from '${this._currentState.label}' found for event: ${e2.type}`);
          if (this._inTransition = false, this._pendingEvents.length > 0) {
            const e3 = this._pendingEvents.shift();
            e3 && (this.logger.trace("Engine", (() => ({ messageType: "object", message: e3, details: "De-queueing pending event:" }))), this.transition(e3));
          }
        }
      }
      class Ee {
        constructor(e2, t2) {
          this.dependencies = e2, this.logger = t2, this.instances = /* @__PURE__ */ new Map(), this.handlers = /* @__PURE__ */ new Map();
        }
        on(e2, t2) {
          this.handlers.set(e2, t2);
        }
        dispatch(e2) {
          if (this.logger.trace("Dispatcher", `Process invocation: ${e2.type}`), "CANCEL" === e2.type) {
            if (this.instances.has(e2.payload)) {
              const t3 = this.instances.get(e2.payload);
              null == t3 || t3.cancel(), this.instances.delete(e2.payload);
            }
            return;
          }
          const t2 = this.handlers.get(e2.type);
          if (!t2) throw this.logger.error("Dispatcher", `Unhandled invocation '${e2.type}'`), new Error(`Unhandled invocation '${e2.type}'`);
          const s2 = t2(e2.payload, this.dependencies);
          this.logger.trace("Dispatcher", (() => ({ messageType: "object", details: "Call invocation handler with parameters:", message: e2.payload, ignoredKeys: ["abortSignal"] }))), e2.managed && this.instances.set(e2.type, s2), s2.start();
        }
        dispose() {
          for (const [e2, t2] of this.instances.entries()) t2.cancel(), this.instances.delete(e2);
        }
      }
      function Ne(e2, t2) {
        const s2 = function(...s3) {
          return { type: e2, payload: null == t2 ? void 0 : t2(...s3) };
        };
        return s2.type = e2, s2;
      }
      function Te(e2, t2) {
        const s2 = (...s3) => ({ type: e2, payload: t2(...s3), managed: false });
        return s2.type = e2, s2;
      }
      function _e(e2, t2) {
        const s2 = (...s3) => ({ type: e2, payload: t2(...s3), managed: true });
        return s2.type = e2, s2.cancel = { type: "CANCEL", payload: e2, managed: false }, s2;
      }
      class Ie extends Error {
        constructor() {
          super("The operation was aborted."), this.name = "AbortError", Object.setPrototypeOf(this, new.target.prototype);
        }
      }
      class Me extends Ce {
        constructor() {
          super(...arguments), this._aborted = false;
        }
        get aborted() {
          return this._aborted;
        }
        throwIfAborted() {
          if (this._aborted) throw new Ie();
        }
        abort() {
          this._aborted = true, this.notify(new Ie());
        }
      }
      class Ae {
        constructor(e2, t2) {
          this.payload = e2, this.dependencies = t2;
        }
      }
      class Ue extends Ae {
        constructor(e2, t2, s2) {
          super(e2, t2), this.asyncFunction = s2, this.abortSignal = new Me();
        }
        start() {
          this.asyncFunction(this.payload, this.abortSignal, this.dependencies).catch(((e2) => {
          }));
        }
        cancel() {
          this.abortSignal.abort();
        }
      }
      const De = (e2) => (t2, s2) => new Ue(t2, s2, e2), Re = _e("HEARTBEAT", ((e2, t2) => ({ channels: e2, groups: t2 }))), $e = Te("LEAVE", ((e2, t2) => ({ channels: e2, groups: t2 }))), Fe = Te("EMIT_STATUS", ((e2) => e2)), xe = _e("WAIT", (() => ({}))), Le = Ne("RECONNECT", (() => ({}))), qe = Ne("DISCONNECT", ((e2 = false) => ({ isOffline: e2 }))), Ge = Ne("JOINED", ((e2, t2) => ({ channels: e2, groups: t2 }))), Ke = Ne("LEFT", ((e2, t2) => ({ channels: e2, groups: t2 }))), He = Ne("LEFT_ALL", ((e2 = false) => ({ isOffline: e2 }))), Be = Ne("HEARTBEAT_SUCCESS", ((e2) => ({ statusCode: e2 }))), We = Ne("HEARTBEAT_FAILURE", ((e2) => e2)), Ve = Ne("TIMES_UP", (() => ({})));
      class ze extends Ee {
        constructor(e2, t2) {
          super(t2, t2.config.logger()), this.on(Re.type, De(((t3, s2, n2) => i(this, [t3, s2, n2], void 0, (function* (t4, s3, { heartbeat: n3, presenceState: r2, config: i2 }) {
            s3.throwIfAborted();
            try {
              yield n3(Object.assign(Object.assign({ abortSignal: s3, channels: t4.channels, channelGroups: t4.groups }, i2.maintainPresenceState && { state: r2 }), { heartbeat: i2.presenceTimeout }));
              e2.transition(Be(200));
            } catch (t5) {
              if (t5 instanceof d) {
                if (t5.status && t5.status.category == h.PNCancelledCategory) return;
                e2.transition(We(t5));
              }
            }
          }))))), this.on($e.type, De(((e3, t3, s2) => i(this, [e3, t3, s2], void 0, (function* (e4, t4, { leave: s3, config: n2 }) {
            if (!n2.suppressLeaveEvents) try {
              s3({ channels: e4.channels, channelGroups: e4.groups });
            } catch (e5) {
            }
          }))))), this.on(xe.type, De(((t3, s2, n2) => i(this, [t3, s2, n2], void 0, (function* (t4, s3, { heartbeatDelay: n3 }) {
            return s3.throwIfAborted(), yield n3(), s3.throwIfAborted(), e2.transition(Ve());
          }))))), this.on(Fe.type, De(((e3, t3, s2) => i(this, [e3, t3, s2], void 0, (function* (e4, t4, { emitStatus: s3, config: n2 }) {
            n2.announceFailedHeartbeats && true === (null == e4 ? void 0 : e4.error) ? s3(Object.assign(Object.assign({}, e4), { operation: K.PNHeartbeatOperation })) : n2.announceSuccessfulHeartbeats && 200 === e4.statusCode && s3(Object.assign(Object.assign({}, e4), { error: false, operation: K.PNHeartbeatOperation, category: h.PNAcknowledgmentCategory }));
          })))));
        }
      }
      const Je = new Pe("HEARTBEAT_STOPPED");
      Je.on(Ge.type, ((e2, t2) => Je.with({ channels: [...e2.channels, ...t2.payload.channels.filter(((t3) => !e2.channels.includes(t3)))], groups: [...e2.groups, ...t2.payload.groups.filter(((t3) => !e2.groups.includes(t3)))] }))), Je.on(Ke.type, ((e2, t2) => Je.with({ channels: e2.channels.filter(((e3) => !t2.payload.channels.includes(e3))), groups: e2.groups.filter(((e3) => !t2.payload.groups.includes(e3))) }))), Je.on(Le.type, ((e2, t2) => Ye.with({ channels: e2.channels, groups: e2.groups }))), Je.on(He.type, ((e2, t2) => Ze.with(void 0)));
      const Xe = new Pe("HEARTBEAT_COOLDOWN");
      Xe.onEnter((() => xe())), Xe.onExit((() => xe.cancel)), Xe.on(Ve.type, ((e2, t2) => Ye.with({ channels: e2.channels, groups: e2.groups }))), Xe.on(Ge.type, ((e2, t2) => Ye.with({ channels: [...e2.channels, ...t2.payload.channels.filter(((t3) => !e2.channels.includes(t3)))], groups: [...e2.groups, ...t2.payload.groups.filter(((t3) => !e2.groups.includes(t3)))] }))), Xe.on(Ke.type, ((e2, t2) => Ye.with({ channels: e2.channels.filter(((e3) => !t2.payload.channels.includes(e3))), groups: e2.groups.filter(((e3) => !t2.payload.groups.includes(e3))) }, [$e(t2.payload.channels, t2.payload.groups)]))), Xe.on(qe.type, ((e2, t2) => Je.with({ channels: e2.channels, groups: e2.groups }, [...t2.payload.isOffline ? [] : [$e(e2.channels, e2.groups)]]))), Xe.on(He.type, ((e2, t2) => Ze.with(void 0, [...t2.payload.isOffline ? [] : [$e(e2.channels, e2.groups)]])));
      const Qe = new Pe("HEARTBEAT_FAILED");
      Qe.on(Ge.type, ((e2, t2) => Ye.with({ channels: [...e2.channels, ...t2.payload.channels.filter(((t3) => !e2.channels.includes(t3)))], groups: [...e2.groups, ...t2.payload.groups.filter(((t3) => !e2.groups.includes(t3)))] }))), Qe.on(Ke.type, ((e2, t2) => Ye.with({ channels: e2.channels.filter(((e3) => !t2.payload.channels.includes(e3))), groups: e2.groups.filter(((e3) => !t2.payload.groups.includes(e3))) }, [$e(t2.payload.channels, t2.payload.groups)]))), Qe.on(Le.type, ((e2, t2) => Ye.with({ channels: e2.channels, groups: e2.groups }))), Qe.on(qe.type, ((e2, t2) => Je.with({ channels: e2.channels, groups: e2.groups }, [...t2.payload.isOffline ? [] : [$e(e2.channels, e2.groups)]]))), Qe.on(He.type, ((e2, t2) => Ze.with(void 0, [...t2.payload.isOffline ? [] : [$e(e2.channels, e2.groups)]])));
      const Ye = new Pe("HEARTBEATING");
      Ye.onEnter(((e2) => Re(e2.channels, e2.groups))), Ye.onExit((() => Re.cancel)), Ye.on(Be.type, ((e2, t2) => Xe.with({ channels: e2.channels, groups: e2.groups }, [Fe(Object.assign({}, t2.payload))]))), Ye.on(Ge.type, ((e2, t2) => Ye.with({ channels: [...e2.channels, ...t2.payload.channels.filter(((t3) => !e2.channels.includes(t3)))], groups: [...e2.groups, ...t2.payload.groups.filter(((t3) => !e2.groups.includes(t3)))] }))), Ye.on(Ke.type, ((e2, t2) => Ye.with({ channels: e2.channels.filter(((e3) => !t2.payload.channels.includes(e3))), groups: e2.groups.filter(((e3) => !t2.payload.groups.includes(e3))) }, [$e(t2.payload.channels, t2.payload.groups)]))), Ye.on(We.type, ((e2, t2) => Qe.with(Object.assign({}, e2), [...t2.payload.status ? [Fe(Object.assign({}, t2.payload.status))] : []]))), Ye.on(qe.type, ((e2, t2) => Je.with({ channels: e2.channels, groups: e2.groups }, [...t2.payload.isOffline ? [] : [$e(e2.channels, e2.groups)]]))), Ye.on(He.type, ((e2, t2) => Ze.with(void 0, [...t2.payload.isOffline ? [] : [$e(e2.channels, e2.groups)]])));
      const Ze = new Pe("HEARTBEAT_INACTIVE");
      Ze.on(Ge.type, ((e2, t2) => Ye.with({ channels: t2.payload.channels, groups: t2.payload.groups })));
      class et {
        get _engine() {
          return this.engine;
        }
        constructor(e2) {
          this.dependencies = e2, this.channels = [], this.groups = [], this.engine = new je(e2.config.logger()), this.dispatcher = new ze(this.engine, e2), e2.config.logger().debug("PresenceEventEngine", "Create presence event engine."), this._unsubscribeEngine = this.engine.subscribe(((e3) => {
            "invocationDispatched" === e3.type && this.dispatcher.dispatch(e3.invocation);
          })), this.engine.start(Ze, void 0);
        }
        join({ channels: e2, groups: t2 }) {
          this.channels = [...this.channels, ...(null != e2 ? e2 : []).filter(((e3) => !this.channels.includes(e3)))], this.groups = [...this.groups, ...(null != t2 ? t2 : []).filter(((e3) => !this.groups.includes(e3)))], 0 === this.channels.length && 0 === this.groups.length || this.engine.transition(Ge(this.channels.slice(0), this.groups.slice(0)));
        }
        leave({ channels: e2, groups: t2 }) {
          e2 && (this.channels = this.channels.filter(((t3) => !e2.includes(t3)))), t2 && (this.groups = this.groups.filter(((e3) => !t2.includes(e3)))), this.dependencies.presenceState && (null == e2 || e2.forEach(((e3) => delete this.dependencies.presenceState[e3])), null == t2 || t2.forEach(((e3) => delete this.dependencies.presenceState[e3]))), this.engine.transition(Ke(null != e2 ? e2 : [], null != t2 ? t2 : []));
        }
        leaveAll(e2 = false) {
          this.dependencies.presenceState && (this.channels.forEach(((e3) => delete this.dependencies.presenceState[e3])), this.groups.forEach(((e3) => delete this.dependencies.presenceState[e3]))), this.channels = [], this.groups = [], this.engine.transition(He(e2));
        }
        reconnect() {
          this.engine.transition(Le());
        }
        disconnect(e2 = false) {
          this.engine.transition(qe(e2));
        }
        dispose() {
          this.disconnect(true), this._unsubscribeEngine(), this.dispatcher.dispose();
        }
      }
      const tt = _e("HANDSHAKE", ((e2, t2, s2) => ({ channels: e2, groups: t2, onDemand: s2 }))), st = _e("RECEIVE_MESSAGES", ((e2, t2, s2, n2) => ({ channels: e2, groups: t2, cursor: s2, onDemand: n2 }))), nt = Te("EMIT_MESSAGES", ((e2, t2) => ({ cursor: e2, events: t2 }))), rt = Te("EMIT_STATUS", ((e2) => e2)), it = Ne("SUBSCRIPTION_CHANGED", ((e2, t2, s2 = false) => ({ channels: e2, groups: t2, isOffline: s2 }))), at = Ne("SUBSCRIPTION_RESTORED", ((e2, t2, s2, n2) => ({ channels: e2, groups: t2, cursor: { timetoken: s2, region: null != n2 ? n2 : 0 } }))), ot = Ne("HANDSHAKE_SUCCESS", ((e2) => e2)), ct = Ne("HANDSHAKE_FAILURE", ((e2) => e2)), ut = Ne("RECEIVE_SUCCESS", ((e2, t2) => ({ cursor: e2, events: t2 }))), lt = Ne("RECEIVE_FAILURE", ((e2) => e2)), ht = Ne("DISCONNECT", ((e2 = false) => ({ isOffline: e2 }))), dt = Ne("RECONNECT", ((e2, t2) => ({ cursor: { timetoken: null != e2 ? e2 : "", region: null != t2 ? t2 : 0 } }))), pt = Ne("UNSUBSCRIBE_ALL", (() => ({}))), gt = new Pe("UNSUBSCRIBED");
      gt.on(it.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, onDemand: true }))), gt.on(at.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, cursor: { timetoken: `${t2.cursor.timetoken}`, region: t2.cursor.region }, onDemand: true })));
      const bt = new Pe("HANDSHAKE_STOPPED");
      bt.on(it.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : bt.with({ channels: t2.channels, groups: t2.groups, cursor: e2.cursor }))), bt.on(dt.type, ((e2, { payload: t2 }) => mt.with(Object.assign(Object.assign({}, e2), { cursor: t2.cursor || e2.cursor, onDemand: true })))), bt.on(at.type, ((e2, { payload: t2 }) => {
        var s2;
        return 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : bt.with({ channels: t2.channels, groups: t2.groups, cursor: { timetoken: `${t2.cursor.timetoken}`, region: t2.cursor.region || (null === (s2 = e2.cursor) || void 0 === s2 ? void 0 : s2.region) || 0 } });
      })), bt.on(pt.type, ((e2) => gt.with()));
      const yt = new Pe("HANDSHAKE_FAILED");
      yt.on(it.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, cursor: e2.cursor, onDemand: true }))), yt.on(dt.type, ((e2, { payload: t2 }) => mt.with(Object.assign(Object.assign({}, e2), { cursor: t2.cursor || e2.cursor, onDemand: true })))), yt.on(at.type, ((e2, { payload: t2 }) => {
        var s2, n2;
        return 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, cursor: { timetoken: `${t2.cursor.timetoken}`, region: t2.cursor.region ? t2.cursor.region : null !== (n2 = null === (s2 = null == e2 ? void 0 : e2.cursor) || void 0 === s2 ? void 0 : s2.region) && void 0 !== n2 ? n2 : 0 }, onDemand: true });
      })), yt.on(pt.type, ((e2) => gt.with()));
      const mt = new Pe("HANDSHAKING");
      mt.onEnter(((e2) => {
        var t2;
        return tt(e2.channels, e2.groups, null !== (t2 = e2.onDemand) && void 0 !== t2 && t2);
      })), mt.onExit((() => tt.cancel)), mt.on(it.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, cursor: e2.cursor, onDemand: true }))), mt.on(ot.type, ((e2, { payload: t2 }) => {
        var s2, n2, r2, i2, a2;
        return St.with({ channels: e2.channels, groups: e2.groups, cursor: { timetoken: (null === (s2 = e2.cursor) || void 0 === s2 ? void 0 : s2.timetoken) ? null === (n2 = e2.cursor) || void 0 === n2 ? void 0 : n2.timetoken : t2.timetoken, region: t2.region }, referenceTimetoken: I(t2.timetoken, null === (r2 = e2.cursor) || void 0 === r2 ? void 0 : r2.timetoken) }, [rt({ category: h.PNConnectedCategory, affectedChannels: e2.channels.slice(0), affectedChannelGroups: e2.groups.slice(0), operation: K.PNSubscribeOperation, currentTimetoken: (null === (i2 = e2.cursor) || void 0 === i2 ? void 0 : i2.timetoken) ? null === (a2 = e2.cursor) || void 0 === a2 ? void 0 : a2.timetoken : t2.timetoken })]);
      })), mt.on(ct.type, ((e2, t2) => {
        var s2;
        return yt.with(Object.assign(Object.assign({}, e2), { reason: t2.payload }), [rt({ category: h.PNConnectionErrorCategory, error: null === (s2 = t2.payload.status) || void 0 === s2 ? void 0 : s2.category })]);
      })), mt.on(ht.type, ((e2, t2) => {
        var s2;
        if (t2.payload.isOffline) {
          const t3 = q.create(new Error("Network connection error")).toPubNubError(K.PNSubscribeOperation);
          return yt.with(Object.assign(Object.assign({}, e2), { reason: t3 }), [rt({ category: h.PNConnectionErrorCategory, error: null === (s2 = t3.status) || void 0 === s2 ? void 0 : s2.category })]);
        }
        return bt.with(Object.assign({}, e2));
      })), mt.on(at.type, ((e2, { payload: t2 }) => {
        var s2;
        return 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, cursor: { timetoken: `${t2.cursor.timetoken}`, region: t2.cursor.region || (null === (s2 = null == e2 ? void 0 : e2.cursor) || void 0 === s2 ? void 0 : s2.region) || 0 }, onDemand: true });
      })), mt.on(pt.type, ((e2) => gt.with()));
      const ft = new Pe("RECEIVE_STOPPED");
      ft.on(it.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : ft.with({ channels: t2.channels, groups: t2.groups, cursor: e2.cursor }))), ft.on(at.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : ft.with({ channels: t2.channels, groups: t2.groups, cursor: { timetoken: `${t2.cursor.timetoken}`, region: t2.cursor.region || e2.cursor.region } }))), ft.on(dt.type, ((e2, { payload: t2 }) => {
        var s2;
        return mt.with({ channels: e2.channels, groups: e2.groups, cursor: { timetoken: t2.cursor.timetoken ? null === (s2 = t2.cursor) || void 0 === s2 ? void 0 : s2.timetoken : e2.cursor.timetoken, region: t2.cursor.region || e2.cursor.region }, onDemand: true });
      })), ft.on(pt.type, (() => gt.with(void 0)));
      const vt = new Pe("RECEIVE_FAILED");
      vt.on(dt.type, ((e2, { payload: t2 }) => {
        var s2;
        return mt.with({ channels: e2.channels, groups: e2.groups, cursor: { timetoken: t2.cursor.timetoken ? null === (s2 = t2.cursor) || void 0 === s2 ? void 0 : s2.timetoken : e2.cursor.timetoken, region: t2.cursor.region || e2.cursor.region }, onDemand: true });
      })), vt.on(it.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, cursor: e2.cursor, onDemand: true }))), vt.on(at.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0) : mt.with({ channels: t2.channels, groups: t2.groups, cursor: { timetoken: `${t2.cursor.timetoken}`, region: t2.cursor.region || e2.cursor.region }, onDemand: true }))), vt.on(pt.type, ((e2) => gt.with(void 0)));
      const St = new Pe("RECEIVING");
      St.onEnter(((e2) => {
        var t2;
        return st(e2.channels, e2.groups, e2.cursor, null !== (t2 = e2.onDemand) && void 0 !== t2 && t2);
      })), St.onExit((() => st.cancel)), St.on(ut.type, ((e2, { payload: t2 }) => St.with({ channels: e2.channels, groups: e2.groups, cursor: t2.cursor, referenceTimetoken: I(t2.cursor.timetoken) }, [nt(e2.cursor, t2.events)]))), St.on(it.type, ((e2, { payload: t2 }) => {
        var s2;
        if (0 === t2.channels.length && 0 === t2.groups.length) {
          let e3;
          return t2.isOffline && (e3 = null === (s2 = q.create(new Error("Network connection error")).toPubNubError(K.PNSubscribeOperation).status) || void 0 === s2 ? void 0 : s2.category), gt.with(void 0, [rt(Object.assign({ category: t2.isOffline ? h.PNDisconnectedUnexpectedlyCategory : h.PNDisconnectedCategory, operation: K.PNUnsubscribeOperation }, e3 ? { error: e3 } : {}))]);
        }
        return St.with({ channels: t2.channels, groups: t2.groups, cursor: e2.cursor, referenceTimetoken: e2.referenceTimetoken, onDemand: true }, [rt({ category: h.PNSubscriptionChangedCategory, affectedChannels: t2.channels.slice(0), affectedChannelGroups: t2.groups.slice(0), currentTimetoken: e2.cursor.timetoken })]);
      })), St.on(at.type, ((e2, { payload: t2 }) => 0 === t2.channels.length && 0 === t2.groups.length ? gt.with(void 0, [rt({ category: h.PNDisconnectedCategory })]) : St.with({ channels: t2.channels, groups: t2.groups, cursor: { timetoken: `${t2.cursor.timetoken}`, region: t2.cursor.region || e2.cursor.region }, referenceTimetoken: I(e2.cursor.timetoken, `${t2.cursor.timetoken}`, e2.referenceTimetoken), onDemand: true }, [rt({ category: h.PNSubscriptionChangedCategory, affectedChannels: t2.channels.slice(0), affectedChannelGroups: t2.groups.slice(0), currentTimetoken: t2.cursor.timetoken })]))), St.on(lt.type, ((e2, { payload: t2 }) => {
        var s2;
        return vt.with(Object.assign(Object.assign({}, e2), { reason: t2 }), [rt({ category: h.PNDisconnectedUnexpectedlyCategory, error: null === (s2 = t2.status) || void 0 === s2 ? void 0 : s2.category })]);
      })), St.on(ht.type, ((e2, t2) => {
        var s2;
        if (t2.payload.isOffline) {
          const t3 = q.create(new Error("Network connection error")).toPubNubError(K.PNSubscribeOperation);
          return vt.with(Object.assign(Object.assign({}, e2), { reason: t3 }), [rt({ category: h.PNDisconnectedUnexpectedlyCategory, operation: K.PNSubscribeOperation, error: null === (s2 = t3.status) || void 0 === s2 ? void 0 : s2.category })]);
        }
        return ft.with(Object.assign({}, e2), [rt({ category: h.PNDisconnectedCategory, operation: K.PNSubscribeOperation })]);
      })), St.on(pt.type, ((e2) => gt.with(void 0, [rt({ category: h.PNDisconnectedCategory, operation: K.PNUnsubscribeOperation })])));
      class wt extends Ee {
        constructor(e2, t2) {
          super(t2, t2.config.logger()), this.on(tt.type, De(((t3, s2, n2) => i(this, [t3, s2, n2], void 0, (function* (t4, s3, { handshake: n3, presenceState: r2, config: i2 }) {
            s3.throwIfAborted();
            try {
              const a2 = yield n3(Object.assign(Object.assign({ abortSignal: s3, channels: t4.channels, channelGroups: t4.groups, filterExpression: i2.filterExpression }, i2.maintainPresenceState && { state: r2 }), { onDemand: t4.onDemand }));
              return e2.transition(ot(a2));
            } catch (t5) {
              if (t5 instanceof d) {
                if (t5.status && t5.status.category == h.PNCancelledCategory) return;
                return e2.transition(ct(t5));
              }
            }
          }))))), this.on(st.type, De(((t3, s2, n2) => i(this, [t3, s2, n2], void 0, (function* (t4, s3, { receiveMessages: n3, config: r2 }) {
            s3.throwIfAborted();
            try {
              const i2 = yield n3({ abortSignal: s3, channels: t4.channels, channelGroups: t4.groups, timetoken: t4.cursor.timetoken, region: t4.cursor.region, filterExpression: r2.filterExpression, onDemand: t4.onDemand });
              e2.transition(ut(i2.cursor, i2.messages));
            } catch (t5) {
              if (t5 instanceof d) {
                if (t5.status && t5.status.category == h.PNCancelledCategory) return;
                if (!s3.aborted) return e2.transition(lt(t5));
              }
            }
          }))))), this.on(nt.type, De(((e3, t3, s2) => i(this, [e3, t3, s2], void 0, (function* ({ cursor: e4, events: t4 }, s3, { emitMessages: n2 }) {
            t4.length > 0 && n2(e4, t4);
          }))))), this.on(rt.type, De(((e3, t3, s2) => i(this, [e3, t3, s2], void 0, (function* (e4, t4, { emitStatus: s3 }) {
            return s3(e4);
          })))));
        }
      }
      class Ot {
        get _engine() {
          return this.engine;
        }
        constructor(e2) {
          this.channels = [], this.groups = [], this.dependencies = e2, this.engine = new je(e2.config.logger()), this.dispatcher = new wt(this.engine, e2), e2.config.logger().debug("EventEngine", "Create subscribe event engine."), this._unsubscribeEngine = this.engine.subscribe(((e3) => {
            "invocationDispatched" === e3.type && this.dispatcher.dispatch(e3.invocation);
          })), this.engine.start(gt, void 0);
        }
        get subscriptionTimetoken() {
          const e2 = this.engine.currentState;
          if (!e2) return;
          let t2, s2 = "0";
          if (e2.label === St.label) {
            const e3 = this.engine.currentContext;
            s2 = e3.cursor.timetoken, t2 = e3.referenceTimetoken;
          }
          return _(s2, null != t2 ? t2 : "0");
        }
        subscribe({ channels: e2, channelGroups: t2, timetoken: s2, withPresence: n2 }) {
          var r2;
          const i2 = null == e2 ? void 0 : e2.some(((e3) => !this.channels.includes(e3))), a2 = null == t2 ? void 0 : t2.some(((e3) => !this.groups.includes(e3))), o2 = i2 || a2;
          if (this.channels = [...this.channels, ...null != e2 ? e2 : []], this.groups = [...this.groups, ...null != t2 ? t2 : []], n2 && (this.channels.map(((e3) => this.channels.push(`${e3}-pnpres`))), this.groups.map(((e3) => this.groups.push(`${e3}-pnpres`)))), s2) this.engine.transition(at(Array.from(/* @__PURE__ */ new Set([...this.channels, ...null != e2 ? e2 : []])), Array.from(/* @__PURE__ */ new Set([...this.groups, ...null != t2 ? t2 : []])), s2));
          else if (o2) this.engine.transition(it(Array.from(/* @__PURE__ */ new Set([...this.channels, ...null != e2 ? e2 : []])), Array.from(/* @__PURE__ */ new Set([...this.groups, ...null != t2 ? t2 : []]))));
          else {
            this.dependencies.config.logger().debug("EventEngine", "Skipping state transition - all channels/groups already subscribed. Emitting SubscriptionChanged event.");
            const e3 = this.engine.currentState, t3 = this.engine.currentContext;
            let s3 = "0";
            if ((null == e3 ? void 0 : e3.label) === St.label && t3) {
              s3 = null === (r2 = t3.cursor) || void 0 === r2 ? void 0 : r2.timetoken;
            }
            this.dependencies.emitStatus({ category: h.PNSubscriptionChangedCategory, affectedChannels: Array.from(new Set(this.channels)), affectedChannelGroups: Array.from(new Set(this.groups)), currentTimetoken: s3 });
          }
          this.dependencies.join && this.dependencies.join({ channels: Array.from(new Set(this.channels.filter(((e3) => !e3.endsWith("-pnpres"))))), groups: Array.from(new Set(this.groups.filter(((e3) => !e3.endsWith("-pnpres"))))) });
        }
        unsubscribe({ channels: e2 = [], channelGroups: t2 = [] }) {
          const s2 = E(this.channels, [...e2, ...e2.map(((e3) => `${e3}-pnpres`))]), n2 = E(this.groups, [...t2, ...t2.map(((e3) => `${e3}-pnpres`))]);
          if (new Set(this.channels).size !== new Set(s2).size || new Set(this.groups).size !== new Set(n2).size) {
            const r2 = N(this.channels, e2), i2 = N(this.groups, t2);
            this.dependencies.presenceState && (null == r2 || r2.forEach(((e3) => delete this.dependencies.presenceState[e3])), null == i2 || i2.forEach(((e3) => delete this.dependencies.presenceState[e3]))), this.channels = s2, this.groups = n2, this.engine.transition(it(Array.from(new Set(this.channels.slice(0))), Array.from(new Set(this.groups.slice(0))))), this.dependencies.leave && this.dependencies.leave({ channels: r2.slice(0), groups: i2.slice(0) });
          }
        }
        unsubscribeAll(e2 = false) {
          const t2 = this.getSubscribedChannelGroups(), s2 = this.getSubscribedChannels();
          this.channels = [], this.groups = [], this.dependencies.presenceState && Object.keys(this.dependencies.presenceState).forEach(((e3) => {
            delete this.dependencies.presenceState[e3];
          })), this.engine.transition(it(this.channels.slice(0), this.groups.slice(0), e2)), this.dependencies.leaveAll && this.dependencies.leaveAll({ channels: s2, groups: t2, isOffline: e2 });
        }
        reconnect({ timetoken: e2, region: t2 }) {
          const s2 = this.getSubscribedChannels(), n2 = this.getSubscribedChannels();
          this.engine.transition(dt(e2, t2)), this.dependencies.presenceReconnect && this.dependencies.presenceReconnect({ channels: n2, groups: s2 });
        }
        disconnect(e2 = false) {
          const t2 = this.getSubscribedChannels(), s2 = this.getSubscribedChannels();
          this.engine.transition(ht(e2)), this.dependencies.presenceDisconnect && this.dependencies.presenceDisconnect({ channels: s2, groups: t2, isOffline: e2 });
        }
        getSubscribedChannels() {
          return Array.from(new Set(this.channels.slice(0)));
        }
        getSubscribedChannelGroups() {
          return Array.from(new Set(this.groups.slice(0)));
        }
        dispose() {
          this.disconnect(true), this._unsubscribeEngine(), this.dispatcher.dispose();
        }
      }
      class kt extends de {
        constructor(e2) {
          var t2;
          const s2 = null !== (t2 = e2.sendByPost) && void 0 !== t2 && t2;
          super({ method: s2 ? ce.POST : ce.GET, compressible: s2 }), this.parameters = e2, this.parameters.sendByPost = s2;
        }
        operation() {
          return K.PNPublishOperation;
        }
        validate() {
          const { message: e2, channel: t2, keySet: { publishKey: s2 } } = this.parameters;
          return t2 ? e2 ? s2 ? void 0 : "Missing 'publishKey'" : "Missing 'message'" : "Missing 'channel'";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { timetoken: this.deserializeResponse(e2)[2] };
          }));
        }
        get path() {
          const { message: e2, channel: t2, keySet: s2 } = this.parameters, n2 = this.prepareMessagePayload(e2);
          return `/publish/${s2.publishKey}/${s2.subscribeKey}/0/${P(t2)}/0${this.parameters.sendByPost ? "" : `/${P(n2)}`}`;
        }
        get queryParameters() {
          const { customMessageType: e2, meta: t2, replicate: s2, storeInHistory: n2, ttl: r2 } = this.parameters, i2 = {};
          return e2 && (i2.custom_message_type = e2), void 0 !== n2 && (i2.store = n2 ? "1" : "0"), void 0 !== r2 && (i2.ttl = r2), void 0 === s2 || s2 || (i2.norep = "true"), t2 && "object" == typeof t2 && (i2.meta = JSON.stringify(t2)), i2;
        }
        get headers() {
          var e2;
          return this.parameters.sendByPost ? Object.assign(Object.assign({}, null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {}), { "Content-Type": "application/json" }) : super.headers;
        }
        get body() {
          return this.prepareMessagePayload(this.parameters.message);
        }
        prepareMessagePayload(e2) {
          const { crypto: t2 } = this.parameters;
          if (!t2) return JSON.stringify(e2) || "";
          const s2 = t2.encrypt(JSON.stringify(e2));
          return JSON.stringify("string" == typeof s2 ? s2 : u(s2));
        }
      }
      class Ct extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNSignalOperation;
        }
        validate() {
          const { message: e2, channel: t2, keySet: { publishKey: s2 } } = this.parameters;
          return t2 ? e2 ? s2 ? void 0 : "Missing 'publishKey'" : "Missing 'message'" : "Missing 'channel'";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { timetoken: this.deserializeResponse(e2)[2] };
          }));
        }
        get path() {
          const { keySet: { publishKey: e2, subscribeKey: t2 }, channel: s2, message: n2 } = this.parameters, r2 = JSON.stringify(n2);
          return `/signal/${e2}/${t2}/0/${P(s2)}/0/${P(r2)}`;
        }
        get queryParameters() {
          const { customMessageType: e2 } = this.parameters, t2 = {};
          return e2 && (t2.custom_message_type = e2), t2;
        }
      }
      class Pt extends ge {
        operation() {
          return K.PNReceiveMessagesOperation;
        }
        validate() {
          const e2 = super.validate();
          return e2 || (this.parameters.timetoken ? this.parameters.region ? void 0 : "region can not be empty" : "timetoken can not be empty");
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channels: t2 = [] } = this.parameters;
          return `/v2/subscribe/${e2}/${j(t2.sort(), ",")}/0`;
        }
        get queryParameters() {
          const { channelGroups: e2, filterExpression: t2, timetoken: s2, region: n2, onDemand: r2 } = this.parameters, i2 = { ee: "" };
          return r2 && (i2["on-demand"] = 1), e2 && e2.length > 0 && (i2["channel-group"] = e2.sort().join(",")), t2 && t2.length > 0 && (i2["filter-expr"] = t2), "string" == typeof s2 ? s2 && "0" !== s2 && s2.length > 0 && (i2.tt = s2) : s2 && s2 > 0 && (i2.tt = s2), n2 && (i2.tr = n2), i2;
        }
      }
      class jt extends ge {
        operation() {
          return K.PNHandshakeOperation;
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channels: t2 = [] } = this.parameters;
          return `/v2/subscribe/${e2}/${j(t2.sort(), ",")}/0`;
        }
        get queryParameters() {
          const { channelGroups: e2, filterExpression: t2, state: s2, onDemand: n2 } = this.parameters, r2 = { ee: "" };
          return n2 && (r2["on-demand"] = 1), e2 && e2.length > 0 && (r2["channel-group"] = e2.sort().join(",")), t2 && t2.length > 0 && (r2["filter-expr"] = t2), s2 && Object.keys(s2).length > 0 && (r2.state = JSON.stringify(s2)), r2;
        }
      }
      var Et;
      !(function(e2) {
        e2[e2.Channel = 0] = "Channel", e2[e2.ChannelGroup = 1] = "ChannelGroup";
      })(Et || (Et = {}));
      class Nt {
        constructor({ channels: e2, channelGroups: t2 }) {
          this.isEmpty = true, this._channelGroups = new Set((null != t2 ? t2 : []).filter(((e3) => e3.length > 0))), this._channels = new Set((null != e2 ? e2 : []).filter(((e3) => e3.length > 0))), this.isEmpty = 0 === this._channels.size && 0 === this._channelGroups.size;
        }
        get length() {
          return this.isEmpty ? 0 : this._channels.size + this._channelGroups.size;
        }
        get channels() {
          return this.isEmpty ? [] : Array.from(this._channels);
        }
        get channelGroups() {
          return this.isEmpty ? [] : Array.from(this._channelGroups);
        }
        contains(e2) {
          return !this.isEmpty && (this._channels.has(e2) || this._channelGroups.has(e2));
        }
        with(e2) {
          return new Nt({ channels: [...this._channels, ...e2._channels], channelGroups: [...this._channelGroups, ...e2._channelGroups] });
        }
        without(e2) {
          return new Nt({ channels: [...this._channels].filter(((t2) => !e2._channels.has(t2))), channelGroups: [...this._channelGroups].filter(((t2) => !e2._channelGroups.has(t2))) });
        }
        add(e2) {
          return e2._channelGroups.size > 0 && (this._channelGroups = /* @__PURE__ */ new Set([...this._channelGroups, ...e2._channelGroups])), e2._channels.size > 0 && (this._channels = /* @__PURE__ */ new Set([...this._channels, ...e2._channels])), this.isEmpty = 0 === this._channels.size && 0 === this._channelGroups.size, this;
        }
        remove(e2) {
          return e2._channelGroups.size > 0 && (this._channelGroups = new Set([...this._channelGroups].filter(((t2) => !e2._channelGroups.has(t2))))), e2._channels.size > 0 && (this._channels = new Set([...this._channels].filter(((t2) => !e2._channels.has(t2))))), this;
        }
        removeAll() {
          return this._channels.clear(), this._channelGroups.clear(), this.isEmpty = true, this;
        }
        toString() {
          return `SubscriptionInput { channels: [${this.channels.join(", ")}], channelGroups: [${this.channelGroups.join(", ")}], is empty: ${this.isEmpty ? "true" : "false"}} }`;
        }
      }
      class Tt {
        constructor(e2, t2, s2, n2) {
          this._isSubscribed = false, this.clones = {}, this.parents = [], this._id = ne.createUUID(), this.referenceTimetoken = n2, this.subscriptionInput = t2, this.options = s2, this.client = e2;
        }
        get id() {
          return this._id;
        }
        get isLastClone() {
          return 1 === Object.keys(this.clones).length;
        }
        get isSubscribed() {
          return !!this._isSubscribed || this.parents.length > 0 && this.parents.some(((e2) => e2.isSubscribed));
        }
        set isSubscribed(e2) {
          this.isSubscribed !== e2 && (this._isSubscribed = e2);
        }
        addParentState(e2) {
          this.parents.includes(e2) || this.parents.push(e2);
        }
        removeParentState(e2) {
          const t2 = this.parents.indexOf(e2);
          -1 !== t2 && this.parents.splice(t2, 1);
        }
        storeClone(e2, t2) {
          this.clones[e2] || (this.clones[e2] = t2);
        }
      }
      class _t {
        constructor(e2, t2 = "Subscription") {
          this.subscriptionType = t2, this.id = ne.createUUID(), this.eventDispatcher = new ye(), this._state = e2;
        }
        get state() {
          return this._state;
        }
        get channels() {
          return this.state.subscriptionInput.channels.slice(0);
        }
        get channelGroups() {
          return this.state.subscriptionInput.channelGroups.slice(0);
        }
        set onMessage(e2) {
          this.eventDispatcher.onMessage = e2;
        }
        set onPresence(e2) {
          this.eventDispatcher.onPresence = e2;
        }
        set onSignal(e2) {
          this.eventDispatcher.onSignal = e2;
        }
        set onObjects(e2) {
          this.eventDispatcher.onObjects = e2;
        }
        set onMessageAction(e2) {
          this.eventDispatcher.onMessageAction = e2;
        }
        set onFile(e2) {
          this.eventDispatcher.onFile = e2;
        }
        addListener(e2) {
          this.eventDispatcher.addListener(e2);
        }
        removeListener(e2) {
          this.eventDispatcher.removeListener(e2);
        }
        removeAllListeners() {
          this.eventDispatcher.removeAllListeners();
        }
        handleEvent(e2, t2) {
          var s2;
          if ((!this.state.cursor || e2 > this.state.cursor) && (this.state.cursor = e2), this.state.referenceTimetoken && t2.data.timetoken < this.state.referenceTimetoken) return void this.state.client.logger.trace(this.subscriptionType, (() => ({ messageType: "text", message: `Event timetoken (${t2.data.timetoken}) is older than reference timetoken (${this.state.referenceTimetoken}) for ${this.id} subscription object. Ignoring event.` })));
          if ((null === (s2 = this.state.options) || void 0 === s2 ? void 0 : s2.filter) && !this.state.options.filter(t2)) return void this.state.client.logger.trace(this.subscriptionType, `Event filtered out by filter function for ${this.id} subscription object. Ignoring event.`);
          const n2 = Object.values(this.state.clones);
          n2.length > 0 && this.state.client.logger.trace(this.subscriptionType, `Notify ${this.id} subscription object clones (count: ${n2.length}) about received event.`), n2.forEach(((e3) => e3.eventDispatcher.handleEvent(t2)));
        }
        dispose() {
          const e2 = Object.keys(this.state.clones);
          e2.length > 1 ? (this.state.client.logger.debug(this.subscriptionType, `Remove subscription object clone on dispose: ${this.id}`), delete this.state.clones[this.id]) : 1 === e2.length && this.state.clones[this.id] && (this.state.client.logger.debug(this.subscriptionType, `Unsubscribe subscription object on dispose: ${this.id}`), this.unsubscribe());
        }
        invalidate(e2 = false) {
          this.state._isSubscribed = false, e2 && (delete this.state.clones[this.id], 0 === Object.keys(this.state.clones).length && (this.state.client.logger.trace(this.subscriptionType, "Last clone removed. Reset shared subscription state."), this.state.subscriptionInput.removeAll(), this.state.parents = []));
        }
        subscribe(e2) {
          this.state.isSubscribed ? this.state.client.logger.trace(this.subscriptionType, "Already subscribed. Ignoring subscribe request.") : (this.state.client.logger.debug(this.subscriptionType, (() => e2 ? { messageType: "object", message: e2, details: "Subscribe with parameters:" } : { messageType: "text", message: "Subscribe" })), this.state.isSubscribed = true, this.updateSubscription({ subscribing: true, timetoken: null == e2 ? void 0 : e2.timetoken }));
        }
        unsubscribe() {
          if (!this.state._isSubscribed || this.state.isSubscribed) {
            if (!this.state._isSubscribed && this.state.parents.length > 0 && this.state.isSubscribed) return void this.state.client.logger.warn(this.subscriptionType, (() => ({ messageType: "object", details: "Subscription is subscribed as part of a subscription set. Remove from active sets to unsubscribe:", message: this.state.parents.filter(((e2) => e2.isSubscribed)) })));
            if (!this.state._isSubscribed) return void this.state.client.logger.trace(this.subscriptionType, "Not subscribed. Ignoring unsubscribe request.");
          }
          this.state.client.logger.debug(this.subscriptionType, "Unsubscribe"), this.state.isSubscribed = false, delete this.state.cursor, this.updateSubscription({ subscribing: false });
        }
        updateSubscription(e2) {
          var t2, s2;
          (null == e2 ? void 0 : e2.timetoken) && ((null === (t2 = this.state.cursor) || void 0 === t2 ? void 0 : t2.timetoken) && "0" !== (null === (s2 = this.state.cursor) || void 0 === s2 ? void 0 : s2.timetoken) ? "0" !== e2.timetoken && e2.timetoken > this.state.cursor.timetoken && (this.state.cursor.timetoken = e2.timetoken) : this.state.cursor = { timetoken: e2.timetoken });
          const n2 = e2.subscriptions && e2.subscriptions.length > 0 ? e2.subscriptions : void 0;
          e2.subscribing ? this.register(Object.assign(Object.assign({}, e2.timetoken ? { cursor: this.state.cursor } : {}), n2 ? { subscriptions: n2 } : {})) : this.unregister(n2);
        }
      }
      class It extends Tt {
        constructor(e2) {
          const t2 = new Nt({});
          e2.subscriptions.forEach(((e3) => t2.add(e3.state.subscriptionInput))), super(e2.client, t2, e2.options, e2.client.subscriptionTimetoken), this.subscriptions = e2.subscriptions;
        }
        addSubscription(e2) {
          this.subscriptions.includes(e2) || (e2.state.addParentState(this), this.subscriptions.push(e2), this.subscriptionInput.add(e2.state.subscriptionInput));
        }
        removeSubscription(e2, t2) {
          const s2 = this.subscriptions.indexOf(e2);
          -1 !== s2 && (this.subscriptions.splice(s2, 1), t2 || e2.state.removeParentState(this), this.subscriptionInput.remove(e2.state.subscriptionInput));
        }
        removeAllSubscriptions() {
          this.subscriptions.forEach(((e2) => e2.state.removeParentState(this))), this.subscriptions.splice(0, this.subscriptions.length), this.subscriptionInput.removeAll();
        }
      }
      class Mt extends _t {
        constructor(e2) {
          let t2;
          if ("client" in e2) {
            let s2 = [];
            !e2.subscriptions && e2.entities ? e2.entities.forEach(((t3) => s2.push(t3.subscription(e2.options)))) : e2.subscriptions && (s2 = e2.subscriptions), t2 = new It({ client: e2.client, subscriptions: s2, options: e2.options }), s2.forEach(((e3) => e3.state.addParentState(t2))), t2.client.logger.debug("SubscriptionSet", (() => ({ messageType: "object", details: "Create subscription set with parameters:", message: Object.assign({ subscriptions: t2.subscriptions }, e2.options ? e2.options : {}) })));
          } else t2 = e2.state, t2.client.logger.debug("SubscriptionSet", "Create subscription set clone");
          super(t2, "SubscriptionSet"), this.state.storeClone(this.id, this), t2.subscriptions.forEach(((e3) => e3.addParentSet(this)));
        }
        get state() {
          return super.state;
        }
        get subscriptions() {
          return this.state.subscriptions.slice(0);
        }
        handleEvent(e2, t2) {
          var s2;
          this.state.subscriptionInput.contains(null !== (s2 = t2.data.subscription) && void 0 !== s2 ? s2 : t2.data.channel) && (this.state._isSubscribed ? (super.handleEvent(e2, t2), this.state.subscriptions.length > 0 && this.state.client.logger.trace(this.subscriptionType, `Notify ${this.id} subscription set subscriptions (count: ${this.state.subscriptions.length}) about received event.`), this.state.subscriptions.forEach(((s3) => s3.handleEvent(e2, t2)))) : this.state.client.logger.trace(this.subscriptionType, `Subscription set ${this.id} is not subscribed. Ignoring event.`));
        }
        subscriptionInput(e2 = false) {
          let t2 = this.state.subscriptionInput;
          return this.state.subscriptions.forEach(((s2) => {
            e2 && s2.state.entity.subscriptionsCount > 0 && (t2 = t2.without(s2.state.subscriptionInput));
          })), t2;
        }
        cloneEmpty() {
          return new Mt({ state: this.state });
        }
        dispose() {
          const e2 = this.state.isLastClone;
          this.state.subscriptions.forEach(((t2) => {
            t2.removeParentSet(this), e2 && t2.state.removeParentState(this.state);
          })), super.dispose();
        }
        invalidate(e2 = false) {
          (e2 ? this.state.subscriptions.slice(0) : this.state.subscriptions).forEach(((t2) => {
            e2 && (t2.state.entity.decreaseSubscriptionCount(this.state.id), t2.removeParentSet(this)), t2.invalidate(e2);
          })), e2 && this.state.removeAllSubscriptions(), super.invalidate();
        }
        addSubscription(e2) {
          this.addSubscriptions([e2]);
        }
        addSubscriptions(e2) {
          const t2 = [], s2 = [];
          this.state.client.logger.debug(this.subscriptionType, (() => {
            const t3 = [], s3 = [];
            return e2.forEach(((e3) => {
              this.state.subscriptions.includes(e3) ? t3.push(e3) : s3.push(e3);
            })), { messageType: "object", details: `Add subscriptions to ${this.id} (subscriptions count: ${this.state.subscriptions.length + s3.length}):`, message: { addedSubscriptions: s3, ignoredSubscriptions: t3 } };
          })), e2.filter(((e3) => !this.state.subscriptions.includes(e3))).forEach(((e3) => {
            e3.state.isSubscribed ? s2.push(e3) : t2.push(e3), e3.addParentSet(this), this.state.addSubscription(e3);
          })), 0 === s2.length && 0 === t2.length || !this.state.isSubscribed || (s2.forEach((({ state: e3 }) => e3.entity.increaseSubscriptionCount(this.state.id))), t2.length > 0 && this.updateSubscription({ subscribing: true, subscriptions: t2 }));
        }
        removeSubscription(e2) {
          this.removeSubscriptions([e2]);
        }
        removeSubscriptions(e2) {
          const t2 = [];
          this.state.client.logger.debug(this.subscriptionType, (() => {
            const t3 = [], s2 = [];
            return e2.forEach(((e3) => {
              this.state.subscriptions.includes(e3) ? s2.push(e3) : t3.push(e3);
            })), { messageType: "object", details: `Remove subscriptions from ${this.id} (subscriptions count: ${this.state.subscriptions.length}):`, message: { removedSubscriptions: s2, ignoredSubscriptions: t3 } };
          })), e2.filter(((e3) => this.state.subscriptions.includes(e3))).forEach(((e3) => {
            e3.state.isSubscribed && t2.push(e3), e3.removeParentSet(this), this.state.removeSubscription(e3, e3.parentSetsCount > 1);
          })), 0 !== t2.length && this.state.isSubscribed && this.updateSubscription({ subscribing: false, subscriptions: t2 });
        }
        addSubscriptionSet(e2) {
          this.addSubscriptions(e2.subscriptions);
        }
        removeSubscriptionSet(e2) {
          this.removeSubscriptions(e2.subscriptions);
        }
        register(e2) {
          var t2;
          const s2 = null !== (t2 = e2.subscriptions) && void 0 !== t2 ? t2 : this.state.subscriptions;
          s2.forEach((({ state: e3 }) => e3.entity.increaseSubscriptionCount(this.state.id))), this.state.client.logger.trace(this.subscriptionType, (() => ({ messageType: "text", message: `Register subscription for real-time events: ${this}` }))), this.state.client.registerEventHandleCapable(this, e2.cursor, s2);
        }
        unregister(e2) {
          const t2 = null != e2 ? e2 : this.state.subscriptions;
          t2.forEach((({ state: e3 }) => e3.entity.decreaseSubscriptionCount(this.state.id))), this.state.client.logger.trace(this.subscriptionType, (() => e2 ? { messageType: "object", message: { subscription: this, subscriptions: e2 }, details: "Unregister subscriptions of subscription set from real-time events:" } : { messageType: "text", message: `Unregister subscription from real-time events: ${this}` })), this.state.client.unregisterEventHandleCapable(this, t2);
        }
        toString() {
          const e2 = this.state;
          return `${this.subscriptionType} { id: ${this.id}, stateId: ${e2.id}, clonesCount: ${Object.keys(this.state.clones).length}, isSubscribed: ${e2.isSubscribed}, subscriptions: [${e2.subscriptions.map(((e3) => e3.toString())).join(", ")}] }`;
        }
      }
      class At extends Tt {
        constructor(e2) {
          var t2, s2;
          const n2 = e2.entity.subscriptionNames(null !== (s2 = null === (t2 = e2.options) || void 0 === t2 ? void 0 : t2.receivePresenceEvents) && void 0 !== s2 && s2), r2 = new Nt({ [e2.entity.subscriptionType == Et.Channel ? "channels" : "channelGroups"]: n2 });
          super(e2.client, r2, e2.options, e2.client.subscriptionTimetoken), this.entity = e2.entity;
        }
      }
      class Ut extends _t {
        constructor(e2) {
          "client" in e2 ? e2.client.logger.debug("Subscription", (() => ({ messageType: "object", details: "Create subscription with parameters:", message: Object.assign({ entity: e2.entity }, e2.options ? e2.options : {}) }))) : e2.state.client.logger.debug("Subscription", "Create subscription clone"), super("state" in e2 ? e2.state : new At(e2)), this.parents = [], this.handledUpdates = [], this.state.storeClone(this.id, this);
        }
        get state() {
          return super.state;
        }
        get parentSetsCount() {
          return this.parents.length;
        }
        handleEvent(e2, t2) {
          var s2, n2;
          if (this.state.isSubscribed && this.state.subscriptionInput.contains(null !== (s2 = t2.data.subscription) && void 0 !== s2 ? s2 : t2.data.channel)) {
            if (this.parentSetsCount > 0) {
              const e3 = A(t2.data);
              if (this.handledUpdates.includes(e3)) return void this.state.client.logger.trace(this.subscriptionType, `Event (${e3}) already handled by ${this.id}. Ignoring.`);
              this.handledUpdates.push(e3), this.handledUpdates.length > 10 && this.handledUpdates.shift();
            }
            this.state.subscriptionInput.contains(null !== (n2 = t2.data.subscription) && void 0 !== n2 ? n2 : t2.data.channel) && super.handleEvent(e2, t2);
          }
        }
        subscriptionInput(e2 = false) {
          return e2 && this.state.entity.subscriptionsCount > 0 ? new Nt({}) : this.state.subscriptionInput;
        }
        cloneEmpty() {
          return new Ut({ state: this.state });
        }
        dispose() {
          this.parentSetsCount > 0 ? this.state.client.logger.debug(this.subscriptionType, (() => ({ messageType: "text", message: `'${this.state.entity.subscriptionNames()}' subscription still in use. Ignore dispose request.` }))) : (this.handledUpdates.splice(0, this.handledUpdates.length), super.dispose());
        }
        invalidate(e2 = false) {
          e2 && this.state.entity.decreaseSubscriptionCount(this.state.id), this.handledUpdates.splice(0, this.handledUpdates.length), super.invalidate(e2);
        }
        addParentSet(e2) {
          this.parents.includes(e2) || (this.parents.push(e2), this.state.client.logger.trace(this.subscriptionType, `Add parent subscription set for ${this.id}: ${e2.id}. Parent subscription set count: ${this.parentSetsCount}`));
        }
        removeParentSet(e2) {
          const t2 = this.parents.indexOf(e2);
          -1 !== t2 && (this.parents.splice(t2, 1), this.state.client.logger.trace(this.subscriptionType, `Remove parent subscription set from ${this.id}: ${e2.id}. Parent subscription set count: ${this.parentSetsCount}`)), 0 === this.parentSetsCount && this.handledUpdates.splice(0, this.handledUpdates.length);
        }
        addSubscription(e2) {
          this.state.client.logger.debug(this.subscriptionType, (() => ({ messageType: "text", message: `Create set with subscription: ${e2}` })));
          const t2 = new Mt({ client: this.state.client, subscriptions: [this, e2], options: this.state.options });
          return this.state.isSubscribed || e2.state.isSubscribed ? (this.state.client.logger.trace(this.subscriptionType, "Subscribe resulting set because the receiver is already subscribed."), t2.subscribe(), t2) : t2;
        }
        register(e2) {
          this.state.entity.increaseSubscriptionCount(this.state.id), this.state.client.logger.trace(this.subscriptionType, (() => ({ messageType: "text", message: `Register subscription for real-time events: ${this}` }))), this.state.client.registerEventHandleCapable(this, e2.cursor);
        }
        unregister(e2) {
          this.state.entity.decreaseSubscriptionCount(this.state.id), this.state.client.logger.trace(this.subscriptionType, (() => ({ messageType: "text", message: `Unregister subscription from real-time events: ${this}` }))), this.handledUpdates.splice(0, this.handledUpdates.length), this.state.client.unregisterEventHandleCapable(this);
        }
        toString() {
          const e2 = this.state;
          return `${this.subscriptionType} { id: ${this.id}, stateId: ${e2.id}, entity: ${e2.entity.subscriptionNames(false).pop()}, clonesCount: ${Object.keys(e2.clones).length}, isSubscribed: ${e2.isSubscribed}, parentSetsCount: ${this.parentSetsCount}, cursor: ${e2.cursor ? e2.cursor.timetoken : "not set"}, referenceTimetoken: ${e2.referenceTimetoken ? e2.referenceTimetoken : "not set"} }`;
        }
      }
      class Dt extends de {
        constructor(e2) {
          var t2, s2, n2, r2;
          super(), this.parameters = e2, null !== (t2 = (n2 = this.parameters).channels) && void 0 !== t2 || (n2.channels = []), null !== (s2 = (r2 = this.parameters).channelGroups) && void 0 !== s2 || (r2.channelGroups = []);
        }
        operation() {
          return K.PNGetStateOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2, channelGroups: s2 } = this.parameters;
          if (!e2) return "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            const t2 = this.deserializeResponse(e2), { channels: s2 = [], channelGroups: n2 = [] } = this.parameters, r2 = { channels: {} };
            return 1 === s2.length && 0 === n2.length ? r2.channels[s2[0]] = t2.payload : r2.channels = t2.payload, r2;
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2, channels: s2 } = this.parameters;
          return `/v2/presence/sub-key/${e2}/channel/${j(null != s2 ? s2 : [], ",")}/uuid/${P(null != t2 ? t2 : "")}`;
        }
        get queryParameters() {
          const { channelGroups: e2 } = this.parameters;
          return e2 && 0 !== e2.length ? { "channel-group": e2.join(",") } : {};
        }
      }
      class Rt extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNSetStateOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, state: t2, channels: s2 = [], channelGroups: n2 = [] } = this.parameters;
          return e2 ? void 0 === t2 ? "Missing State" : 0 === (null == s2 ? void 0 : s2.length) && 0 === (null == n2 ? void 0 : n2.length) ? "Please provide a list of channels and/or channel-groups" : void 0 : "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { state: this.deserializeResponse(e2).payload };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2, channels: s2 } = this.parameters;
          return `/v2/presence/sub-key/${e2}/channel/${j(null != s2 ? s2 : [], ",")}/uuid/${P(t2)}/data`;
        }
        get queryParameters() {
          const { channelGroups: e2, state: t2 } = this.parameters, s2 = { state: JSON.stringify(t2) };
          return e2 && 0 !== e2.length && (s2["channel-group"] = e2.join(",")), s2;
        }
      }
      class $t extends de {
        constructor(e2) {
          super({ cancellable: true }), this.parameters = e2;
        }
        operation() {
          return K.PNHeartbeatOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2 = [], channelGroups: s2 = [] } = this.parameters;
          return e2 ? 0 === t2.length && 0 === s2.length ? "Please provide a list of channels and/or channel-groups" : void 0 : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channels: t2 } = this.parameters;
          return `/v2/presence/sub-key/${e2}/channel/${j(null != t2 ? t2 : [], ",")}/heartbeat`;
        }
        get queryParameters() {
          const { channelGroups: e2, state: t2, heartbeat: s2 } = this.parameters, n2 = { heartbeat: `${s2}` };
          return e2 && 0 !== e2.length && (n2["channel-group"] = e2.join(",")), void 0 !== t2 && (n2.state = JSON.stringify(t2)), n2;
        }
      }
      class Ft extends de {
        constructor(e2) {
          super(), this.parameters = e2, this.parameters.channelGroups && (this.parameters.channelGroups = Array.from(new Set(this.parameters.channelGroups))), this.parameters.channels && (this.parameters.channels = Array.from(new Set(this.parameters.channels)));
        }
        operation() {
          return K.PNUnsubscribeOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2 = [], channelGroups: s2 = [] } = this.parameters;
          return e2 ? 0 === t2.length && 0 === s2.length ? "At least one `channel` or `channel group` should be provided." : void 0 : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
        get path() {
          var e2;
          const { keySet: { subscribeKey: t2 }, channels: s2 } = this.parameters;
          return `/v2/presence/sub-key/${t2}/channel/${j(null !== (e2 = null == s2 ? void 0 : s2.sort()) && void 0 !== e2 ? e2 : [], ",")}/leave`;
        }
        get queryParameters() {
          const { channelGroups: e2 } = this.parameters;
          return e2 && 0 !== e2.length ? { "channel-group": e2.sort().join(",") } : {};
        }
      }
      class xt extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNWhereNowOperation;
        }
        validate() {
          if (!this.parameters.keySet.subscribeKey) return "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            const t2 = this.deserializeResponse(e2);
            return t2.payload ? { channels: t2.payload.channels } : { channels: [] };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2 } = this.parameters;
          return `/v2/presence/sub-key/${e2}/uuid/${P(t2)}`;
        }
      }
      class Lt extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2, a2, o2, c2;
          super(), this.parameters = e2, null !== (t2 = (i2 = this.parameters).queryParameters) && void 0 !== t2 || (i2.queryParameters = {}), null !== (s2 = (a2 = this.parameters).includeUUIDs) && void 0 !== s2 || (a2.includeUUIDs = true), null !== (n2 = (o2 = this.parameters).includeState) && void 0 !== n2 || (o2.includeState = false), null !== (r2 = (c2 = this.parameters).limit) && void 0 !== r2 || (c2.limit = 1e3);
        }
        operation() {
          const { channels: e2 = [], channelGroups: t2 = [] } = this.parameters;
          return 0 === e2.length && 0 === t2.length ? K.PNGlobalHereNowOperation : K.PNHereNowOperation;
        }
        validate() {
          if (!this.parameters.keySet.subscribeKey) return "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            var t2, s2;
            const n2 = this.deserializeResponse(e2), r2 = "occupancy" in n2 ? 1 : n2.payload.total_channels, i2 = "occupancy" in n2 ? n2.occupancy : n2.payload.total_occupancy, a2 = {};
            let o2 = {};
            const c2 = this.parameters.limit;
            let u2 = false;
            if ("occupancy" in n2) {
              const e3 = this.parameters.channels[0];
              o2[e3] = { uuids: null !== (t2 = n2.uuids) && void 0 !== t2 ? t2 : [], occupancy: i2 };
            } else o2 = null !== (s2 = n2.payload.channels) && void 0 !== s2 ? s2 : {};
            return Object.keys(o2).forEach(((e3) => {
              const t3 = o2[e3];
              a2[e3] = { occupants: this.parameters.includeUUIDs ? t3.uuids.map(((e4) => "string" == typeof e4 ? { uuid: e4, state: null } : e4)) : [], name: e3, occupancy: t3.occupancy }, u2 || t3.occupancy !== c2 || (u2 = true);
            })), { totalChannels: r2, totalOccupancy: i2, channels: a2 };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channels: t2, channelGroups: s2 } = this.parameters;
          let n2 = `/v2/presence/sub-key/${e2}`;
          return (t2 && t2.length > 0 || s2 && s2.length > 0) && (n2 += `/channel/${j(null != t2 ? t2 : [], ",")}`), n2;
        }
        get queryParameters() {
          const { channelGroups: e2, includeUUIDs: t2, includeState: s2, limit: n2, offset: r2, queryParameters: i2 } = this.parameters;
          return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.operation() === K.PNHereNowOperation ? { limit: n2 } : {}), this.operation() === K.PNHereNowOperation && null != r2 && r2 ? { offset: r2 } : {}), t2 ? {} : { disable_uuids: "1" }), null != s2 && s2 ? { state: "1" } : {}), e2 && e2.length > 0 ? { "channel-group": e2.join(",") } : {}), i2);
        }
      }
      class qt extends de {
        constructor(e2) {
          super({ method: ce.DELETE }), this.parameters = e2;
        }
        operation() {
          return K.PNDeleteMessagesOperation;
        }
        validate() {
          return this.parameters.keySet.subscribeKey ? this.parameters.channel ? void 0 : "Missing channel" : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v3/history/sub-key/${e2}/channel/${P(t2)}`;
        }
        get queryParameters() {
          const { start: e2, end: t2 } = this.parameters;
          return Object.assign(Object.assign({}, e2 ? { start: e2 } : {}), t2 ? { end: t2 } : {});
        }
      }
      class Gt extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNMessageCounts;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2, timetoken: s2, channelTimetokens: n2 } = this.parameters;
          return e2 ? t2 ? s2 && n2 ? "`timetoken` and `channelTimetokens` are incompatible together" : s2 || n2 ? n2 && n2.length > 1 && n2.length !== t2.length ? "Length of `channelTimetokens` and `channels` do not match" : void 0 : "`timetoken` or `channelTimetokens` need to be set" : "Missing channels" : "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { channels: this.deserializeResponse(e2).channels };
          }));
        }
        get path() {
          return `/v3/history/sub-key/${this.parameters.keySet.subscribeKey}/message-counts/${j(this.parameters.channels)}`;
        }
        get queryParameters() {
          let { channelTimetokens: e2 } = this.parameters;
          return this.parameters.timetoken && (e2 = [this.parameters.timetoken]), Object.assign(Object.assign({}, 1 === e2.length ? { timetoken: e2[0] } : {}), e2.length > 1 ? { channelsTimetoken: e2.join(",") } : {});
        }
      }
      class Kt extends de {
        constructor(e2) {
          var t2, s2, n2;
          super(), this.parameters = e2, e2.count ? e2.count = Math.min(e2.count, 100) : e2.count = 100, null !== (t2 = e2.stringifiedTimeToken) && void 0 !== t2 || (e2.stringifiedTimeToken = false), null !== (s2 = e2.includeMeta) && void 0 !== s2 || (e2.includeMeta = false), null !== (n2 = e2.logVerbosity) && void 0 !== n2 || (e2.logVerbosity = false);
        }
        operation() {
          return K.PNHistoryOperation;
        }
        validate() {
          return this.parameters.keySet.subscribeKey ? this.parameters.channel ? void 0 : "Missing channel" : "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            const t2 = this.deserializeResponse(e2), s2 = t2[0], n2 = t2[1], r2 = t2[2];
            return Array.isArray(s2) ? { messages: s2.map(((e3) => {
              const t3 = this.processPayload(e3.message), s3 = { entry: t3.payload, timetoken: e3.timetoken };
              return t3.error && (s3.error = t3.error), e3.meta && (s3.meta = e3.meta), s3;
            })), startTimeToken: n2, endTimeToken: r2 } : { messages: [], startTimeToken: n2, endTimeToken: r2 };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v2/history/sub-key/${e2}/channel/${P(t2)}`;
        }
        get queryParameters() {
          const { start: e2, end: t2, reverse: s2, count: n2, stringifiedTimeToken: r2, includeMeta: i2 } = this.parameters;
          return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ count: n2, include_token: "true" }, e2 ? { start: e2 } : {}), t2 ? { end: t2 } : {}), r2 ? { string_message_token: "true" } : {}), null != s2 ? { reverse: s2.toString() } : {}), i2 ? { include_meta: "true" } : {});
        }
        processPayload(e2) {
          const { crypto: t2, logVerbosity: s2 } = this.parameters;
          if (!t2 || "string" != typeof e2) return { payload: e2 };
          let n2, r2;
          try {
            const s3 = t2.decrypt(e2);
            n2 = s3 instanceof ArrayBuffer ? JSON.parse(Kt.decoder.decode(s3)) : s3;
          } catch (t3) {
            s2 && console.log("decryption error", t3.message), n2 = e2, r2 = `Error while decrypting message content: ${t3.message}`;
          }
          return { payload: n2, error: r2 };
        }
      }
      var Ht;
      !(function(e2) {
        e2[e2.Message = -1] = "Message", e2[e2.Files = 4] = "Files";
      })(Ht || (Ht = {}));
      class Bt extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2;
          super(), this.parameters = e2;
          const a2 = null !== (t2 = e2.includeMessageActions) && void 0 !== t2 && t2, o2 = e2.channels.length > 1 || a2 ? 25 : 100;
          e2.count ? e2.count = Math.min(e2.count, o2) : e2.count = o2, e2.includeUuid ? e2.includeUUID = e2.includeUuid : null !== (s2 = e2.includeUUID) && void 0 !== s2 || (e2.includeUUID = true), null !== (n2 = e2.stringifiedTimeToken) && void 0 !== n2 || (e2.stringifiedTimeToken = false), null !== (r2 = e2.includeMessageType) && void 0 !== r2 || (e2.includeMessageType = true), null !== (i2 = e2.logVerbosity) && void 0 !== i2 || (e2.logVerbosity = false);
        }
        operation() {
          return K.PNFetchMessagesOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2, includeMessageActions: s2 } = this.parameters;
          return e2 ? t2 ? void 0 !== s2 && s2 && t2.length > 1 ? "History can return actions data for a single channel only. Either pass a single channel or disable the includeMessageActions flag." : void 0 : "Missing channels" : "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            var t2;
            const s2 = this.deserializeResponse(e2), n2 = null !== (t2 = s2.channels) && void 0 !== t2 ? t2 : {}, r2 = {};
            return Object.keys(n2).forEach(((e3) => {
              r2[e3] = n2[e3].map(((t3) => {
                null === t3.message_type && (t3.message_type = Ht.Message);
                const s3 = this.processPayload(e3, t3), n3 = Object.assign(Object.assign({ channel: e3, timetoken: t3.timetoken, message: s3.payload, messageType: t3.message_type }, t3.custom_message_type ? { customMessageType: t3.custom_message_type } : {}), { uuid: t3.uuid });
                if (t3.actions) {
                  const e4 = n3;
                  e4.actions = t3.actions, e4.data = t3.actions;
                }
                return t3.meta && (n3.meta = t3.meta), s3.error && (n3.error = s3.error), n3;
              }));
            })), s2.more ? { channels: r2, more: s2.more } : { channels: r2 };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channels: t2, includeMessageActions: s2 } = this.parameters;
          return `/v3/${s2 ? "history-with-actions" : "history"}/sub-key/${e2}/channel/${j(t2)}`;
        }
        get queryParameters() {
          const { start: e2, end: t2, count: s2, includeCustomMessageType: n2, includeMessageType: r2, includeMeta: i2, includeUUID: a2, stringifiedTimeToken: o2 } = this.parameters;
          return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ max: s2 }, e2 ? { start: e2 } : {}), t2 ? { end: t2 } : {}), o2 ? { string_message_token: "true" } : {}), void 0 !== i2 && i2 ? { include_meta: "true" } : {}), a2 ? { include_uuid: "true" } : {}), null != n2 ? { include_custom_message_type: n2 ? "true" : "false" } : {}), r2 ? { include_message_type: "true" } : {});
        }
        processPayload(e2, t2) {
          const { crypto: s2, logVerbosity: n2 } = this.parameters;
          if (!s2 || "string" != typeof t2.message) return { payload: t2.message };
          let r2, i2;
          try {
            const e3 = s2.decrypt(t2.message);
            r2 = e3 instanceof ArrayBuffer ? JSON.parse(Bt.decoder.decode(e3)) : e3;
          } catch (e3) {
            n2 && console.log("decryption error", e3.message), r2 = t2.message, i2 = `Error while decrypting message content: ${e3.message}`;
          }
          if (!i2 && r2 && t2.message_type == Ht.Files && "object" == typeof r2 && this.isFileMessage(r2)) {
            const t3 = r2;
            return { payload: { message: t3.message, file: Object.assign(Object.assign({}, t3.file), { url: this.parameters.getFileUrl({ channel: e2, id: t3.file.id, name: t3.file.name }) }) }, error: i2 };
          }
          return { payload: r2, error: i2 };
        }
        isFileMessage(e2) {
          return void 0 !== e2.file;
        }
      }
      class Wt extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNGetMessageActionsOperation;
        }
        validate() {
          return this.parameters.keySet.subscribeKey ? this.parameters.channel ? void 0 : "Missing message channel" : "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            const t2 = this.deserializeResponse(e2);
            let s2 = null, n2 = null;
            return t2.data.length > 0 && (s2 = t2.data[0].actionTimetoken, n2 = t2.data[t2.data.length - 1].actionTimetoken), { data: t2.data, more: t2.more, start: s2, end: n2 };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v1/message-actions/${e2}/channel/${P(t2)}`;
        }
        get queryParameters() {
          const { limit: e2, start: t2, end: s2 } = this.parameters;
          return Object.assign(Object.assign(Object.assign({}, t2 ? { start: t2 } : {}), s2 ? { end: s2 } : {}), e2 ? { limit: e2 } : {});
        }
      }
      class Vt extends de {
        constructor(e2) {
          super({ method: ce.POST }), this.parameters = e2;
        }
        operation() {
          return K.PNAddMessageActionOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, action: t2, channel: s2, messageTimetoken: n2 } = this.parameters;
          return e2 ? s2 ? n2 ? t2 ? t2.value ? t2.type ? t2.type.length > 15 ? "Action.type value exceed maximum length of 15" : void 0 : "Missing Action.type" : "Missing Action.value" : "Missing Action" : "Missing message timetoken" : "Missing message channel" : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then((({ data: e3 }) => ({ data: e3 })));
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2, messageTimetoken: s2 } = this.parameters;
          return `/v1/message-actions/${e2}/channel/${P(t2)}/message/${s2}`;
        }
        get headers() {
          var e2;
          return Object.assign(Object.assign({}, null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {}), { "Content-Type": "application/json" });
        }
        get body() {
          return JSON.stringify(this.parameters.action);
        }
      }
      class zt extends de {
        constructor(e2) {
          super({ method: ce.DELETE }), this.parameters = e2;
        }
        operation() {
          return K.PNRemoveMessageActionOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channel: t2, messageTimetoken: s2, actionTimetoken: n2 } = this.parameters;
          return e2 ? t2 ? s2 ? n2 ? void 0 : "Missing action timetoken" : "Missing message timetoken" : "Missing message action channel" : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then((({ data: e3 }) => ({ data: e3 })));
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2, actionTimetoken: s2, messageTimetoken: n2 } = this.parameters;
          return `/v1/message-actions/${e2}/channel/${P(t2)}/message/${n2}/action/${s2}`;
        }
      }
      class Jt extends de {
        constructor(e2) {
          var t2, s2;
          super(), this.parameters = e2, null !== (t2 = (s2 = this.parameters).storeInHistory) && void 0 !== t2 || (s2.storeInHistory = true);
        }
        operation() {
          return K.PNPublishFileMessageOperation;
        }
        validate() {
          const { channel: e2, fileId: t2, fileName: s2 } = this.parameters;
          return e2 ? t2 ? s2 ? void 0 : "file name can't be empty" : "file id can't be empty" : "channel can't be empty";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { timetoken: this.deserializeResponse(e2)[2] };
          }));
        }
        get path() {
          const { message: e2, channel: t2, keySet: { publishKey: s2, subscribeKey: n2 }, fileId: r2, fileName: i2 } = this.parameters, a2 = Object.assign({ file: { name: i2, id: r2 } }, e2 ? { message: e2 } : {});
          return `/v1/files/publish-file/${s2}/${n2}/0/${P(t2)}/0/${P(this.prepareMessagePayload(a2))}`;
        }
        get queryParameters() {
          const { customMessageType: e2, storeInHistory: t2, ttl: s2, meta: n2 } = this.parameters;
          return Object.assign(Object.assign(Object.assign({ store: t2 ? "1" : "0" }, e2 ? { custom_message_type: e2 } : {}), s2 ? { ttl: s2 } : {}), n2 && "object" == typeof n2 ? { meta: JSON.stringify(n2) } : {});
        }
        prepareMessagePayload(e2) {
          const { crypto: t2 } = this.parameters;
          if (!t2) return JSON.stringify(e2) || "";
          const s2 = t2.encrypt(JSON.stringify(e2));
          return JSON.stringify("string" == typeof s2 ? s2 : u(s2));
        }
      }
      class Xt extends de {
        constructor(e2) {
          super({ method: ce.LOCAL }), this.parameters = e2;
        }
        operation() {
          return K.PNGetFileUrlOperation;
        }
        validate() {
          const { channel: e2, id: t2, name: s2 } = this.parameters;
          return e2 ? t2 ? s2 ? void 0 : "file name can't be empty" : "file id can't be empty" : "channel can't be empty";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return e2.url;
          }));
        }
        get path() {
          const { channel: e2, id: t2, name: s2, keySet: { subscribeKey: n2 } } = this.parameters;
          return `/v1/files/${n2}/channels/${P(e2)}/files/${P(t2)}/${P(s2)}`;
        }
      }
      class Qt extends de {
        constructor(e2) {
          super({ method: ce.DELETE }), this.parameters = e2;
        }
        operation() {
          return K.PNDeleteFileOperation;
        }
        validate() {
          const { channel: e2, id: t2, name: s2 } = this.parameters;
          return e2 ? t2 ? s2 ? void 0 : "file name can't be empty" : "file id can't be empty" : "channel can't be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, id: t2, channel: s2, name: n2 } = this.parameters;
          return `/v1/files/${e2}/channels/${P(s2)}/files/${P(t2)}/${P(n2)}`;
        }
      }
      class Yt extends de {
        constructor(e2) {
          var t2, s2;
          super(), this.parameters = e2, null !== (t2 = (s2 = this.parameters).limit) && void 0 !== t2 || (s2.limit = 100);
        }
        operation() {
          return K.PNListFilesOperation;
        }
        validate() {
          if (!this.parameters.channel) return "channel can't be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v1/files/${e2}/channels/${P(t2)}/files`;
        }
        get queryParameters() {
          const { limit: e2, next: t2 } = this.parameters;
          return Object.assign({ limit: e2 }, t2 ? { next: t2 } : {});
        }
      }
      class Zt extends de {
        constructor(e2) {
          super({ method: ce.POST }), this.parameters = e2;
        }
        operation() {
          return K.PNGenerateUploadUrlOperation;
        }
        validate() {
          return this.parameters.channel ? this.parameters.name ? void 0 : "'name' can't be empty" : "channel can't be empty";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            const t2 = this.deserializeResponse(e2);
            return { id: t2.data.id, name: t2.data.name, url: t2.file_upload_request.url, formFields: t2.file_upload_request.form_fields };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v1/files/${e2}/channels/${P(t2)}/generate-upload-url`;
        }
        get headers() {
          var e2;
          return Object.assign(Object.assign({}, null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {}), { "Content-Type": "application/json" });
        }
        get body() {
          return JSON.stringify({ name: this.parameters.name });
        }
      }
      class es extends de {
        constructor(e2) {
          super({ method: ce.POST }), this.parameters = e2;
          const t2 = e2.file.mimeType;
          t2 && (e2.formFields = e2.formFields.map(((e3) => "Content-Type" === e3.name ? { name: e3.name, value: t2 } : e3)));
        }
        operation() {
          return K.PNPublishFileOperation;
        }
        validate() {
          const { fileId: e2, fileName: t2, file: s2, uploadUrl: n2 } = this.parameters;
          return e2 ? t2 ? s2 ? n2 ? void 0 : "Validation failed: file upload 'url' can't be empty" : "Validation failed: 'file' can't be empty" : "Validation failed: file 'name' can't be empty" : "Validation failed: file 'id' can't be empty";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { status: e2.status, message: e2.body ? es.decoder.decode(e2.body) : "OK" };
          }));
        }
        request() {
          return Object.assign(Object.assign({}, super.request()), { origin: new URL(this.parameters.uploadUrl).origin, timeout: 300 });
        }
        get path() {
          const { pathname: e2, search: t2 } = new URL(this.parameters.uploadUrl);
          return `${e2}${t2}`;
        }
        get body() {
          return this.parameters.file;
        }
        get formData() {
          return this.parameters.formFields;
        }
      }
      class ts {
        constructor(e2) {
          var t2;
          if (this.parameters = e2, this.file = null === (t2 = this.parameters.PubNubFile) || void 0 === t2 ? void 0 : t2.create(e2.file), !this.file) throw new Error("File upload error: unable to create File object.");
        }
        process() {
          return i(this, void 0, void 0, (function* () {
            let e2, t2;
            return this.generateFileUploadUrl().then(((s2) => (e2 = s2.name, t2 = s2.id, this.uploadFile(s2)))).then(((e3) => {
              if (204 !== e3.status) throw new d("Upload to bucket was unsuccessful", { error: true, statusCode: e3.status, category: h.PNUnknownCategory, operation: K.PNPublishFileOperation, errorData: { message: e3.message } });
            })).then((() => this.publishFileMessage(t2, e2))).catch(((e3) => {
              if (e3 instanceof d) throw e3;
              const t3 = e3 instanceof q ? e3 : q.create(e3);
              throw new d("File upload error.", t3.toStatus(K.PNPublishFileOperation));
            }));
          }));
        }
        generateFileUploadUrl() {
          return i(this, void 0, void 0, (function* () {
            const e2 = new Zt(Object.assign(Object.assign({}, this.parameters), { name: this.file.name, keySet: this.parameters.keySet }));
            return this.parameters.sendRequest(e2);
          }));
        }
        uploadFile(e2) {
          return i(this, void 0, void 0, (function* () {
            const { cipherKey: t2, PubNubFile: s2, crypto: n2, cryptography: r2 } = this.parameters, { id: i2, name: a2, url: o2, formFields: c2 } = e2;
            return this.parameters.PubNubFile.supportsEncryptFile && (!t2 && n2 ? this.file = yield n2.encryptFile(this.file, s2) : t2 && r2 && (this.file = yield r2.encryptFile(t2, this.file, s2))), this.parameters.sendRequest(new es({ fileId: i2, fileName: a2, file: this.file, uploadUrl: o2, formFields: c2 }));
          }));
        }
        publishFileMessage(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2, n2, r2, i2;
            let a2, o2 = { timetoken: "0" }, c2 = this.parameters.fileUploadPublishRetryLimit, u2 = false;
            do {
              try {
                o2 = yield this.parameters.publishFile(Object.assign(Object.assign({}, this.parameters), { fileId: e2, fileName: t2 })), u2 = true;
              } catch (e3) {
                e3 instanceof d && (a2 = e3), c2 -= 1;
              }
            } while (!u2 && c2 > 0);
            if (u2) return { status: 200, timetoken: o2.timetoken, id: e2, name: t2 };
            throw new d("Publish failed. You may want to execute that operation manually using pubnub.publishFile", { error: true, category: null !== (n2 = null === (s2 = a2.status) || void 0 === s2 ? void 0 : s2.category) && void 0 !== n2 ? n2 : h.PNUnknownCategory, statusCode: null !== (i2 = null === (r2 = a2.status) || void 0 === r2 ? void 0 : r2.statusCode) && void 0 !== i2 ? i2 : 0, channel: this.parameters.channel, id: e2, name: t2 });
          }));
        }
      }
      class ss {
        constructor(e2, t2) {
          this.subscriptionStateIds = [], this.client = t2, this._nameOrId = e2;
        }
        get entityType() {
          return "Channel";
        }
        get subscriptionType() {
          return Et.Channel;
        }
        subscriptionNames(e2) {
          return [this._nameOrId, ...e2 && !this._nameOrId.endsWith("-pnpres") ? [`${this._nameOrId}-pnpres`] : []];
        }
        subscription(e2) {
          return new Ut({ client: this.client, entity: this, options: e2 });
        }
        get subscriptionsCount() {
          return this.subscriptionStateIds.length;
        }
        increaseSubscriptionCount(e2) {
          this.subscriptionStateIds.includes(e2) || this.subscriptionStateIds.push(e2);
        }
        decreaseSubscriptionCount(e2) {
          {
            const t2 = this.subscriptionStateIds.indexOf(e2);
            t2 >= 0 && this.subscriptionStateIds.splice(t2, 1);
          }
        }
        toString() {
          return `${this.entityType} { nameOrId: ${this._nameOrId}, subscriptionsCount: ${this.subscriptionsCount} }`;
        }
      }
      class ns extends ss {
        get entityType() {
          return "ChannelMetadata";
        }
        get id() {
          return this._nameOrId;
        }
        subscriptionNames(e2) {
          return [this.id];
        }
      }
      class rs extends ss {
        get entityType() {
          return "ChannelGroups";
        }
        get name() {
          return this._nameOrId;
        }
        get subscriptionType() {
          return Et.ChannelGroup;
        }
      }
      class is extends ss {
        get entityType() {
          return "UserMetadata";
        }
        get id() {
          return this._nameOrId;
        }
        subscriptionNames(e2) {
          return [this.id];
        }
      }
      class as extends ss {
        get entityType() {
          return "Channel";
        }
        get name() {
          return this._nameOrId;
        }
      }
      class os extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNRemoveChannelsFromGroupOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2, channelGroup: s2 } = this.parameters;
          return e2 ? s2 ? t2 ? void 0 : "Missing channels" : "Missing Channel Group" : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channelGroup: t2 } = this.parameters;
          return `/v1/channel-registration/sub-key/${e2}/channel-group/${P(t2)}`;
        }
        get queryParameters() {
          return { remove: this.parameters.channels.join(",") };
        }
      }
      class cs extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNAddChannelsToGroupOperation;
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, channels: t2, channelGroup: s2 } = this.parameters;
          return e2 ? s2 ? t2 ? void 0 : "Missing channels" : "Missing Channel Group" : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channelGroup: t2 } = this.parameters;
          return `/v1/channel-registration/sub-key/${e2}/channel-group/${P(t2)}`;
        }
        get queryParameters() {
          return { add: this.parameters.channels.join(",") };
        }
      }
      class us extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNChannelsForGroupOperation;
        }
        validate() {
          return this.parameters.keySet.subscribeKey ? this.parameters.channelGroup ? void 0 : "Missing Channel Group" : "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { channels: this.deserializeResponse(e2).payload.channels };
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channelGroup: t2 } = this.parameters;
          return `/v1/channel-registration/sub-key/${e2}/channel-group/${P(t2)}`;
        }
      }
      class ls extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNRemoveGroupOperation;
        }
        validate() {
          return this.parameters.keySet.subscribeKey ? this.parameters.channelGroup ? void 0 : "Missing Channel Group" : "Missing Subscribe Key";
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channelGroup: t2 } = this.parameters;
          return `/v1/channel-registration/sub-key/${e2}/channel-group/${P(t2)}/remove`;
        }
      }
      class hs extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNChannelGroupsOperation;
        }
        validate() {
          if (!this.parameters.keySet.subscribeKey) return "Missing Subscribe Key";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { groups: this.deserializeResponse(e2).payload.groups };
          }));
        }
        get path() {
          return `/v1/channel-registration/sub-key/${this.parameters.keySet.subscribeKey}/channel-group`;
        }
      }
      class ds {
        constructor(e2, t2, s2) {
          this.sendRequest = s2, this.logger = e2, this.keySet = t2;
        }
        listChannels(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "List channel group channels with parameters:" })));
            const s2 = new us(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = (e3) => {
              e3 && this.logger.debug("PubNub", `List channel group channels success. Received ${e3.channels.length} channels.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        listGroups(e2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", "List all channel groups.");
            const t2 = new hs({ keySet: this.keySet }), s2 = (e3) => {
              e3 && this.logger.debug("PubNub", `List all channel groups success. Received ${e3.groups.length} groups.`);
            };
            return e2 ? this.sendRequest(t2, ((t3, n2) => {
              s2(n2), e2(t3, n2);
            })) : this.sendRequest(t2).then(((e3) => (s2(e3), e3)));
          }));
        }
        addChannels(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Add channels to the channel group with parameters:" })));
            const s2 = new cs(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = () => {
              this.logger.debug("PubNub", "Add channels to the channel group success.");
            };
            return t2 ? this.sendRequest(s2, ((e3) => {
              e3.error || n2(), t2(e3);
            })) : this.sendRequest(s2).then(((e3) => (n2(), e3)));
          }));
        }
        removeChannels(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove channels from the channel group with parameters:" })));
            const s2 = new os(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = () => {
              this.logger.debug("PubNub", "Remove channels from the channel group success.");
            };
            return t2 ? this.sendRequest(s2, ((e3) => {
              e3.error || n2(), t2(e3);
            })) : this.sendRequest(s2).then(((e3) => (n2(), e3)));
          }));
        }
        deleteGroup(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove a channel group with parameters:" })));
            const s2 = new ls(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = () => {
              this.logger.debug("PubNub", `Remove a channel group success. Removed '${e2.channelGroup}' channel group.'`);
            };
            return t2 ? this.sendRequest(s2, ((e3) => {
              e3.error || n2(), t2(e3);
            })) : this.sendRequest(s2).then(((e3) => (n2(), e3)));
          }));
        }
      }
      class ps extends de {
        constructor(e2) {
          var t2, s2;
          super(), this.parameters = e2, "apns2" === this.parameters.pushGateway && (null !== (t2 = (s2 = this.parameters).environment) && void 0 !== t2 || (s2.environment = "development")), this.parameters.count && this.parameters.count > 1e3 && (this.parameters.count = 1e3);
        }
        operation() {
          throw Error("Should be implemented in subclass.");
        }
        validate() {
          const { keySet: { subscribeKey: e2 }, action: t2, device: s2, pushGateway: n2 } = this.parameters;
          return e2 ? s2 ? "add" !== t2 && "remove" !== t2 || "channels" in this.parameters && 0 !== this.parameters.channels.length ? n2 ? "apns2" !== this.parameters.pushGateway || this.parameters.topic ? void 0 : "Missing APNS2 topic" : "Missing GW Type (pushGateway: fcm or apns2)" : "Missing Channels" : "Missing Device ID (device)" : "Missing Subscribe Key";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, action: t2, device: s2, pushGateway: n2 } = this.parameters;
          let r2 = "apns2" === n2 ? `/v2/push/sub-key/${e2}/devices-apns2/${s2}` : `/v1/push/sub-key/${e2}/devices/${s2}`;
          return "remove-device" === t2 && (r2 = `${r2}/remove`), r2;
        }
        get queryParameters() {
          const { start: e2, count: t2 } = this.parameters;
          let s2 = Object.assign(Object.assign({ type: this.parameters.pushGateway }, e2 ? { start: e2 } : {}), t2 && t2 > 0 ? { count: t2 } : {});
          if ("channels" in this.parameters && (s2[this.parameters.action] = this.parameters.channels.join(",")), "apns2" === this.parameters.pushGateway) {
            const { environment: e3, topic: t3 } = this.parameters;
            s2 = Object.assign(Object.assign({}, s2), { environment: e3, topic: t3 });
          }
          return s2;
        }
      }
      class gs extends ps {
        constructor(e2) {
          super(Object.assign(Object.assign({}, e2), { action: "remove" }));
        }
        operation() {
          return K.PNRemovePushNotificationEnabledChannelsOperation;
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
      }
      class bs extends ps {
        constructor(e2) {
          super(Object.assign(Object.assign({}, e2), { action: "list" }));
        }
        operation() {
          return K.PNPushNotificationEnabledChannelsOperation;
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { channels: this.deserializeResponse(e2) };
          }));
        }
      }
      class ys extends ps {
        constructor(e2) {
          super(Object.assign(Object.assign({}, e2), { action: "add" }));
        }
        operation() {
          return K.PNAddPushNotificationEnabledChannelsOperation;
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
      }
      class ms extends ps {
        constructor(e2) {
          super(Object.assign(Object.assign({}, e2), { action: "remove-device" }));
        }
        operation() {
          return K.PNRemoveAllPushNotificationsOperation;
        }
        parse(e2) {
          const t2 = Object.create(null, { parse: { get: () => super.parse } });
          return i(this, void 0, void 0, (function* () {
            return t2.parse.call(this, e2).then(((e3) => ({})));
          }));
        }
      }
      class fs {
        constructor(e2, t2, s2) {
          this.sendRequest = s2, this.logger = e2, this.keySet = t2;
        }
        listChannels(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "List push-enabled channels with parameters:" })));
            const s2 = new bs(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = (e3) => {
              e3 && this.logger.debug("PubNub", `List push-enabled channels success. Received ${e3.channels.length} channels.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        addChannels(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Add push-enabled channels with parameters:" })));
            const s2 = new ys(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = () => {
              this.logger.debug("PubNub", "Add push-enabled channels success.");
            };
            return t2 ? this.sendRequest(s2, ((e3) => {
              e3.error || n2(), t2(e3);
            })) : this.sendRequest(s2).then(((e3) => (n2(), e3)));
          }));
        }
        removeChannels(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove push-enabled channels with parameters:" })));
            const s2 = new gs(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = () => {
              this.logger.debug("PubNub", "Remove push-enabled channels success.");
            };
            return t2 ? this.sendRequest(s2, ((e3) => {
              e3.error || n2(), t2(e3);
            })) : this.sendRequest(s2).then(((e3) => (n2(), e3)));
          }));
        }
        deleteDevice(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove push notifications for device with parameters:" })));
            const s2 = new ms(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = () => {
              this.logger.debug("PubNub", "Remove push notifications for device success.");
            };
            return t2 ? this.sendRequest(s2, ((e3) => {
              e3.error || n2(), t2(e3);
            })) : this.sendRequest(s2).then(((e3) => (n2(), e3)));
          }));
        }
      }
      class vs extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2, a2;
          super(), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (i2 = e2.include).customFields) && void 0 !== s2 || (i2.customFields = false), null !== (n2 = (a2 = e2.include).totalCount) && void 0 !== n2 || (a2.totalCount = false), null !== (r2 = e2.limit) && void 0 !== r2 || (e2.limit = 100);
        }
        operation() {
          return K.PNGetAllChannelMetadataOperation;
        }
        get path() {
          return `/v2/objects/${this.parameters.keySet.subscribeKey}/channels`;
        }
        get queryParameters() {
          const { include: e2, page: t2, filter: s2, sort: n2, limit: r2 } = this.parameters;
          let i2 = "";
          return i2 = "string" == typeof n2 ? n2 : Object.entries(null != n2 ? n2 : {}).map((([e3, t3]) => null !== t3 ? `${e3}:${t3}` : e3)), Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ include: ["status", "type", ...e2.customFields ? ["custom"] : []].join(","), count: `${e2.totalCount}` }, s2 ? { filter: s2 } : {}), (null == t2 ? void 0 : t2.next) ? { start: t2.next } : {}), (null == t2 ? void 0 : t2.prev) ? { end: t2.prev } : {}), r2 ? { limit: r2 } : {}), i2.length ? { sort: i2 } : {});
        }
      }
      class Ss extends de {
        constructor(e2) {
          super({ method: ce.DELETE }), this.parameters = e2;
        }
        operation() {
          return K.PNRemoveChannelMetadataOperation;
        }
        validate() {
          if (!this.parameters.channel) return "Channel cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v2/objects/${e2}/channels/${P(t2)}`;
        }
      }
      class ws extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2, a2, o2, c2, u2, l2, h2, d2, p2, g2, b2, y2, m2, f2;
          super(), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (h2 = e2.include).customFields) && void 0 !== s2 || (h2.customFields = false), null !== (n2 = (d2 = e2.include).totalCount) && void 0 !== n2 || (d2.totalCount = false), null !== (r2 = (p2 = e2.include).statusField) && void 0 !== r2 || (p2.statusField = false), null !== (i2 = (g2 = e2.include).typeField) && void 0 !== i2 || (g2.typeField = false), null !== (a2 = (b2 = e2.include).channelFields) && void 0 !== a2 || (b2.channelFields = false), null !== (o2 = (y2 = e2.include).customChannelFields) && void 0 !== o2 || (y2.customChannelFields = false), null !== (c2 = (m2 = e2.include).channelStatusField) && void 0 !== c2 || (m2.channelStatusField = false), null !== (u2 = (f2 = e2.include).channelTypeField) && void 0 !== u2 || (f2.channelTypeField = false), null !== (l2 = e2.limit) && void 0 !== l2 || (e2.limit = 100), this.parameters.userId && (this.parameters.uuid = this.parameters.userId);
        }
        operation() {
          return K.PNGetMembershipsOperation;
        }
        validate() {
          if (!this.parameters.uuid) return "'uuid' cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2 } = this.parameters;
          return `/v2/objects/${e2}/uuids/${P(t2)}/channels`;
        }
        get queryParameters() {
          const { include: e2, page: t2, filter: s2, sort: n2, limit: r2 } = this.parameters;
          let i2 = "";
          i2 = "string" == typeof n2 ? n2 : Object.entries(null != n2 ? n2 : {}).map((([e3, t3]) => null !== t3 ? `${e3}:${t3}` : e3));
          const a2 = [];
          return e2.statusField && a2.push("status"), e2.typeField && a2.push("type"), e2.customFields && a2.push("custom"), e2.channelFields && a2.push("channel"), e2.channelStatusField && a2.push("channel.status"), e2.channelTypeField && a2.push("channel.type"), e2.customChannelFields && a2.push("channel.custom"), Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ count: `${e2.totalCount}` }, a2.length > 0 ? { include: a2.join(",") } : {}), s2 ? { filter: s2 } : {}), (null == t2 ? void 0 : t2.next) ? { start: t2.next } : {}), (null == t2 ? void 0 : t2.prev) ? { end: t2.prev } : {}), r2 ? { limit: r2 } : {}), i2.length ? { sort: i2 } : {});
        }
      }
      class Os extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2, a2, o2, c2, u2, l2, h2, d2, p2, g2, b2, y2, m2, f2;
          super({ method: ce.PATCH }), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (h2 = e2.include).customFields) && void 0 !== s2 || (h2.customFields = false), null !== (n2 = (d2 = e2.include).totalCount) && void 0 !== n2 || (d2.totalCount = false), null !== (r2 = (p2 = e2.include).statusField) && void 0 !== r2 || (p2.statusField = false), null !== (i2 = (g2 = e2.include).typeField) && void 0 !== i2 || (g2.typeField = false), null !== (a2 = (b2 = e2.include).channelFields) && void 0 !== a2 || (b2.channelFields = false), null !== (o2 = (y2 = e2.include).customChannelFields) && void 0 !== o2 || (y2.customChannelFields = false), null !== (c2 = (m2 = e2.include).channelStatusField) && void 0 !== c2 || (m2.channelStatusField = false), null !== (u2 = (f2 = e2.include).channelTypeField) && void 0 !== u2 || (f2.channelTypeField = false), null !== (l2 = e2.limit) && void 0 !== l2 || (e2.limit = 100), this.parameters.userId && (this.parameters.uuid = this.parameters.userId);
        }
        operation() {
          return K.PNSetMembershipsOperation;
        }
        validate() {
          const { uuid: e2, channels: t2 } = this.parameters;
          return e2 ? t2 && 0 !== t2.length ? void 0 : "Channels cannot be empty" : "'uuid' cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2 } = this.parameters;
          return `/v2/objects/${e2}/uuids/${P(t2)}/channels`;
        }
        get queryParameters() {
          const { include: e2, page: t2, filter: s2, sort: n2, limit: r2 } = this.parameters;
          let i2 = "";
          i2 = "string" == typeof n2 ? n2 : Object.entries(null != n2 ? n2 : {}).map((([e3, t3]) => null !== t3 ? `${e3}:${t3}` : e3));
          const a2 = ["channel.status", "channel.type", "status"];
          return e2.statusField && a2.push("status"), e2.typeField && a2.push("type"), e2.customFields && a2.push("custom"), e2.channelFields && a2.push("channel"), e2.channelStatusField && a2.push("channel.status"), e2.channelTypeField && a2.push("channel.type"), e2.customChannelFields && a2.push("channel.custom"), Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ count: `${e2.totalCount}` }, a2.length > 0 ? { include: a2.join(",") } : {}), s2 ? { filter: s2 } : {}), (null == t2 ? void 0 : t2.next) ? { start: t2.next } : {}), (null == t2 ? void 0 : t2.prev) ? { end: t2.prev } : {}), r2 ? { limit: r2 } : {}), i2.length ? { sort: i2 } : {});
        }
        get headers() {
          var e2;
          return Object.assign(Object.assign({}, null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {}), { "Content-Type": "application/json" });
        }
        get body() {
          const { channels: e2, type: t2 } = this.parameters;
          return JSON.stringify({ [`${t2}`]: e2.map(((e3) => "string" == typeof e3 ? { channel: { id: e3 } } : { channel: { id: e3.id }, status: e3.status, type: e3.type, custom: e3.custom })) });
        }
      }
      class ks extends de {
        constructor(e2) {
          var t2, s2, n2, r2;
          super(), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (r2 = e2.include).customFields) && void 0 !== s2 || (r2.customFields = false), null !== (n2 = e2.limit) && void 0 !== n2 || (e2.limit = 100);
        }
        operation() {
          return K.PNGetAllUUIDMetadataOperation;
        }
        get path() {
          return `/v2/objects/${this.parameters.keySet.subscribeKey}/uuids`;
        }
        get queryParameters() {
          const { include: e2, page: t2, filter: s2, sort: n2, limit: r2 } = this.parameters;
          let i2 = "";
          return i2 = "string" == typeof n2 ? n2 : Object.entries(null != n2 ? n2 : {}).map((([e3, t3]) => null !== t3 ? `${e3}:${t3}` : e3)), Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ include: ["status", "type", ...e2.customFields ? ["custom"] : []].join(",") }, void 0 !== e2.totalCount ? { count: `${e2.totalCount}` } : {}), s2 ? { filter: s2 } : {}), (null == t2 ? void 0 : t2.next) ? { start: t2.next } : {}), (null == t2 ? void 0 : t2.prev) ? { end: t2.prev } : {}), r2 ? { limit: r2 } : {}), i2.length ? { sort: i2 } : {});
        }
      }
      class Cs extends de {
        constructor(e2) {
          var t2, s2, n2;
          super(), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (n2 = e2.include).customFields) && void 0 !== s2 || (n2.customFields = true);
        }
        operation() {
          return K.PNGetChannelMetadataOperation;
        }
        validate() {
          if (!this.parameters.channel) return "Channel cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v2/objects/${e2}/channels/${P(t2)}`;
        }
        get queryParameters() {
          return { include: ["status", "type", ...this.parameters.include.customFields ? ["custom"] : []].join(",") };
        }
      }
      class Ps extends de {
        constructor(e2) {
          var t2, s2, n2;
          super({ method: ce.PATCH }), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (n2 = e2.include).customFields) && void 0 !== s2 || (n2.customFields = true);
        }
        operation() {
          return K.PNSetChannelMetadataOperation;
        }
        validate() {
          return this.parameters.channel ? this.parameters.data ? void 0 : "Data cannot be empty" : "Channel cannot be empty";
        }
        get headers() {
          var e2;
          let t2 = null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {};
          return this.parameters.ifMatchesEtag && (t2 = Object.assign(Object.assign({}, t2), { "If-Match": this.parameters.ifMatchesEtag })), Object.assign(Object.assign({}, t2), { "Content-Type": "application/json" });
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v2/objects/${e2}/channels/${P(t2)}`;
        }
        get queryParameters() {
          return { include: ["status", "type", ...this.parameters.include.customFields ? ["custom"] : []].join(",") };
        }
        get body() {
          return JSON.stringify(this.parameters.data);
        }
      }
      class js extends de {
        constructor(e2) {
          super({ method: ce.DELETE }), this.parameters = e2, this.parameters.userId && (this.parameters.uuid = this.parameters.userId);
        }
        operation() {
          return K.PNRemoveUUIDMetadataOperation;
        }
        validate() {
          if (!this.parameters.uuid) return "'uuid' cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2 } = this.parameters;
          return `/v2/objects/${e2}/uuids/${P(t2)}`;
        }
      }
      class Es extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2, a2, o2, c2, u2, l2, h2, d2, p2, g2, b2, y2, m2, f2;
          super(), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (h2 = e2.include).customFields) && void 0 !== s2 || (h2.customFields = false), null !== (n2 = (d2 = e2.include).totalCount) && void 0 !== n2 || (d2.totalCount = false), null !== (r2 = (p2 = e2.include).statusField) && void 0 !== r2 || (p2.statusField = false), null !== (i2 = (g2 = e2.include).typeField) && void 0 !== i2 || (g2.typeField = false), null !== (a2 = (b2 = e2.include).UUIDFields) && void 0 !== a2 || (b2.UUIDFields = false), null !== (o2 = (y2 = e2.include).customUUIDFields) && void 0 !== o2 || (y2.customUUIDFields = false), null !== (c2 = (m2 = e2.include).UUIDStatusField) && void 0 !== c2 || (m2.UUIDStatusField = false), null !== (u2 = (f2 = e2.include).UUIDTypeField) && void 0 !== u2 || (f2.UUIDTypeField = false), null !== (l2 = e2.limit) && void 0 !== l2 || (e2.limit = 100);
        }
        operation() {
          return K.PNSetMembersOperation;
        }
        validate() {
          if (!this.parameters.channel) return "Channel cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v2/objects/${e2}/channels/${P(t2)}/uuids`;
        }
        get queryParameters() {
          const { include: e2, page: t2, filter: s2, sort: n2, limit: r2 } = this.parameters;
          let i2 = "";
          i2 = "string" == typeof n2 ? n2 : Object.entries(null != n2 ? n2 : {}).map((([e3, t3]) => null !== t3 ? `${e3}:${t3}` : e3));
          const a2 = [];
          return e2.statusField && a2.push("status"), e2.typeField && a2.push("type"), e2.customFields && a2.push("custom"), e2.UUIDFields && a2.push("uuid"), e2.UUIDStatusField && a2.push("uuid.status"), e2.UUIDTypeField && a2.push("uuid.type"), e2.customUUIDFields && a2.push("uuid.custom"), Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ count: `${e2.totalCount}` }, a2.length > 0 ? { include: a2.join(",") } : {}), s2 ? { filter: s2 } : {}), (null == t2 ? void 0 : t2.next) ? { start: t2.next } : {}), (null == t2 ? void 0 : t2.prev) ? { end: t2.prev } : {}), r2 ? { limit: r2 } : {}), i2.length ? { sort: i2 } : {});
        }
      }
      class Ns extends de {
        constructor(e2) {
          var t2, s2, n2, r2, i2, a2, o2, c2, u2, l2, h2, d2, p2, g2, b2, y2, m2, f2;
          super({ method: ce.PATCH }), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (h2 = e2.include).customFields) && void 0 !== s2 || (h2.customFields = false), null !== (n2 = (d2 = e2.include).totalCount) && void 0 !== n2 || (d2.totalCount = false), null !== (r2 = (p2 = e2.include).statusField) && void 0 !== r2 || (p2.statusField = false), null !== (i2 = (g2 = e2.include).typeField) && void 0 !== i2 || (g2.typeField = false), null !== (a2 = (b2 = e2.include).UUIDFields) && void 0 !== a2 || (b2.UUIDFields = false), null !== (o2 = (y2 = e2.include).customUUIDFields) && void 0 !== o2 || (y2.customUUIDFields = false), null !== (c2 = (m2 = e2.include).UUIDStatusField) && void 0 !== c2 || (m2.UUIDStatusField = false), null !== (u2 = (f2 = e2.include).UUIDTypeField) && void 0 !== u2 || (f2.UUIDTypeField = false), null !== (l2 = e2.limit) && void 0 !== l2 || (e2.limit = 100);
        }
        operation() {
          return K.PNSetMembersOperation;
        }
        validate() {
          const { channel: e2, uuids: t2 } = this.parameters;
          return e2 ? t2 && 0 !== t2.length ? void 0 : "UUIDs cannot be empty" : "Channel cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2 } = this.parameters;
          return `/v2/objects/${e2}/channels/${P(t2)}/uuids`;
        }
        get queryParameters() {
          const { include: e2, page: t2, filter: s2, sort: n2, limit: r2 } = this.parameters;
          let i2 = "";
          i2 = "string" == typeof n2 ? n2 : Object.entries(null != n2 ? n2 : {}).map((([e3, t3]) => null !== t3 ? `${e3}:${t3}` : e3));
          const a2 = ["uuid.status", "uuid.type", "type"];
          return e2.statusField && a2.push("status"), e2.typeField && a2.push("type"), e2.customFields && a2.push("custom"), e2.UUIDFields && a2.push("uuid"), e2.UUIDStatusField && a2.push("uuid.status"), e2.UUIDTypeField && a2.push("uuid.type"), e2.customUUIDFields && a2.push("uuid.custom"), Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ count: `${e2.totalCount}` }, a2.length > 0 ? { include: a2.join(",") } : {}), s2 ? { filter: s2 } : {}), (null == t2 ? void 0 : t2.next) ? { start: t2.next } : {}), (null == t2 ? void 0 : t2.prev) ? { end: t2.prev } : {}), r2 ? { limit: r2 } : {}), i2.length ? { sort: i2 } : {});
        }
        get headers() {
          var e2;
          return Object.assign(Object.assign({}, null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {}), { "Content-Type": "application/json" });
        }
        get body() {
          const { uuids: e2, type: t2 } = this.parameters;
          return JSON.stringify({ [`${t2}`]: e2.map(((e3) => "string" == typeof e3 ? { uuid: { id: e3 } } : { uuid: { id: e3.id }, status: e3.status, type: e3.type, custom: e3.custom })) });
        }
      }
      class Ts extends de {
        constructor(e2) {
          var t2, s2, n2;
          super(), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (n2 = e2.include).customFields) && void 0 !== s2 || (n2.customFields = true), this.parameters.userId && (this.parameters.uuid = this.parameters.userId);
        }
        operation() {
          return K.PNGetUUIDMetadataOperation;
        }
        validate() {
          if (!this.parameters.uuid) return "'uuid' cannot be empty";
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2 } = this.parameters;
          return `/v2/objects/${e2}/uuids/${P(t2)}`;
        }
        get queryParameters() {
          const { include: e2 } = this.parameters;
          return { include: ["status", "type", ...e2.customFields ? ["custom"] : []].join(",") };
        }
      }
      class _s extends de {
        constructor(e2) {
          var t2, s2, n2;
          super({ method: ce.PATCH }), this.parameters = e2, null !== (t2 = e2.include) && void 0 !== t2 || (e2.include = {}), null !== (s2 = (n2 = e2.include).customFields) && void 0 !== s2 || (n2.customFields = true), this.parameters.userId && (this.parameters.uuid = this.parameters.userId);
        }
        operation() {
          return K.PNSetUUIDMetadataOperation;
        }
        validate() {
          return this.parameters.uuid ? this.parameters.data ? void 0 : "Data cannot be empty" : "'uuid' cannot be empty";
        }
        get headers() {
          var e2;
          let t2 = null !== (e2 = super.headers) && void 0 !== e2 ? e2 : {};
          return this.parameters.ifMatchesEtag && (t2 = Object.assign(Object.assign({}, t2), { "If-Match": this.parameters.ifMatchesEtag })), Object.assign(Object.assign({}, t2), { "Content-Type": "application/json" });
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, uuid: t2 } = this.parameters;
          return `/v2/objects/${e2}/uuids/${P(t2)}`;
        }
        get queryParameters() {
          return { include: ["status", "type", ...this.parameters.include.customFields ? ["custom"] : []].join(",") };
        }
        get body() {
          return JSON.stringify(this.parameters.data);
        }
      }
      class Is {
        constructor(e2, t2) {
          this.keySet = e2.keySet, this.configuration = e2, this.sendRequest = t2;
        }
        get logger() {
          return this.configuration.logger();
        }
        getAllUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : {}, details: "Get all UUID metadata objects with parameters:" }))), this._getAllUUIDMetadata(e2, t2);
          }));
        }
        _getAllUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = e2 && "function" != typeof e2 ? e2 : {};
            null != t2 || (t2 = "function" == typeof e2 ? e2 : void 0);
            const n2 = new ks(Object.assign(Object.assign({}, s2), { keySet: this.keySet })), r2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Get all UUID metadata success. Received ${e3.totalCount} UUID metadata objects.`);
            };
            return t2 ? this.sendRequest(n2, ((e3, s3) => {
              r2(s3), t2(e3, s3);
            })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
          }));
        }
        getUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : { uuid: this.configuration.userId }, details: `Get ${e2 && "function" != typeof e2 ? "" : " current"} UUID metadata object with parameters:` }))), this._getUUIDMetadata(e2, t2);
          }));
        }
        _getUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            const n2 = e2 && "function" != typeof e2 ? e2 : {};
            null != t2 || (t2 = "function" == typeof e2 ? e2 : void 0), n2.userId && (this.logger.warn("PubNub", "'userId' parameter is deprecated. Use 'uuid' instead."), n2.uuid = n2.userId), null !== (s2 = n2.uuid) && void 0 !== s2 || (n2.uuid = this.configuration.userId);
            const r2 = new Ts(Object.assign(Object.assign({}, n2), { keySet: this.keySet })), i2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Get UUID metadata object success. Received '${n2.uuid}' UUID metadata object.`);
            };
            return t2 ? this.sendRequest(r2, ((e3, s3) => {
              i2(s3), t2(e3, s3);
            })) : this.sendRequest(r2).then(((e3) => (i2(e3), e3)));
          }));
        }
        setUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Set UUID metadata object with parameters:" }))), this._setUUIDMetadata(e2, t2);
          }));
        }
        _setUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            e2.userId && (this.logger.warn("PubNub", "'userId' parameter is deprecated. Use 'uuid' instead."), e2.uuid = e2.userId), null !== (s2 = e2.uuid) && void 0 !== s2 || (e2.uuid = this.configuration.userId);
            const n2 = new _s(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), r2 = (t3) => {
              t3 && this.logger.debug("PubNub", `Set UUID metadata object success. Updated '${e2.uuid}' UUID metadata object.`);
            };
            return t2 ? this.sendRequest(n2, ((e3, s3) => {
              r2(s3), t2(e3, s3);
            })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
          }));
        }
        removeUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : { uuid: this.configuration.userId }, details: `Remove${e2 && "function" != typeof e2 ? "" : " current"} UUID metadata object with parameters:` }))), this._removeUUIDMetadata(e2, t2);
          }));
        }
        _removeUUIDMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            const n2 = e2 && "function" != typeof e2 ? e2 : {};
            null != t2 || (t2 = "function" == typeof e2 ? e2 : void 0), n2.userId && (this.logger.warn("PubNub", "'userId' parameter is deprecated. Use 'uuid' instead."), n2.uuid = n2.userId), null !== (s2 = n2.uuid) && void 0 !== s2 || (n2.uuid = this.configuration.userId);
            const r2 = new js(Object.assign(Object.assign({}, n2), { keySet: this.keySet })), i2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Remove UUID metadata object success. Removed '${n2.uuid}' UUID metadata object.`);
            };
            return t2 ? this.sendRequest(r2, ((e3, s3) => {
              i2(s3), t2(e3, s3);
            })) : this.sendRequest(r2).then(((e3) => (i2(e3), e3)));
          }));
        }
        getAllChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : {}, details: "Get all Channel metadata objects with parameters:" }))), this._getAllChannelMetadata(e2, t2);
          }));
        }
        _getAllChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = e2 && "function" != typeof e2 ? e2 : {};
            null != t2 || (t2 = "function" == typeof e2 ? e2 : void 0);
            const n2 = new vs(Object.assign(Object.assign({}, s2), { keySet: this.keySet })), r2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Get all Channel metadata objects success. Received ${e3.totalCount} Channel metadata objects.`);
            };
            return t2 ? this.sendRequest(n2, ((e3, s3) => {
              r2(s3), t2(e3, s3);
            })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
          }));
        }
        getChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Get Channel metadata object with parameters:" }))), this._getChannelMetadata(e2, t2);
          }));
        }
        _getChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = new Cs(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = (t3) => {
              t3 && this.logger.debug("PubNub", `Get Channel metadata object success. Received '${e2.channel}' Channel metadata object.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        setChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Set Channel metadata object with parameters:" }))), this._setChannelMetadata(e2, t2);
          }));
        }
        _setChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = new Ps(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = (t3) => {
              t3 && this.logger.debug("PubNub", `Set Channel metadata object success. Updated '${e2.channel}' Channel metadata object.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        removeChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove Channel metadata object with parameters:" }))), this._removeChannelMetadata(e2, t2);
          }));
        }
        _removeChannelMetadata(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = new Ss(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = (t3) => {
              t3 && this.logger.debug("PubNub", `Remove Channel metadata object success. Removed '${e2.channel}' Channel metadata object.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        getChannelMembers(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Get channel members with parameters:" })));
            const s2 = new Es(Object.assign(Object.assign({}, e2), { keySet: this.keySet })), n2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Get channel members success. Received ${e3.totalCount} channel members.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        setChannelMembers(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Set channel members with parameters:" })));
            const s2 = new Ns(Object.assign(Object.assign({}, e2), { type: "set", keySet: this.keySet })), n2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Set channel members success. There are ${e3.totalCount} channel members now.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        removeChannelMembers(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove channel members with parameters:" })));
            const s2 = new Ns(Object.assign(Object.assign({}, e2), { type: "delete", keySet: this.keySet })), n2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Remove channel members success. There are ${e3.totalCount} channel members now.`);
            };
            return t2 ? this.sendRequest(s2, ((e3, s3) => {
              n2(s3), t2(e3, s3);
            })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
          }));
        }
        getMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            const n2 = e2 && "function" != typeof e2 ? e2 : {};
            null != t2 || (t2 = "function" == typeof e2 ? e2 : void 0), n2.userId && (this.logger.warn("PubNub", "'userId' parameter is deprecated. Use 'uuid' instead."), n2.uuid = n2.userId), null !== (s2 = n2.uuid) && void 0 !== s2 || (n2.uuid = this.configuration.userId), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, n2), details: "Get memberships with parameters:" })));
            const r2 = new ws(Object.assign(Object.assign({}, n2), { keySet: this.keySet })), i2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Get memberships success. Received ${e3.totalCount} memberships.`);
            };
            return t2 ? this.sendRequest(r2, ((e3, s3) => {
              i2(s3), t2(e3, s3);
            })) : this.sendRequest(r2).then(((e3) => (i2(e3), e3)));
          }));
        }
        setMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            e2.userId && (this.logger.warn("PubNub", "'userId' parameter is deprecated. Use 'uuid' instead."), e2.uuid = e2.userId), null !== (s2 = e2.uuid) && void 0 !== s2 || (e2.uuid = this.configuration.userId), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Set memberships with parameters:" })));
            const n2 = new Os(Object.assign(Object.assign({}, e2), { type: "set", keySet: this.keySet })), r2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Set memberships success. There are ${e3.totalCount} memberships now.`);
            };
            return t2 ? this.sendRequest(n2, ((e3, s3) => {
              r2(s3), t2(e3, s3);
            })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
          }));
        }
        removeMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            e2.userId && (this.logger.warn("PubNub", "'userId' parameter is deprecated. Use 'uuid' instead."), e2.uuid = e2.userId), null !== (s2 = e2.uuid) && void 0 !== s2 || (e2.uuid = this.configuration.userId), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove memberships with parameters:" })));
            const n2 = new Os(Object.assign(Object.assign({}, e2), { type: "delete", keySet: this.keySet })), r2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Remove memberships success. There are ${e3.totalCount} memberships now.`);
            };
            return t2 ? this.sendRequest(n2, ((e3, s3) => {
              r2(s3), t2(e3, s3);
            })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
          }));
        }
        fetchMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2, n2;
            if (this.logger.warn("PubNub", "'fetchMemberships' is deprecated. Use 'pubnub.objects.getChannelMembers' or 'pubnub.objects.getMemberships' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Fetch memberships with parameters:" }))), "spaceId" in e2) {
              const n3 = e2, r3 = { channel: null !== (s2 = n3.spaceId) && void 0 !== s2 ? s2 : n3.channel, filter: n3.filter, limit: n3.limit, page: n3.page, include: Object.assign({}, n3.include), sort: n3.sort ? Object.fromEntries(Object.entries(n3.sort).map((([e3, t3]) => [e3.replace("user", "uuid"), t3]))) : void 0 }, i3 = (e3) => ({ status: e3.status, data: e3.data.map(((e4) => ({ user: e4.uuid, custom: e4.custom, updated: e4.updated, eTag: e4.eTag }))), totalCount: e3.totalCount, next: e3.next, prev: e3.prev });
              return t2 ? this.getChannelMembers(r3, ((e3, s3) => {
                t2(e3, s3 ? i3(s3) : s3);
              })) : this.getChannelMembers(r3).then(i3);
            }
            const r2 = e2, i2 = { uuid: null !== (n2 = r2.userId) && void 0 !== n2 ? n2 : r2.uuid, filter: r2.filter, limit: r2.limit, page: r2.page, include: Object.assign({}, r2.include), sort: r2.sort ? Object.fromEntries(Object.entries(r2.sort).map((([e3, t3]) => [e3.replace("space", "channel"), t3]))) : void 0 }, a2 = (e3) => ({ status: e3.status, data: e3.data.map(((e4) => ({ space: e4.channel, custom: e4.custom, updated: e4.updated, eTag: e4.eTag }))), totalCount: e3.totalCount, next: e3.next, prev: e3.prev });
            return t2 ? this.getMemberships(i2, ((e3, s3) => {
              t2(e3, s3 ? a2(s3) : s3);
            })) : this.getMemberships(i2).then(a2);
          }));
        }
        addMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2, n2, r2, i2, a2, o2;
            if (this.logger.warn("PubNub", "'addMemberships' is deprecated. Use 'pubnub.objects.setChannelMembers' or 'pubnub.objects.setMemberships' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Add memberships with parameters:" }))), "spaceId" in e2) {
              const i3 = e2, a3 = { channel: null !== (s2 = i3.spaceId) && void 0 !== s2 ? s2 : i3.channel, uuids: null !== (r2 = null === (n2 = i3.users) || void 0 === n2 ? void 0 : n2.map(((e3) => "string" == typeof e3 ? e3 : { id: e3.userId, custom: e3.custom }))) && void 0 !== r2 ? r2 : i3.uuids, limit: 0 };
              return t2 ? this.setChannelMembers(a3, t2) : this.setChannelMembers(a3);
            }
            const c2 = e2, u2 = { uuid: null !== (i2 = c2.userId) && void 0 !== i2 ? i2 : c2.uuid, channels: null !== (o2 = null === (a2 = c2.spaces) || void 0 === a2 ? void 0 : a2.map(((e3) => "string" == typeof e3 ? e3 : { id: e3.spaceId, custom: e3.custom }))) && void 0 !== o2 ? o2 : c2.channels, limit: 0 };
            return t2 ? this.setMemberships(u2, t2) : this.setMemberships(u2);
          }));
        }
      }
      class Ms extends de {
        constructor() {
          super();
        }
        operation() {
          return K.PNTimeOperation;
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            return { timetoken: this.deserializeResponse(e2)[0] };
          }));
        }
        get path() {
          return "/time/0";
        }
      }
      class As extends de {
        constructor(e2) {
          super(), this.parameters = e2;
        }
        operation() {
          return K.PNDownloadFileOperation;
        }
        validate() {
          const { channel: e2, id: t2, name: s2 } = this.parameters;
          return e2 ? t2 ? s2 ? void 0 : "file name can't be empty" : "file id can't be empty" : "channel can't be empty";
        }
        parse(e2) {
          return i(this, void 0, void 0, (function* () {
            const { cipherKey: t2, crypto: s2, cryptography: n2, name: r2, PubNubFile: i2 } = this.parameters, a2 = e2.headers["content-type"];
            let o2, c2 = e2.body;
            return i2.supportsEncryptFile && (t2 || s2) && (t2 && n2 ? c2 = yield n2.decrypt(t2, c2) : !t2 && s2 && (o2 = yield s2.decryptFile(i2.create({ data: c2, name: r2, mimeType: a2 }), i2))), o2 || i2.create({ data: c2, name: r2, mimeType: a2 });
          }));
        }
        get path() {
          const { keySet: { subscribeKey: e2 }, channel: t2, id: s2, name: n2 } = this.parameters;
          return `/v1/files/${e2}/channels/${P(t2)}/files/${P(s2)}/${P(n2)}`;
        }
      }
      class Us {
        static notificationPayload(e2, t2) {
          return new ke(e2, t2);
        }
        static generateUUID() {
          return ne.createUUID();
        }
        constructor(e2) {
          if (this.eventHandleCapable = {}, this.entities = {}, this._configuration = e2.configuration, this.cryptography = e2.cryptography, this.tokenManager = e2.tokenManager, this.transport = e2.transport, this.crypto = e2.crypto, this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2.configuration, details: "Create with configuration:", ignoredKeys: (e3, t2) => "function" == typeof t2[e3] || e3.startsWith("_") || "keySet" === e3 || C(e3) }))), this._objects = new Is(this._configuration, this.sendRequest.bind(this)), this._channelGroups = new ds(this._configuration.logger(), this._configuration.keySet, this.sendRequest.bind(this)), this._push = new fs(this._configuration.logger(), this._configuration.keySet, this.sendRequest.bind(this)), this.eventDispatcher = new ye(), this._configuration.enableEventEngine) {
            this.logger.debug("PubNub", "Using new subscription loop management.");
            let e3 = this._configuration.getHeartbeatInterval();
            this.presenceState = {}, e3 && (this.presenceEventEngine = new et({ heartbeat: (e4, t2) => (this.logger.trace("PresenceEventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Heartbeat with parameters:" }))), this.heartbeat(e4, t2)), leave: (e4) => {
              this.logger.trace("PresenceEventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Leave with parameters:" }))), this.makeUnsubscribe(e4, (() => {
              }));
            }, heartbeatDelay: () => new Promise(((t2, s2) => {
              e3 = this._configuration.getHeartbeatInterval(), e3 ? setTimeout(t2, 1e3 * e3) : s2(new d("Heartbeat interval has been reset."));
            })), emitStatus: (e4) => this.emitStatus(e4), config: this._configuration, presenceState: this.presenceState })), this.eventEngine = new Ot({ handshake: (e4) => (this.logger.trace("EventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Handshake with parameters:", ignoredKeys: ["abortSignal", "crypto", "timeout", "keySet", "getFileUrl"] }))), this.subscribeHandshake(e4)), receiveMessages: (e4) => (this.logger.trace("EventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Receive messages with parameters:", ignoredKeys: ["abortSignal", "crypto", "timeout", "keySet", "getFileUrl"] }))), this.subscribeReceiveMessages(e4)), delay: (e4) => new Promise(((t2) => setTimeout(t2, e4))), join: (e4) => {
              var t2, s2;
              this.logger.trace("EventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Join with parameters:" }))), e4 && 0 === (null !== (t2 = e4.channels) && void 0 !== t2 ? t2 : []).length && 0 === (null !== (s2 = e4.groups) && void 0 !== s2 ? s2 : []).length ? this.logger.trace("EventEngine", "Ignoring 'join' announcement request.") : this.join(e4);
            }, leave: (e4) => {
              var t2, s2;
              this.logger.trace("EventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Leave with parameters:" }))), e4 && 0 === (null !== (t2 = e4.channels) && void 0 !== t2 ? t2 : []).length && 0 === (null !== (s2 = e4.groups) && void 0 !== s2 ? s2 : []).length ? this.logger.trace("EventEngine", "Ignoring 'leave' announcement request.") : this.leave(e4);
            }, leaveAll: (e4) => {
              this.logger.trace("EventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Leave all with parameters:" }))), this.leaveAll(e4);
            }, presenceReconnect: (e4) => {
              this.logger.trace("EventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Reconnect with parameters:" }))), this.presenceReconnect(e4);
            }, presenceDisconnect: (e4) => {
              this.logger.trace("EventEngine", (() => ({ messageType: "object", message: Object.assign({}, e4), details: "Disconnect with parameters:" }))), this.presenceDisconnect(e4);
            }, presenceState: this.presenceState, config: this._configuration, emitMessages: (e4, t2) => {
              try {
                this.logger.debug("EventEngine", (() => ({ messageType: "object", message: t2.map(((e5) => {
                  const t3 = e5.type === pe.Message || e5.type === pe.Signal ? A(e5.data.message) : void 0;
                  return t3 ? { type: e5.type, data: Object.assign(Object.assign({}, e5.data), { pn_mfp: t3 }) } : e5;
                })), details: "Received events:" }))), t2.forEach(((t3) => this.emitEvent(e4, t3)));
              } catch (e5) {
                const t3 = { error: true, category: h.PNUnknownCategory, errorData: e5, statusCode: 0 };
                this.emitStatus(t3);
              }
            }, emitStatus: (e4) => this.emitStatus(e4) });
          } else this.logger.debug("PubNub", "Using legacy subscription loop management."), this.subscriptionManager = new ve(this._configuration, ((e3, t2) => {
            try {
              this.emitEvent(e3, t2);
            } catch (e4) {
              const t3 = { error: true, category: h.PNUnknownCategory, errorData: e4, statusCode: 0 };
              this.emitStatus(t3);
            }
          }), this.emitStatus.bind(this), ((e3, t2) => {
            this.logger.trace("SubscriptionManager", (() => ({ messageType: "object", message: Object.assign({}, e3), details: "Subscribe with parameters:", ignoredKeys: ["crypto", "timeout", "keySet", "getFileUrl"] }))), this.makeSubscribe(e3, t2);
          }), ((e3, t2) => (this.logger.trace("SubscriptionManager", (() => ({ messageType: "object", message: Object.assign({}, e3), details: "Heartbeat with parameters:", ignoredKeys: ["crypto", "timeout", "keySet", "getFileUrl"] }))), this.heartbeat(e3, t2))), ((e3, t2) => {
            this.logger.trace("SubscriptionManager", (() => ({ messageType: "object", message: Object.assign({}, e3), details: "Leave with parameters:" }))), this.makeUnsubscribe(e3, t2);
          }), this.time.bind(this));
        }
        get configuration() {
          return this._configuration;
        }
        get _config() {
          return this.configuration;
        }
        get authKey() {
          var e2;
          return null !== (e2 = this._configuration.authKey) && void 0 !== e2 ? e2 : void 0;
        }
        getAuthKey() {
          return this.authKey;
        }
        setAuthKey(e2) {
          this.logger.debug("PubNub", "Auth key updated."), this._configuration.setAuthKey(e2), this.onAuthenticationChange && this.onAuthenticationChange(e2);
        }
        get userId() {
          return this._configuration.userId;
        }
        set userId(e2) {
          if (!e2 || "string" != typeof e2 || 0 === e2.trim().length) {
            const e3 = new Error("Missing or invalid userId parameter. Provide a valid string userId");
            throw this.logger.error("PubNub", (() => ({ messageType: "error", message: e3 }))), e3;
          }
          this.logger.debug("PubNub", `Set user ID: ${e2}`), this._configuration.userId = e2, this.onUserIdChange && this.onUserIdChange(this._configuration.userId);
        }
        getUserId() {
          return this._configuration.userId;
        }
        setUserId(e2) {
          this.userId = e2;
        }
        get filterExpression() {
          var e2;
          return null !== (e2 = this._configuration.getFilterExpression()) && void 0 !== e2 ? e2 : void 0;
        }
        getFilterExpression() {
          return this.filterExpression;
        }
        set filterExpression(e2) {
          this.logger.debug("PubNub", `Set filter expression: ${e2}`), this._configuration.setFilterExpression(e2);
        }
        setFilterExpression(e2) {
          this.logger.debug("PubNub", `Set filter expression: ${e2}`), this.filterExpression = e2;
        }
        get cipherKey() {
          return this._configuration.getCipherKey();
        }
        set cipherKey(e2) {
          this._configuration.setCipherKey(e2);
        }
        setCipherKey(e2) {
          this.logger.debug("PubNub", "Cipher key updated."), this.cipherKey = e2;
        }
        set heartbeatInterval(e2) {
          var t2;
          this.logger.debug("PubNub", `Set heartbeat interval: ${e2}`), this._configuration.setHeartbeatInterval(e2), this.onHeartbeatIntervalChange && this.onHeartbeatIntervalChange(null !== (t2 = this._configuration.getHeartbeatInterval()) && void 0 !== t2 ? t2 : 0);
        }
        setHeartbeatInterval(e2) {
          this.heartbeatInterval = e2;
        }
        get logger() {
          return this._configuration.logger();
        }
        getVersion() {
          return this._configuration.getVersion();
        }
        _addPnsdkSuffix(e2, t2) {
          this.logger.debug("PubNub", `Add '${e2}' 'pnsdk' suffix: ${t2}`), this._configuration._addPnsdkSuffix(e2, t2);
        }
        getUUID() {
          return this.userId;
        }
        setUUID(e2) {
          this.logger.warn("PubNub", "'setUserId` is deprecated, please use 'setUserId' or 'userId' setter instead."), this.logger.debug("PubNub", `Set UUID: ${e2}`), this.userId = e2;
        }
        get customEncrypt() {
          return this._configuration.getCustomEncrypt();
        }
        get customDecrypt() {
          return this._configuration.getCustomDecrypt();
        }
        channel(e2) {
          let t2 = this.entities[`${e2}_ch`];
          return t2 || (t2 = this.entities[`${e2}_ch`] = new as(e2, this)), t2;
        }
        channelGroup(e2) {
          let t2 = this.entities[`${e2}_chg`];
          return t2 || (t2 = this.entities[`${e2}_chg`] = new rs(e2, this)), t2;
        }
        channelMetadata(e2) {
          let t2 = this.entities[`${e2}_chm`];
          return t2 || (t2 = this.entities[`${e2}_chm`] = new ns(e2, this)), t2;
        }
        userMetadata(e2) {
          let t2 = this.entities[`${e2}_um`];
          return t2 || (t2 = this.entities[`${e2}_um`] = new is(e2, this)), t2;
        }
        subscriptionSet(e2) {
          var t2, s2;
          {
            const n2 = [];
            return null === (t2 = e2.channels) || void 0 === t2 || t2.forEach(((e3) => n2.push(this.channel(e3)))), null === (s2 = e2.channelGroups) || void 0 === s2 || s2.forEach(((e3) => n2.push(this.channelGroup(e3)))), new Mt({ client: this, entities: n2, options: e2.subscriptionOptions });
          }
        }
        sendRequest(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            const s2 = e2.validate();
            if (s2) {
              const e3 = (n2 = s2, p(Object.assign({ message: n2 }, {}), h.PNValidationErrorCategory));
              if (this.logger.error("PubNub", (() => ({ messageType: "error", message: e3 }))), t2) return t2(e3, null);
              throw new d("Validation failed, check status for details", e3);
            }
            var n2;
            const r2 = e2.request(), i2 = e2.operation();
            r2.formData && r2.formData.length > 0 || i2 === K.PNDownloadFileOperation ? r2.timeout = this._configuration.getFileTimeout() : i2 === K.PNSubscribeOperation || i2 === K.PNReceiveMessagesOperation ? r2.timeout = this._configuration.getSubscribeTimeout() : r2.timeout = this._configuration.getTransactionTimeout();
            const a2 = { error: false, operation: i2, category: h.PNAcknowledgmentCategory, statusCode: 0 }, [o2, c2] = this.transport.makeSendable(r2);
            return e2.cancellationController = c2 || null, o2.then(((t3) => {
              if (a2.statusCode = t3.status, 200 !== t3.status && 204 !== t3.status) {
                const e3 = Us.decoder.decode(t3.body), s3 = t3.headers["content-type"];
                if (s3 || -1 !== s3.indexOf("javascript") || -1 !== s3.indexOf("json")) {
                  const t4 = JSON.parse(e3);
                  "object" == typeof t4 && "error" in t4 && t4.error && "object" == typeof t4.error && (a2.errorData = t4.error);
                } else a2.responseText = e3;
              }
              return e2.parse(t3);
            })).then(((e3) => t2 ? t2(a2, e3) : e3)).catch(((e3) => {
              const s3 = e3 instanceof q ? e3 : q.create(e3);
              if (t2) return s3.category !== h.PNCancelledCategory && this.logger.error("PubNub", (() => ({ messageType: "error", message: s3.toPubNubError(i2, "REST API request processing error, check status for details") }))), t2(s3.toStatus(i2), null);
              const n3 = s3.toPubNubError(i2, "REST API request processing error, check status for details");
              throw s3.category !== h.PNCancelledCategory && this.logger.error("PubNub", (() => ({ messageType: "error", message: n3 }))), n3;
            }));
          }));
        }
        destroy(e2 = false) {
          this.logger.info("PubNub", "Destroying PubNub client."), this._globalSubscriptionSet && (this._globalSubscriptionSet.invalidate(true), this._globalSubscriptionSet = void 0), Object.values(this.eventHandleCapable).forEach(((e3) => e3.invalidate(true))), this.eventHandleCapable = {}, this.subscriptionManager ? (this.subscriptionManager.unsubscribeAll(e2), this.subscriptionManager.disconnect()) : this.eventEngine && this.eventEngine.unsubscribeAll(e2), this.presenceEventEngine && this.presenceEventEngine.leaveAll(e2);
        }
        stop() {
          this.logger.warn("PubNub", "'stop' is deprecated, please use 'destroy' instead."), this.destroy();
        }
        publish(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Publish with parameters:" })));
              const s2 = false === e2.replicate && false === e2.storeInHistory, n2 = new kt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, crypto: this._configuration.getCryptoModule() })), r2 = (e3) => {
                e3 && this.logger.debug("PubNub", `${s2 ? "Fire" : "Publish"} success with timetoken: ${e3.timetoken}`);
              };
              return t2 ? this.sendRequest(n2, ((e3, s3) => {
                r2(s3), t2(e3, s3);
              })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
            }
          }));
        }
        signal(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Signal with parameters:" })));
              const s2 = new Ct(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Publish success with timetoken: ${e3.timetoken}`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        fire(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Fire with parameters:" }))), null != t2 || (t2 = () => {
            }), this.publish(Object.assign(Object.assign({}, e2), { replicate: false, storeInHistory: false }), t2);
          }));
        }
        get globalSubscriptionSet() {
          return this._globalSubscriptionSet || (this._globalSubscriptionSet = this.subscriptionSet({})), this._globalSubscriptionSet;
        }
        get subscriptionTimetoken() {
          return this.subscriptionManager ? this.subscriptionManager.subscriptionTimetoken : this.eventEngine ? this.eventEngine.subscriptionTimetoken : void 0;
        }
        getSubscribedChannels() {
          return this.subscriptionManager ? this.subscriptionManager.subscribedChannels : this.eventEngine ? this.eventEngine.getSubscribedChannels() : [];
        }
        getSubscribedChannelGroups() {
          return this.subscriptionManager ? this.subscriptionManager.subscribedChannelGroups : this.eventEngine ? this.eventEngine.getSubscribedChannelGroups() : [];
        }
        registerEventHandleCapable(e2, t2, s2) {
          {
            let n2;
            this.logger.trace("PubNub", (() => ({ messageType: "object", message: Object.assign(Object.assign({ subscription: e2 }, t2 ? { cursor: t2 } : []), s2 ? { subscriptions: s2 } : {}), details: "Register event handle capable:" }))), this.eventHandleCapable[e2.state.id] || (this.eventHandleCapable[e2.state.id] = e2), s2 && 0 !== s2.length ? (n2 = new Nt({}), s2.forEach(((e3) => n2.add(e3.subscriptionInput(false))))) : n2 = e2.subscriptionInput(false);
            const r2 = {};
            r2.channels = n2.channels, r2.channelGroups = n2.channelGroups, t2 && (r2.timetoken = t2.timetoken), this.subscriptionManager ? this.subscriptionManager.subscribe(r2) : this.eventEngine && this.eventEngine.subscribe(r2);
          }
        }
        unregisterEventHandleCapable(e2, t2) {
          {
            if (!this.eventHandleCapable[e2.state.id]) return;
            const s2 = [];
            this.logger.trace("PubNub", (() => ({ messageType: "object", message: { subscription: e2, subscriptions: t2 }, details: "Unregister event handle capable:" })));
            let n2, r2 = !t2 || 0 === t2.length;
            if (!r2 && e2 instanceof Mt && e2.subscriptions.length === (null == t2 ? void 0 : t2.length) && (r2 = e2.subscriptions.every(((e3) => t2.includes(e3)))), r2 && delete this.eventHandleCapable[e2.state.id], t2 && 0 !== t2.length ? (n2 = new Nt({}), t2.forEach(((e3) => {
              const t3 = e3.subscriptionInput(true);
              t3.isEmpty ? s2.push(e3) : n2.add(t3);
            }))) : (n2 = e2.subscriptionInput(true), n2.isEmpty && s2.push(e2)), s2.length > 0 && this.logger.trace("PubNub", (() => {
              const e3 = [];
              return s2[0] instanceof Mt ? s2[0].subscriptions.forEach(((t3) => e3.push(t3.state.entity))) : s2.forEach(((t3) => e3.push(t3.state.entity))), { messageType: "object", message: { entities: e3 }, details: "Can't unregister event handle capable because entities still in use:" };
            })), n2.isEmpty) return;
            {
              const e3 = [], t3 = [];
              if (Object.values(this.eventHandleCapable).forEach(((s3) => {
                const r3 = s3.subscriptionInput(false), i3 = r3.channelGroups, a2 = r3.channels;
                e3.push(...n2.channelGroups.filter(((e4) => i3.includes(e4)))), t3.push(...n2.channels.filter(((e4) => a2.includes(e4))));
              })), (t3.length > 0 || e3.length > 0) && (this.logger.trace("PubNub", (() => {
                const s3 = [], r3 = (n3) => {
                  const r4 = n3.subscriptionNames(true), i4 = n3.subscriptionType === Et.Channel ? t3 : e3;
                  r4.some(((e4) => i4.includes(e4))) && s3.push(n3);
                };
                Object.values(this.eventHandleCapable).forEach(((e4) => {
                  e4 instanceof Mt ? e4.subscriptions.forEach(((e5) => {
                    r3(e5.state.entity);
                  })) : e4 instanceof Ut && r3(e4.state.entity);
                }));
                let i3 = "Some entities still in use:";
                return t3.length + e3.length === n2.length && (i3 = "Can't unregister event handle capable because entities still in use:"), { messageType: "object", message: { entities: s3 }, details: i3 };
              })), n2.remove(new Nt({ channels: t3, channelGroups: e3 })), n2.isEmpty)) return;
            }
            const i2 = {};
            i2.channels = n2.channels, i2.channelGroups = n2.channelGroups, this.subscriptionManager ? this.subscriptionManager.unsubscribe(i2) : this.eventEngine && this.eventEngine.unsubscribe(i2);
          }
        }
        subscribe(e2) {
          {
            this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Subscribe with parameters:" })));
            const t2 = this.subscriptionSet(Object.assign(Object.assign({}, e2), { subscriptionOptions: { receivePresenceEvents: e2.withPresence } }));
            this.globalSubscriptionSet.addSubscriptionSet(t2), t2.dispose();
            const s2 = "number" == typeof e2.timetoken ? `${e2.timetoken}` : e2.timetoken;
            this.globalSubscriptionSet.subscribe({ timetoken: s2 });
          }
        }
        makeSubscribe(e2, t2) {
          {
            this._configuration.isSharedWorkerEnabled() || (e2.onDemand = false);
            const s2 = new be(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, crypto: this._configuration.getCryptoModule(), getFileUrl: this.getFileUrl.bind(this) }));
            if (this.sendRequest(s2, ((e3, n2) => {
              var r2;
              this.subscriptionManager && (null === (r2 = this.subscriptionManager.abort) || void 0 === r2 ? void 0 : r2.identifier) === s2.requestIdentifier && (this.subscriptionManager.abort = null), t2(e3, n2);
            })), this.subscriptionManager) {
              const e3 = () => s2.abort("Cancel long-poll subscribe request");
              e3.identifier = s2.requestIdentifier, this.subscriptionManager.abort = e3;
            }
          }
        }
        unsubscribe(e2) {
          {
            if (this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Unsubscribe with parameters:" }))), !this._globalSubscriptionSet) return void this.logger.debug("PubNub", "There are no active subscriptions. Ignore.");
            const t2 = this.globalSubscriptionSet.subscriptions.filter(((t3) => {
              var s2, n2;
              const r2 = t3.subscriptionInput(false);
              if (r2.isEmpty) return false;
              for (const t4 of null !== (s2 = e2.channels) && void 0 !== s2 ? s2 : []) if (r2.contains(t4)) return true;
              for (const t4 of null !== (n2 = e2.channelGroups) && void 0 !== n2 ? n2 : []) if (r2.contains(t4)) return true;
            }));
            t2.length > 0 && this.globalSubscriptionSet.removeSubscriptions(t2);
          }
        }
        makeUnsubscribe(e2, t2) {
          {
            let { channels: s2, channelGroups: n2 } = e2;
            if (this._configuration.getKeepPresenceChannelsInPresenceRequests() || (n2 && (n2 = n2.filter(((e3) => !e3.endsWith("-pnpres")))), s2 && (s2 = s2.filter(((e3) => !e3.endsWith("-pnpres"))))), 0 === (null != n2 ? n2 : []).length && 0 === (null != s2 ? s2 : []).length) return t2({ error: false, operation: K.PNUnsubscribeOperation, category: h.PNAcknowledgmentCategory, statusCode: 200 });
            this.sendRequest(new Ft({ channels: s2, channelGroups: n2, keySet: this._configuration.keySet }), t2);
          }
        }
        unsubscribeAll() {
          this.logger.debug("PubNub", "Unsubscribe all channels and groups"), this._globalSubscriptionSet && this._globalSubscriptionSet.invalidate(false), Object.values(this.eventHandleCapable).forEach(((e2) => e2.invalidate(false))), this.eventHandleCapable = {}, this.subscriptionManager ? this.subscriptionManager.unsubscribeAll() : this.eventEngine && this.eventEngine.unsubscribeAll();
        }
        disconnect(e2 = false) {
          this.logger.debug("PubNub", `Disconnect (while offline? ${e2 ? "yes" : "no"})`), this.subscriptionManager ? this.subscriptionManager.disconnect() : this.eventEngine && this.eventEngine.disconnect(e2);
        }
        reconnect(e2) {
          this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Reconnect with parameters:" }))), this.subscriptionManager ? this.subscriptionManager.reconnect() : this.eventEngine && this.eventEngine.reconnect(null != e2 ? e2 : {});
        }
        subscribeHandshake(e2) {
          return i(this, void 0, void 0, (function* () {
            {
              this._configuration.isSharedWorkerEnabled() || (e2.onDemand = false);
              const t2 = new jt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, crypto: this._configuration.getCryptoModule(), getFileUrl: this.getFileUrl.bind(this) })), s2 = e2.abortSignal.subscribe(((e3) => {
                t2.abort("Cancel subscribe handshake request");
              }));
              return this.sendRequest(t2).then(((e3) => (s2(), e3.cursor)));
            }
          }));
        }
        subscribeReceiveMessages(e2) {
          return i(this, void 0, void 0, (function* () {
            {
              this._configuration.isSharedWorkerEnabled() || (e2.onDemand = false);
              const t2 = new Pt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, crypto: this._configuration.getCryptoModule(), getFileUrl: this.getFileUrl.bind(this) })), s2 = e2.abortSignal.subscribe(((e3) => {
                t2.abort("Cancel long-poll subscribe request");
              }));
              return this.sendRequest(t2).then(((e3) => (s2(), e3)));
            }
          }));
        }
        getMessageActions(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Get message actions with parameters:" })));
              const s2 = new Wt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Get message actions success. Received ${e3.data.length} message actions.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        addMessageAction(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Add message action with parameters:" })));
              const s2 = new Vt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Message action add success. Message action added with timetoken: ${e3.data.actionTimetoken}`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        removeMessageAction(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove message action with parameters:" })));
              const s2 = new zt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (t3) => {
                t3 && this.logger.debug("PubNub", `Message action remove success. Removed message action with ${e2.actionTimetoken} timetoken.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        fetchMessages(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Fetch messages with parameters:" })));
              const s2 = new Bt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, crypto: this._configuration.getCryptoModule(), getFileUrl: this.getFileUrl.bind(this) })), n2 = (e3) => {
                if (!e3) return;
                const t3 = Object.values(e3.channels).reduce(((e4, t4) => e4 + t4.length), 0);
                this.logger.debug("PubNub", `Fetch messages success. Received ${t3} messages.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        deleteMessages(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Delete messages with parameters:" })));
              const s2 = new qt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", "Delete messages success.");
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        messageCounts(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Get messages count with parameters:" })));
              const s2 = new Gt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (t3) => {
                if (!t3) return;
                const s3 = Object.values(t3.channels).reduce(((e3, t4) => e3 + t4), 0);
                this.logger.debug("PubNub", `Get messages count success. There are ${s3} messages since provided reference timetoken${e2.channelTimetokens ? e2.channelTimetokens.join(",") : ""}.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        history(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Fetch history with parameters:" })));
              const s2 = new Kt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, crypto: this._configuration.getCryptoModule() })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Fetch history success. Received ${e3.messages.length} messages.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        hereNow(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Here now with parameters:" })));
              const s2 = new Lt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Here now success. There are ${e3.totalOccupancy} participants in ${e3.totalChannels} channels.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        whereNow(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Where now with parameters:" })));
              const n2 = new xt({ uuid: null !== (s2 = e2.uuid) && void 0 !== s2 ? s2 : this._configuration.userId, keySet: this._configuration.keySet }), r2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Where now success. Currently present in ${e3.channels.length} channels.`);
              };
              return t2 ? this.sendRequest(n2, ((e3, s3) => {
                r2(s3), t2(e3, s3);
              })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
            }
          }));
        }
        getState(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Get presence state with parameters:" })));
              const n2 = new Dt(Object.assign(Object.assign({}, e2), { uuid: null !== (s2 = e2.uuid) && void 0 !== s2 ? s2 : this._configuration.userId, keySet: this._configuration.keySet })), r2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Get presence state success. Received presence state for ${Object.keys(e3.channels).length} channels.`);
              };
              return t2 ? this.sendRequest(n2, ((e3, s3) => {
                r2(s3), t2(e3, s3);
              })) : this.sendRequest(n2).then(((e3) => (r2(e3), e3)));
            }
          }));
        }
        setState(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2, n2;
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Set presence state with parameters:" })));
              const { keySet: r2, userId: i2 } = this._configuration, a2 = this._configuration.getPresenceTimeout();
              let o2;
              if (this._configuration.enableEventEngine && this.presenceState) {
                const t3 = this.presenceState;
                null === (s2 = e2.channels) || void 0 === s2 || s2.forEach(((s3) => t3[s3] = e2.state)), "channelGroups" in e2 && (null === (n2 = e2.channelGroups) || void 0 === n2 || n2.forEach(((s3) => t3[s3] = e2.state))), this.onPresenceStateChange && this.onPresenceStateChange(this.presenceState);
              }
              o2 = "withHeartbeat" in e2 && e2.withHeartbeat ? new $t(Object.assign(Object.assign({}, e2), { keySet: r2, heartbeat: a2 })) : new Rt(Object.assign(Object.assign({}, e2), { keySet: r2, uuid: i2 }));
              const c2 = (e3) => {
                e3 && this.logger.debug("PubNub", "Set presence state success." + (o2 instanceof $t ? " Presence state has been set using heartbeat endpoint." : ""));
              };
              return this.subscriptionManager && (this.subscriptionManager.setState(e2), this.onPresenceStateChange && this.onPresenceStateChange(this.subscriptionManager.presenceState)), t2 ? this.sendRequest(o2, ((e3, s3) => {
                c2(s3), t2(e3, s3);
              })) : this.sendRequest(o2).then(((e3) => (c2(e3), e3)));
            }
          }));
        }
        presence(e2) {
          var t2;
          this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Change presence with parameters:" }))), null === (t2 = this.subscriptionManager) || void 0 === t2 || t2.changePresence(e2);
        }
        heartbeat(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            {
              this.logger.trace("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Heartbeat with parameters:" })));
              let { channels: n2, channelGroups: r2 } = e2;
              if (r2 && (r2 = r2.filter(((e3) => !e3.endsWith("-pnpres")))), n2 && (n2 = n2.filter(((e3) => !e3.endsWith("-pnpres")))), 0 === (null != r2 ? r2 : []).length && 0 === (null != n2 ? n2 : []).length) {
                const e3 = { error: false, operation: K.PNHeartbeatOperation, category: h.PNAcknowledgmentCategory, statusCode: 200 };
                return this.logger.trace("PubNub", "There are no active subscriptions. Ignore."), t2 ? t2(e3, {}) : Promise.resolve(e3);
              }
              const i2 = new $t(Object.assign(Object.assign({}, e2), { channels: [...new Set(n2)], channelGroups: [...new Set(r2)], keySet: this._configuration.keySet })), a2 = (e3) => {
                e3 && this.logger.trace("PubNub", "Heartbeat success.");
              }, o2 = null === (s2 = e2.abortSignal) || void 0 === s2 ? void 0 : s2.subscribe(((e3) => {
                i2.abort("Cancel long-poll subscribe request");
              }));
              return t2 ? this.sendRequest(i2, ((e3, s3) => {
                a2(s3), o2 && o2(), t2(e3, s3);
              })) : this.sendRequest(i2).then(((e3) => (a2(e3), o2 && o2(), e3)));
            }
          }));
        }
        join(e2) {
          var t2, s2;
          this.logger.trace("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Join with parameters:" }))), e2 && 0 === (null !== (t2 = e2.channels) && void 0 !== t2 ? t2 : []).length && 0 === (null !== (s2 = e2.groups) && void 0 !== s2 ? s2 : []).length ? this.logger.trace("PubNub", "Ignoring 'join' announcement request.") : this.presenceEventEngine ? this.presenceEventEngine.join(e2) : this.heartbeat(Object.assign(Object.assign({ channels: e2.channels, channelGroups: e2.groups }, this._configuration.maintainPresenceState && this.presenceState && Object.keys(this.presenceState).length > 0 && { state: this.presenceState }), { heartbeat: this._configuration.getPresenceTimeout() }), (() => {
          }));
        }
        presenceReconnect(e2) {
          this.logger.trace("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Presence reconnect with parameters:" }))), this.presenceEventEngine ? this.presenceEventEngine.reconnect() : this.heartbeat(Object.assign(Object.assign({ channels: e2.channels, channelGroups: e2.groups }, this._configuration.maintainPresenceState && { state: this.presenceState }), { heartbeat: this._configuration.getPresenceTimeout() }), (() => {
          }));
        }
        leave(e2) {
          var t2, s2, n2;
          this.logger.trace("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Leave with parameters:" }))), e2 && 0 === (null !== (t2 = e2.channels) && void 0 !== t2 ? t2 : []).length && 0 === (null !== (s2 = e2.groups) && void 0 !== s2 ? s2 : []).length ? this.logger.trace("PubNub", "Ignoring 'leave' announcement request.") : this.presenceEventEngine ? null === (n2 = this.presenceEventEngine) || void 0 === n2 || n2.leave(e2) : this.makeUnsubscribe({ channels: e2.channels, channelGroups: e2.groups }, (() => {
          }));
        }
        leaveAll(e2 = {}) {
          this.logger.trace("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Leave all with parameters:" }))), this.presenceEventEngine ? this.presenceEventEngine.leaveAll(!!e2.isOffline) : e2.isOffline || this.makeUnsubscribe({ channels: e2.channels, channelGroups: e2.groups }, (() => {
          }));
        }
        presenceDisconnect(e2) {
          this.logger.trace("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Presence disconnect parameters:" }))), this.presenceEventEngine ? this.presenceEventEngine.disconnect(!!e2.isOffline) : e2.isOffline || this.makeUnsubscribe({ channels: e2.channels, channelGroups: e2.groups }, (() => {
          }));
        }
        grantToken(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            throw new Error("Grant Token error: PAM module disabled");
          }));
        }
        revokeToken(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            throw new Error("Revoke Token error: PAM module disabled");
          }));
        }
        get token() {
          return this.tokenManager && this.tokenManager.getToken();
        }
        getToken() {
          return this.token;
        }
        set token(e2) {
          this.tokenManager && this.tokenManager.setToken(e2), this.onAuthenticationChange && this.onAuthenticationChange(e2);
        }
        setToken(e2) {
          this.logger.debug("PubNub", "Access token updated."), this.token = e2;
        }
        parseToken(e2) {
          return this.logger.debug("PubNub", "Parse access token."), this.tokenManager && this.tokenManager.parseToken(e2);
        }
        grant(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            throw new Error("Grant error: PAM module disabled");
          }));
        }
        audit(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            throw new Error("Grant Permissions error: PAM module disabled");
          }));
        }
        get objects() {
          return this._objects;
        }
        fetchUsers(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'fetchUsers' is deprecated. Use 'pubnub.objects.getAllUUIDMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : {}, details: "Fetch all User objects with parameters:" }))), this.objects._getAllUUIDMetadata(e2, t2);
          }));
        }
        fetchUser(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'fetchUser' is deprecated. Use 'pubnub.objects.getUUIDMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : { uuid: this.userId }, details: `Fetch${e2 && "function" != typeof e2 ? "" : " current"} User object with parameters:` }))), this.objects._getUUIDMetadata(e2, t2);
          }));
        }
        createUser(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'createUser' is deprecated. Use 'pubnub.objects.setUUIDMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Create User object with parameters:" }))), this.objects._setUUIDMetadata(e2, t2);
          }));
        }
        updateUser(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'updateUser' is deprecated. Use 'pubnub.objects.setUUIDMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Update User object with parameters:" }))), this.objects._setUUIDMetadata(e2, t2);
          }));
        }
        removeUser(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'removeUser' is deprecated. Use 'pubnub.objects.removeUUIDMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : { uuid: this.userId }, details: `Remove${e2 && "function" != typeof e2 ? "" : " current"} User object with parameters:` }))), this.objects._removeUUIDMetadata(e2, t2);
          }));
        }
        fetchSpaces(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'fetchSpaces' is deprecated. Use 'pubnub.objects.getAllChannelMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: e2 && "function" != typeof e2 ? e2 : {}, details: "Fetch all Space objects with parameters:" }))), this.objects._getAllChannelMetadata(e2, t2);
          }));
        }
        fetchSpace(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'fetchSpace' is deprecated. Use 'pubnub.objects.getChannelMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Fetch Space object with parameters:" }))), this.objects._getChannelMetadata(e2, t2);
          }));
        }
        createSpace(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'createSpace' is deprecated. Use 'pubnub.objects.setChannelMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Create Space object with parameters:" }))), this.objects._setChannelMetadata(e2, t2);
          }));
        }
        updateSpace(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'updateSpace' is deprecated. Use 'pubnub.objects.setChannelMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Update Space object with parameters:" }))), this.objects._setChannelMetadata(e2, t2);
          }));
        }
        removeSpace(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'removeSpace' is deprecated. Use 'pubnub.objects.removeChannelMetadata' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove Space object with parameters:" }))), this.objects._removeChannelMetadata(e2, t2);
          }));
        }
        fetchMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.objects.fetchMemberships(e2, t2);
          }));
        }
        addMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.objects.addMemberships(e2, t2);
          }));
        }
        updateMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            return this.logger.warn("PubNub", "'addMemberships' is deprecated. Use 'pubnub.objects.setChannelMembers' or 'pubnub.objects.setMemberships' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Update memberships with parameters:" }))), this.objects.addMemberships(e2, t2);
          }));
        }
        removeMemberships(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2, n2, r2;
            {
              if (this.logger.warn("PubNub", "'removeMemberships' is deprecated. Use 'pubnub.objects.removeMemberships' or 'pubnub.objects.removeChannelMembers' instead."), this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Remove memberships with parameters:" }))), "spaceId" in e2) {
                const r3 = e2, i3 = { channel: null !== (s2 = r3.spaceId) && void 0 !== s2 ? s2 : r3.channel, uuids: null !== (n2 = r3.userIds) && void 0 !== n2 ? n2 : r3.uuids, limit: 0 };
                return t2 ? this.objects.removeChannelMembers(i3, t2) : this.objects.removeChannelMembers(i3);
              }
              const i2 = e2, a2 = { uuid: i2.userId, channels: null !== (r2 = i2.spaceIds) && void 0 !== r2 ? r2 : i2.channels, limit: 0 };
              return t2 ? this.objects.removeMemberships(a2, t2) : this.objects.removeMemberships(a2);
            }
          }));
        }
        get channelGroups() {
          return this._channelGroups;
        }
        get push() {
          return this._push;
        }
        sendFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              if (!this._configuration.PubNubFile) throw new Error("Validation failed: 'PubNubFile' not configured or file upload not supported by the platform.");
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Send file with parameters:" })));
              const s2 = new ts(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, PubNubFile: this._configuration.PubNubFile, fileUploadPublishRetryLimit: this._configuration.fileUploadPublishRetryLimit, file: e2.file, sendRequest: this.sendRequest.bind(this), publishFile: this.publishFile.bind(this), crypto: this._configuration.getCryptoModule(), cryptography: this.cryptography ? this.cryptography : void 0 })), n2 = { error: false, operation: K.PNPublishFileOperation, category: h.PNAcknowledgmentCategory, statusCode: 0 }, r2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Send file success. File shared with ${e3.id} ID.`);
              };
              return s2.process().then(((e3) => (n2.statusCode = e3.status, r2(e3), t2 ? t2(n2, e3) : e3))).catch(((e3) => {
                let s3;
                throw e3 instanceof d ? s3 = e3.status : e3 instanceof q && (s3 = e3.toStatus(n2.operation)), this.logger.error("PubNub", (() => ({ messageType: "error", message: new d("File sending error. Check status for details", s3) }))), t2 && s3 && t2(s3, null), new d("REST API request processing error. Check status for details", s3);
              }));
            }
          }));
        }
        publishFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              if (!this._configuration.PubNubFile) throw new Error("Validation failed: 'PubNubFile' not configured or file upload not supported by the platform.");
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Publish file message with parameters:" })));
              const s2 = new Jt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, crypto: this._configuration.getCryptoModule() })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", `Publish file message success. File message published with timetoken: ${e3.timetoken}`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        listFiles(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "List files with parameters:" })));
              const s2 = new Yt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", `List files success. There are ${e3.count} uploaded files.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        getFileUrl(e2) {
          var t2;
          {
            const s2 = this.transport.request(new Xt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })).request()), n2 = null !== (t2 = s2.queryParameters) && void 0 !== t2 ? t2 : {}, r2 = Object.keys(n2).map(((e3) => {
              const t3 = n2[e3];
              return Array.isArray(t3) ? t3.map(((t4) => `${e3}=${P(t4)}`)).join("&") : `${e3}=${P(t3)}`;
            })).join("&");
            return `${s2.origin}${s2.path}?${r2}`;
          }
        }
        downloadFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              if (!this._configuration.PubNubFile) throw new Error("Validation failed: 'PubNubFile' not configured or file upload not supported by the platform.");
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Download file with parameters:" })));
              const s2 = new As(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet, PubNubFile: this._configuration.PubNubFile, cryptography: this.cryptography ? this.cryptography : void 0, crypto: this._configuration.getCryptoModule() })), n2 = (e3) => {
                e3 && this.logger.debug("PubNub", "Download file success.");
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : yield this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        deleteFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            {
              this.logger.debug("PubNub", (() => ({ messageType: "object", message: Object.assign({}, e2), details: "Delete file with parameters:" })));
              const s2 = new Qt(Object.assign(Object.assign({}, e2), { keySet: this._configuration.keySet })), n2 = (t3) => {
                t3 && this.logger.debug("PubNub", `Delete file success. Deleted file with ${e2.id} ID.`);
              };
              return t2 ? this.sendRequest(s2, ((e3, s3) => {
                n2(s3), t2(e3, s3);
              })) : this.sendRequest(s2).then(((e3) => (n2(e3), e3)));
            }
          }));
        }
        time(e2) {
          return i(this, void 0, void 0, (function* () {
            this.logger.debug("PubNub", "Get service time.");
            const t2 = new Ms(), s2 = (e3) => {
              e3 && this.logger.debug("PubNub", `Get service time success. Current timetoken: ${e3.timetoken}`);
            };
            return e2 ? this.sendRequest(t2, ((t3, n2) => {
              s2(n2), e2(t3, n2);
            })) : this.sendRequest(t2).then(((e3) => (s2(e3), e3)));
          }));
        }
        emitStatus(e2) {
          var t2;
          null === (t2 = this.eventDispatcher) || void 0 === t2 || t2.handleStatus(e2);
        }
        emitEvent(e2, t2) {
          var s2;
          this._globalSubscriptionSet && this._globalSubscriptionSet.handleEvent(e2, t2), null === (s2 = this.eventDispatcher) || void 0 === s2 || s2.handleEvent(t2), Object.values(this.eventHandleCapable).forEach(((s3) => {
            s3 !== this._globalSubscriptionSet && s3.handleEvent(e2, t2);
          }));
        }
        set onStatus(e2) {
          this.eventDispatcher && (this.eventDispatcher.onStatus = e2);
        }
        set onMessage(e2) {
          this.eventDispatcher && (this.eventDispatcher.onMessage = e2);
        }
        set onPresence(e2) {
          this.eventDispatcher && (this.eventDispatcher.onPresence = e2);
        }
        set onSignal(e2) {
          this.eventDispatcher && (this.eventDispatcher.onSignal = e2);
        }
        set onObjects(e2) {
          this.eventDispatcher && (this.eventDispatcher.onObjects = e2);
        }
        set onMessageAction(e2) {
          this.eventDispatcher && (this.eventDispatcher.onMessageAction = e2);
        }
        set onFile(e2) {
          this.eventDispatcher && (this.eventDispatcher.onFile = e2);
        }
        addListener(e2) {
          this.eventDispatcher && this.eventDispatcher.addListener(e2);
        }
        removeListener(e2) {
          this.eventDispatcher && this.eventDispatcher.removeListener(e2);
        }
        removeAllListeners() {
          this.eventDispatcher && this.eventDispatcher.removeAllListeners();
        }
        encrypt(e2, t2) {
          this.logger.warn("PubNub", "'encrypt' is deprecated. Use cryptoModule instead.");
          const s2 = this._configuration.getCryptoModule();
          if (!t2 && s2 && "string" == typeof e2) {
            const t3 = s2.encrypt(e2);
            return "string" == typeof t3 ? t3 : u(t3);
          }
          if (!this.crypto) throw new Error("Encryption error: cypher key not set");
          return this.crypto.encrypt(e2, t2);
        }
        decrypt(e2, t2) {
          this.logger.warn("PubNub", "'decrypt' is deprecated. Use cryptoModule instead.");
          const s2 = this._configuration.getCryptoModule();
          if (!t2 && s2) {
            const t3 = s2.decrypt(e2);
            return t3 instanceof ArrayBuffer ? JSON.parse(new TextDecoder().decode(t3)) : t3;
          }
          if (!this.crypto) throw new Error("Decryption error: cypher key not set");
          return this.crypto.decrypt(e2, t2);
        }
        encryptFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            if ("string" != typeof e2 && (t2 = e2), !t2) throw new Error("File encryption error. Source file is missing.");
            if (!this._configuration.PubNubFile) throw new Error("File encryption error. File constructor not configured.");
            if ("string" != typeof e2 && !this._configuration.getCryptoModule()) throw new Error("File encryption error. Crypto module not configured.");
            if ("string" == typeof e2) {
              if (!this.cryptography) throw new Error("File encryption error. File encryption not available");
              return this.cryptography.encryptFile(e2, t2, this._configuration.PubNubFile);
            }
            return null === (s2 = this._configuration.getCryptoModule()) || void 0 === s2 ? void 0 : s2.encryptFile(t2, this._configuration.PubNubFile);
          }));
        }
        decryptFile(e2, t2) {
          return i(this, void 0, void 0, (function* () {
            var s2;
            if ("string" != typeof e2 && (t2 = e2), !t2) throw new Error("File encryption error. Source file is missing.");
            if (!this._configuration.PubNubFile) throw new Error("File decryption error. File constructor not configured.");
            if ("string" == typeof e2 && !this._configuration.getCryptoModule()) throw new Error("File decryption error. Crypto module not configured.");
            if ("string" == typeof e2) {
              if (!this.cryptography) throw new Error("File decryption error. File decryption not available");
              return this.cryptography.decryptFile(e2, t2, this._configuration.PubNubFile);
            }
            return null === (s2 = this._configuration.getCryptoModule()) || void 0 === s2 ? void 0 : s2.decryptFile(t2, this._configuration.PubNubFile);
          }));
        }
      }
      Us.decoder = new TextDecoder(), Us.OPERATIONS = K, Us.CATEGORIES = h, Us.Endpoint = z, Us.ExponentialRetryPolicy = X.ExponentialRetryPolicy, Us.LinearRetryPolicy = X.LinearRetryPolicy, Us.NoneRetryPolicy = X.None, Us.LogLevel = V;
      class Ds {
        constructor(e2, t2) {
          this.decode = e2, this.base64ToBinary = t2;
        }
        decodeToken(e2) {
          let t2 = "";
          e2.length % 4 == 3 ? t2 = "=" : e2.length % 4 == 2 && (t2 = "==");
          const s2 = e2.replace(/-/gi, "+").replace(/_/gi, "/") + t2, n2 = this.decode(this.base64ToBinary(s2));
          return "object" == typeof n2 ? n2 : void 0;
        }
      }
      class Rs extends Us {
        constructor(e2) {
          var t2;
          const s2 = void 0 !== e2.subscriptionWorkerUrl, r2 = W(e2), i2 = Object.assign(Object.assign({}, r2), { sdkFamily: "Web" });
          i2.PubNubFile = o;
          const a2 = re(i2, ((e3) => {
            if (e3.cipherKey) {
              return new F({ default: new $(Object.assign(Object.assign({}, e3), e3.logger ? {} : { logger: a2.logger() })), cryptors: [new O({ cipherKey: e3.cipherKey })] });
            }
          }));
          let u2, l2;
          e2.subscriptionWorkerLogVerbosity ? e2.subscriptionWorkerLogLevel = V.Debug : void 0 === e2.subscriptionWorkerLogLevel && (e2.subscriptionWorkerLogLevel = V.None), void 0 !== e2.subscriptionWorkerLogVerbosity && a2.logger().warn("Configuration", "'subscriptionWorkerLogVerbosity' is deprecated. Use 'subscriptionWorkerLogLevel' instead."), a2.getCryptoModule() && (a2.getCryptoModule().logger = a2.logger()), u2 = new oe(new Ds(((e3) => B(n.decode(e3))), c)), (a2.getCipherKey() || a2.secretKey) && (l2 = new D({ secretKey: a2.secretKey, cipherKey: a2.getCipherKey(), useRandomIVs: a2.getUseRandomIVs(), customEncrypt: a2.getCustomEncrypt(), customDecrypt: a2.getCustomDecrypt(), logger: a2.logger() }));
          let h2, d2 = () => {
          }, p2 = () => {
          }, g2 = () => {
          }, b2 = () => {
          };
          h2 = new R();
          let y2 = new he(a2.logger(), i2.transport);
          if (r2.subscriptionWorkerUrl) try {
            const e3 = new H({ clientIdentifier: a2._instanceId, subscriptionKey: a2.subscribeKey, userId: a2.getUserId(), workerUrl: r2.subscriptionWorkerUrl, sdkVersion: a2.getVersion(), heartbeatInterval: a2.getHeartbeatInterval(), announceSuccessfulHeartbeats: a2.announceSuccessfulHeartbeats, announceFailedHeartbeats: a2.announceFailedHeartbeats, workerOfflineClientsCheckInterval: i2.subscriptionWorkerOfflineClientsCheckInterval, workerUnsubscribeOfflineClients: i2.subscriptionWorkerUnsubscribeOfflineClients, workerLogLevel: i2.subscriptionWorkerLogLevel, tokenManager: u2, transport: y2, logger: a2.logger() });
            p2 = (t3) => e3.onPresenceStateChange(t3), d2 = (t3) => e3.onHeartbeatIntervalChange(t3), g2 = (t3) => e3.onTokenChange(t3), b2 = (t3) => e3.onUserIdChange(t3), y2 = e3, r2.subscriptionWorkerUnsubscribeOfflineClients && "undefined" != typeof window && window.addEventListener && window.addEventListener("pagehide", ((t3) => {
              t3.persisted || e3.terminate();
            }), { once: true });
          } catch (e3) {
            a2.logger().error("PubNub", (() => ({ messageType: "error", message: e3 })));
          }
          else s2 && a2.logger().warn("PubNub", "SharedWorker not supported in this browser. Fallback to the original transport.");
          const m2 = new le({ clientConfiguration: a2, tokenManager: u2, transport: y2 });
          if (super({ configuration: a2, transport: m2, cryptography: h2, tokenManager: u2, crypto: l2 }), this.File = o, this.onHeartbeatIntervalChange = d2, this.onAuthenticationChange = g2, this.onPresenceStateChange = p2, this.onUserIdChange = b2, y2 instanceof H) {
            y2.emitStatus = this.emitStatus.bind(this);
            const e3 = this.disconnect.bind(this);
            this.disconnect = (t3) => {
              y2.disconnect(), e3();
            };
          }
          (null === (t2 = e2.listenToBrowserNetworkEvents) || void 0 === t2 || t2) && "undefined" != typeof window && window.addEventListener && (window.addEventListener("offline", (() => {
            this.networkDownDetected();
          })), window.addEventListener("online", (() => {
            this.networkUpDetected();
          })));
        }
        networkDownDetected() {
          this.logger.debug("PubNub", "Network down detected"), this.emitStatus({ category: Rs.CATEGORIES.PNNetworkDownCategory }), this._configuration.restore ? this.disconnect(true) : this.destroy(true);
        }
        networkUpDetected() {
          this.logger.debug("PubNub", "Network up detected"), this.emitStatus({ category: Rs.CATEGORIES.PNNetworkUpCategory }), this.reconnect();
        }
      }
      return Rs.CryptoModule = F, Rs;
    }));
  })(pubnub_min$3);
  return pubnub_min$3.exports;
}
var pubnub_minExports = requirePubnub_min();
const pubnub_min = /* @__PURE__ */ getDefaultExportFromCjs(pubnub_minExports);
const pubnub_min$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: pubnub_min
}, [pubnub_minExports]);
export {
  pubnub_min$1 as p
};
