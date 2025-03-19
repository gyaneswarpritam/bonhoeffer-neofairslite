import dayjs from "dayjs";
import "dayjs/plugin/utc";
import "dayjs/locale/en"; // Import the locale you want to use

dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/duration"));

export const dayjsFormat = (input) => {
  dayjs.locale("en");
  return dayjs(input).format("DD-MM-YYYY hh:mm A");
};

export const dayjsShortFormat = (input) => {
  dayjs.locale("en");
  return dayjs(input).format("MMMM D, YYYY hh:mm A");
};
export const dayjsShortDate = (input) => {
  dayjs.locale("en");
  return dayjs(input).format("MMMM D, YYYY");
};
export const dayjsShortTime = (input) => {
  dayjs.locale("en");
  return dayjs(input).format("hh:mm A");
};

export const formatDateTime = (dateTimeStr) => {
  // Extract date and time parts manually
  const [datePart, timePartWithOffset] = dateTimeStr.split("T");
  const [timePart, offset] = timePartWithOffset.split("+");
  const [hours, minutes, seconds] = timePart.split(":");

  // Format date
  const [year, month, day] = datePart.split("-");
  const formattedDate = `${day}-${month}-${year}`;

  // Format time
  const hours24 = parseInt(hours, 10);
  const amPm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${hours12}:${minutes} ${amPm}`;

  // Combine date and time
  return `${formattedDate} ${formattedTime}`;
};

export const convertDateTime = (dateTimeStr) => {
  // Extract date and time parts manually
  const [datePart, timePartWithOffset] = dateTimeStr.split("T");
  const [timePart] = timePartWithOffset.split("+"); // Remove the timezone offset
  const [hours, minutes] = timePart.split(":"); // Extract hours and minutes

  // Combine date part and time part without seconds and offset
  return `${datePart}T${hours}:${minutes}`;
};
