'use client';

import React from 'react';

const CancellationPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Cancellation Policy 🔄
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Life happens, plans change - here's how we handle cancellations and refunds on LocallyTrip.com! 💸
          </p>
          <div className="text-sm text-white/80">
            Last updated: August 13, 2025
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Quick Refund Guide �
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              TL;DR: The earlier you cancel, the more money you get back! 📊
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">48+ Hours</div>
              <div className="text-green-700 font-semibold mb-2">Almost Full Refund 🎉</div>
              <p className="text-green-600 text-sm">Get your money back (minus small fees)</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">24-48 Hours</div>
              <div className="text-yellow-700 font-semibold mb-2">Half Back 💸</div>
              <p className="text-yellow-600 text-sm">50% of what you paid</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">12-24 Hours</div>
              <div className="text-orange-700 font-semibold mb-2">Quarter Back 🪙</div>
              <p className="text-orange-600 text-sm">25% refund if you're lucky</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">&lt;12 Hours</div>
              <div className="text-red-700 font-semibold mb-2">Ouch, Nothing 😅</div>
              <p className="text-red-600 text-sm">Too late, no refunds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* General Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                The Real Deal About Cancellations 💯
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Look, we get it - sometimes life gets in the way of your amazing travel plans. Our cancellation policy tries to be fair to everyone while keeping things simple and transparent. 
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-700 mb-2">⏰ Quick Heads Up!</h4>
                <p className="text-blue-600 text-sm">
                  All cancellation deadlines are based on your experience's local time zone. And you gotta cancel through our platform - no calling your host directly! 📱
                </p>
              </div>
            </div>

            {/* Standard Cancellation Tiers */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                How Much Money You Get Back 💰
              </h2>
              
              <div className="space-y-6">
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <h3 className="text-xl font-semibold text-green-700 mb-3">Level 1: 48+ Hours Before (The Sweet Spot! 🎯)</h3>
                  <ul className="list-disc list-inside text-green-600 space-y-2 ml-4">
                    <li><strong>Your Money Back:</strong> Almost everything you paid!</li>
                    <li><strong>Small Service Fees:</strong> We keep these to cover our costs</li>
                    <li><strong>When You Get It:</strong> 5-7 business days back to your card</li>
                    <li><strong>The Process:</strong> Super easy, automatic approval ✅</li>
                  </ul>
                </div>

                <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                  <h3 className="text-xl font-semibold text-yellow-700 mb-3">Level 2: 24-48 Hours Before (Still Pretty Good 👍)</h3>
                  <ul className="list-disc list-inside text-yellow-600 space-y-2 ml-4">
                    <li><strong>Your Money Back:</strong> Half of what you paid</li>
                    <li><strong>Small Service Fees:</strong> Still can't refund these</li>
                    <li><strong>When You Get It:</strong> 5-7 business days</li>
                    <li><strong>The Process:</strong> Still automatic, no drama</li>
                  </ul>
                </div>

                <div className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                  <h3 className="text-xl font-semibold text-orange-700 mb-3">Level 3: 12-24 Hours Before (Getting Risky 😬)</h3>
                  <ul className="list-disc list-inside text-orange-600 space-y-2 ml-4">
                    <li><strong>Your Money Back:</strong> Only 25% - not much!</li>
                    <li><strong>Small Service Fees:</strong> Definitely can't refund these</li>
                    <li><strong>When You Get It:</strong> 5-7 business days</li>
                    <li><strong>The Process:</strong> Your host has to say yes first</li>
                  </ul>
                </div>

                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="text-xl font-semibold text-red-700 mb-3">Level 4: Less Than 12 Hours (Oof, Sorry! 💸)</h3>
                  <ul className="list-disc list-inside text-red-600 space-y-2 ml-4">
                    <li><strong>Your Money Back:</strong> Nothing, nada, zero</li>
                    <li><strong>Small Service Fees:</strong> Also gone</li>
                    <li><strong>When You Get It:</strong> You don't</li>
                    <li><strong>The Process:</strong> Only if something really crazy happens</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Service-Specific Policies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                Different Vibes, Different Rules 🎨
              </h2>
              
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-700 mb-3">📸 Photo Shoots & Insta Magic</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Same rules as above apply</li>
                    <li>Rainy day? We'll reschedule or refund you - no stress!</li>
                    <li>If the photographer's camera breaks, you get everything back</li>
                    <li>Sometimes getting your edited pics takes time, which might delay refunds</li>
                  </ul>
                </div>

                <div className="bg-pink-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-pink-700 mb-3">🗺️ Tour Guide Adventures</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Normal cancellation rules apply</li>
                    <li>Hurricane coming? We'll move your tour or give you money back</li>
                    <li>Museum closed? We'll find you something cooler or refund you</li>
                    <li>Group tours might have their own special rules</li>
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-700 mb-3">📋 Trip Planning Sessions</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Need at least 48 hours notice for full refund</li>
                    <li>If we already started working on your itinerary, you might get less back</li>
                    <li>Already got your digital travel guide? That part's yours to keep</li>
                    <li>Time spent chatting about your trip counts against refunds</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-700 mb-3">🎁 Epic Combo Packages</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>The strictest rule in your package applies to everything</li>
                    <li>Want to cancel just part of it? Maybe, but you'll lose discounts</li>
                    <li>Package deals might not work the same when broken apart</li>
                    <li>Sometimes we can do individual cancellations - just ask!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Host Cancellations */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                When Your Host Bails On You 😤
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If a host cancels on you (which rarely happens, but still), here's what you get:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li><strong>All your money back</strong> - including those service fees we usually keep</li>
                <li><strong>Super fast refund</strong> - within 24 hours, not a week</li>
                <li><strong>Sorry money</strong> - $25-$100 credit for the inconvenience</li>
                <li><strong>VIP rebooking help</strong> - our team will find you something even better</li>
              </ul>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-700 mb-2">Hosts Who Cancel Get Punished 💀</h4>
                <p className="text-red-600 text-sm mb-2">
                  If hosts keep canceling on people, we:
                </p>
                <ul className="list-disc list-inside text-red-600 text-sm space-y-1 ml-4">
                  <li>Hide them in search results</li>
                  <li>Review their account (and might suspend them)</li>
                  <li>Make them pay higher fees</li>
                  <li>Force them to take training classes</li>
                </ul>
              </div>
            </div>

            {/* Emergency and Exceptional Circumstances */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                When Life Really Hits Different 🌪️
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Sometimes crazy stuff happens that's totally out of your control. We get it, and we'll work with you:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">We'll Automatically Help You If...</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>There's a natural disaster or crazy weather warning</li>
                <li>The government says "no travel" to your destination</li>
                <li>There's a public health emergency (like what happened in 2020)</li>
                <li>Transportation workers go on strike</li>
                <li>Your venue suddenly closes for unexpected reasons</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">We'll Look at Your Situation If...</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>You have a medical emergency (you'll need to show us proof)</li>
                <li>Family emergency happens</li>
                <li>Your flight gets cancelled or majorly delayed</li>
                <li>Visa or immigration problems pop up</li>
                <li>Your destination becomes unsafe</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">Proof Required 📋</h4>
                <p className="text-blue-600 text-sm">
                  For emergencies, send us documents like medical certificates, official notices, or proof of flight issues. Our team will review everything case by case and try to help you out! 💙
                </p>
              </div>
            </div>

            {/* Refund Process */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                How to Get Your Money Back 💳
              </h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Step-by-Step Cancellation</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Log into your LocallyTrip.com account</li>
                <li>Go to "My Bookings" (it's in your profile)</li>
                <li>Find the trip you want to cancel</li>
                <li>Hit that "Cancel Booking" button</li>
                <li>Tell us why you're canceling (helps us improve!)</li>
                <li>Confirm you really want to cancel</li>
              </ol>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">When Your Money Comes Back</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li><strong>Credit Cards:</strong> 5-7 business days (pretty standard)</li>
                <li><strong>Debit Cards:</strong> 5-10 business days (banks are slower)</li>
                <li><strong>PayPal:</strong> 3-5 business days (usually faster)</li>
                <li><strong>Bank Transfers:</strong> 7-14 business days (the slowest option)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Other Ways We Can Hook You Up</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We usually send money back the same way you paid, but sometimes we can offer:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>LocallyTrip.com credit for future adventures</li>
                <li>Vouchers for similar experiences</li>
                <li>Partial refunds plus rebooking credits</li>
              </ul>
            </div>

            {/* No-Show Policy */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                When You Just Don't Show Up 👻
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you ghost your host and don't show up to your experience:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Sorry, but you won't get any money back</li>
                <li>Your host keeps everything you paid</li>
                <li>Being super late (like 30+ minutes) counts as not showing up</li>
                <li>Most hosts give you a 15-30 minute grace period</li>
              </ul>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-700 mb-2">How to Avoid No-Show Charges</h4>
                <ul className="list-disc list-inside text-orange-600 text-sm space-y-1 ml-4">
                  <li>Text your host if you're running late</li>
                  <li>Cancel ASAP if you can't make it</li>
                  <li>Set phone reminders for your booking</li>
                  <li>Double-check the meeting time and place</li>
                </ul>
              </div>
            </div>

            {/* Modifications and Rescheduling */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-3">
                Changing Your Plans Instead of Canceling 🔄
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Before you cancel completely, maybe we can just tweak your booking instead:
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Free Changes (If You Ask Early Enough!)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Change your date (48+ hours ahead, if your host is available)</li>
                <li>Adjust the time on the same day</li>
                <li>Add or remove people from your group (within limits)</li>
                <li>Update special requests or preferences</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Changes That Cost Extra Money</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6 ml-4">
                <li>Upgrading your service or adding cool extras</li>
                <li>Changing to a completely different location</li>
                <li>Making your experience longer</li>
                <li>Last-minute changes (less than 48 hours)</li>
              </ul>

              <p className="text-gray-700 leading-relaxed">
                Your host has to say yes to any changes, and they need to be available. Some changes might cost extra, but it's usually cheaper than canceling and rebooking! 💡
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Need Help? We Got You! 🤗
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Cancellation stress? Our support squad is here to help:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Support Email:</strong> support@locallytrip.com</p>
                <p><strong>Cancellation Hotline:</strong> +1 (555) 123-CANCEL</p>
                <p><strong>Live Chat:</strong> Available 24/7 right here on the platform</p>
                <p><strong>Help Center:</strong> <a href="/help" className="text-purple-600 hover:text-purple-700 font-medium">Browse Our FAQs</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CancellationPolicyPage;
