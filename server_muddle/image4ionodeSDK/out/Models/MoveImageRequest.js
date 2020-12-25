"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MoveRequestModel = /** @class */ (function () {
    function MoveRequestModel(source, targetPath) {
        this.source = "";
        this.targetPath = "";
        this.source = source;
        this.targetPath = targetPath;
    }
    Object.defineProperty(MoveRequestModel.prototype, "TargetPath", {
        get: function () {
            return this.targetPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MoveRequestModel.prototype, "Source", {
        get: function () {
            return this.source;
        },
        enumerable: true,
        configurable: true
    });
    return MoveRequestModel;
}());
exports.default = MoveRequestModel;
