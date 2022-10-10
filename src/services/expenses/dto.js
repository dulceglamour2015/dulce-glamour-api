const multiple = (expenses) => {
  return expenses.map((expense) => {
    expense.id = expense._id;

    return expense;
  });
};

module.exports = { multiple };
