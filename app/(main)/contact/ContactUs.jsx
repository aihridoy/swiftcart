"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";
import { sendEmail } from "@/actions/contact";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${formData.message}</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #777; font-size: 12px;">This email was sent from the LWSkart Contact Us page.</p>
      </div>
    `;

    try {
      const result = await sendEmail({
        to: "aihridoy976@gmail.com",
        subject: `Contact Form: ${formData.subject}`,
        html: htmlContent,
      });

      if (result.success) {
        toast.success("Message sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 py-20">
          <div className="absolute inset-0 bg-black opacity-5"></div>
          <div className="container relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 uppercase mb-4 drop-shadow-md">
              Contact Us
            </h1>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6 rounded"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We’re here to assist you! Whether you have a question, need
              support, or just want to say hello, reach out to us.
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white clip-path-wave"></div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-xl shadow-lg transform hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold text-gray-800 uppercase mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 peer placeholder-transparent"
                      placeholder="Your Name"
                      required
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 peer placeholder-transparent"
                      placeholder="Your Email"
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Email
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 peer placeholder-transparent"
                      placeholder="Subject"
                      required
                    />
                    <label
                      htmlFor="subject"
                      className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Subject
                    </label>
                  </div>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 peer placeholder-transparent"
                      rows="5"
                      placeholder="Your Message"
                      required
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-gray-600 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-gray-600"
                    >
                      Message
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 text-white rounded-lg font-medium uppercase transition-all duration-300 transform hover:scale-105 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    }`}
                  >
                    {isSubmitting ? "Sending..." : "Share Thoughts"}
                  </button>
                  {submitStatus === "success" && (
                    <p className="text-green-600 text-center mt-2">
                      Message sent successfully!
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-red-600 text-center mt-2">
                      Failed to send message. Please try again.
                    </p>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-100 p-8 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-800 uppercase mb-8">
                  Get in Touch
                </h2>
                <div className="space-y-8">
                  <div className="flex items-start group">
                    <div className="text-3xl text-red-500 mr-4 transform group-hover:scale-110 transition-transform duration-300">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Address
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        123 LWSkart Street, Suite 456
                        <br />
                        New York, NY 10001, USA
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <div className="flex items-start group">
                    <div className="text-3xl text-red-500 mr-4 transform group-hover:scale-110 transition-transform duration-300">
                      <FaPhone />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Phone
                      </h3>
                      <p className="text-gray-600">+1 (800) 555-1234</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <div className="flex items-start group">
                    <div className="text-3xl text-red-500 mr-4 transform group-hover:scale-110 transition-transform duration-300">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Email
                      </h3>
                      <p className="text-gray-600">support@lwskart.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;