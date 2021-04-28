async function loaderFactory(loader, model, parent) {
  const idFactory = await loader.mongooseLoader(model).dataloader('_id');
  return await idFactory.load(parent);
}

module.exports = {
  loaderFactory
};
