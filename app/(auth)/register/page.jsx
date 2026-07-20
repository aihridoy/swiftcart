import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Register",
  description: "Create a SwiftCart account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RegisterForm />;
}
