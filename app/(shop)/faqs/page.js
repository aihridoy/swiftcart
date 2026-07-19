import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "FAQs - SwiftCart",
  description:
    "Answers to the questions we get most often about ordering, delivery, returns and accounts at SwiftCart.",
};

const sections = [
  {
    heading: "How do I place an order?",
    body: "Add the items you want to your cart, open the cart and choose Proceed to Checkout. You will need to be signed in so we can attach the order to your account and email you a confirmation.",
  },
  {
    heading: "Which payment methods do you accept?",
    body: "Checkout accepts Visa, Mastercard and American Express. Your card details are used for the order only and we store nothing beyond the last four digits, so you can recognise the card on your order history.",
  },
  {
    heading: "Can I change or cancel an order?",
    body: "Get in touch as soon as possible through the contact page. Orders that have not yet been dispatched can be changed or cancelled; once a parcel is on its way it has to be handled as a return.",
  },
  {
    heading: "How do I track my order?",
    body: "Open Track Order in the footer, or go to your account. Every order shows its current status, the items in it and the address it is going to.",
  },
  {
    heading: "Do I need an account to buy something?",
    body: "Yes. An account is what lets us keep your cart, your wishlist and your order history in one place, and it is how we send your confirmation email.",
  },
  {
    heading: "Something on the site is not working",
    body: "Tell us on the contact page and include the page you were on and what you were trying to do. That is usually enough for us to reproduce it.",
  },
];

export default function Page() {
  return (
    <InfoPage
      title="Frequently Asked Questions"
      intro="The short answers. If yours is not here, the contact page reaches a person."
      sections={sections}
    />
  );
}
