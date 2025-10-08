import React, { useState, useEffect, useRef } from 'react';
import { Heart, Frown, Meh, Smile, AlertTriangle, Send, X, Zap, Moon, Sun, Cloud, Star, Target, Activity, Edit3 } from 'lucide-react';

interface MoodAssessmentProps {
  onComplete: (mood: string, reason: string) => void;
  onSkip?: () => void;
  isVisible: boolean;
}

const MoodAssessment: React.FC<MoodAssessmentProps> = ({ onComplete, onSkip, isVisible }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [customMood, setCustomMood] = useState<string>('');
  const [isCustomMood, setIsCustomMood] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const customMoodInputRef = useRef<HTMLInputElement>(null);

  const moods = [
    { id: 'good', label: 'Good', icon: Smile, color: 'from-green-400 to-emerald-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    { id: 'sad', label: 'Sad', icon: Frown, color: 'from-blue-400 to-indigo-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'stressed', label: 'Stressed', icon: AlertTriangle, color: 'from-orange-400 to-red-500', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
    { id: 'anxious', label: 'Anxious', icon: Heart, color: 'from-purple-400 to-pink-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    { id: 'neutral', label: 'Neutral', icon: Meh, color: 'from-gray-400 to-slate-500', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
    { id: 'excited', label: 'Excited', icon: Zap, color: 'from-yellow-400 to-orange-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { id: 'tired', label: 'Tired', icon: Moon, color: 'from-indigo-400 to-purple-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
    { id: 'energetic', label: 'Energetic', icon: Sun, color: 'from-yellow-400 to-amber-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { id: 'focused', label: 'Focused', icon: Target, color: 'from-emerald-400 to-teal-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    { id: 'confused', label: 'Confused', icon: Cloud, color: 'from-slate-400 to-gray-500', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' },
    { id: 'hopeful', label: 'Hopeful', icon: Star, color: 'from-cyan-400 to-blue-500', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
    { id: 'motivated', label: 'Motivated', icon: Activity, color: 'from-rose-400 to-pink-500', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setIsCustomMood(false);
    setCustomMood('');
    setCurrentStep(2);
  };

  const handleCustomMoodSelect = () => {
    if (customMood.trim()) {
      setSelectedMood('custom');
      setIsCustomMood(true);
      setCurrentStep(2);
    }
  };

  const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMood(e.target.value);
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
      const moodToSubmit = isCustomMood ? customMood.trim() : selectedMood;
      onComplete(moodToSubmit, reason.trim());
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setReason('');
    setIsCustomMood(false);
    setCustomMood('');
  };

  const selectedMoodData = moods.find(mood => mood.id === selectedMood);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-card-small max-w-lg w-full mx-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm text-white p-4 sm:p-8 text-center relative border-b border-white/20">
          <button
            onClick={onSkip}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <h2 className="text-xl sm:text-2xl font-light mb-2 sm:mb-3 tracking-wide">How are you feeling today?</h2>
          <p className="text-slate-300 text-xs sm:text-sm font-light">Let's start with understanding your current state</p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 bg-slate-900/20">
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-fadeIn">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {moods.map((mood) => {
                  const IconComponent = mood.icon;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`p-2 sm:p-3 rounded-xl border border-slate-300/40 bg-slate-800/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-slate-700/70 hover:border-slate-200/60 active:scale-95 ${mood.borderColor}`}
                    >
                      <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                        <div className={`p-1 sm:p-2 rounded-lg bg-gradient-to-r ${mood.color} text-white transition-transform duration-200 hover:scale-105 shadow-md`}>
                          <IconComponent size={14} className="sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-medium text-slate-100 text-xs tracking-wide drop-shadow-sm">{mood.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Custom Mood Input */}
              <div className="mt-4 pt-4 border-t border-slate-300/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Edit3 className="w-4 h-4 text-slate-200" />
                  <span className="text-slate-100 text-sm font-medium">Or describe your mood:</span>
                </div>
                <div className="flex space-x-2">
                  <input
                    ref={customMoodInputRef}
                    type="text"
                    value={customMood}
                    onChange={handleCustomMoodChange}
                    placeholder="e.g., frustrated, overwhelmed, grateful..."
                    className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-300/40 rounded-lg text-slate-100 placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200/50 focus:border-slate-200/50 backdrop-blur-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCustomMoodSelect();
                      }
                    }}
                  />
                  <button
                    onClick={handleCustomMoodSelect}
                    disabled={!customMood.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 disabled:from-slate-800/50 disabled:to-slate-700/50 text-slate-100 rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center border border-slate-300/40 backdrop-blur-sm active:scale-95 shadow-md"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (selectedMoodData || isCustomMood) && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              {/* Selected Mood Display */}
              <div className="text-center">
                <div className={`inline-flex items-center space-x-2 sm:space-x-3 p-3 sm:p-5 rounded-2xl bg-gradient-to-r ${isCustomMood ? 'from-purple-400 to-pink-500' : selectedMoodData?.color} text-white mb-4 sm:mb-6 animate-bounceIn`}>
                  <span className="font-light text-sm sm:text-lg tracking-wide">
                    I'm feeling {isCustomMood ? customMood.toLowerCase() : selectedMoodData?.label.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-slate-100 font-medium mb-3 sm:mb-4 text-xs sm:text-sm tracking-wide drop-shadow-sm">
                  Why are you feeling this way?
                </label>
                <textarea
                  ref={textareaRef}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="w-full p-3 sm:p-5 border border-slate-300/40 bg-slate-800/60 backdrop-blur-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-200/50 focus:border-slate-200/50 resize-none text-slate-100 placeholder-slate-300 font-light text-xs sm:text-sm leading-relaxed shadow-md"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 sm:space-x-4">
                <button
                  onClick={handleBack}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-slate-200 hover:text-slate-100 font-medium transition-colors text-xs sm:text-sm tracking-wide border border-slate-300/40 bg-slate-800/60 backdrop-blur-sm rounded-2xl hover:bg-slate-700/70 active:scale-95 shadow-md"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!reason.trim()}
                  className="flex-1 bg-gradient-to-r from-slate-700/80 to-slate-600/80 hover:from-slate-600/90 hover:to-slate-500/90 disabled:from-slate-800/50 disabled:to-slate-700/50 text-slate-100 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center border border-slate-300/40 backdrop-blur-sm active:scale-95 shadow-md"
                >
                  <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
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
