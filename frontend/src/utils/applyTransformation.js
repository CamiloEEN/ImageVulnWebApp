export function applyTransformation(imageElement, redArray, greenArray, blueArray) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;

  ctx.drawImage(imageElement, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = redArray[data[i]];     // R
    data[i + 1] = greenArray[data[i + 1]]; // G
    data[i + 2] = blueArray[data[i + 2]];  // B
    // data[i + 3] = alpha
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
