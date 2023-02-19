export function readFileAsDataURL(
  image: File[],
  setState: React.Dispatch<React.SetStateAction<[] | File[]>>
) {
  for (let i = 0; i < image.length; i++) {
    const fileReader = new FileReader();
    if (image) fileReader.readAsDataURL(image[i]);
    fileReader.onload = (e) => {
      setState((prev: any) => [...prev, e.target?.result]);
    };
  }
}
