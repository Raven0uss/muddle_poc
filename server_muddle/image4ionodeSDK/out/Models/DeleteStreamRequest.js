"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeleteStreamRequest = /** @class */ (function () {
    function DeleteStreamRequest(name) {
        this.name = "";
        this.name = name;
    }
    Object.defineProperty(DeleteStreamRequest.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    return DeleteStreamRequest;
}());
exports.default = DeleteStreamRequest;
