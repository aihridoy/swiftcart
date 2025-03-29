// app/terms-and-conditions/page.js
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Terms and Conditions - LWSkart",
  description:
    "Read the Terms and Conditions for using the LWSkart website and purchasing products from our online store.",
};

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-6 py-10 bg-white shadow rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 uppercase">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome to LWSkart! Please read these Terms and Conditions carefully
          before using our website.
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              These Terms and Conditions govern your use of the LWSkart website
              and the purchase of products from our online store. By accessing
              or using our website, you agree to be bound by these terms. If you
              do not agree with any part of these terms, please do not use our
              website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. User Responsibilities
            </h2>
            <p>
              You agree to use the LWSkart website for lawful purposes only. You
              are responsible for maintaining the confidentiality of your
              account and password and for restricting access to your computer
              or device. You agree to accept responsibility for all activities
              that occur under your account.
            </p>
            <p className="mt-2">You must not use our website to:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Engage in any illegal or fraudulent activity.</li>
              <li>
                Post or transmit any content that is harmful, offensive, or
                violates the rights of others.
              </li>
              <li>
                Attempt to gain unauthorized access to our systems or networks.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Product Information
            </h2>
            <p>
              We strive to provide accurate product descriptions, images, and
              pricing on our website. However, we do not warrant that the
              information is complete, accurate, or error-free. We reserve the
              right to correct any errors, inaccuracies, or omissions and to
              change or update information at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Orders and Payments
            </h2>
            <p>
              By placing an order on LWSkart, you agree to pay the total amount
              specified at checkout, including any applicable taxes and shipping
              fees. We accept payments via credit/debit cards, PayPal, etc. All
              payments must be made in USD.
            </p>
            <p className="mt-2">
              We reserve the right to refuse or cancel any order for reasons
              including but not limited to product availability, errors in
              pricing, or suspected fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Shipping and Delivery
            </h2>
            <p>
              We will make every effort to deliver your order within the
              estimated delivery time provided at checkout. However, delivery
              times are not guaranteed and may be affected by factors beyond our
              control, such as weather conditions, carrier delays, or customs
              processing for international orders.
            </p>
            <p className="mt-2">
              Shipping costs will be calculated and displayed at checkout based
              on your location and the selected shipping method. You are
              responsible for providing accurate shipping information, and we
              are not liable for delays or non-delivery due to incorrect
              addresses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Returns and Refunds
            </h2>
            <p>
              If you are not satisfied with your purchase, you may return the
              product within 30 days of delivery, provided it is in its original
              condition, unused, and with all packaging and tags intact. To
              initiate a return, please contact our customer support team at
              support@lwskart.com/ +1-800-555-1234.
            </p>
            <p className="mt-2">
              Refunds will be processed within 7-10 business days after we
              receive the returned product. Shipping costs are non-refundable,
              and you are responsible for the cost of return shipping unless the
              product is defective or incorrect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Intellectual Property
            </h2>
            <p>
              All content on the LWSkart website, including text, images, logos,
              and designs, is the property of LWSkart or its licensors and is
              protected by copyright, trademark, and other intellectual property
              laws. You may not reproduce, distribute, or use any content from
              our website without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              LWSkart shall not be liable for any indirect, incidental, special,
              or consequential damages arising from your use of our website or
              the purchase of our products, including but not limited to loss of
              profits, data, or goodwill. Our total liability for any claim
              shall not exceed the amount you paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of the United States. Any disputes
              arising from these terms shall be resolved in the courts of New
              York, NY.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              10. Changes to Terms
            </h2>
            <p>
              We reserve the right to update or modify these Terms and
              Conditions at any time without prior notice. Any changes will be
              effective immediately upon posting on our website. Your continued
              use of the website after such changes constitutes your acceptance
              of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please
              contact us at:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Email: support@lwskart.com</li>
              <li>Phone: +1-800-555-1234</li>
              <li>Address: 123 Main St, New York, NY 10001</li>
            </ul>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-primary hover:underline text-sm font-medium mr-4"
          >
            Back to Home
          </Link>
          <Link
            href="/register"
            className="text-primary hover:underline text-sm font-medium"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
