/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import React from "react";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen py-16">
      <div className="max-w-lg w-full mx-auto shadow px-6 py-7 rounded overflow-hidden">
        <h2 className="text-2xl uppercase font-medium mb-1">Create an account</h2>
        <p className="text-gray-600 mb-6 text-sm">Register as a new customer</p>
        <form action="#" method="post" autoComplete="off">
          <div className="space-y-2">
            <div>
              <label htmlFor="name" className="text-gray-600 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="Fulan Fulana"
              />
            </div>
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
            <div>
              <label htmlFor="confirm" className="text-gray-600 mb-2 block">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm"
                id="confirm"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                placeholder="*******"
              />
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreement"
                id="agreement"
                className="text-primary focus:ring-0 rounded-sm cursor-pointer"
              />
              <label htmlFor="agreement" className="text-gray-600 ml-3 cursor-pointer">
                I have read and agree to the{" "}
                <a href="#" className="text-primary">
                  terms & conditions
                </a>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-medium"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 flex justify-center relative">
          <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">
            Or sign up with
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

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;