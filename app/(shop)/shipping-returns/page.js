import InfoPage from "@/components/InfoPage";

export const metadata = {
  title: "Shipping & Returns - SwiftCart",
  description:
    "How long SwiftCart takes to deliver, what delivery costs, and how to return something that is not right.",
};

const sections = [
  {
    heading: "Processing time",
    body: "Orders are picked and packed within one to two working days. You get a confirmation email when the order is placed and another when it leaves us.",
  },
  {
    heading: "Delivery",
    bullets: [
      "Standard delivery: 3-5 working days.",
      "Express delivery: 1-2 working days.",
      "Large furniture is delivered by a two-person team and is booked in with you by phone.",
      "Delivery is free on orders over $100; below that a flat rate is shown at checkout before you pay.",
    ],
  },
  {
    heading: "Returns",
    body: "Anything you are not happy with can be returned within 30 days of delivery, as long as it is unused and in its original packaging. Start a return from your order in Track Order, or through the contact page.",
  },
  {
    heading: "Refunds",
    body: "Once your return reaches us and passes a quick check, the refund goes back to the original payment method within five working days. Outbound delivery charges are refunded too if the item arrived damaged or was not what you ordered.",
  },
  {
    heading: "Damaged or incorrect items",
    body: "Send us a photo through the contact page within 48 hours of delivery and we will arrange a replacement or a full refund, including return postage.",
  },
  {
    heading: "What cannot be returned",
    bullets: [
      "Made-to-order and personalised pieces.",
      "Items marked final sale at the time of purchase.",
      "Anything that has been used, assembled or altered.",
    ],
  },
];

export default function Page() {
  return (
    <InfoPage
      title="Shipping & Returns"
      intro="What to expect after you order, and what to do if something is not right."
      sections={sections}
    />
  );
}
