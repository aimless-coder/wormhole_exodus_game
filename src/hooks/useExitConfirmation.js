import { useEffect } from 'react';

const useExitConfirmation = () => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      const message = "Are you sure you want to leave? Your progress may be lost!";
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export default useExitConfirmation; 