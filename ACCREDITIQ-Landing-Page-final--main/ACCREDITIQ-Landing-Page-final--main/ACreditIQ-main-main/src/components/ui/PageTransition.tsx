import { useEffect, useState, ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  panelKey: string;
}

export default function PageTransition({ children, panelKey }: PageTransitionProps) {
  const [mountedKey, setMountedKey] = useState(panelKey);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // When the panelKey changes, reset animation state
    setMountedKey(panelKey);
    setShow(false);
    
    // Trigger the animation shortly after mount to ensure CSS transition runs
    const timer = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timer);
  }, [panelKey]);

  return (
    <div
      key={mountedKey}
      className={`transition-all duration-300 ease-in-out transform ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  );
}
