export function dataURLtoBlob(dataURL: string) {
  console.log(dataURL);
  // Split the dataURL to extract the base64 encoded data
  const [, base64Data] = dataURL.split(";base64,");

  // Convert the base64 encoded data to binary data
  const binaryData = Buffer.from(base64Data, "base64");

  // Create a new Blob object from the binary data
  const blob = new Blob([binaryData], { type: "image/jpeg" }); // change type to match your dataURL

  return blob;
}
