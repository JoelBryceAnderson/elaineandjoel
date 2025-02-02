import React, { useState, useEffect } from 'react';
import { Heart, PartyPopper } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRsvpData, submitRsvp } from '../utils/api';
import { RsvpData } from '../server/api/types';

interface FormData {
  attending: boolean | null;
  guestCount: number;
  guestNames: string[];
  dietaryRestrictions: string[];
  songRequest: string;
}

type UpdateFormDataFunction = {
  <K extends keyof FormData>(
    key: K,
    value: FormData[K],
    index?: never
  ): void;
  <K extends keyof FormData>(
    key: K,
    value: FormData[K] extends Array<infer U> ? U : never,
    index: number
  ): void;
};

interface Question {
  id: string;
  component: React.ReactNode;
}

const initialFormData: FormData = {
  attending: null,
  guestCount: 1,
  guestNames: [''],
  dietaryRestrictions: [''],
  songRequest: ''
};

const RSVPPage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [rsvpData, setRsvpData] = useState<RsvpData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRsvpData = async () => {
      if (!inviteCode) {
        setError('No invite code provided');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchRsvpData(inviteCode);
        setRsvpData(data);
        if (data.response) {
          setFormData(data.response);
          setCurrentStep(5); // Go to confirmation if already responded
        }
      } catch (err) {
        setError('Invalid invite code');
      } finally {
        setIsLoading(false);
      }
    };

    loadRsvpData();
  }, [inviteCode]);

  const updateFormData: UpdateFormDataFunction = (key, value, index?) => {
    setFormData(prev => {
      if (typeof index === 'number' && Array.isArray(prev[key])) {
        const newArray = [...(prev[key] as any[])];
        newArray[index] = value;
        return { ...prev, [key]: newArray };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleSubmit = async () => {
    if (!inviteCode || !rsvpData || formData.attending === null) return;

    try {
      await submitRsvp(inviteCode, {
        ...formData,
        attending: formData.attending, // This ensures TypeScript knows it's boolean
        submittedAt: new Date().toISOString(),
      });
      setCurrentStep(5);
    } catch (err) {
      setError('Failed to submit RSVP. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#112543] p-8 flex items-center justify-center">
        <div className="bg-white/95 rounded-xl p-8">
          <p className="text-[#1B365D]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !rsvpData) {
    return (
      <div className="min-h-screen bg-[#112543] p-8 flex items-center justify-center">
        <div className="bg-white/95 rounded-xl p-8">
          <p className="text-[#1B365D]">{error || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  const questions: Question[] = [
    {
      id: 'attending',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#1B365D] text-center">Will you be joining us?</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                updateFormData('attending', true);
                setCurrentStep(1);
              }}
              className="px-8 py-3 bg-[#C5A572] text-white rounded-lg hover:bg-[#1B365D] transition-colors"
              type="button"
              aria-label="Yes, I'll be there"
            >
              Yes!
            </button>
            <button
              onClick={() => {
                updateFormData('attending', false);
                handleSubmit();
              }}
              className="px-8 py-3 border-2 border-[#C5A572] text-[#1B365D] rounded-lg hover:bg-[#1B365D] hover:text-white transition-colors"
              type="button"
              aria-label="No, I can't make it"
            >
              Sorry, no
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'guestCount',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#1B365D] text-center">How many guests (including you)?</h2>
          <p className="text-center text-gray-600">Your invitation allows up to {rsvpData.guestGroup.maxGuests} guests</p>
          <div className="flex justify-center">
            <select
              value={formData.guestCount}
              onChange={(e) => {
                const count = parseInt(e.target.value);
                updateFormData('guestCount', count);
                setFormData(prev => ({
                  ...prev,
                  guestNames: Array(count).fill(''),
                  dietaryRestrictions: Array(count).fill('')
                }));
                setCurrentStep(2);
              }}
              className="w-24 px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#C5A572] focus:outline-none"
              aria-label="Number of guests"
            >
              {Array.from({length: rsvpData.guestGroup.maxGuests}, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      )
    },
    {
      id: 'names',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#1B365D] text-center">Guest Names</h2>
          <div className="flex flex-col items-center gap-4">
            {Array(formData.guestCount).fill(null).map((_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Guest ${index + 1} name`}
                value={formData.guestNames[index] || ''}
                onChange={(e) => updateFormData('guestNames', e.target.value, index)}
                className="w-64 px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#C5A572] focus:outline-none"
                aria-label={`Guest ${index + 1} name`}
              />
            ))}
            <button
              onClick={() => {
                if (formData.guestNames.every(name => name.trim())) {
                  setCurrentStep(3);
                }
              }}
              className="px-8 py-3 bg-[#C5A572] text-white rounded-lg hover:bg-[#1B365D] transition-colors"
              type="button"
              aria-label="Continue to dietary restrictions"
            >
              Continue
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'dietary',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#1B365D] text-center">Dietary Restrictions</h2>
          <div className="flex flex-col items-center gap-4">
            {formData.guestNames.map((name, index) => (
              <div key={index} className="w-full max-w-md">
                <p className="text-[#1B365D] mb-2">{name}</p>
                <input
                  type="text"
                  placeholder="Any dietary restrictions?"
                  value={formData.dietaryRestrictions[index] || ''}
                  onChange={(e) => updateFormData('dietaryRestrictions', e.target.value, index)}
                  className="w-full px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#C5A572] focus:outline-none"
                  aria-label={`Dietary restrictions for ${name}`}
                />
              </div>
            ))}
            <button
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3 bg-[#C5A572] text-white rounded-lg hover:bg-[#1B365D] transition-colors"
              type="button"
              aria-label="Continue to song request"
            >
              Continue
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'song',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#1B365D] text-center">Song Request</h2>
          <p className="text-center text-gray-600">What song will get you on the dance floor?</p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Song request"
              value={formData.songRequest}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                updateFormData('songRequest', e.target.value)
              }
              className="w-64 px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#C5A572] focus:outline-none"
              aria-label="Song request"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#C5A572] text-white rounded-lg hover:bg-[#1B365D] transition-colors"
              type="button"
              aria-label="Submit RSVP"
            >
              Submit RSVP
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'confirmation',
      component: (
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            {formData.attending === true ? (
              <PartyPopper className="w-16 h-16 text-[#C5A572]" aria-hidden="true" />
            ) : (
              <Heart className="w-16 h-16 text-[#C5A572]" aria-hidden="true" />
            )}
          </div>
          <h2 className="text-2xl font-serif text-[#1B365D]">
            {formData.attending === true
              ? "Thank you for your RSVP!"
              : "We'll miss you!"}
          </h2>
          {formData.attending === true && (
            <>
              <p className="text-gray-600">
                We can't wait to celebrate with you!
              </p>
              <div className="mt-8">
                <h3 className="text-xl font-serif text-[#1B365D] mb-4">Your Events</h3>
                <div className="space-y-2">
                  {rsvpData.guestGroup.allowedEvents.map((event, index) => (
                    <p key={index} className="text-gray-600">{event}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#112543] p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-[#1B365D] tracking-wide text-sm">PLEASE</h2>
            <h1 className="text-4xl font-serif tracking-wide text-[#1B365D]">
              RSVP
            </h1>
            <p className="text-[#1B365D]">by October 1, 2025</p>
            {rsvpData.guestGroup.primaryContact && (
              <p className="text-[#1B365D]">Welcome, {rsvpData.guestGroup.primaryContact}!</p>
            )}
          </div>

          {/* Form Section */}
          <div className="min-h-[300px] flex items-center justify-center">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`absolute w-full transition-all duration-500 ${
                  index === currentStep
                    ? 'opacity-100 translate-y-0'
                    : index < currentStep
                    ? 'opacity-0 -translate-y-8'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  pointerEvents: index === currentStep ? 'auto' : 'none'
                }}
                role="group"
                aria-label={`Question ${index + 1}: ${question.id}`}
                aria-hidden={index !== currentStep}
              >
                {question.component}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPPage;