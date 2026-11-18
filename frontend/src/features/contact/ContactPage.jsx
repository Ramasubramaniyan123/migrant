import { useState } from 'react'

export const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [state, setState] = useState({ loading: false, sent: false, error: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setState({ loading: true, sent: false, error: '' })
    // No public contact endpoint exists on the backend yet; mailto fallback keeps
    // the form functional without pretending a request succeeded.
    const subject = encodeURIComponent(`[${form.subject || 'General'}] ${form.name} — ${form.email}`)
    const body = encodeURIComponent(form.message)
    window.location.href = `mailto:support@migrantcommunity.app?subject=${subject}&body=${body}`
    setState({ loading: false, sent: true, error: '' })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl font-bold">Contact us</h1>
      <p className="mt-3 text-ink-2">
        Questions, feedback or need help? We'd love to hear from you.
      </p>

      {state.sent ? (
        <div className="card mt-8 p-8 text-center">
          <p className="font-medium text-success">Your email client should now open with your message.</p>
          <p className="mt-2 text-sm text-ink-2">If nothing happened, email us directly at support@migrantcommunity.app</p>
        </div>
      ) : (
        <form onSubmit={submit} className="card mt-8 space-y-4 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ct-name" className="label">Name</label>
              <input id="ct-name" required className="input" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label htmlFor="ct-email" className="label">Email</label>
              <input id="ct-email" type="email" required className="input" value={form.email} onChange={set('email')} />
            </div>
          </div>
          <div>
            <label htmlFor="ct-subject" className="label">Subject</label>
            <input id="ct-subject" className="input" value={form.subject} onChange={set('subject')} />
          </div>
          <div>
            <label htmlFor="ct-message" className="label">Message</label>
            <textarea id="ct-message" required rows={6} className="input resize-y" value={form.message} onChange={set('message')} />
          </div>
          {state.error && <p className="text-sm text-danger" role="alert">{state.error}</p>}
          <button type="submit" className="btn-accent" disabled={state.loading}>
            {state.loading ? 'Opening…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  )
}
