/**
 * https://mimetype.io/all-types
 */
export const mimeMap = {
  ".3gp": "video/3gpp",
  ".3g2": "video/3gpp2",
  ".h265": "video/h265",
  ".jpgv": "video/jpeg",
  ".mp4": "video/mp4",
  ".mp4v": "video/mp4",
  ".mpg4": "video/mp4",
  ".m1v": "video/mpeg",
  ".m2v": "video/mpeg",
  ".mpa": "video/mpeg",
  ".mpe": "video/mpeg",
  ".mpeg": "video/mpeg",
  ".mpg": "video/mpeg",
  ".ogv": "video/ogg",
  ".mov": "video/quicktime",
  ".qt": "video/quicktime",
  ".m4u": "video/vnd.mpegurl",
  ".mxu": "video/vnd.mpegurl",
  ".viv": "video/vnd.vivo",
  ".webm": "video/webm",
  ".flv": "video/x-flv",
  ".mkv": "video/x-matroska",
  ".wm": "video/x-ms-wm",
  ".wmv": "video/x-ms-wmv",
  ".wmx": "video/x-ms-wmx",
  ".wvx": "video/x-ms-wvx",
  ".avi": "video/x-msvideo",
  ".movie": "video/x-sgi-movie",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heic",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

export const getLocalUrl = (file) => URL.createObjectURL(file);

export const compressImage = (file) => {
  const [type, ext] = file.type.split("/");
  if (type !== "image" || ext === "gif") {
    return Promise.resolve(file);
  }
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        const drawWidth = this.naturalWidth;
        const drawHeight = this.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = drawWidth;
        canvas.height = drawHeight;
        const context = canvas.getContext("2d");
        context.drawImage(this, 0, 0, drawWidth, drawHeight);
        canvas.toBlob(
          function (blob) {
            const toFile = new File([blob], file.name, { type: "image/jpeg" });
            resolve(toFile);
          },
          "image/jpeg",
          0.8
        );
      };
      img.src = this.result;
    };
    reader.readAsDataURL(file);
  });
};
