


import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { connectToDatabase, User } from './db.js'

const app = express()
const port = process.env.PORT || 5000
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({ origin: clientUrl, credentials: true }))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'replace-this-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value
    if (!email) return done(new Error('Google did not provide an email address'))

    const user = await User.findOneAndUpdate(
      { googleId: profile.id },
      {
        googleId: profile.id,
        name: profile.displayName,
        email,
        profilePicture: profile.photos?.[0]?.value || '',
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    )
    return done(null, user)
  } catch (error) {
    return done(error)
  }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await User.findById(id))
  } catch (error) {
    done(error)
  }
})

app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: `${clientUrl}/?error=authentication_failed`,
}), (_req, res) => res.redirect(clientUrl))

app.get('/api/me', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ user: null })
  res.json({ user: req.user })
})

app.post('/auth/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error)
    req.session.destroy((sessionError) => {
      if (sessionError) return next(sessionError)
      res.clearCookie('connect.sid')
      res.json({ message: 'Logged out successfully' })
    })
  })
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Authentication failed. Please try again.' })
})

connectToDatabase()
  .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch((error) => {
    console.error('Unable to start server:', error.message)
    process.exit(1)
  })