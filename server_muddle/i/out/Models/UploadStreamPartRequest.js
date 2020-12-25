"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UploadStreamPartRequest = /** @class */ (function () {
    function UploadStreamPartRequest(filename, partId, token, part) {
        this.filename = "";
        this.partId = 0;
        this.token = "";
        this.filename = filename;
        this.partId = partId;
        this.token = token;
        this.part = part;
    }
    Object.defineProperty(UploadStreamPartRequest.prototype, "Filename", {
        get: function () {
            return this.filename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploadStreamPartRequest.prototype, "PartId", {
        get: function () {
            return this.partId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploadStreamPartRequest.prototype, "Token", {
        get: function () {
            return this.token;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploadStreamPartRequest.prototype, "Part", {
        get: function () {
            return this.part;
        },
        enumerable: true,
        configurable: true
    });
    return UploadStreamPartRequest;
}());
exports.default = UploadStreamPartRequest;
