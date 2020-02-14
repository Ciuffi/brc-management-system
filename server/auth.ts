import passport from "passport";
import { Strategy } from "passport-local";
import dotenv from "dotenv";
import { ensureLoggedIn, ensureLoggedOut } from "connect-ensure-login";

// Grab secrets from the environment
dotenv.config();
const token = process.env.brcToken;
const password = process.env.password;

export default () => {
  // Setup authentication handler
  passport.use(
    new Strategy(
      {
        usernameField: "user",
        passwordField: "pass",
        session: true
      },
      (user, pass, done) => {
        if (pass === password) {
          done(null, { auth: token });
        } else {
          done(null, false);
        }
      }
    )
  );

  passport.serializeUser(({ auth }, done) => done(null, auth));

  passport.deserializeUser((auth, done) => {
    if (auth === token) {
      done(null, token);
    } else {
      done(null, false);
    }
  });

  // Setup auth gates
  const loggedIn = ensureLoggedIn("/login");

  const loggedOut = ensureLoggedOut("/");

  return { passport, loggedIn, loggedOut };
};
