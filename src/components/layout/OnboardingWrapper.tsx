import React, { useEffect, useState } from 'react';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import { useAuth } from '../../contexts/AuthContext';
import OnboardingModal from '../modals/OnboardingModal';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children }) => {
  const { user } = useAuth();
  const { canvases, fetchCanvases } = useCanvasesStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user) {
      const initializeCanvases = async () => {
        await fetchCanvases();
      };
      initializeCanvases();
    }
  }, [user]);

  useEffect(() => {
    setShowOnboarding(user && canvases.length === 0);
  }, [canvases, user]);

  return (
    <>
      {showOnboarding && user && canvases.length === 0 && <OnboardingModal />}
      {children}
    </>
  );
};

export default OnboardingWrapper; 