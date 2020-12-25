import Image4ioAPI = require('./Image4ioAPI');
import 'mocha';
import * as Models from './Models';
import * as chai from 'chai';

var apiKey = 'apiKey(Username)';
var apiSecret = 'apiSecret(Password)';
/*
var api = new Image4ioAPI.Image4ioAPI(apiKey, apiSecret);

describe('Image4IOAPITest', () => {
    it('GetTest', () => {
        var getRes = api.GetImageDetails(new Models.GetImageDetailsRequestModel("/test.png"));
        return getRes.then(response => {
            chai.expect(response.name).of.equals("/test.png");
        }).catch(error => {
            throw error;
        })
    })
    it('UploadTest', () => {
        var uploadReq = new Models.UploadImagesRequestModel("Test", true, true);
        uploadReq.Add("./Upload_image.jpg", "Upload_image.jpg", "Upload_image.jpg");
        var uploadRes = api.Upload(uploadReq);
        return uploadRes.then(response => {
            chai.expect(response.uploadedFiles[0].status == "Uploaded" || response.uploadedFiles[0].status == "Overwrited").to.equal(true);
        }).catch(error => {
            throw error;
        })
    })
    it('FetchTest', () => {
        var fetchRes = api.Fetch(new Models.FetchRequestModel("imageURLtoBeFetched", "DestinationFolder"));
        return fetchRes.then(response => {
            chai.expect(response.fetchedFile.status).of.equals("Fetched");
        }).catch(error => {
            throw error;
        })
    })
    it('CopyTest', () => {
        var copyRes = api.Copy(new Models.CopyRequestModel("/SourceFolder/FileToBeCopied.png", "DestinationFolder"));
        return copyRes.then(response => {
            chai.expect(response.copiedFile.status).of.equals("Copied");
        }).catch(error => {
            throw error;
        })
    })
    it('MoveTest', () => {
        var moveRes = api.Move(new Models.MoveRequestModel("/SourceFolder/FileToBeMoved.png", "DestinationFolder"));
        return moveRes.then(response => {
            chai.expect(response.movedFile.status).of.equals("Moved");
        }).catch(error => {
            throw error;
        })
    })
    it('ListTest', () => {
        var listFolderRes = api.ListFolder(new Models.ListFolderRequestModel("FolderToBeListed"));
        return listFolderRes.then(response => {
            chai.expect(response.files.length).greaterThan(0);
        }).catch(error => {
            throw error;
        })
    })
    it('CreateTest', () => {
        var createRes = api.CreateFolder(new Models.CreateFolderRequestModel("FolderToBeCreated"));
        return createRes.then(response => {
            chai.expect(response.createdFolder.status == "Created" || response.createdFolder.status == "AlredyExist").to.equal(true);
        }).catch(error => {
            throw error;
        })
    })
    it('DeleteFileTest', () => {
        var deleteFileRes = api.DeleteFile(new Models.DeleteFileRequestModel("/SourceFolder/Delete_file.jpg"));
        return deleteFileRes.then(response => {
            chai.expect(response.deletedFile.status).of.equals("Deleted");
        }).catch(error => {
            throw error;
        })
    })
    it('DeleteFolderTest', () => {
        var deleteFolderRes = api.DeleteFolder(new Models.DeleteFolderRequestModel("FolderToBeDeleted"));
        return deleteFolderRes.then(response => {
            chai.expect(response.deletedFolder.status).of.equals("Deleted");
        }).catch(error => {
            throw error;
        })
    })

})*/