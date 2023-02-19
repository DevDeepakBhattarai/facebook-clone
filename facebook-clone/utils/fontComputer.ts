export function fontComputer(font: string | undefined) {
  switch (font) {
    case "sans serif":
      return "font-[comic-sans-mc]";
    case "arial":
      return "font-mono";

    case "Comic Sans MS":
      return "font-[cursive]";
    case "Georgia":
      return "font-[Georgia]";
    case "helvetica":
      return "font-sherif";
  }
}
