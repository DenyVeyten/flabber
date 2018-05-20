const cv = require('opencv4nodejs');
const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
  image.drawRectangle(
    rect,
    color,
    opts.thickness,
    cv.LINE_8
  );
const drawBlueRect = (image, rect, opts = { thickness: 2 }) => drawRect(image, rect, new cv.Vec(255, 0, 0), opts);

const fs = require('fs');
const regex = /^data:.+\/(.+);base64,(.*)$/;

module.exports = (string) => {
  const matches = string.match(regex);
  const buffer = new Buffer(matches[2], 'base64');

  const image = cv.imdecode(buffer);
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

// detect faces
  const faces = classifier.detectMultiScale(image.bgrToGray());
  //console.log('faceRects:', faces.objects);
  //console.log('confidences:', faces.numDetections);

  //if (!faces.objects.length) {
  //  console.log('No faces detected!');
  //}

  const result = [];

  faces.numDetections.forEach((conf, i) => {
    if (conf < 8) return;
    result.push(faces.objects[i]);
  });

  return result;
};
