import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import LoadingScreen from './pages/common/LoadingScreen.jsx'

export default function Root() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (can be replaced with actual async operations)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? <LoadingScreen /> : <App />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<Root/>);
