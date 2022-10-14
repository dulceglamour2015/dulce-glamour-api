const multiple = (boxes) => {
  return boxes.map((box) => {
    box.id = box._id;

    return box;
  });
};

const single = (box) => {
  box.id = box._id;

  return box;
};

module.exports = { multiple, single };
