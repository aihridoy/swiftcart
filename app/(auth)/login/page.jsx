import LoginForm from "./LoginForm";

export const metadata = {
  title: "Login",
  description: "Sign in to your SwiftCart account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginForm />;
}
