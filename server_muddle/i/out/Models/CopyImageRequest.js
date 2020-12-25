"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CopyRequestModel = /** @class */ (function () {
    function CopyRequestModel(source, targetPath, name, useFilename, overwrite) {
        this.source = "";
        this.targetPath = "";
        this.name = "";
        this.useFilename = false;
        this.overwrite = false;
        this.source = source;
        this.targetPath = targetPath;
        this.name = name;
        this.useFilename = useFilename;
        this.overwrite = overwrite;
    }
    Object.defineProperty(CopyRequestModel.prototype, "Source", {
        get: function () {
            return this.source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CopyRequestModel.prototype, "TargetPath", {
        get: function () {
            return this.targetPath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CopyRequestModel.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CopyRequestModel.prototype, "UseFilename", {
        get: function () {
            return this.useFilename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CopyRequestModel.prototype, "Overwrite", {
        get: function () {
            return this.overwrite;
        },
        enumerable: true,
        configurable: true
    });
    return CopyRequestModel;
}());
exports.default = CopyRequestModel;
