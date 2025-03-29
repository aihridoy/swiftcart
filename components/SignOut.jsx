import { doSignOut } from "@/actions/auth-utils";
import React from "react";

const SignOut = () => {
  return (
    <form action={doSignOut}>
      <button
        type="submit"
        className="text-gray-200 hover:text-white transition"
      >
        Sign Out
      </button>
    </form>
  );
};

export default SignOut;
