"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UploadImagesRequestModel = /** @class */ (function () {
    function UploadImagesRequestModel(path, overwrite, useFilename) {
        this.useFilename = false;
        this.overwrite = false;
        this.path = "";
        this.files = new Array();
        this.useFilename = useFilename;
        this.overwrite = overwrite;
        this.path = path;
    }
    Object.defineProperty(UploadImagesRequestModel.prototype, "UseFilename", {
        get: function () {
            return this.useFilename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploadImagesRequestModel.prototype, "Overwrite", {
        get: function () {
            return this.overwrite;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploadImagesRequestModel.prototype, "Path", {
        get: function () {
            return this.path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UploadImagesRequestModel.prototype, "Files", {
        get: function () {
            return this.files;
        },
        enumerable: true,
        configurable: true
    });
    UploadImagesRequestModel.prototype.Add = function (data, name, filename) {
        this.files.push(new File(data, name, filename));
    };
    return UploadImagesRequestModel;
}());
exports.default = UploadImagesRequestModel;
var File = /** @class */ (function () {
    function File(data, name, filename) {
        this.data = "";
        this.name = "";
        this.filename = "";
        this.data = data;
        this.name = name;
        this.filename = filename;
    }
    Object.defineProperty(File.prototype, "Data", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "Name", {
        get: function () {
            return this.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "FileName", {
        get: function () {
            return this.filename;
        },
        enumerable: true,
        configurable: true
    });
    return File;
}());
