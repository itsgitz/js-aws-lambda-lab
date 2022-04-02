exports.handler = async (event, context) => {
  const rdsDataServices = require('./libs/aws/rdsDataService');

  let response;

  if (event.httpMethod === 'GET') {
    const getUsers = await rdsDataServices.getUsers();
    const data = getUsers; 
    response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } else {
    const insertParams = JSON.parse(event.body);
    const createUsers = await rdsDataServices.createUsers(insertParams);

    response = {
      statusCode: 200,
      body: JSON.stringify(createUsers)
    };
  }

  return response;
};

