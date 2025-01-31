  import jwt from "jsonwebtoken";
  import { OAuth2Client } from "google-auth-library";
  import passport from "passport";

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  };

  export const googleAuth = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  });

  export const googleCallback = (req, res) => {
    console.log("googleCallback");
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err || !user) {
        console.log("Authentication error:", err);
        return res.redirect(`/error?message=${encodeURIComponent(err.message)}`);
      }
      const token = generateToken(user);
      console.log("token", token);
      res.cookie("token", token, {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: "localhost",
      });
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    })(req, res);
  };
