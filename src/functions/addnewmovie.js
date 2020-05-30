import fetch from "node-fetch";
const jwt = require("jsonwebtoken");

const JWTSEACRET =
  process.env.JWTSEACRET || require("../../config/env").JWTSEACRET;

const AIRTABLEAPIKEY =
  process.env.AIRTABLEAPIKEY || require("../../config/env").AIRTABLEAPIKEY;
const AIRTABLEBASEID =
  process.env.AIRTABLEBASEID || require("../../config/env").AIRTABLEBASEID;
const AIRTABLETABLENAME =
  process.env.AIRTABLETABLENAME ||
  require("../../config/env").AIRTABLETABLENAME;

// const API = "https://api.airtable.com/v0/appWi36ZXVnHiBqwY/moviedb?maxRecords=3&view=Grid%20view";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
};

let respormise = (data) => {
  return new Promise((resolve, reject) => {
    var payload = {
      records: [
        {
          fields: JSON.parse(data),
        },
      ],
      typecast: true,
    };

    console.log(payload);

    fetch(
      `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}`,

      {
        method: "post",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${AIRTABLEAPIKEY}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //movie, series,
        resolve({
          statusCode: 200,
          headers: headers,

          body: JSON.stringify({ data: data.records }),
        });
      })
      .catch((err) => {
        console.log(err);
        reject({
          statusCode: 500,
          body: JSON.stringify(err),
        });
      });
  });
};

exports.handler = async (event, context) => {
  const token = event.headers.authorization;

  //   console.log(event.headers);

  if (event.httpMethod === "OPTIONS") {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept ,Authorization ",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      },
      body: JSON.stringify({ message: "You can use CORS" }),
    };

    return response;
  }

  if (event.httpMethod === "POST") {
    console.log(event.body);

    if (token) {
      try {
        const decode = jwt.verify(token, JWTSEACRET);
        const resu = await respormise(event.body);
        console.log(resu);
        return resu;
      } catch (error) {
        return {
          statusCode: 403,
          headers: headers,

          body: JSON.stringify({
            err: true,
            msg: "invalid auth token provided",
          }),
        };
      }
    } else {
      return {
        statusCode: 403,
        headers: headers,

        body: JSON.stringify({ err: true, msg: "no auth token provided" }),
      };
    }
  }

  return {
    statusCode: 404,
    headers: headers,

    body: JSON.stringify({ err: true, msg: "Required POST Request" }),
  };

  //   console.log();

  // console.log(res);
};
