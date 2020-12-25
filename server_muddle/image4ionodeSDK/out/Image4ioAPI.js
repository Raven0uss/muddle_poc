"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
var request = __importStar(require("request-promise"));
var fs_1 = require("fs");
var Image4ioClient = /** @class */ (function() {
  function Image4ioClient(apiKey, apiSecret) {
    this.baseUrl = "https://api.image4.io";
    this.upload = {};
    this.apiKey = "";
    this.apiSecret = "";
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }
  Image4ioClient.prototype.UploadImage = function(model) {
    try {
      return this.UploadImageAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.UploadImageAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var formData, error_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            formData = {
              files: Array(),
              path: model.Path,
              overwrite: String(model.Overwrite),
              useFilename: String(model.UseFilename),
            };
            model.Files.forEach(function(file) {
              formData.files.push(fs_1.createReadStream(file.Data));
            });
            // console.log(this.apiKey, this.apiSecret);
            console.log(formData);
            return [
              4 /*yield*/,
              request
                .post(
                  {
                    url: this.baseUrl + "/v1.0/uploadImage",
                    formData: formData,
                    rejectUnauthorized: false,
                  },
                  function(err, res, body) {
                    console.log(err);
                    if (res.statusCode == 200) {
                      return body;
                    } else {
                      return new Error(
                        "Upload image failed. Status code: " +
                          res.statusCode +
                          "; Error(s):" +
                          JSON.parse(body).errors[0]
                      );
                    }
                  }
                )
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_1 = _a.sent();
            throw error_1;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.CopyImage = function(model) {
    try {
      return this.CopyImageAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.CopyImageAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_2;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "PUT",
              uri: this.baseUrl + "/v1.0/copyImage",
              body: {
                source: model.Source,
                targetPath: model.TargetPath,
                name: model.Name,
                useFilename: model.UseFilename,
                overwrite: model.Overwrite,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .put(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Copy image failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_2 = _a.sent();
            throw error_2;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.GetImage = function(model) {
    try {
      return this.GetImageAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.GetImageAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_3;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "GET",
              uri: this.baseUrl + "/v1.0/image",
              qs: {
                name: model.Name,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .get(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Get Image failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_3 = _a.sent();
            throw error_3;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.DeleteFolder = function(model) {
    try {
      return this.DeleteFolderAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.DeleteFolderAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_4;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "DELETE",
              uri: this.baseUrl + "/v1.0/deleteFolder",
              body: {
                path: model.Path,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .delete(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Delete Folder failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_4 = _a.sent();
            throw error_4;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.DeleteImage = function(model) {
    try {
      return this.DeleteImageAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.DeleteImageAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_5;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "DELETE",
              uri: this.baseUrl + "/v1.0/deleteImage",
              body: {
                path: model.Name,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .delete(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Delete Image failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_5 = _a.sent();
            throw error_5;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.CreateFolder = function(model) {
    try {
      return this.CreateFolderAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.CreateFolderAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_6;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "POST",
              uri: this.baseUrl + "/v1.0/createFolder",
              body: {
                path: model.Path,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .post(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Create Folder failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_6 = _a.sent();
            throw error_6;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.FetchImage = function(model) {
    try {
      return this.FetchImageAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.FetchImageAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_7;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "POST",
              uri: this.baseUrl + "/v1.0/fetchImage",
              body: {
                from: model.From,
                targetPath: model.TargetPath,
                useFilename: model.UseFilename,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .post(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Fetch Image failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_7 = _a.sent();
            throw error_7;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.FetchStream = function(model) {
    try {
      return this.FetchStreamAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.FetchStreamAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_8;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "POST",
              uri: this.baseUrl + "/v1.0/fetchStream",
              body: {
                from: model.From,
                targetPath: model.TargetPath,
                filename: model.Filename,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .post(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Fetch Stream failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_8 = _a.sent();
            throw error_8;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.ListFolder = function(model) {
    try {
      return this.ListFolderAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.ListFolderAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_9;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "GET",
              uri: this.baseUrl + "/v1.0/listFolder",
              qs: {
                path: model.Path,
                continuationToken: model.ContinuationToken,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .get(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "List Folder failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_9 = _a.sent();
            throw error_9;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.MoveImage = function(model) {
    try {
      return this.MoveImageAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.MoveImageAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_10;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "PUT",
              uri: this.baseUrl + "/v1.0/moveImage",
              body: {
                source: model.Source,
                targetPath: model.TargetPath,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .put(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Move Image failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_10 = _a.sent();
            throw error_10;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.Purge = function() {
    try {
      return this.PurgeAsync()
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.PurgeAsync = function() {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_11;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "DELETE",
              uri: this.baseUrl + "/v1.0/purge",
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .delete(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Purge Request failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_11 = _a.sent();
            throw error_11;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.GetSubscription = function() {
    try {
      return this.GetSubscriptionAsync()
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.GetSubscriptionAsync = function() {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_12;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "GET",
              uri: this.baseUrl + "/v1.0/subscription",
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .get(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Purge Request failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_12 = _a.sent();
            throw error_12;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.StartUploadStream = function(model) {
    try {
      return this.StartUploadStreamAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.StartUploadStreamAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_13;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "POST",
              uri: this.baseUrl + "/v1.0/uploadStream",
              body: {
                path: model.Path,
                filename: model.Filename,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .post(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Start Upload Stream failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_13 = _a.sent();
            throw error_13;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.UploadStreamPart = function(model) {
    try {
      return this.UploadStreamPartAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.UploadStreamPartAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var formData, exception_1;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            formData = {
              filename: model.Filename,
              partId: model.PartId,
              token: model.Token,
              part: model.Part,
            };
            return [
              4 /*yield*/,
              request
                .patch(
                  {
                    url: this.baseUrl + "/v1.0/uploadStream",
                    formData: formData,
                  },
                  function(err, res, body) {
                    if (res.statusCode == 200) {
                      return body;
                    } else {
                      throw new Error(
                        "Upload stream part failed. Status code: " +
                          res.statusCode +
                          "; Error(s):" +
                          JSON.stringify(body.errors)
                      );
                    }
                  }
                )
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            exception_1 = _a.sent();
            throw exception_1;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.FinalizeStream = function(model) {
    try {
      return this.FinalizeStreamAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.FinalizeStreamAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_14;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "POST",
              uri: this.baseUrl + "/v1.0/finalizeStream",
              body: {
                filename: model.Filename,
                token: model.Token,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .post(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Finalize Stream failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_14 = _a.sent();
            throw error_14;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.GetStream = function(model) {
    try {
      return this.GetStreamAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.GetStreamAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_15;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "GET",
              uri: this.baseUrl + "/v1.0/stream",
              qs: {
                names: model.Name,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .get(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Get Streams failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_15 = _a.sent();
            throw error_15;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  Image4ioClient.prototype.DeleteStream = function(model) {
    try {
      return this.DeleteStreamAsync(model)
        .then(function(response) {
          return JSON.parse(String(response));
        })
        .catch(function(exception) {
          throw exception;
        });
    } catch (exception) {
      throw exception;
    }
  };
  Image4ioClient.prototype.DeleteStreamAsync = function(model) {
    return __awaiter(this, void 0, void 0, function() {
      var options, error_16;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            options = {
              method: "DELETE",
              uri: this.baseUrl + "/v1.0/deleteStream",
              body: {
                path: model.Name,
              },
              json: true,
            };
            return [
              4 /*yield*/,
              request
                .delete(options, function(err, res, body) {
                  if (res.statusCode == 200) {
                    return body;
                  } else {
                    throw new Error(
                      "Delete Stream failed. Status code: " +
                        res.statusCode +
                        "; Error(s):" +
                        JSON.stringify(body.errors)
                    );
                  }
                })
                .auth(this.apiKey, this.apiSecret, true),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_16 = _a.sent();
            throw error_16;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  return Image4ioClient;
})();
exports.Image4ioClient = Image4ioClient;
