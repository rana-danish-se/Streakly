import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../sections/Hero';
import AboutSection from '../sections/About';
import AboutDeveloper from '../sections/AboutDeveloper';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Navigation handlers
  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/register');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <main>
       <HeroSection 
         onLogin={handleLogin}
         onSignup={handleSignup}
         onDashboard={handleDashboard}
       />
       <AboutSection />   
     <AboutDeveloper/>
    </main>
  );
};

export default LandingPage;
