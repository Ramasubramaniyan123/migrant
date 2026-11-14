import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Onboarding = () => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [language, setLanguage] = useState('')
  const [interests, setInterests] = useState([])
  const [bio, setBio] = useState('')
  const navigate = useNavigate()

  const interestsList = ['Travel', 'Food', 'Music', 'Sports', 'Art', 'Language', 'Photography', 'Cooking', 'Fitness', 'Reading']

  const handleNext = () => {
    setStep(prev => prev + 1)
    if (step === 5) navigate('/app/home')
  }

  const handleInterestToggle = (interest) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <nav className="flex justify-between items-center mb-6 pb-8 border-b border-border">
          <h2 className="font-display text-2xl font-bold">Onboarding - Step {step} of 7</h2>
          <button onClick={() => step > 1 && setStep(prev => prev - 1)} className="mr-2 px-3 py-1 rounded border">Previous</button>
          <button onClick={handleNext} className="btn-primary px-4 py-2 rounded-lg font-medium">
            {step < 7 ? 'Next' : 'Get Started'}
          </button>
        </nav>

        <div className="prose">
          <h3 className="font-display text-xl font-bold mb-4">{['Welcome', 'Current Location', 'Hometown', 'Language', 'Interests', 'Profile Details', 'Privacy'][step - 1]}</h3>
          <p className="font-body text-token-text-secondary mb-6">{[
            'Let\'s get you set up.',
            'Tell us where you are currently living.',
            'Share your hometown to connect with people from your region.',
            'Select your native language so we can bridge cultural connections.',
            'Select your interests to find like-minded people.',
            'Add a profile picture and bio.',
            'Choose what you want to share publicly.'
          ][step - 1]}</p>

          {step === 1 ? null : (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border px-4 py-2 input-field" />
            </div>
          )}

          {step === 2 ? null : (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Current City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-lg border px-4 py-2 input-field" />
            </div>
          )}

          {step === 3 ? null : (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Native Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border px-4 py-2 input-field">
                <option value="">Select language</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="hindi">Hindi</option>
                <option value="mandarin">Mandarin</option>
              </select>
            </div>
          )}

          {step === 4 ? null : (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                {interestsList.map(interest => (
                  <button
                    key={interest}
                    className={`
                      px-3 py-1 rounded border text-xs ${
                        interests.includes(interest) ? 'bg-primary text-primary' : ''
                      } hover:bg-primary hover:text-white transition-colors`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 ? null : (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Bio (optional)</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-lg border px-4 py-2 input-field min-h-[80px] resize-y" rows={3} />
            </div>
          )}

          {step >= 7 && step <= 8 ? (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <input type="checkbox" checked className="rounded cursor-pointer" />
                <label className="ml-2 text-sm font-medium">Make profile public</label>
              </div>
              <div>
                <input type="checkbox" checked className="rounded cursor-pointer" />
                <label className="ml-2 text-sm font-medium">Receive notifications</label>
              </div>
            </div>
          ) : null}

          <div className="flex justify-between mt-8 pt-8 border-t border-border">
            <button onClick={() => step > 1 && setStep(prev => prev - 1)} className="px-3 py-1 rounded border hover:bg-gray-100">Previous</button>
            <button onClick={handleNext} className="btn-primary px-4 py-2 rounded-lg font-medium">
              {step < 7 ? 'Next' : 'Get Started'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}