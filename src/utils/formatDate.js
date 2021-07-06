const { DateTime } = require('luxon');

// 2021-07-05T18:13:26.933-05:00
// 2021-07-05T16:46:59.342-05:00
// 2021-07-05T16:40:19.343-05:00
// 2021-07-05T16:17:51.003-05:00
// 2021-07-05T16:09:22.511-05:00

function formattedDate(date) {
  const formatted = DateTime.fromJSDate(date, {
    zone: 'America/Lima',
  });

  return formatted
    .toFormat('yyyy LLL dd hh:mm', {
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Lima',
    })
    .toUpperCase();
}

function getCurrentTime() {
  const pacificTime = DateTime.local().setZone('America/Lima');
  return pacificTime
    .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
    .toUpperCase();
}

function dateComparator(from, to) {
  if (from.toISOString() === to) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  formattedDate,
  getCurrentTime,
  dateComparator,
};
