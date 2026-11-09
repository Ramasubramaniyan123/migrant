import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Globe, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Card from '../../components/common/Card';
import profileService from '../../services/profileService';
import { GENDERS, PROFICIENCY_LEVELS } from '../../utils/constants';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bio: '',
    hometownCountry: 'India',
    hometownCity: '',
    currentCity: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await profileService.updateProfile(formData);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-terracotta mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-navy">Tell us about yourself</h2>
              <p className="text-grey mt-2">Let's start with the basics</p>
            </div>

            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              placeholder="Your first name"
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              placeholder="Your last name"
            />

            <Input
              type="date"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              required
            />

            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={GENDERS.map(g => ({ value: g, label: g }))}
              placeholder="Select your gender"
            />

            <Textarea
              label="Bio (Optional)"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us a bit about yourself..."
              rows={3}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-terracotta mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-navy">Where are you from?</h2>
              <p className="text-grey mt-2">Help us connect you with people from your hometown</p>
            </div>

            <Input
              label="Hometown City"
              value={formData.hometownCity}
              onChange={(e) => setFormData({ ...formData, hometownCity: e.target.value })}
              required
              placeholder="e.g., Mumbai, Delhi, Bangalore"
            />

            <Input
              label="Hometown Country"
              value={formData.hometownCountry}
              onChange={(e) => setFormData({ ...formData, hometownCountry: e.target.value })}
              required
              placeholder="e.g., India"
            />

            <Input
              label="Current City"
              value={formData.currentCity}
              onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
              required
              placeholder="e.g., Gurugram"
              helperText="Where do you currently live?"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-terracotta mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-navy">Almost done!</h2>
              <p className="text-grey mt-2">Review your information and complete setup</p>
            </div>

            <Card className="bg-lavender">
              <h3 className="font-semibold text-navy mb-3">Your Profile Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-grey">Name:</span> {formData.firstName} {formData.lastName}</p>
                <p><span className="text-grey">Hometown:</span> {formData.hometownCity}, {formData.hometownCountry}</p>
                <p><span className="text-grey">Current City:</span> {formData.currentCity}</p>
              </div>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-1">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Add languages you speak</li>
                <li>Set your interests</li>
                <li>Discover people from your hometown</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender to-offwhite flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-navy">Step {step} of {totalSteps}</span>
            <span className="text-sm text-grey">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-terracotta h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} icon={ChevronLeft}>
              Back
            </Button>
          )}

          {step < totalSteps ? (
            <Button fullWidth onClick={handleNext} className="ml-auto">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button fullWidth onClick={handleSubmit} loading={loading} className="ml-auto">
              Complete Setup
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default OnboardingPage;
