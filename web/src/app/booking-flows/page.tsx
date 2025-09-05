'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Demo data untuk mockup
const bookingFlows = {
  guide: {
    title: 'Tour Guide Booking Flow',
    emoji: '🧑‍💼',
    color: 'from-blue-500 to-blue-600',
    steps: [
      {
        id: 1,
        title: 'Select Date & Time',
        description: 'Choose your preferred tour date and starting time',
        fields: ['Date picker', 'Time slots', 'Duration'],
        duration: '~2 minutes'
      },
      {
        id: 2,
        title: 'Group Details',
        description: 'Tell us about your group size and preferences',
        fields: ['Number of people', 'Ages', 'Special requests'],
        duration: '~1 minute'
      },
      {
        id: 3,
        title: 'Payment & Confirmation',
        description: 'Secure payment and instant confirmation',
        fields: ['Payment method', 'Contact details', 'Confirmation'],
        duration: '~2 minutes'
      }
    ]
  },
  photographer: {
    title: 'Photography Booking Flow',
    emoji: '📸',
    color: 'from-pink-500 to-pink-600',
    steps: [
      {
        id: 1,
        title: 'Package Selection',
        description: 'Choose your photography package and style',
        fields: ['Package type', 'Duration', 'Number of photos', 'Style preferences'],
        duration: '~3 minutes'
      },
      {
        id: 2,
        title: 'Date & Location',
        description: 'Select preferred dates and shooting locations',
        fields: ['Date options', 'Location preferences', 'Backup dates'],
        duration: '~2 minutes'
      },
      {
        id: 3,
        title: 'Consultation Scheduling',
        description: 'Book a pre-session consultation call',
        fields: ['Call time', 'Vision discussion', 'Final requirements'],
        duration: '~2 minutes'
      },
      {
        id: 4,
        title: 'Confirmation & Payment',
        description: 'Secure booking after photographer confirmation',
        fields: ['Deposit payment', 'Contract agreement', 'Final confirmation'],
        duration: '~3 minutes'
      }
    ]
  },
  tripplanner: {
    title: 'Trip Planner Booking Flow',
    emoji: '📝',
    color: 'from-green-500 to-green-600',
    steps: [
      {
        id: 1,
        title: 'Trip Requirements',
        description: 'Detailed form about your travel preferences',
        fields: ['Destination', 'Dates', 'Budget', 'Travel style', 'Interests', 'Group size'],
        duration: '~8 minutes'
      },
      {
        id: 2,
        title: 'Consultation Booking',
        description: 'Schedule a detailed discussion with your planner',
        fields: ['Video call time', 'Timezone', 'Preparation notes'],
        duration: '~2 minutes'
      },
      {
        id: 3,
        title: 'Quote Discussion',
        description: 'Review and negotiate the planning service cost',
        fields: ['Service breakdown', 'Timeline', 'Revisions included'],
        duration: '~5 minutes'
      },
      {
        id: 4,
        title: 'Contract & Payment',
        description: 'Finalize agreement and begin planning process',
        fields: ['Service agreement', 'Payment schedule', 'Planning timeline'],
        duration: '~3 minutes'
      }
    ]
  },
  combo: {
    title: 'Combo Service Booking Flow',
    emoji: '🎁',
    color: 'from-purple-500 to-purple-600',
    steps: [
      {
        id: 1,
        title: 'Service Selection',
        description: 'Choose which services you want to combine',
        fields: ['Guide services', 'Photography', 'Planning', 'Additional services'],
        duration: '~4 minutes'
      },
      {
        id: 2,
        title: 'Coordination Requirements',
        description: 'Plan the logistics for multiple services',
        fields: ['Timeline coordination', 'Location planning', 'Team requirements'],
        duration: '~5 minutes'
      },
      {
        id: 3,
        title: 'Team Availability',
        description: 'Check availability of all service providers',
        fields: ['Date preferences', 'Team coordination', 'Backup options'],
        duration: '~3 minutes'
      },
      {
        id: 4,
        title: 'Package Customization',
        description: 'Adjust the package based on your needs',
        fields: ['Service modifications', 'Pricing adjustments', 'Special requests'],
        duration: '~4 minutes'
      },
      {
        id: 5,
        title: 'Complex Confirmation',
        description: 'Multi-service coordination and final booking',
        fields: ['Multi-provider agreement', 'Coordination timeline', 'Payment'],
        duration: '~5 minutes'
      }
    ]
  }
};

const BookingFlowMockup: React.FC = () => {
  const [selectedFlow, setSelectedFlow] = useState<string>('guide');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showDemo, setShowDemo] = useState<boolean>(false);

  const getCurrentFlow = () => bookingFlows[selectedFlow as keyof typeof bookingFlows];

  const getTotalDuration = (steps: any[]) => {
    const totalMinutes = steps.reduce((total, step) => {
      const minutes = parseInt(step.duration.match(/\d+/)[0]);
      return total + minutes;
    }, 0);
    return `${totalMinutes} minutes total`;
  };

  const getComplexityLevel = (stepCount: number) => {
    if (stepCount <= 3) return { level: 'Simple', color: 'text-green-600', bg: 'bg-green-100' };
    if (stepCount <= 4) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Complex', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Interactive Booking Flow Mockups ✨
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore how different booking flows work for each service category. Click through the interactive demos to understand the user journey.
          </p>
        </div>

        {/* Flow Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {Object.entries(bookingFlows).map(([key, flow]) => {
            const complexity = getComplexityLevel(flow.steps.length);
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedFlow(key);
                  setCurrentStep(1);
                  setShowDemo(false);
                }}
                className={`p-6 rounded-3xl border-2 transition-all duration-200 text-left ${
                  selectedFlow === key 
                    ? 'border-purple-500 bg-white shadow-xl transform scale-105' 
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg'
                }`}
              >
                <div className="text-center mb-4">
                  <span className="text-4xl">{flow.emoji}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{flow.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Steps:</span>
                    <span className="font-medium">{flow.steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{getTotalDuration(flow.steps)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Complexity:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${complexity.bg} ${complexity.color}`}>
                      {complexity.level}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Flow Details */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{getCurrentFlow().emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{getCurrentFlow().title}</h2>
                <p className="text-gray-600">{getCurrentFlow().steps.length} steps • {getTotalDuration(getCurrentFlow().steps)}</p>
              </div>
            </div>
            <button
              onClick={() => setShowDemo(!showDemo)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 ${
                showDemo 
                  ? 'bg-gray-500 text-white' 
                  : `bg-gradient-to-r ${getCurrentFlow().color} text-white hover:shadow-lg transform hover:scale-105`
              }`}
            >
              {showDemo ? '← Back to Overview' : 'Start Interactive Demo →'}
            </button>
          </div>

          {!showDemo ? (
            /* Flow Overview */
            <div className="space-y-6">
              {getCurrentFlow().steps.map((step, index) => (
                <div key={step.id} className="flex gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r ${getCurrentFlow().color} text-white flex items-center justify-center font-bold`}>
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {step.fields.map((field, fieldIndex) => (
                        <span 
                          key={fieldIndex}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      ⏱️ Estimated time: {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Interactive Demo */
            <div className="space-y-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl">Step {currentStep} of {getCurrentFlow().steps.length}</h3>
                  <span className="text-sm text-gray-600">
                    {Math.round((currentStep / getCurrentFlow().steps.length) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r ${getCurrentFlow().color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${(currentStep / getCurrentFlow().steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Step */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-700 mb-2">
                    {getCurrentFlow().steps[currentStep - 1]?.title}
                  </h2>
                  <p className="text-gray-700">
                    {getCurrentFlow().steps[currentStep - 1]?.description}
                  </p>
                </div>

                {/* Mock Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {getCurrentFlow().steps[currentStep - 1]?.fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className="font-medium text-gray-700">{field}</label>
                      <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                        <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    ← Previous
                  </button>
                  
                  {currentStep < getCurrentFlow().steps.length ? (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className={`px-6 py-3 bg-gradient-to-r ${getCurrentFlow().color} text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setShowDemo(false);
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Complete Booking! ✅
                    </button>
                  )}
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex justify-center space-x-2">
                {getCurrentFlow().steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index + 1)}
                    className={`w-8 h-8 rounded-full font-bold text-sm transition-all duration-200 ${
                      currentStep === index + 1
                        ? `bg-gradient-to-r ${getCurrentFlow().color} text-white shadow-lg`
                        : currentStep > index + 1
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {currentStep > index + 1 ? '✓' : step.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comparison Summary */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl shadow-xl p-8 border-2 border-yellow-200">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-center">
            Booking Flow Comparison 📊
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-yellow-300">
                  <th className="text-left py-3 font-bold">Service Type</th>
                  <th className="text-center py-3 font-bold">Steps</th>
                  <th className="text-center py-3 font-bold">Duration</th>
                  <th className="text-center py-3 font-bold">Complexity</th>
                  <th className="text-center py-3 font-bold">Booking Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bookingFlows).map(([key, flow]) => {
                  const complexity = getComplexityLevel(flow.steps.length);
                  return (
                    <tr key={key} className="border-b border-yellow-200">
                      <td className="py-4 font-medium">
                        <span className="mr-2">{flow.emoji}</span>
                        {flow.title.replace(' Booking Flow', '')}
                      </td>
                      <td className="text-center py-4">{flow.steps.length}</td>
                      <td className="text-center py-4">{getTotalDuration(flow.steps)}</td>
                      <td className="text-center py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${complexity.bg} ${complexity.color}`}>
                          {complexity.level}
                        </span>
                      </td>
                      <td className="text-center py-4 text-xs">
                        {key === 'guide' && 'Instant'}
                        {key === 'photographer' && 'Schedule-based'}
                        {key === 'tripplanner' && 'Request-based'}
                        {key === 'combo' && 'Hybrid'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back to Experience */}
        <div className="text-center mt-12">
          <Link 
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Explore Experiences
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingFlowMockup;
