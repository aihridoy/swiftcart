import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your SwiftCart account password.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ForgotPasswordForm />;
}
