"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Most orders arrive within 3-7 business days. Orders over $200 ship free; you'll get a confirmation email with tracking details as soon as your order leaves the warehouse.",
  },
  {
    question: "What's your return policy?",
    answer:
      "You can return most items within 30 days of delivery for a full refund, as long as they're unused and in original packaging.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards. Payment is processed securely at checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive an email update. You can also check order status any time from your account's Order History page.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Contact us as soon as possible after placing your order. We can usually make changes or cancel if the order hasn't shipped yet.",
  },
];

export default function FAQHome() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="container pb-16">
      <h2 className="text-2xl font-medium text-gray-800 uppercase mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto divide-y divide-gray-200 border-t border-b border-gray-200">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && (
                <p className="text-gray-600 text-sm pb-4 pr-8">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
