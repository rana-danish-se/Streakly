import { motion } from 'framer-motion';
import { 
  FiCheckCircle, 
  FiTarget, 
  FiTrendingUp, 
  FiCalendar, 
  FiBook,
  FiAward,
  FiBarChart2,
  FiBell
} from 'react-icons/fi';

const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const features = [
    {
      icon: FiTarget,
      title: 'Journey Management',
      description: 'Create and organize learning journeys for any skill or goal you want to master.',
      color: 'blue',
    },
    {
      icon: FiCheckCircle,
      title: 'Topic Tracking',
      description: 'Break down your goals into actionable topics and track completion with beautiful checkboxes.',
      color: 'green',
    },
    {
      icon: FiTrendingUp,
      title: 'Streak System',
      description: 'Build consistency with powerful streak tracking. Watch your current and longest streaks grow.',
      color: 'orange',
    },
    {
      icon: FiCalendar,
      title: 'Smart Scheduling',
      description: 'Schedule your journey start date and receive notifications when it\'s time to begin.',
      color: 'purple',
    },
    {
      icon: FiBook,
      title: 'Resource Library',
      description: 'Attach notes, images, PDFs, and links to your topics for easy access to learning materials.',
      color: 'indigo',
    },
    {
      icon: FiBarChart2,
      title: 'Progress Analytics',
      description: 'Visualize your learning progress with beautiful charts and insightful statistics.',
      color: 'pink',
    },
    {
      icon: FiAward,
      title: 'Consistency Tracking',
      description: 'Monitor your active days, missed days, and overall consistency percentage.',
      color: 'yellow',
    },
    {
      icon: FiBell,
      title: 'Smart Reminders',
      description: 'Never miss a day with customizable browser notifications to keep you on track.',
      color: 'red',
    },
  ];

  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    pink: 'from-pink-500 to-pink-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <section className="py-20 px-6 bg-white dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-4">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">About Streakly</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Your Personal Learning
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Success Platform
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Streakly transforms the way you learn by combining goal tracking, consistency monitoring, 
            and powerful analytics into one beautiful, intuitive platform. Built for students and 
            lifelong learners who are serious about achieving their goals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <FiTarget className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Our Mission</h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                We believe that consistency is the key to mastering any skill. Streakly is designed to make 
                tracking your learning journey effortless, engaging, and rewarding. Whether you're learning 
                a new programming language, studying for exams, or picking up a new hobby, we're here to 
                help you stay accountable and celebrate every milestone along the way.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorMap[feature.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Ready to transform your learning journey?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your First Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
