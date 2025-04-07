// import dayjs
import dayjs from "dayjs";

// import relativeTime plugin
import relativeTime from "dayjs/plugin/relativeTime";

// extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

export const convertTimestampToFromNow = (timestamp: Date) => {
  return dayjs(timestamp).fromNow();
};

export const convertTimestampToDate = (timestamp: Date) => {
  return dayjs(timestamp).format("D MMM YYYY, h:mm:ssA");
};
