import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const configureGoogleAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              isFreelancer: false,
              isVerified: true,
              isOAuthUser: true // Nouveau champ
            });
            await user.save();
          }

          const token = jwt.sign({ userId: user._id }, ENV_VARS.JWT_SECRET, {
            expiresIn: "15d",
          });

          done(null, { user, token });
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};