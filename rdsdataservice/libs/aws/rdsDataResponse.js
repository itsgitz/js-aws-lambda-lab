// parseUsersData for parsing or mapping RDS Data Service Response
// to JSON
// https://stackoverflow.com/a/57296495
function parseUsersData(getUsers) {
  const users = [];

  getUsers.forEach((item) => {
    users.push({
      id: item[0].longValue,
      username: item[1].stringValue,
      password: item[2].stringValue,
      email: item[3].stringValue,
    });
  });

  return users;
}

module.exports = {
  parseUsersData
};
