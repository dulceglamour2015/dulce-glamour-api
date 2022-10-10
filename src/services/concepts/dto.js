const multiple = (concepts) => {
  return concepts.map((concept) => {
    concept.id = concept._id;

    return concept;
  });
};

module.exports = { multiple };
