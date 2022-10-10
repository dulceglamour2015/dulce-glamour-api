const multiple = (providers) => {
  return providers.map((provider) => {
    provider.id = provider._id;

    return provider;
  });
};

module.exports = { multiple };
