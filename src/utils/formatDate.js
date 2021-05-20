const { DateTime } = require('luxon');

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
  if (
    from.toISOString() === to
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  formattedDate,
  getCurrentTime,
  dateComparator
};
