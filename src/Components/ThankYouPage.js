
import React from 'react';
import { useNavigate } from 'react-router-dom';
import thankyouPic from "../Animation - 1699597614697.gif"

const ThankYouPage = () => {
    const navigate = useNavigate()

    const handleSubmit = () => {
        navigate('/form')
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-[#2960A1] mb-4">Thank You!</h2>
        <p className="text-gray-700 text-center mb-6">Your details has been received.</p>
        <img
          src={thankyouPic}  // Replace with your own image URL
          alt="Thank You"
          className="mx-auto mb-6 rounded-full"
        />
        <p className="text-gray-700 text-center mb-6">
          We appreciate your feedback and will get back to you as soon as possible.
        </p>
        <button
          className="bg-[#2960A1] text-white px-4 py-2 rounded-md hover:bg-[#3529a1] focus:outline-none focus:ring focus:border-[#bfd3e8]"
          onClick={handleSubmit}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
