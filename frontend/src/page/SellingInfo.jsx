import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../component/Spinner";
import { RiCloseLargeLine } from "react-icons/ri";

const SellingInfo = () => {
  const [loading, setLoading] = useState(false);
  const status = useSelector((state) => state.auth.status);
  const [showalert,setShowalert]=useState(true)
  console.log("status frokjnaskdk=", status);
  if(status==='pending'){
    console.log("inside if")
  }else{
    console.log('insidethe elese')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {status === "pending"&&showalert && (   
            <div
              role="alert"
              className="alert h-14 w-full fixed  flex justify-between  bg-amber-200"
            >
              <span className="font-medium text-md">
                {" "}
                youre request under processing{" "}
              </span>
              <button onClick={()=>setShowalert(!showalert)} className="hover:bg-white p-2 rounded ">
                <RiCloseLargeLine size={18} />
              </button>
            </div>
          )}

          {/* Hero Section */}
          <div className="bg-indigo-700 text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">
                Grow Your Business With Us
              </h1>
              <p className="text-xl mb-8">
                Join thousands of sellers reaching millions of customers every
                day
              </p>
              {
                status === 'pre-registration' && <Link to="/business_reg">
                <button
                  className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-100 transition duration-300"
                  onClick={() => {
                    /* Link to onboarding */
                  }}
                >
                  Start Selling Now
                </button>
              </Link>
              }
             
            </div>
          </div>

          {/* Benefits Section */}
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Sell On Our Platform?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="text-indigo-600 mb-4">
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Massive Customer Reach
                </h3>
                <p className="text-gray-600">
                  Access our community of 50M+ active buyers actively searching
                  for products like yours.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="text-indigo-600 mb-4">
                  <svg
                    className="w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Competitive Fees</h3>
                <p className="text-gray-600">
                  Only 5% transaction fee - significantly lower than most
                  marketplaces.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
                <div className="text-indigo-600 mb-4">
                  <svg
                    className="w-10 h-10"  
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Powerful Tools</h3>
                <p className="text-gray-600">
                  Free inventory management, analytics dashboard, and marketing
                  tools included.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Success Stories
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <blockquote className="mb-4">
                  <p className="text-xl italic text-gray-700">
                    "Our sales increased by 300% in just 3 months after joining
                    this platform. The seller tools made it so easy to manage
                    our growing business."
                  </p>
                </blockquote>
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-gray-600">Owner, HomeDecor Plus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          {status === "pre-registration" && (
            <div className="py-16 px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to Grow Your Business?
              </h2>
              <button
                className="bg-indigo-600 text-white font-bold py-4 px-12 rounded-lg text-lg hover:bg-indigo-700 transition duration-300"
                onClick={() => {
                  /* Link to onboarding */
                }}
              >
                Get Started in 5 Minutes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SellingInfo;
