const { DateTime } = require('luxon');

function formattedDate(date) {
  const formatted = DateTime.fromJSDate(date, {
    zone: 'America/Guayaquil',
  });

  return formatted
    .toFormat('dd LLL yyyy hh:mm', {
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Guayaquil',
    })
    .toUpperCase();
}

function getCurrentTime() {
  const pacificTime = DateTime.local().setZone('America/Guayaquil');
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

function getFullDateInNumber() {
  const date = DateTime.now().setZone('America/Guayaquil');
  const { year, day, month } = date;

  return { year, day, month };
}

function getCurrentDateISO() {
  return DateTime.local().setZone('America/Guayaquil').toISO();
}

module.exports = {
  formattedDate,
  getCurrentTime,
  dateComparator,
  getFullDateInNumber,
  getCurrentDateISO,
};
