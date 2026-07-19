import React from "react";

// Shared shell for the static information pages (FAQs, shipping, privacy) so
// each one is just its content, not another 200 lines of the same markup.
const InfoPage = ({ title, intro, sections }) => {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 uppercase">{title}</h1>
        {intro && <p className="text-gray-600 text-center mb-8">{intro}</p>}

        <div className="space-y-8 text-gray-700">
          {sections.map(({ heading, body, bullets }) => (
            <section key={heading}>
              <h2 className="text-2xl font-semibold mb-4">{heading}</h2>
              {body && <p>{body}</p>}
              {bullets && (
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
