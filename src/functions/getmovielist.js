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

// function getpages(movs, url) {
//   fetch(url, {
//     headers: {
//       Authorization: `Bearer ${AIRTABLEAPIKEY}`,
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data.offset);

//       if (data.offset != null) {
//         console.log("have pagination ", url);

//         movs.push(data.records);

//         getpages(movs, url + "&offset=" + data.offset);
//       } else {
//         return movs;
//       }

//       //movie, series,
//     })
//     .catch((err) => console.log(err));
// }

// `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}?view=Grid%20view&filterByFormula=NOT({Name} = '')`,

//"itr1xtZGx8TGpH3Cy/recUfV5i6UeV7m5c2"

function getStarWarsPlanets(
  progress,
  url = `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}?view=Grid%20view&%5B%7Bfield%3A%20%22added_on%22%2C%20direction%3A%20%22asc%22%7D%5D&filterByFormula=NOT({Name} = '')`,
  planets = []
) {
  console.log("have pagination ", url);
  return new Promise((resolve, reject) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLEAPIKEY}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          console.log("******* " + JSON.stringify(response));
          throw `${response.status}: ${response.statusText}`;
        }
        response
          .json()
          .then((data) => {
            planets = planets.concat(data.records);

            if (data.offset) {
              console.log("have pagination ", url);
              progress && progress(planets);

              var urll = "";
              if (url.length > 186) {
                urll = url.slice(0, 71);
              } else {
                urll = url;
              }

              console.log("urll - ", urll);

              getStarWarsPlanets(
                progress,
                urll + "&offset=" + data.offset,
                planets
              )
                .then(resolve)
                .catch((err) => {
                  console.log(err);
                  reject();
                });
            } else {
              resolve(planets);
            }
          })
          .catch((err) => {
            console.log(err);
            reject();
          });
      })
      .catch((err) => {
        console.log(err);
        reject();
      })
  );
}

function progressCallback(planets) {
  // render progress
  console.log(`${planets.length} loaded`);
}

getStarWarsPlanets(progressCallback)
  .then((planets) => {
    // all planets have been loaded
    console.log(planets.length);
  })
  .catch(console.error);

let respormise = () => {
  return new Promise((resolve, reject) => {
    getStarWarsPlanets(progressCallback)
      .then((planets) => {
        // all planets have been loaded
        console.log(planets.length);
        resolve({
          statusCode: 200,
          headers: headers,
          body: JSON.stringify({ data: planets }),
        });
      })
      .catch((err) => {
        console.log(err);
        reject({
          statusCode: 500,
          body: JSON.stringify(err),
        });
      });

    // var s = getpages(
    //   [],
    //   `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}?view=Grid%20view`
    // );
    // console.log(s);

    // getpages()
    //&filterByFormula=NOT({Name} = '')
    // fetch(
    //   `https://api.airtable.com/v0/${AIRTABLEBASEID}/${AIRTABLETABLENAME}?view=Grid%20view&%5B%7Bfield%3A%20%22added_on%22%2C%20direction%3A%20%22asc%22%7D%5D&offset=itrqgQzBo89x5wIUn/reclKMI6mGPcYUaQ0`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${AIRTABLEAPIKEY}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // )
    //   .then((response) => response.json())
    // .then((data) => {
    //   console.log(data);
    //   //movie, series,
    //   resolve({
    //     statusCode: 200,
    //     headers: headers,

    //     body: JSON.stringify({ data: data.records }),
    //   });
    // })
    // .catch((err) => {
    //   console.log(err);
    //   reject({
    //     statusCode: 500,
    //     body: JSON.stringify(err),
    //   })
    // });
  });
};

exports.handler = async (event, context) => {
  const token = event.headers.authorization;

  // console.log(event.headers);

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

  console.log(token);

  if (token) {
    try {
      const decode = jwt.verify(token, JWTSEACRET);
      const resu = await respormise();
      // console.log(resu);
      return resu;
    } catch (error) {
      return {
        statusCode: 403,
        headers: headers,

        body: JSON.stringify({ err: true, msg: "invalid auth token provided" }),
      };
    }
  } else {
    return {
      statusCode: 403,
      headers: headers,

      body: JSON.stringify({ err: true, msg: "no auth token provided" }),
    };
  }

  //   console.log();

  // console.log(res);
};
