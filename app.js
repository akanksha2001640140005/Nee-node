const express = require("express");
const { session } = require("passport");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("./passportConfig")(passport);
const app = express();

const PORT = 3600;
app.listen(PORT, () => {
  console.log("server is running.");
});
//connect to db

const db = require("./db");
db.connect();
//routing
app.use(express.json({ limit: "50mb" }));
//register user route

app.post(
  "/auth/signup",
  passport.authenticate("local-signup", { session: false }),
  (req, res) => {
    // sign up
    res.json({
      user: req.user,
    });
  }
);
app.post(
  "/auth/login",
  passport.authenticate("local-login", { session: false }),
  (req, res, next) => {
    //jwt
    jwt.sign(
      { email: req.user.email },
      "secretKey",
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.json({
            message: "Failed to login",
            token: null,
          });
        }
        res.json({
          user: req.user,
          token: token,
        });
      }
    );
    // login
  }
);
// jwt protected route

app.get(
  "/user/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);
