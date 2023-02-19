export function getTimeDifference(date: string) {
  const uploadedDate = new Date(date);
  const currentTime = new Date().getTime();
  const difference = currentTime - uploadedDate.getTime();
  const tenSeconds = 10 * 1000;
  const oneMinute = 60 * 1000;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;

  if (difference < tenSeconds) {
    return "Just now";
  } else if (difference < oneMinute) {
    return "1 m";
  } else if (difference < oneHour) {
    return Math.floor(difference / oneMinute) + " m";
  } else if (difference < oneDay) {
    return Math.floor(difference / oneHour) + " h";
  } else if (difference < oneWeek) {
    return Math.floor(difference / oneDay) + " d";
  } else {
    return Math.floor(difference / oneWeek) + " w";
  }
}
