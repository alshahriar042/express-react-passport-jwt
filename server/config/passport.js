require("dotenv").config();
const User = require("../models/user.model");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
  const passport = require("passport");

  const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =process.env.SECRET_KEY;
console.log("Secret Key:", process.env.SECRET_KEY);

// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ _id: jwt_payload.id }); 
        if (user) {
          return done(null, user);
        } else {
          return done(null, false); // user not found
          // or you could create a new account here if desired
        }
      } catch (err) {
        return done(err, false); // handle errors
      }
    })
  );
  
