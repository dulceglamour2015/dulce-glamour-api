const multiple = (docs) => {
  return docs.map((doc) => {
    doc.id = doc._id;

    return doc;
  });
};

const single = (doc) => {
  doc.id = doc._id;

  return doc;
};

module.exports = { multiple, single };
