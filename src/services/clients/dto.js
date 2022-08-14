const multiple = (clients) => {
  return clients.map((client) => {
    client.id = client._id;

    return client;
  });
};

module.exports = { multiple };
