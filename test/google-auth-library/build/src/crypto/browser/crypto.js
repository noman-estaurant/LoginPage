"use strict";
/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// This file implements crypto functions we need using in-browser
// SubtleCrypto interface `window.crypto.subtle`.
const base64js = require("base64-js");
const isbrowser_1 = require("../../isbrowser");
// Not all browsers support `TextEncoder`. The following `require` will
// provide a fast UTF8-only replacement for those browsers that don't support
// text encoding natively.
if (isbrowser_1.isBrowser() && typeof TextEncoder === 'undefined') {
    require('fast-text-encoding');
}
class BrowserCrypto {
    constructor() {
        if (typeof (window) === 'undefined' || window.crypto === undefined ||
            window.crypto.subtle === undefined) {
            throw new Error('SubtleCrypto not found. Make sure it\'s an https:// website.');
        }
    }
    sha256DigestBase64(str) {
        return __awaiter(this, void 0, void 0, function* () {
            // SubtleCrypto digest() method is async, so we must make
            // this method async as well.
            // To calculate SHA256 digest using SubtleCrypto, we first
            // need to convert an input string to an ArrayBuffer:
            const inputBuffer = new TextEncoder().encode(str);
            // Result is ArrayBuffer as well.
            const outputBuffer = yield window.crypto.subtle.digest('SHA-256', inputBuffer);
            return base64js.fromByteArray(new Uint8Array(outputBuffer));
        });
    }
    randomBytesBase64(count) {
        const array = new Uint8Array(count);
        window.crypto.getRandomValues(array);
        return base64js.fromByteArray(array);
    }
    verify(pubkey, data, signature) {
        return __awaiter(this, void 0, void 0, function* () {
            const algo = {
                name: 'RSASSA-PKCS1-v1_5',
                hash: { name: 'SHA-256' },
            };
            const dataArray = new TextEncoder().encode(data);
            // base64js requires padding, so let's add some '='
            while (signature.length % 4 !== 0) {
                signature += '=';
            }
            const signatureArray = base64js.toByteArray(signature);
            const cryptoKey = yield window.crypto.subtle.importKey('jwk', pubkey, algo, true, ['verify']);
            // SubtleCrypto's verify method is async so we must make
            // this method async as well.
            const result = yield window.crypto.subtle.verify(algo, cryptoKey, signatureArray, dataArray);
            return result;
        });
    }
    createSign(algorithm) {
        throw new Error('createSign is not implemented in BrowserCrypto');
    }
    decodeBase64StringUtf8(base64) {
        const uint8array = base64js.toByteArray(base64);
        const result = new TextDecoder().decode(uint8array);
        return result;
    }
    encodeBase64StringUtf8(text) {
        const uint8array = new TextEncoder().encode(text);
        const result = base64js.fromByteArray(uint8array);
        return result;
    }
}
exports.BrowserCrypto = BrowserCrypto;
//# sourceMappingURL=crypto.js.map