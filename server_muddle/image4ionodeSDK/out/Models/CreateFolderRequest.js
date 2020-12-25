"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateFolderRequestModel = /** @class */ (function () {
    function CreateFolderRequestModel(path) {
        this.path = "";
        this.path = path;
    }
    Object.defineProperty(CreateFolderRequestModel.prototype, "Path", {
        get: function () {
            return this.path;
        },
        enumerable: true,
        configurable: true
    });
    return CreateFolderRequestModel;
}());
exports.default = CreateFolderRequestModel;
