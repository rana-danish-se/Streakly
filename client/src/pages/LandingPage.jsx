import { useNavigate } from 'react-router-dom';
import HeroSection from '../sections/Hero';
import AboutSection from '../sections/About';
import AboutDeveloper from '../sections/AboutDeveloper';

const LandingPage = () => {
  const navigate = useNavigate();
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
