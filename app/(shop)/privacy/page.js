import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Privacy Policy - SwiftCart",
  description:
    "What personal data SwiftCart collects, why it is collected, how long it is kept and how to have it removed.",
};

const sections = [
  {
    heading: "What we collect",
    bullets: [
      "Account details: your name, email address and password, which is stored only as a hash.",
      "Order details: delivery address, phone number, the items ordered and the last four digits of the card used.",
      "Activity on the site: your cart, wishlist and product reviews.",
      "Sign-in provider details, if you use Google or Facebook to sign in.",
    ],
  },
  {
    heading: "Why we collect it",
    body: "To take payment, deliver your order, show you your order history, send order confirmations, and answer you when you contact us. We do not sell personal data.",
  },
  {
    heading: "Card details",
    body: "Full card numbers are never written to our database. Only the last four digits are kept, so that an order is recognisable in your history.",
  },
  {
    heading: "Email",
    body: "Order confirmations go to the email address on your account. Marketing email is separate and opt-in, and every one of those messages has a one-click unsubscribe link.",
  },
  {
    heading: "How long we keep it",
    body: "Order records are kept while your account exists, and afterwards only for as long as tax and accounting rules require. Everything else is deleted with your account.",
  },
  {
    heading: "Your choices",
    bullets: [
      "Ask for a copy of the data we hold about you.",
      "Correct anything that is wrong from your profile page.",
      "Ask us to delete your account and the data attached to it.",
      "Unsubscribe from marketing email at any time.",
    ],
  },
  {
    heading: "Contact",
    body: "Any privacy request can be sent through the contact page and we will respond within 30 days.",
  },
];

export default function Page() {
  return (
    <InfoPage
      title="Privacy Policy"
      intro="What we collect, why we collect it, and how to get it removed."
      sections={sections}
    />
  );
}
