const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { prisma } = require('./database');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
    if (user) return done(null, user);

    user = await prisma.user.findUnique({ where: { email: profile.emails?.[0]?.value } });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: profile.id, avatar: profile.photos?.[0]?.value },
      });
      return done(null, user);
    }

    user = await prisma.user.create({
      data: {
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        googleId: profile.id,
        avatar: profile.photos?.[0]?.value,
      },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

module.exports = passport;