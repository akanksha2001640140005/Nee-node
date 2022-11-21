const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const User = require("./userModel");

module.exports = (passport) => {
  //user registration
  passport.use(
    "local-signup",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          //check if user exists
          const userExists = await User.findOne({ email: email });
          if (userExists) {
            return done('null', false);
          }
          //creae a new user with data
          const user = await User.create({ email, password });
          return done(null, user);
        } catch (error) {
            console.log('this error')
          done(error, false);
        }
      }
    )
  );
  //user login

  passport.use(
    "local-login",
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          //check if user exits
          const user = await User.findOne({ email: email });
          if (!user) return done(null, false);
          // console.log(user.password)
          const isMatch = await user.matchPassword(password);
          if (!isMatch) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    ),
    passport.use(new jwtStrategy({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: 'secretKey',
    },
    async (jwtPayload, done) => {
      try{
        //Extract user
        const user = jwtPayload.user
        done(null,user.email)
      } catch(error) {
        done(error, false)
      }
    }
    ))
  );
};
