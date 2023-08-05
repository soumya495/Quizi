// replace extra characters from the string with ...
export function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 1) + " ..." : str;
}

// convert to milliseconds
export function convertToMilliSeconds(hours, minutes, seconds) {
  const parsedHours = hours ? parseInt(hours) : 0;
  const parsedMinutes = minutes ? parseInt(minutes) : 0;
  const parsedSeconds = seconds ? parseInt(seconds) : 0;

  const durationInMilliseconds =
    parsedHours * 60 * 60 * 1000 +
    parsedMinutes * 60 * 1000 +
    parsedSeconds * 1000;
  return durationInMilliseconds;
}

// convert milliseconds to hours, minutes and seconds
export function convertToHoursMinutesSeconds(durationInMilliseconds) {
  const hours = Math.floor(durationInMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor(
    (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((durationInMilliseconds % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

// For scrolling to a particular element in a container
export function scrollToEl(elementId, containerId) {
  let item = document.getElementById(elementId);
  let wrapper = document.getElementById(containerId);
  let count = item?.offsetTop - wrapper?.scrollTop - 80;
  wrapper.scrollBy({ top: count, left: 0, behavior: "smooth" });
}
