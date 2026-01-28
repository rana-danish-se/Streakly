import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FiGithub, 
  FiLinkedin, 
  FiInstagram,
  FiMail,
  FiHeart,
  FiSend,
  FiCheckCircle,
  FiExternalLink
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';
import danish from '../assets/danish.jpg';

const AboutDeveloper = () => {
  const { theme } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const socialLinks = [
    { 
      icon: <FiGithub className="w-6 h-6" />, 
      name: 'GitHub',
      url: 'https://github.com/rana-danish-se',
      color: theme === 'dark' ? '#FFFFFF' : '#181717'
    },
    { 
      icon: <FiLinkedin className="w-6 h-6" />, 
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/rana-danish-89349a32b/',
      color: '#0A66C2'
    },
    { 
      icon: <FiInstagram className="w-6 h-6" />, 
      name: 'Instagram',
      url: 'https://www.instagram.com/rana_danish_65/',
      color: '#E4405F'
    }
  ];

  return (
    <section 
      ref={ref}
      className="relative py-10 overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: 'var(--success)' }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: 'var(--text)' }}
          >
            Built With <br />
            <span style={{ color: 'var(--primary)' }}> Passion & Code</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto"
        >
          {/* Left Column - Developer Image */}
          <motion.div variants={itemVariants}>
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={danish} 
                alt="Developer" 
                className="w-full h-[500px] object-cover"
              />
              
              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 border-4 rounded-3xl pointer-events-none"
                style={{ borderColor: 'var(--primary)' }}
                animate={{
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Right Column - Developer Info */}
          <div className="space-y-6">
            {/* Name & Title */}
            <motion.div variants={itemVariants}>
              <h3 
                className="text-4xl font-bold mb-2"
                style={{ color: 'var(--text)' }}
              >
                Danish Rana
              </h3>
              <p 
                className="text-2xl mb-3"
                style={{ color: 'var(--primary)' }}
              >
                Full Stack Developer
              </p>
              
              {/* Availability Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ 
                  backgroundColor: theme === 'dark' 
                    ? 'rgba(74, 222, 128, 0.1)' 
                    : 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid var(--success)'
                }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--success)' }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="text-sm font-semibold" style={{ color: 'var(--success)' }}>
                  Available for Work
                </span>
              </motion.div>
            </motion.div>

            {/* About */}
            <motion.div variants={itemVariants}>
              <p 
                className="text-lg leading-relaxed opacity-80"
                style={{ color: 'var(--text)' }}
              >
                Passionate about creating intuitive and powerful web applications. 
                Specialized in MERN stack development with a focus on user experience 
                and clean, maintainable code. Constantly learning and exploring new technologies 
                to build solutions that make a difference.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants}>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ 
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255,255,255,0.1)' 
                        : 'rgba(0,0,0,0.05)',
                      color: 'var(--text)'
                    }}
                    whileHover={{ 
                      scale: 1.15,
                      backgroundColor: social.color,
                      color: '#FFFFFF',
                      y: -3
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Why This Project */}
            <motion.div variants={itemVariants}>
              <motion.div
                className="p-6 rounded-2xl"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: '2px solid var(--primary)'
                }}
                whileHover={{ y: -3 }}
              >
                <h4 
                  className="text-xl font-bold mb-3 flex items-center gap-2"
                  style={{ color: 'var(--text)' }}
                >
                  <FiHeart style={{ color: 'var(--danger)' }} />
                  Why This Project?
                </h4>
                <p 
                  className="leading-relaxed opacity-80 text-sm"
                  style={{ color: 'var(--text)' }}
                >
                  As a lifelong learner, I understand the challenges of staying consistent 
                  and tracking progress across multiple learning paths. This app was born 
                  from my own need for a simple yet powerful tool to manage my learning 
                  journey. Every feature has been carefully designed based on real learning 
                  experiences.
                </p>
              </motion.div>
            </motion.div>

            {/* Let's Connect CTA */}
            <motion.div variants={itemVariants}>
              <motion.div
                className="p-6 rounded-2xl text-center"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF'
                }}
                whileHover={{ scale: 1.02, y: -3 }}
              >
                <FiSend className="w-10 h-10 mx-auto mb-3" />
                <h4 className="text-xl font-bold mb-2">
                  Let's Connect!
                </h4>
                <p className="mb-4 opacity-90 text-sm">
                  Have questions or want to collaborate? Feel free to reach out!
                </p>
                <motion.a
                  href="mailto:ranadanish.se@gmail.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-white"
                  style={{ color: 'var(--primary)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiMail />
                  Get In Touch
                  <FiExternalLink className="w-4 h-4" />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutDeveloper;