const AWS = require('aws-sdk');
const rdsDataResponse = require('./rdsDataResponse');

const dataServiceParams = {
  resourceArn: process.env.RDS_ARN,
  secretArn: process.env.SECRET_ARN,
  database: process.env.RDS_DB,
};

const selectedTable = process.env.RDS_TABLE;

function setQueryParams(query, transactionId = null) {
  return queryParams = {
    resourceArn: dataServiceParams.resourceArn,
    secretArn: dataServiceParams.secretArn,
    transactionId: transactionId,
    database: dataServiceParams.database,
    sql: query,
    includeResultMetadata: true
  };
}

async function getUsers() {
  const client = new AWS.RDSDataService({
    region: process.env.REGION
  }); 

  const query = `SELECT * FROM ${selectedTable}`;
  const queryParams = setQueryParams(query);

  const result = await client.executeStatement(queryParams)
    .promise()
    .then((data, err) => {
      if (err) {
        throw err
      } else {
        return data.records;
      }
    });

  //  [
  //    [
  //      {"longValue":2},
  //      {"stringValue":"anggit"},
  //      {"stringValue":"hellopassword"},
  //      {"stringValue":"anggit@isi.co.id"}
  //    ]
  //  ]

  const users = rdsDataResponse.parseUsersData(result);

  return users;
}

async function createUsers(insertParams) {
  const client = new AWS.RDSDataService({
    region: process.env.REGION
  });

  const begin = await client.beginTransaction(dataServiceParams)
    .promise();

  const query = `INSERT INTO ${selectedTable} (username, password, email)
    VALUES ('${insertParams.username}', '${insertParams.password}', '${insertParams.email}')
    RETURNING id
  `;
  const queryParams = setQueryParams(query, begin.transactionId);

  const result = await client.executeStatement(queryParams)
    .promise()
    .then((data, err) => {
      if (err) {
        throw err;
      } else {
        return data.records[0][0].longValue;
      }
    });

  const commitTransaction = await client.commitTransaction({
    resourceArn: dataServiceParams.resourceArn,
    secretArn: dataServiceParams.secretArn,
    transactionId: begin.transactionId
  })
    .promise()
    .then((data, err) => {
      if (err) {
        throw err;
      } else {
        return data;
      }
    });

  return {
    id: result,
    status: commitTransaction.transactionStatus
  };
}

module.exports = {
  getUsers, createUsers
}
