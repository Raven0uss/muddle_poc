let client = new Image4ioAPI.Image4ioAPI(apiKey, apiSecret);
var request = new Models.UploadImagesRequest("/folderName", true, true);
request.Add(
  "/path/to/image/location/name-of-the-image.jpg",
  "name-of-the-image",
  "name-of-the-image.jpg"
);
let response = client.UploadImage(request);

// 200
// {
//     "uploadedFiles": [
//       {
//         "name": "/name-of-the-image.png",
//         "userGivenName": "name-of-the-image.png",
//         "size": 388,
//         "format": "png",
//         "url": "https://cdn.image4.io/cloudname/name-of-the-image.png",
//         "imagePath": "/cloudname/name-of-the-image.png",
//         "width": 72,
//         "height": 72,
//         "createdAtUTC": "2020-04-15T10:10:30.940525Z",
//         "updatedAtUTC": "2020-04-15T10:10:30.9405273Z",
//         "status": "Uploaded"
//       },
//       {
//         "name": "/name-of-the-image.tiff",
//         "status": "NotAllowedFormat"
//       }
//     ],
//     "success": true,
//     "errors": [],
//     "messages": [
//       "There are some images that cannot be uploaded"
//     ]
//   }

// 400
// Null or Empty
// {
//     "createdFolder": [],
//     "success": false,
//     "errors": [
//       "Path cannot be null or empty"
//     ],
//     "messages": []
//   }
// No file to upload
// {
//     "createdFolder": [],
//     "success": false,
//     "errors": [
//       "There is no file(s) to upload"
//     ],
//     "messages": []
//   }

// 500
// {
//     "success": true,
//     "errors": [
//       "string"
//     ],
//     "messages": [
//       "string"
//     ]
//   }
