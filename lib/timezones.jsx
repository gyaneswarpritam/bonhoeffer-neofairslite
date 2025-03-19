// utils/timezones.js
import moment from "moment-timezone";

export const getTimezonesWithGMT = () => {
  const timezones = moment.tz.names();

  const timezoneList = timezones.map((timezone) => {
    const offset = moment.tz(timezone).utcOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const gmt = `GMT${offset >= 0 ? "+" : "-"}${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}`;

    return {
      timezone,
      gmt,
      offset,
    };
  });

  // Sort by the GMT offset
  const sortedTimezoneList = timezoneList.sort((a, b) => a.offset - b.offset);

  // Remove duplicates based on GMT offset
  // const uniqueTimezones = sortedTimezoneList.filter(
  //   (value, index, self) => index === self.findIndex((t) => t.gmt === value.gmt)
  // );

  return sortedTimezoneList;
};
