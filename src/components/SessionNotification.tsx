import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import AuthService from '../services/AuthService';

interface SessionNotificationProps {
  onRefresh: () => void;
  onDismiss: () => void;
  onLogout: () => void;
}

const SessionNotification: React.FC<SessionNotificationProps> = ({
  onRefresh,
  onDismiss,
  onLogout,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const authService = AuthService.getInstance();

  useEffect(() => {
    const checkSessionStatus = () => {
      const sessionInfo = authService.getSessionInfo();
      
      if (sessionInfo.isAuthenticated && sessionInfo.isExpiringSoon && !isDismissed) {
        setIsVisible(true);
        
        if (sessionInfo.tokenExpiry) {
          const now = new Date();
          const timeLeft = Math.max(0, Math.floor((sessionInfo.tokenExpiry.getTime() - now.getTime()) / 1000));
          setTimeRemaining(timeLeft);
        }
      } else {
        setIsVisible(false);
      }
    };

    // Check immediately
    checkSessionStatus();

    // Check every 30 seconds
    const interval = setInterval(checkSessionStatus, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [isDismissed]);

  // Separate effect for countdown timer
  useEffect(() => {
    if (!isVisible || timeRemaining <= 0) return;

    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Session expired, trigger logout
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isVisible, timeRemaining, onLogout]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await authService.refreshToken();
      onRefresh();
      setIsVisible(false);
      setIsDismissed(false); // Reset dismissed state on successful refresh
    } catch (error) {
      console.error('Token refresh failed:', error);
      onLogout();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeRemaining(0); // Stop the countdown
    setIsDismissed(true); // Mark as dismissed
    onDismiss();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs">
      <div className="bg-yellow-500/95 backdrop-blur-sm border border-yellow-400/40 rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-yellow-800 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm text-yellow-800 font-medium">
              Session expires in {formatTime(timeRemaining)}
            </p>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
            </button>
            
            <button
              onClick={handleDismiss}
              className="text-yellow-600 hover:text-yellow-800 focus:outline-none p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionNotification;
