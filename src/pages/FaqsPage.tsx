import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#1B365D] font-medium">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-[#C5A572] transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 mb-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 pt-2 pb-4">{answer}</p>
      </div>
    </div>
  );
};

const FaqsPage: React.FC = () => {
  const faqs: FAQ[] = [
    {
      question: "What is the dress code?",
      answer: "The dress code is cocktail attire. For men, this means a suit or sports coat with dress pants. For women, this means a cocktail dress or an elegant pantsuit. The venue is indoors and temperature-controlled, but you may want to bring a light layer for comfort."
    },
    {
      question: "Can I bring a plus one?",
      answer: "Due to venue capacity limitations, we can only accommodate the guests named on your invitation. Your RSVP will indicate whether you have been invited with a guest."
    },
    {
      question: "Will there be parking available?",
      answer: "While there is some street parking available in the area, we recommend using ride-sharing services or public transportation. The venue is a 10-minute walk from the Bedford Ave L train station. If you're driving, there are several parking garages within a few blocks."
    },
    {
      question: "Are children welcome?",
      answer: "Maybe!"
    },
    {
      question: "What time should I arrive?",
      answer: "The ceremony will begin promptly at 6:00 PM. We recommend arriving 15-20 minutes early to allow time for seating. The cocktail hour will begin immediately following the ceremony at 6:45 PM."
    },
    {
      question: "Will the ceremony and reception be indoors or outdoors?",
      answer: "Both the ceremony and reception will be held indoors at Aurora Restaurant. The entire event will be temperature-controlled for your comfort."
    },
    {
      question: "Do you have a wedding registry?",
      answer: "We are not registered. You can find links to donate to our honeymoon fund & local charities on the Registry & Gifts page. Please note that while we appreciate your generosity, gifts are not necessary."
    },
    {
      question: "Are there dietary restrictions I should know about?",
      answer: "The menu will include vegetarian options. If you have specific dietary restrictions or allergies, please note them in your RSVP response and we will do our best to accommodate you."
    },
    {
      question: "Will there be dancing?",
      answer: "Maybe!"
    }
  ];

  return (
    <div className="min-h-screen bg-[#112543] p-8">
      <div className="max-w-2xl mx-auto px-8 py-24 relative">
        <div className="absolute inset-0 bg-white/95 rounded-xl shadow-lg" />
        
        <div className="relative z-10">
          {/* Header section */}
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-[#1B365D] tracking-wide text-sm">WEDDING DETAILS</h2>
            <h1 className="text-4xl font-serif tracking-wide text-[#1B365D]">
              Frequently Asked Questions
            </h1>
            <p className="text-[#1B365D] mt-6">
              These answers are currently not true. Do not trust them.
            </p>
          </div>

          {/* FAQs section */}
          <div className="max-w-xl mx-auto">
            <div className="space-y-1">
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqsPage;