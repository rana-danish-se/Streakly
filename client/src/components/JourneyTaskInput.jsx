import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiList, FiCommand } from 'react-icons/fi';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { useTheme } from '../contexts/ThemeContext';

const JourneyTaskInput = ({ onAddTasks, disabled }) => {
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    let tasks = [];
    const trimmedInput = input.trim();

    // Check for bullet points (-, *, •, 1.)
    const hasBullets = /^[-*•]|\d+\./m.test(trimmedInput);

    if (hasBullets) {
       tasks = trimmedInput
         .split(/\r?\n(?=[-*•]|\d+\.\s)/)
         .map(t => t.replace(/^[-*•]\s*|\d+\.\s*/, '').trim())
         .filter(t => t.length > 0);
    } else {
       tasks = trimmedInput
         .split('\n')
         .map(t => t.trim())
         .filter(t => t.length > 0);
    }

    if (tasks.length > 0) {
      onAddTasks(tasks);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const taskCount = input.split('\n').filter(line => line.trim()).length;

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl"
          style={{ 
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(129, 140, 248, 0.15) 50%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl"
          style={{ 
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(74, 222, 128, 0.35) 0%, rgba(34, 197, 94, 0.2) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(34, 197, 94, 0.25) 0%, rgba(74, 222, 128, 0.12) 50%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <motion.div
          className="absolute top-1/2 right-10 w-64 h-64 rounded-full blur-3xl"
          style={{ 
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 50%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{ 
          backgroundColor: 'var(--card)',
          border: '2px solid',
          borderColor: isFocused 
            ? 'var(--primary)' 
            : theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
          boxShadow: isFocused 
            ? `0 20px 60px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.25)' : 'rgba(99, 102, 241, 0.15)'}, 0 0 0 4px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.05)'}` 
            : `0 10px 40px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'}`
        }}
        animate={{
          borderColor: isFocused 
            ? 'var(--primary)' 
            : theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
        }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(129, 140, 248, 0.05) 0%, transparent 50%, rgba(74, 222, 128, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, transparent 50%, rgba(34, 197, 94, 0.03) 100%)'
          }}
        />

        {isFocused && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 0%, ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)'} 50%, transparent 100%)`
            }}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
        )}

        <motion.div 
          className="relative px-6 py-4 flex items-center gap-3"
          style={{ 
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(129, 140, 248, 0.04) 100%)',
            borderBottom: '1px solid',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
          }}
        >
          <motion.div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)`,
              boxShadow: `0 4px 12px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.3)' : 'rgba(99, 102, 241, 0.2)'}`
            }}
            animate={isFocused ? { 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1]
            } : {}}
            transition={{ duration: 0.5 }}
          >
            <FiList className="w-5 h-5 text-white relative z-10" />
            
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  boxShadow: `0 0 20px var(--primary)`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span 
                className="font-bold text-base"
                style={{ color: 'var(--text)' }}
              >
                Add Multiple Tasks
              </span>
              {isFocused && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <HiSparkles 
                    className="w-5 h-5"
                    style={{ color: 'var(--warning)' }}
                  />
                </motion.div>
              )}
            </div>
            <p 
              className="text-xs mt-0.5 opacity-60"
              style={{ color: 'var(--text)' }}
            >
              One task per line or use bullet points (-)
            </p>
          </div>

          {input.trim() && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-1.5 rounded-lg font-bold text-sm"
              style={{ 
                background: `linear-gradient(135deg, var(--success) 0%, var(--primary) 100%)`,
                color: '#FFFFFF',
                boxShadow: `0 4px 12px ${theme === 'dark' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`
              }}
            >
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </motion.div>
          )}
        </motion.div>
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative p-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder="Setup project repository&#10;Create database schema&#10;Design user interface&#10;Write authentication logic"
              className="w-full min-h-[160px] bg-transparent border-none focus:ring-0 focus:outline-none resize-y text-base leading-relaxed placeholder:opacity-50"
              style={{ 
                color: 'var(--text)',
                caretColor: 'var(--primary)',
                fontFamily: 'ui-monospace, monospace'
              }}
            />

            {!input && !isFocused && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <HiLightningBolt 
                    className="w-24 h-24"
                    style={{ color: 'var(--primary)' }}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
          
          <motion.div 
            className="px-6 pb-6 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-50" style={{ color: 'var(--text)' }}>
                Quick submit:
              </span>
              <div className="flex items-center gap-1">
                <kbd 
                  className="px-2 py-1 rounded-lg text-xs font-semibold"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    color: 'var(--text)',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
                  }}
                >
                  <FiCommand className="w-3 h-3 inline" />
                </kbd>
                <span className="text-xs opacity-50" style={{ color: 'var(--text)' }}>+</span>
                <kbd 
                  className="px-2 py-1 rounded-lg text-xs font-semibold"
                  style={{ 
                    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    color: 'var(--text)',
                    border: '1px solid',
                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'
                  }}
                >
                  ↵
                </kbd>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={!input.trim() || disabled}
              className="relative flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base overflow-hidden"
              style={{ 
                background: !input.trim() || disabled 
                  ? (theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')
                  : `linear-gradient(135deg, var(--primary) 0%, var(--success) 100%)`,
                color: !input.trim() || disabled ? 'var(--text)' : '#FFFFFF',
                opacity: !input.trim() || disabled ? 0.4 : 1,
                boxShadow: !input.trim() || disabled 
                  ? 'none'
                  : `0 8px 24px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.35)' : 'rgba(99, 102, 241, 0.25)'}`
              }}
              whileHover={!disabled && input.trim() ? { 
                scale: 1.05,
                boxShadow: `0 12px 32px ${theme === 'dark' ? 'rgba(129, 140, 248, 0.45)' : 'rgba(99, 102, 241, 0.35)'}`
              } : {}}
              whileTap={!disabled && input.trim() ? { scale: 0.95 } : {}}
            >
              {!disabled && input.trim() && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  animate={{
                    x: ['-100%', '200%'],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              <FiPlus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Add Tasks</span>
              
              {!disabled && input.trim() && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    border: '2px solid white',
                    opacity: 0
                  }}
                  animate={{
                    scale: [1, 1.1, 1.2],
                    opacity: [0.5, 0.2, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JourneyTaskInput;