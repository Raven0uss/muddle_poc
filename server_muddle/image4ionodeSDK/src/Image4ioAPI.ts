import * as request from 'request-promise';
import * as Models from './Models';
import { createReadStream } from 'fs';

export class Image4ioClient {
    public baseUrl: string = "https://api.image4.io";
    public upload: Object = {};
    public apiKey: string = "";
    public apiSecret: string = "";

    constructor(apiKey: string, apiSecret: string) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    public UploadImage(model: Models.UploadImagesRequest) {
        try {
            return this.UploadImageAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async UploadImageAsync(model: Models.UploadImagesRequest) {
        try {
            var formData = {
                files: Array(),
                path : model.Path,
                overwrite: String(model.Overwrite),
                useFilename: String(model.UseFilename),
            };

            model.Files.forEach(file => {
                formData.files.push(createReadStream(file.Data));
            });

            return await request.post({ url: this.baseUrl + '/v1.0/uploadImage', formData: formData }, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Upload image failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }


    public CopyImage(model: Models.CopyImageRequest) {
        try {
            return this.CopyImageAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async CopyImageAsync(model: Models.CopyImageRequest) {
        try {
            
            var options={
                method:"PUT",
                uri:this.baseUrl + '/v1.0/copyImage',
                body: {
                    source: model.Source,
                    targetPath : model.TargetPath,
                    name:model.Name,
                    useFilename:model.UseFilename,
                    overwrite:model.Overwrite
                },
                json:true
            }

            return await request.put(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Copy image failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public GetImage(model: Models.GetImageRequest) {
        try {
            return this.GetImageAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async GetImageAsync(model: Models.GetImageRequest) {
        try {
            var options={
                method:"GET",
                uri:this.baseUrl + '/v1.0/image',
                qs: {
                    name: model.Name
                },
                json:true
            }
            return await request.get(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Get Image failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }

            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public DeleteFolder(model: Models.DeleteFolderRequest) {
        try {
            return this.DeleteFolderAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async DeleteFolderAsync(model: Models.DeleteFolderRequest) {
        try {
            var options={
                method:"DELETE",
                uri:this.baseUrl + '/v1.0/deleteFolder',
                body: {
                    path: model.Path
                },
                json:true
            }
            return await request.delete(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Delete Folder failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }


    public DeleteImage(model: Models.DeleteImageRequest) {
        try {
            return this.DeleteImageAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async DeleteImageAsync(model: Models.DeleteImageRequest) {
        try {
            var options={
                method:"DELETE",
                uri:this.baseUrl + '/v1.0/deleteImage',
                body: {
                    path: model.Name
                },
                json:true
            }

            return await request.delete(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Delete Image failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }


    public CreateFolder(model: Models.CreateFolderRequest) {
        try {
            return this.CreateFolderAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async CreateFolderAsync(model: Models.CreateFolderRequest) {
        try {
            var options={
                method:"POST",
                uri:this.baseUrl + '/v1.0/createFolder',
                body: {
                    path: model.Path
                },
                json:true
            }

            return await request.post(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Create Folder failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public FetchImage(model: Models.FetchImageRequest) {
        try {
            return this.FetchImageAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async FetchImageAsync(model: Models.FetchImageRequest) {
        try {
            var options={
                method:"POST",
                uri:this.baseUrl + '/v1.0/fetchImage',
                body: {
                    from:model.From,
                    targetPath:model.TargetPath,
                    useFilename:model.UseFilename
                },
                json:true
            }

            return await request.post(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Fetch Image failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public FetchStream(model: Models.FetchStreamRequest) {
        try {
            return this.FetchStreamAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async FetchStreamAsync(model: Models.FetchStreamRequest) {
        try {
            var options={
                method:"POST",
                uri:this.baseUrl + '/v1.0/fetchStream',
                body: {
                    from:model.From,
                    targetPath:model.TargetPath,
                    filename:model.Filename
                },
                json:true
            }

            return await request.post(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Fetch Stream failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public ListFolder(model: Models.ListFolderRequest) {
        try {
            return this.ListFolderAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async ListFolderAsync(model: Models.ListFolderRequest) {
        try {
            var options={
                method:"GET",
                uri:this.baseUrl + '/v1.0/listFolder',
                qs: {
                    path:model.Path,
                    continuationToken: model.ContinuationToken
                },
                json:true
            }

            return await request.get(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("List Folder failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public MoveImage(model: Models.MoveImageRequest) {
        try {
            return this.MoveImageAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async MoveImageAsync(model: Models.MoveImageRequest) {
        try {

            var options={
                method:"PUT",
                uri:this.baseUrl + '/v1.0/moveImage',
                body: {
                    source:model.Source,
                    targetPath:model.TargetPath
                },
                json:true
            }

            return await request.put(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Move Image failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public Purge() {
        try {
            return this.PurgeAsync().then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async PurgeAsync() {
        try {

            var options={
                method:"DELETE",
                uri:this.baseUrl + '/v1.0/purge',
                json:true
            }

            return await request.delete(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Purge Request failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public GetSubscription() {
        try {
            return this.GetSubscriptionAsync().then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async GetSubscriptionAsync() {
        try {

            var options={
                method:"GET",
                uri:this.baseUrl + '/v1.0/subscription',
                json:true
            }

            return await request.get(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Purge Request failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public StartUploadStream(model: Models.StartUploadStreamRequest) {
        try {
            return this.StartUploadStreamAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async StartUploadStreamAsync(model: Models.StartUploadStreamRequest) {
        try {
            var options={
                method:"POST",
                uri:this.baseUrl + '/v1.0/uploadStream',
                body: {
                    path: model.Path,
                    filename:model.Filename
                },
                json:true
            }

            return await request.post(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Start Upload Stream failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public UploadStreamPart(model: Models.UploadStreamPartRequest) {
        try {
            return this.UploadStreamPartAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async UploadStreamPartAsync(model: Models.UploadStreamPartRequest) {
        try {
            var formData = {
                filename: model.Filename,
                partId : model.PartId,
                token: model.Token,
                part: model.Part,
            };

            return await request.patch({ url: this.baseUrl + '/v1.0/uploadStream', formData: formData }, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Upload stream part failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
            
        } catch (exception) {
            throw exception;
        }
    }

    public FinalizeStream(model: Models.FinalizeStreamRequest) {
        try {
            return this.FinalizeStreamAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async FinalizeStreamAsync(model: Models.FinalizeStreamRequest) {
        try {
            var options={
                method:"POST",
                uri:this.baseUrl + '/v1.0/finalizeStream',
                body: {
                    filename:model.Filename,
                    token: model.Token
                },
                json:true
            }

            return await request.post(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Finalize Stream failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public GetStream(model: Models.GetStreamRequest) {
        try {
            return this.GetStreamAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async GetStreamAsync(model: Models.GetStreamRequest) {
        try {
            var options={
                method:"GET",
                uri:this.baseUrl + '/v1.0/stream',
                qs: {
                    names: model.Name
                },
                json:true
            }
            return await request.get(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Get Streams failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }

            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }

    public DeleteStream(model: Models.DeleteStreamRequest) {
        try {
            return this.DeleteStreamAsync(model).then(response => {
                return JSON.parse(String(response));
            }).catch(exception => {
                throw exception;
            });
        } catch (exception) {
            throw exception;
        }
    }
    private async DeleteStreamAsync(model: Models.DeleteStreamRequest) {
        try {
            var options={
                method:"DELETE",
                uri:this.baseUrl + '/v1.0/deleteStream',
                body: {
                    path: model.Name
                },
                json:true
            }

            return await request.delete(options, function (err, res, body) {
                if (res.statusCode == 200) {
                    return body;
                } else {
                    throw new Error("Delete Stream failed. Status code: " + res.statusCode + "; Error(s):" + JSON.stringify(body.errors));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        } catch (error) {
            throw error;
        }
    }
}

