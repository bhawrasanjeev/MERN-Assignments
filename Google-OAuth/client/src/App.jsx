import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const hasAuthError = new URLSearchParams(window.location.search).has('error')

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((response) => {
        if (!response.ok) throw new Error('Not authenticated')
        return response.json()
      })
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function handleLogout() {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  if (loading) {
    return <main className="state-screen"><span className="spinner" aria-label="Loading" /></main>
  }

  if (!user) {
    return (
      <main className="auth-layout">
        <section className="intro-panel">
          <p className="eyebrow">Northstar workspace</p>
          <h1>One calm place for your next move.</h1>
          <p className="intro-copy">Sign in to reach your personal dashboard and keep your work close, wherever you are.</p>
          <div className="signal-list" aria-label="Workspace benefits">
            <span><b>01</b> Private by default</span>
            <span><b>02</b> Ready in one click</span>
          </div>
        </section>
        <section className="login-panel">
          <div className="brand-mark" aria-hidden="true">N</div>
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to Northstar</h2>
          <p className="muted">Use your Google account to continue securely.</p>
          {hasAuthError && <p className="error-message" role="alert">Google sign-in was not completed. Please try again.</p>}
          <a className="google-button" href="/auth/google">
            <span className="google-g" aria-hidden="true">G</span>
            Continue with Google
            <span aria-hidden="true">&rarr;</span>
          </a>
          <p className="fine-print">Your account details are stored securely and never shared.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <a className="wordmark" href="/">NORTHSTAR</a>
        <button className="logout-button" type="button" onClick={handleLogout}>Log out</button>
      </header>
      <section className="dashboard-content">
        <p className="eyebrow">Personal dashboard</p>
        <div className="welcome-row">
          <div>
            <h1>Good to see you, {user.name?.split(' ')[0] || 'there'}.</h1>
            <p className="muted">Your workspace is ready when you are.</p>
          </div>
          {user.profilePicture && <img className="avatar" src={user.profilePicture} alt={`${user.name}'s profile`} />}
        </div>
        <div className="dashboard-grid">
          <article className="welcome-card">
            <span className="card-kicker">AUTHENTICATED</span>
            <h2>Logged in with Google</h2>
            <p>You are signed in and your session will stay active when you refresh this page.</p>
          </article>
          <article className="profile-card">
            <span className="card-kicker">ACCOUNT DETAILS</span>
            <dl>
              <div><dt>Name</dt><dd>{user.name}</dd></div>
              <div><dt>Email</dt><dd>{user.email}</dd></div>
            </dl>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
