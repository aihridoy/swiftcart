"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createOrder } from "@/actions/order-utils";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getCartItemById } from "@/actions/cart-utils";
import { sendEmail } from "@/actions/contact";

const Checkout = () => {
  const { cartId } = useParams();
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    agreement: false,
  });

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    paymentMethod: "visa", // Default to Visa
  });

  // Fetch cart data with improved caching strategy
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["checkout", cartId, session?.user?.id], 
    queryFn: () => getCartItemById(cartId),
    enabled: !!cartId && sessionStatus === "authenticated",
    staleTime: 0, 
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("Query error:", error);
      if (error.message.includes("Unauthorized")) {
        toast.error("Please log in to access checkout.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`Error loading checkout: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    },
  });

  // Force refetch when component mounts or cartId changes
  useEffect(() => {
    if (cartId && sessionStatus === "authenticated") {
      refetch();
    }
  }, [cartId, sessionStatus, refetch]);

  // Mutation to create an order and send email
  const orderMutation = useMutation({
    mutationFn: async (orderData) => {
      const orderResponse = await createOrder(orderData);
      // Prepare email content
      const emailHtml = `
        <h1 style="color: #0087de;">SwiftCart Order Confirmation</h1>
        <h2>Order Overview</h2>
        <p><strong>Order ID:</strong> ${orderResponse?.order?._id}</p>
        <p><strong>Placed on:</strong> ${new Date(orderResponse?.order?.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${orderResponse?.order?.status}</p>
        
        <h2>Shipping Details</h2>
        <p><strong>Name:</strong> ${orderResponse?.order?.shippingDetails?.firstName} ${orderResponse?.order?.shippingDetails?.lastName}</p>
        ${
          orderResponse?.order?.shippingDetails?.company
            ? `<p><strong>Company:</strong> ${orderResponse.order.shippingDetails.company}</p>`
            : ""
        }
        <p><strong>Address:</strong> ${orderResponse?.order?.shippingDetails?.address}</p>
        <p><strong>City, Country:</strong> ${orderResponse?.order?.shippingDetails?.city}, ${orderResponse?.order?.shippingDetails?.country}</p>
        <p><strong>Phone:</strong> ${orderResponse?.order?.shippingDetails?.phone}</p>
        <p><strong>Email:</strong> ${orderResponse?.order?.shippingDetails?.email}</p>
        
        <h2>Payment Information</h2>
        <p><strong>Payment Method:</strong> ${orderResponse?.order?.paymentDetails?.paymentMethod?.toUpperCase()}</p>
        <p><strong>Card:</strong> **** **** **** ${orderResponse?.order?.paymentDetails?.cardLast4}</p>
        
        <h2>Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #e6f0fa;">
              <th style="border: 1px solid #ddd; padding: 8px;">Product ID</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderResponse?.order?.items
              ?.map(
                (item) => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item?.product}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item?.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">$${(item?.price * item?.quantity).toFixed(2)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
        
        <h2>Order Summary</h2>
        <p><strong>Subtotal:</strong> $${orderResponse?.order?.subtotal?.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ${
          orderResponse?.order?.shipping === 0
            ? "Free"
            : `$${orderResponse?.order?.shipping?.toFixed(2)}`
        }</p>
        <p><strong>Total:</strong> $${orderResponse?.order?.total?.toFixed(2)}</p>
        
        <p style="color: #0087de;">Thank you for shopping with SwiftCart!</p>
        <p style="color: #0087de;">Contact us: <a href="mailto:support@swiftcart.com">support@swiftcart.com</a></p>
      `;
      // Send confirmation email
      await sendEmail({
        to: orderResponse?.order?.shippingDetails?.email,
        subject: `SwiftCart Order Confirmation - ${orderResponse?.order?._id}`,
        html: emailHtml,
      });
      return orderResponse;
    },
    onSuccess: (data) => {
      toast.success("Order placed successfully and confirmation email sent!", {
        position: "top-right",
        autoClose: 3000,
      });
      // Redirect to an order confirmation page or homepage
      setTimeout(() => {
        router.push("/");
      }, 3000);
    },
    onError: (error) => {
      toast.error(`Error placing order or sending email: ${error?.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle payment input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number (add spaces every 4 digits)
    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (formattedValue.length > 19) return; // Limit to 16 digits + 3 spaces
    }

    // Format expiry date (MM/YY)
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2");
      if (formattedValue.length > 5) return; // Limit to MM/YY format
    }

    // Format CVV (limit to 3-4 digits)
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 4) return;
    }

    setPaymentData({
      ...paymentData,
      [name]: formattedValue,
    });
  };

  // Validate payment information
  const validatePayment = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = paymentData;
    
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      toast.error("Please enter a valid card number.", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast.error("Please enter a valid expiry date (MM/YY).", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!cvv || cvv.length < 3) {
      toast.error("Please enter a valid CVV.", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    if (!cardholderName.trim()) {
      toast.error("Please enter the cardholder name.", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreement) {
      toast.error("Please agree to the terms and conditions.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!validatePayment()) {
      return;
    }

    // Prepare order data
    const orderData = {
      cartId,
      shippingDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        country: formData.country,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
      },
      paymentDetails: {
        paymentMethod: paymentData.paymentMethod,
        cardLast4: paymentData.cardNumber.slice(-4),
        cardholderName: paymentData.cardholderName,
      },
      subtotal,
      shipping,
      total,
    };

    orderMutation.mutate(orderData);
  };

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email,
      }));
    }
  }, [session]);

  // Show loading while session is loading
  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
        <p className="ml-4">Loading session...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
        <p className="ml-4">Loading checkout data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 flex flex-col justify-center items-center">
        <p className="mb-4">Failed to load checkout. Please try again later.</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          Retry
        </button>
      </div>
    );
  }

  const cart = data?.cart || { items: [] };
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">
      <div className="col-span-12 lg:col-span-8 border border-gray-200 p-4 rounded">
        <h3 className="text-lg font-medium capitalize mb-4">Checkout</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Information Section */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Shipping Information
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-gray-600">
                    First Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-gray-600">
                    Last Name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="text-gray-600">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="country" className="text-gray-600">
                  Country/Region <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="address" className="text-gray-600">
                  Street address <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="city" className="text-gray-600">
                  City <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-gray-600">
                  Phone number <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-gray-600">
                  Email address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Payment Information Section */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Payment Information
            </h4>
            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="text-gray-600 mb-2 block">
                  Payment Method <span className="text-primary">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="visa"
                      checked={paymentData.paymentMethod === "visa"}
                      onChange={handlePaymentChange}
                      className="mr-2"
                    />
                    <span className="text-gray-600">Visa</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mastercard"
                      checked={paymentData.paymentMethod === "mastercard"}
                      onChange={handlePaymentChange}
                      className="mr-2"
                    />
                    <span className="text-gray-600">Mastercard</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="amex"
                      checked={paymentData.paymentMethod === "amex"}
                      onChange={handlePaymentChange}
                      className="mr-2"
                    />
                    <span className="text-gray-600">American Express</span>
                  </label>
                </div>
              </div>

              {/* Card Information */}
              <div>
                <label htmlFor="cardholderName" className="text-gray-600">
                  Cardholder Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  id="cardholderName"
                  required
                  value={paymentData.cardholderName}
                  onChange={handlePaymentChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="cardNumber" className="text-gray-600">
                  Card Number <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  required
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="text-gray-600">
                    Expiry Date <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    id="expiryDate"
                    required
                    value={paymentData.expiryDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="text-gray-600">
                    CVV <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    required
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    className="w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Submit */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreement"
                id="agreement"
                checked={formData.agreement}
                onChange={handleChange}
                className="text-primary focus:ring-0 rounded-sm cursor-pointer w-4 h-4"
              />
              <label
                htmlFor="agreement"
                className="text-gray-600 ml-3 cursor-pointer text-sm"
              >
                I agree to the{" "}
                <a href="#" className="text-primary">
                  terms & conditions
                </a>
              </label>
            </div>
            <button
              type="submit"
              disabled={orderMutation.isPending}
              className={`block w-full py-3 px-4 text-center text-white bg-primary border border-primary rounded-md hover:bg-transparent hover:text-primary transition font-medium ${
                orderMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {orderMutation.isPending ? "Processing Payment..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-4 border border-gray-200 p-4 rounded">
        <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">
          Order Summary
        </h4>
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item._id} className="flex justify-between">
              <div>
                <h5 className="text-gray-800 font-medium">
                  {item.product?.title || "Product"}
                </h5>
                {item.product?.size && (
                  <p className="text-sm text-gray-600">
                    Size: {item.product.size}
                  </p>
                )}
              </div>
              <p className="text-gray-600">x{item.quantity}</p>
              <p className="text-gray-800 font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>

        <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercase">
          <p>Shipping</p>
          <p>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
        </div>

        <div className="flex justify-between text-gray-800 font-medium py-3 uppercase">
          <p className="font-semibold">Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;