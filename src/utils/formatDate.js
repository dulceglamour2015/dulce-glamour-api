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

module.exports = {
  formattedDate,
};
