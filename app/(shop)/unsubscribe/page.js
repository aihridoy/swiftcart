import UnsubscribeForm from "./UnsubscribeForm";

export const metadata = {
  title: "Unsubscribe",
  description: "Unsubscribe from the SwiftCart newsletter.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <UnsubscribeForm />;
}
