const express = require("express");
const cors = require("cors");
const { expressjwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotenv = require("dotenv");
const axios = require("axios").default;

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// const checkJwt = expressjwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
//   }),
//   audience: process.env.AUTH0_AUDIENCE,
//   issuer: `https://${process.env.AUTH0_DOMAIN}/`,
//   algorithms: ["RS256"],
// }).unless({
//   path: ["/public"],
// });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(checkJwt);

async function generateAuth0AccessToken() {
  // Generate an access token with the client credentials
  // This access token will be used to call the Auth0 management API

  const { data } = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: process.env.AUTH0_API_MANAGEMENT_AUDIENCE,
      grant_type: "client_credentials",
    }
  );

  return data.access_token;
}

app.use("/public", (req, res) => {
  res.send("Hello World! This is the backend public route.");
});

app.use("/private", async (req, res) => {
  try {
    const { use_mfa } = req.body;
    const userToken = req.headers.authorization.split(" ")[1];
    const auth0AccessToken = await generateAuth0AccessToken();

    const userInfos = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const userId = userInfos.data.sub; // auth0 user id

    const user = await axios.patch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        user_metadata: {
          use_mfa,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${auth0AccessToken}`,
        },
      }
    );

    console.log(user.data);

    res.send({
      message: "Update user_metadata successfully",
      data: user.data,
    });
  } catch (error) {
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
