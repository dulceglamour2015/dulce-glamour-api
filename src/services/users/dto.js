function multiple(users) {
  return users.map((user) => {
    user.id = user._id;

    return user;
  });
}

module.exports = { multiple };
