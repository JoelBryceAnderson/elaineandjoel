import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import PageTemplate from "../components/PageTemplate";

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
    <div className="border-b border-gray-200 pr-12 pl-12">
      <button
        className="w-full py-4 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#1B365D] font-medium">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-[#ccac6c] transform transition-transform duration-200 ${
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
      answer: "No children, please. Adults only."
    },
    {
      question: "What time should I arrive?",
      answer: "Doors open at the venue at 6:00 PM. The ceremony will begin promptly at 6:30 PM. We recommend arriving 15-20 minutes prior to the ceremony to allow time for seating. The cocktail hour will begin immediately following the ceremony."
    },
    {
      question: "Will the ceremony and reception be indoors or outdoors?",
      answer: "Both the ceremony and reception will be held indoors at Aurora Restaurant."
    },
    {
      question: "Do you have a wedding registry?",
      answer: "We are not registered. You can find links to donate to our honeymoon fund & local charities on the Registry & Gifts page. Please note that while we appreciate your generosity, gifts are not necessary. Most of you are traveling to celebrate the day with us and the time and effort you are putting into that is more than enough of a gift for us."
    },
    {
      question: "What's for dinner?",
      answer: "The reception dinner will feature family-style Italian fare. Please include any dietary restrictions when submitting your RSVP online!"
    },
    {
      question: "Are there dietary restrictions I should know about?",
      answer: "The menu will include vegetarian options. If you have specific dietary restrictions or allergies, please note them in your RSVP response and we will do our best to accommodate you."
    },
    {
      question: "Will there be dancing?",
      answer: "Yes -- and please include your song requests on the RSVP page!"
    },
    {
      question: "Open bar?",
      answer: "Yes -- drink up!"
    },
    {
      question: "Is it safe to get around at night?",
      answer: "Williamsburg is generally very safe, especially around the venue. If your hotel is within walking distance, you should have no issues walking home after the wedding. If you’re not familiar with the NYC subway, we recommend skipping it late at night—especially after a few drinks. Rideshares and cabs are easy to find and a safer bet for getting back to your place comfortably. We recommend downloading Uber, Lyft, Revel (a NY-specific rideshare which usually has great discounts for first time users!), or Curb (connects you to NYC taxis). "
    }
  ];

  return (
  <div>
    <PageTemplate
      title="FAQs"
      subtitle="For any additional questions not covered here, please reach out to us directly!"
    >          
        <div className="max-w-2xl mx-auto">
          <div className="space-y-1">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </PageTemplate>
    </div>
  );
};

export default FaqsPage;