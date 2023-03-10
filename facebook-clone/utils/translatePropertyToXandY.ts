export default function translatePropertyToXAndY(translateString: string) {
  const match = translateString.match(
    /translateX\((.*?)\) translateY\((.*?)\)/
  );
  if (!match) {
    return {
      x: 0,
      y: 0,
    };
  }
  const x = parseFloat(match[1]);
  const y = parseFloat(match[2]);

  if (isNaN(x) || isNaN(y)) {
    return {
      x: 0,
      y: 0,
    };
  }

  return { x, y };
}
