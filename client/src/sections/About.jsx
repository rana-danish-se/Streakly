import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FiTarget, 
  FiTrendingUp, 
  FiAward, 
  FiCalendar,
  FiCheckCircle,
  FiZap,
  FiPieChart,
  FiUsers,
  FiBook,
  FiClock
} from 'react-icons/fi';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';

const AboutSection = () => {
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
    hidden: { y: 50, opacity: 0 },
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

  const features = [
    {
      icon: <FiTarget className="w-6 h-6" />,
      title: "Goal-Oriented Learning",
      description: "Set clear targets and track your progress with precision. Define your learning journeys and watch yourself grow.",
      color: "primary"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Progress Analytics",
      description: "Visualize your learning curve with beautiful charts and detailed statistics. Know exactly where you stand.",
      color: "success"
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: "Streak Management",
      description: "Build consistency with our intelligent streak system. Track your highest and current streaks to stay motivated.",
      color: "warning"
    },
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "Plan your learning journey with target days and deadlines. Stay organized and never miss a milestone.",
      color: "primary"
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Topic Tracking",
      description: "Break down complex subjects into manageable topics. Check them off as you master each one.",
      color: "success"
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Consistency Monitoring",
      description: "Track the days you show up and stay accountable. Our system keeps you honest and motivated.",
      color: "danger"
    }
  ];

  const stats = [
    {
      icon: <FiBook className="w-8 h-8" />,
      value: "100%",
      label: "Free Forever",
      description: "No hidden costs"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      value: "10K+",
      label: "Happy Learners",
      description: "Growing community"
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      value: "24/7",
      label: "Always Available",
      description: "Learn anytime"
    },
    {
      icon: <FiPieChart className="w-8 h-8" />,
      value: "∞",
      label: "Unlimited Journeys",
      description: "No restrictions"
    }
  ];

  const getColorValue = (color) => {
    const colorMap = {
      primary: 'var(--primary)',
      success: 'var(--success)',
      warning: 'var(--warning)',
      danger: 'var(--danger)'
    };
    return colorMap[color] || 'var(--primary)';
  };

  return (
    <section 
      ref={ref}
      className="relative py-4 overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'var(--primary)' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: 'var(--success)' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ color: 'var(--text)' }}
          >
            Your Personal <br />
            <span style={{ color: 'var(--primary)' }}> Learning Companion</span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-xl max-w-3xl mx-auto opacity-80"
            style={{ color: 'var(--text)' }}
          >
            We've built the ultimate learning tracker to help you stay consistent, 
            organized, and motivated on your journey to mastery. Every feature is designed 
            with your success in mind.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 max-w-[90%] mx-auto md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 400 }
              }}
              className="group relative p-8 rounded-2xl"
              style={{ 
                backgroundColor: 'var(--card)',
                border: '1px solid',
                borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }}
            >
              {/* Gradient overlay on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${getColorValue(feature.color)}15 0%, transparent 100%)`
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ 
                    backgroundColor: theme === 'dark' 
                      ? `${getColorValue(feature.color)}20` 
                      : `${getColorValue(feature.color)}15`,
                    color: getColorValue(feature.color)
                  }}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Title */}
                <h3 
                  className="text-xl font-bold mb-3"
                  style={{ color: 'var(--text)' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p 
                  className="opacity-70 leading-relaxed"
                  style={{ color: 'var(--text)' }}
                >
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <motion.div
                  className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: getColorValue(feature.color) }}
                >
                  <span className="text-sm font-semibold">Learn more</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="relative p-6 max-w-[90%] mx-auto rounded-3xl overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card)',
            border: '2px solid',
            borderColor: 'var(--primary)'
          }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              background: `linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)`
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <div className="relative z-10">
            {/* Stats Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ type: "spring", delay: 0.7 }}
              >
                <HiLightningBolt 
                  className="w-12 h-12 mx-auto mb-4" 
                  style={{ color: 'var(--primary)' }}
                />
              </motion.div>
              <h3 
                className="text-3xl font-bold mb-3"
                style={{ color: 'var(--text)' }}
              >
                Built for Success
              </h3>
              <p 
                className="text-lg opacity-70"
                style={{ color: 'var(--text)' }}
              >
                Join thousands of learners achieving their goals
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5
                  }}
                  className="text-center"
                >
                  {/* Icon */}
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{ 
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(129, 140, 248, 0.1)' 
                        : 'rgba(99, 102, 241, 0.1)',
                      color: 'var(--primary)'
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {stat.icon}
                  </motion.div>

                  {/* Value */}
                  <div 
                    className="text-4xl font-bold mb-2"
                    style={{ color: 'var(--primary)' }}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div 
                    className="font-semibold mb-1"
                    style={{ color: 'var(--text)' }}
                  >
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div 
                    className="text-sm opacity-60"
                    style={{ color: 'var(--text)' }}
                  >
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <motion.button
            className="group px-6 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto"
            style={{ 
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF'
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Journey</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;