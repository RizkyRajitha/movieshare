const jwt = require("jsonwebtoken");

const JWTSEACRET =
  process.env.JWTSEACRET || require("../../config/env").JWTSEACRET;

exports.handler = async (event, context) => {
  //   const token = event.headers.Authorization;

  return {
    statusCode: 200,
    body: JSON.stringify({ token: jwt.sign({ name: "rizky" }, JWTSEACRET) }),
  };

  //   console.log();

  // console.log(res);
};
