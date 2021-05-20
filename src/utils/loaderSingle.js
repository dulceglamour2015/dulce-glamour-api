const DataLoader = require('dataloader');

class Single {
  constructor() {
    this.loaders = {};
  }

  async load(model, id) {
    const loader = this.findLoader(model);
    return await loader.load(id);
  }

  loadMany(model, ids) {
    const loader = this.findLoader(model);
    return loader.loadMany(ids);
  }
  findLoader(model) {
    if (!this.loaders[model]) {
      this.loaders[model] = new DataLoader(
        async (ids) => {
          const rows = await model.find({ _id: { $in: ids } });

          const lookup = rows.reduce((acc, row) => {
            acc[row._id] = row;
            return acc;
          }, {});

          const idsmap = ids.map((id) => lookup[id] || null);
          return idsmap;
        },
        {
          cacheKeyFn: (key) => key.toString()
        }
      );
    }
    return this.loaders[model];
  }
}

module.exports = Single;
