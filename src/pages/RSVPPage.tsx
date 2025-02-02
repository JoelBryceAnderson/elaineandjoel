import React, { useState } from 'react';
import { Heart, PartyPopper } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

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

  const isValidGuestNames = (names: string[]): boolean => {
    return names.every(name => name.trim().length > 0);
  };

  const questions: Question[] = [
    {
      id: 'attending',
      component: (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-serif text-[#1B365D]">Will you join us?</h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                updateFormData('attending', true);
                setCurrentStep(1);
              }}
              className={`px-8 py-3 rounded-lg transition-colors ${
                formData.attending === true
                  ? 'bg-[#C5A572] text-white'
                  : 'bg-white border-2 border-[#C5A572] text-[#1B365D] hover:bg-[#C5A572] hover:text-white'
              }`}
              type="button"
              aria-label="Accept invitation"
            >
              Joyfully Accept
            </button>
            <button
              onClick={() => {
                updateFormData('attending', false);
                setCurrentStep(5);
              }}
              className={`px-8 py-3 rounded-lg transition-colors ${
                formData.attending === false
                  ? 'bg-[#C5A572] text-white'
                  : 'bg-white border-2 border-[#C5A572] text-[#1B365D] hover:bg-[#C5A572] hover:text-white'
              }`}
              type="button"
              aria-label="Decline invitation"
            >
              Regretfully Decline
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'guestCount',
      component: (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-serif text-[#1B365D]">How many guests?</h2>
          <div className="flex justify-center space-x-4">
            {[1, 2].map((count) => (
              <button
                key={count}
                onClick={() => {
                  updateFormData('guestCount', count);
                  setFormData(prev => ({
                    ...prev,
                    guestNames: Array(count).fill(''),
                    dietaryRestrictions: Array(count).fill('')
                  }));
                  setCurrentStep(2);
                }}
                className={`px-8 py-3 rounded-lg transition-colors ${
                  formData.guestCount === count
                    ? 'bg-[#C5A572] text-white'
                    : 'bg-white border-2 border-[#C5A572] text-[#1B365D] hover:bg-[#C5A572] hover:text-white'
                }`}
                type="button"
                aria-label={`Select ${count} ${count === 1 ? 'guest' : 'guests'}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'names',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#1B365D] text-center">Guest Names</h2>
          {Array.from({ length: formData.guestCount }).map((_, index) => (
            <div key={index} className="flex justify-center">
              <input
                type="text"
                placeholder={`Guest ${index + 1} Name`}
                value={formData.guestNames[index] || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateFormData('guestNames', e.target.value, index)
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && isValidGuestNames(formData.guestNames)) {
                    setCurrentStep(3);
                  }
                }}
                className="w-64 px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#C5A572] focus:outline-none"
                aria-label={`Guest ${index + 1} Name`}
                required
              />
            </div>
          ))}
          {isValidGuestNames(formData.guestNames) && (
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3 bg-[#C5A572] text-white rounded-lg hover:bg-[#1B365D] transition-colors"
                type="button"
                aria-label="Continue to dietary restrictions"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'dietary',
      component: (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-[#1B365D] text-center">Dietary Restrictions</h2>
          {formData.guestNames.map((name, index) => (
            <div key={index} className="flex justify-center">
              <div className="w-64 space-y-2">
                <label 
                  className="text-sm text-[#1B365D]"
                  htmlFor={`dietary-${index}`}
                >
                  {name}
                </label>
                <input
                  id={`dietary-${index}`}
                  type="text"
                  placeholder="Any dietary restrictions?"
                  value={formData.dietaryRestrictions[index] || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    updateFormData('dietaryRestrictions', e.target.value, index)
                  }
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      setCurrentStep(4);
                    }
                  }}
                  className="w-full px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#C5A572] focus:outline-none"
                  aria-label={`Dietary restrictions for ${name}`}
                />
              </div>
            </div>
          ))}
          <div className="flex justify-center">
            <button
              onClick={() => setCurrentStep(4)}
              className="px-8 py-3 bg-[#C5A572] text-white rounded-lg hover:bg-[#1B365D] transition-colors"
              type="button"
              aria-label="Continue to song request"
            >
              Next
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
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  setCurrentStep(5);
                }
              }}
              className="w-64 px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#C5A572] focus:outline-none"
              aria-label="Song request"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setCurrentStep(5)}
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
            <p className="text-gray-600">
              We can't wait to celebrate with you!
            </p>
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