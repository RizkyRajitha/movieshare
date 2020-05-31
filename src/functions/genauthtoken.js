const jwt = require("jsonwebtoken");

const JWTSEACRET =
  process.env.JWTSEACRET || require("../../config/env").JWTSEACRET;

exports.handler = async (event, context) => {
  //   const token = event.headers.Authorization;

  return {
    statusCode: 500,
    body: JSON.stringify({ token: "err" }),
  };

  //   console.log();

  // console.log(res);
};
