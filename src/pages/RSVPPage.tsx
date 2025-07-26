import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, PartyPopper, UserPlus, Send } from 'lucide-react';
import { fetchRsvpData, submitRsvp } from '../utils/api';
import { RsvpData, GuestResponse } from '../types/rsvp';

type Step = 'nameEntry' | 'rsvp' | 'details' | 'song' | 'confirmation';

const RSVPPage: React.FC = () => {
  const [step, setStep] = useState<Step>('nameEntry');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [searchName, setSearchName] = useState({ firstName: '', lastName: '' });
  const [rsvpData, setRsvpData] = useState<RsvpData | null>(null);
  const [guestResponses, setGuestResponses] = useState<GuestResponse[]>([]);
  const [songRequest, setSongRequest] = useState('');

  const handleNameSearch = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await fetchRsvpData(searchName.firstName, searchName.lastName);
      setRsvpData(data);
      
      // Initialize responses for the fetched party
      const initialResponses = data.guestGroup.guests.map(guest => ({
        ...guest,
        attending: true, // Default to attending
        dietaryRestrictions: ''
      }));
      setGuestResponses(initialResponses);
      
      setStep('rsvp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGuestResponse = (index: number, field: keyof GuestResponse, value: any) => {
    setGuestResponses(prev => {
      const newResponses = [...prev];
      (newResponses[index] as any)[field] = value;
      return newResponses;
    });
  };

  const addGuest = () => {
    setGuestResponses(prev => [
      ...prev,
      { firstName: '', lastName: '', attending: true, dietaryRestrictions: '' }
    ]);
  };
  
  const removeGuest = (index: number) => {
    setGuestResponses(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    if (!rsvpData) return;
    setIsLoading(true);
    setError(null);
    try {
      const finalResponse = {
        guests: guestResponses,
        songRequest,
        submittedAt: new Date().toISOString(),
      };
      await submitRsvp(rsvpData.partyId, finalResponse);
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit RSVP.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const attendingCount = guestResponses.filter(g => g.attending).length;
  const originalGuestCount = rsvpData?.guestGroup.guests.length ?? 0;
  const additionalGuestCount = guestResponses.length - originalGuestCount;
  const canAddMoreGuests = rsvpData ? additionalGuestCount < rsvpData.guestGroup.additionalGuests : false;


  const renderContent = () => {
    switch (step) {
      case 'nameEntry':
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-serif text-[#1B365D]">Enter your first and last name:</h2>
            <div className="flex flex-col items-center space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={searchName.firstName}
                onChange={(e) => setSearchName({ ...searchName, firstName: e.target.value })}
                className="w-64 px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#ccac6c] focus:outline-none text-center"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={searchName.lastName}
                onChange={(e) => setSearchName({ ...searchName, lastName: e.target.value })}
                className="w-64 px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#ccac6c] focus:outline-none text-center"
              />
              <button
                onClick={handleNameSearch}
                disabled={!searchName.firstName || !searchName.lastName || isLoading}
                className="px-8 py-3 bg-[#ccac6c] text-white rounded-lg hover:bg-[#1B365D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Find My Invitation'}
              </button>
            </div>
          </div>
        );
        
      case 'rsvp':
        if (!rsvpData) return null;
        return (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-serif text-[#1B365D]">Will you be joining us?</h2>
            <div className="space-y-4">
              {guestResponses.map((guest, index) => (
                <div key={index} className="flex items-center justify-between bg-white/50 p-3 rounded-lg">
                  <span className="text-[#1B365D]">{`${guest.firstName} ${guest.lastName}`}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateGuestResponse(index, 'attending', true)} className={`px-3 py-1 rounded ${guest.attending ? 'bg-[#ccac6c] text-white' : 'bg-gray-200'}`}>Yes</button>
                    <button onClick={() => updateGuestResponse(index, 'attending', false)} className={`px-3 py-1 rounded ${!guest.attending ? 'bg-red-400 text-white' : 'bg-gray-200'}`}>No</button>
                  </div>
                </div>
              ))}
            </div>
            {rsvpData.guestGroup.additionalGuests > 0 && (
              <div className="pt-4 border-t border-[#1B365D]/20">
                <p className="text-sm text-gray-600 mb-2">You can add up to {rsvpData.guestGroup.additionalGuests} additional guest(s).</p>
                {canAddMoreGuests && (
                  <button onClick={addGuest} className="flex items-center gap-2 mx-auto px-4 py-2 text-sm bg-transparent border-2 border-[#ccac6c] text-[#1B365D] rounded-lg hover:bg-[#ccac6c] hover:text-white">
                    <UserPlus size={16} /> Add Guest
                  </button>
                )}
              </div>
            )}
            <button onClick={() => attendingCount > 0 ? setStep('details') : handleSubmit()} className="mt-4 px-8 py-3 bg-[#ccac6c] text-white rounded-lg hover:bg-[#1B365D]">
              {attendingCount > 0 ? `Confirm ${attendingCount} Guest(s)` : 'Submit Response'}
            </button>
          </div>
        );

      case 'details':
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-serif text-[#1B365D] text-center">Guest Details</h2>
                {guestResponses.map((guest, index) => {
                    if (!guest.attending) return null;

                    const isAdditionalGuest = index >= originalGuestCount;

                    return (
                        <div key={index} className="p-3 rounded-lg bg-white/50">
                            <p className="font-bold text-[#1B365D] mb-2">{isAdditionalGuest ? `Additional Guest ${index - originalGuestCount + 1}` : `${guest.firstName} ${guest.lastName}`}</p>
                            {isAdditionalGuest && (
                                <div className="flex gap-2 mb-2">
                                    <input type="text" placeholder="First Name" value={guest.firstName} onChange={e => updateGuestResponse(index, 'firstName', e.target.value)} className="w-full px-3 py-1 border-2 border-[#1B365D]/20 rounded-lg" />
                                    <input type="text" placeholder="Last Name" value={guest.lastName} onChange={e => updateGuestResponse(index, 'lastName', e.target.value)} className="w-full px-3 py-1 border-2 border-[#1B365D]/20 rounded-lg" />
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="Any dietary restrictions?"
                                value={guest.dietaryRestrictions || ''}
                                onChange={(e) => updateGuestResponse(index, 'dietaryRestrictions', e.target.value)}
                                className="w-full px-3 py-1 border-2 border-[#1B365D]/20 rounded-lg"
                            />
                             {isAdditionalGuest && (
                                <button onClick={() => removeGuest(index)} className="text-red-500 text-xs mt-1">Remove Guest</button>
                            )}
                        </div>
                    );
                })}
                <div className="text-center">
                    <button onClick={() => setStep('song')} className="px-8 py-3 bg-[#ccac6c] text-white rounded-lg hover:bg-[#1B365D]">Continue</button>
                </div>
            </div>
        );

      case 'song':
          return (
              <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-serif text-[#1B365D]">Song Request</h2>
                  <p className="text-gray-600">What song will get you on the dance floor?</p>
                  <input
                      type="text"
                      placeholder="Song title & artist"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      className="w-full max-w-sm mx-auto px-4 py-2 border-2 border-[#1B365D]/20 rounded-lg focus:border-[#ccac6c] focus:outline-none text-center"
                  />
                  <button onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-2 mx-auto px-8 py-3 bg-[#ccac6c] text-white rounded-lg hover:bg-[#1B365D] disabled:opacity-50">
                      {isLoading ? 'Submitting...' : 'Submit RSVP'} <Send size={16} />
                  </button>
              </div>
          );

      case 'confirmation':
          return (
              <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                      {attendingCount > 0 ? (
                          <PartyPopper className="w-16 h-16 text-[#ccac6c]" />
                      ) : (
                          <Heart className="w-16 h-16 text-[#ccac6c]" />
                      )}
                  </div>
                  <h2 className="text-2xl font-serif text-[#1B365D]">
                      {attendingCount > 0 ? "Thank you for your RSVP!" : "We'll miss you!"}
                  </h2>
                  {attendingCount > 0 && (
                      <p className="text-gray-600">We can't wait to celebrate with you!</p>
                  )}
              </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#082e5d] p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <Link to="/" className="absolute top-6 left-6 text-[#1B365D] bg-white/70 hover:bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out z-20 text-sm font-sans">
          &larr; Return to Home
        </Link>
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        <div className="relative z-10">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-[#1B365D] tracking-wide text-sm">PLEASE</h2>
            <h1 className="text-4xl font-serif tracking-wide text-[#1B365D]">RSVP</h1>
            <p className="text-[#1B365D]">by October 15, 2025</p>
          </div>
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="w-full">
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVPPage;