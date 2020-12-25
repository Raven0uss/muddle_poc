"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FinalizeStreamRequest = /** @class */ (function () {
    function FinalizeStreamRequest(filename, token) {
        this.filename = "";
        this.token = "";
        this.filename = filename;
        this.token = token;
    }
    Object.defineProperty(FinalizeStreamRequest.prototype, "Filename", {
        get: function () {
            return this.filename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FinalizeStreamRequest.prototype, "Token", {
        get: function () {
            return this.token;
        },
        enumerable: true,
        configurable: true
    });
    return FinalizeStreamRequest;
}());
exports.default = FinalizeStreamRequest;
