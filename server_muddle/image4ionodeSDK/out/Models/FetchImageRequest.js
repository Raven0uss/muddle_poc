"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FetchImageRequestModel = /** @class */ (function () {
    function FetchImageRequestModel(from, targetPath, useFilename) {
        this.from = "";
        this.targetPath = "";
        this.useFilename = false;
        this.from = from;
        this.targetPath = targetPath;
        this.useFilename = useFilename;
    }
    Object.defineProperty(FetchImageRequestModel.prototype, "From", {
        get: function () {
            return this.from;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchImageRequestModel.prototype, "TargetPath", {
        get: function () {
            return this.targetPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FetchImageRequestModel.prototype, "UseFilename", {
        get: function () {
            return this.useFilename;
        },
        enumerable: true,
        configurable: true
    });
    return FetchImageRequestModel;
}());
exports.default = FetchImageRequestModel;
