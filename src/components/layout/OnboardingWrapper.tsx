import React, { useEffect, useState } from 'react';
import { useCanvasesStore } from '../../store/useCanvasesStore';
import OnboardingModal from '../modals/OnboardingModal';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({ children }) => {
  const { canvases, fetchCanvases } = useCanvasesStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const initializeCanvases = async () => {
      await fetchCanvases();
    };
    initializeCanvases();
  }, []);

  useEffect(() => {
    setShowOnboarding(canvases.length === 0);
  }, [canvases]);

  return (
    <>
      {showOnboarding && canvases.length === 0 && <OnboardingModal />}
      {children}
    </>
  );
};

export default OnboardingWrapper; 