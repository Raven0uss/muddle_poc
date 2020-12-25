"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListFolderRequestModel = /** @class */ (function () {
    function ListFolderRequestModel(path, continuationToken) {
        this.path = "";
        this.continuationToken = "";
        this.path = path;
        this.continuationToken = continuationToken;
    }
    Object.defineProperty(ListFolderRequestModel.prototype, "Path", {
        get: function () {
            return this.path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListFolderRequestModel.prototype, "ContinuationToken", {
        get: function () {
            return this.continuationToken;
        },
        enumerable: true,
        configurable: true
    });
    return ListFolderRequestModel;
}());
exports.default = ListFolderRequestModel;
