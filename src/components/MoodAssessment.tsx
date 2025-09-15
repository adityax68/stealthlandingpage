import React, { useState, useEffect, useRef } from 'react';
import { Heart, Frown, Meh, Smile, AlertTriangle, Send, X } from 'lucide-react';

interface MoodAssessmentProps {
  onComplete: (mood: string, reason: string) => void;
  onSkip?: () => void;
  isVisible: boolean;
}

const MoodAssessment: React.FC<MoodAssessmentProps> = ({ onComplete, onSkip, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const moods = [
    { id: 'good', label: 'Good', icon: Smile, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { id: 'sad', label: 'Sad', icon: Frown, color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'stressed', label: 'Stressed', icon: AlertTriangle, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { id: 'anxious', label: 'Anxious', icon: Heart, color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'from-gray-400 to-slate-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
    { id: 'excited', label: 'Excited', icon: Smile, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setCurrentStep(2);
  };

  // Focus textarea when step 2 appears
  useEffect(() => {
    if (currentStep === 2 && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [currentStep]);

  const handleSubmit = () => {
    if (reason.trim()) {
      onComplete(selectedMood, reason.trim());
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setReason('');
  };

  const selectedMoodData = moods.find(mood => mood.id === selectedMood);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-slideUp border border-white/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 text-center relative">
          <button
            onClick={onSkip}
            className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
          <h2 className="text-2xl font-light mb-3 tracking-wide">How are you feeling today?</h2>
          <p className="text-slate-300 text-sm font-light">Let's start with understanding your current state</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStep === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-2 gap-4">
                {moods.map((mood) => {
                  const IconComponent = mood.icon;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`p-5 rounded-2xl border border-gray-200/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-opacity-80 ${mood.bgColor} ${mood.borderColor}`}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${mood.color} text-white transition-transform duration-200 hover:scale-105`}>
                          <IconComponent size={20} />
                        </div>
                        <span className="font-light text-gray-700 text-sm tracking-wide">{mood.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 2 && selectedMoodData && (
            <div className="space-y-8 animate-fadeIn">
              {/* Selected Mood Display */}
              <div className="text-center">
                <div className={`inline-flex items-center space-x-3 p-5 rounded-2xl bg-gradient-to-r ${selectedMoodData.color} text-white mb-6 animate-bounceIn`}>
                  <selectedMoodData.icon size={20} />
                  <span className="font-light text-lg tracking-wide">I'm feeling {selectedMoodData.label.toLowerCase()}</span>
                </div>
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-gray-700 font-light mb-4 text-sm tracking-wide">
                  Why are you feeling this way?
                </label>
                <textarea
                  ref={textareaRef}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Share what's on your mind... (optional)"
                  className="w-full p-5 border border-gray-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 font-light text-sm leading-relaxed"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-4 text-gray-500 hover:text-gray-700 font-light transition-colors text-sm tracking-wide"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!reason.trim()}
                  className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-4 rounded-2xl font-light transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodAssessment;
