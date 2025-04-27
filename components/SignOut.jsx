import { doSignOut } from "@/actions/auth-utils";
import React from "react";

const SignOut = () => {
  return (
    <form action={doSignOut}>
      <button
        type="submit"
        className="px-4 py-2 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white rounded-md transition duration-200 text-sm font-medium"
      >
        Sign Out
      </button>
    </form>
  );
};

export default SignOut;
