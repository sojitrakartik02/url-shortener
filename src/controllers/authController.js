import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import passport from "passport";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const googleAuth = passport.authenticate("google", { session: false });

export const googleCallback = (req, res) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    const token = generateToken(user);
    console.log("token", token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });

    res.redirect(`${process.env.CLIENT_URL}`);
  })(req, res);
};
