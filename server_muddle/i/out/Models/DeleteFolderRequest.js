"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeleteFolderRequestModel = /** @class */ (function () {
    function DeleteFolderRequestModel(path) {
        this.path = "";
        this.path = path;
    }
    Object.defineProperty(DeleteFolderRequestModel.prototype, "Path", {
        get: function () {
            return this.path;
        },
        enumerable: true,
        configurable: true
    });
    return DeleteFolderRequestModel;
}());
exports.default = DeleteFolderRequestModel;
