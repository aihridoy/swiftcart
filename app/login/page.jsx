/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto shadow px-6 py-7 rounded bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1 text-center">Login</h2>
        <p className="text-gray-600 mb-6 text-sm text-center">Welcome back, customer</p>

        <form action="#" method="post" autoComplete="off">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="youremail@domain.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="remember" className="text-gray-600 ml-2 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-primary text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-medium"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-center relative">
          <div className="text-gray-600 uppercase px-3 bg-white z-10 relative text-sm">
            Or login with
          </div>
          <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
        </div>

        <div className="mt-4 flex gap-4">
          <a
            href="#"
            className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-medium text-sm hover:bg-blue-700"
          >
            Facebook
          </a>
          <a
            href="#"
            className="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-medium text-sm hover:bg-red-500"
          >
            Google
          </a>
        </div>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;