import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { HiLightningBolt } from 'react-icons/hi';


import api from '../services/api';

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState({ text: "Loading quote...", author: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const cachedQuoteStr = localStorage.getItem('daily_quote');
        
        if (cachedQuoteStr) {
          const cachedQuote = JSON.parse(cachedQuoteStr);
          if (cachedQuote.date === today) {
            setQuote({ text: cachedQuote.q, author: cachedQuote.a });
            setLoading(false);
            return;
          }
        }

        const response = await api.get('/quotes/random');
        const data = response.data;
        if (data && data[0]) {
          const newQuote = { q: data[0].q, a: data[0].a };
          setQuote({ text: newQuote.q, author: newQuote.a });
          
          localStorage.setItem('daily_quote', JSON.stringify({
            ...newQuote,
            date: today
          }));
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote({ 
          text: "The secret of getting ahead is getting started.", 
          author: "Mark Twain" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-8 overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card)',
        border: '2px solid',
        borderColor: 'var(--primary)'
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <HiLightningBolt className="w-full h-full" style={{ color: 'var(--primary)' }} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <FiStar style={{ color: 'var(--warning)' }} className="w-5 h-5" />
          <span 
            className="text-sm font-semibold"
            style={{ color: 'var(--primary)' }}
          >
            Daily Motivation
          </span>
        </div>
        
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <div 
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ 
                borderColor: 'var(--primary)',
                borderTopColor: 'transparent'
              }}
            />
          </div>
        ) : (
          <>
            <motion.blockquote
              key={quote.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-medium mb-4 leading-relaxed"
              style={{ color: 'var(--text)' }}
            >
              "{quote.text}"
            </motion.blockquote>
            
            <cite 
              className="not-italic text-lg opacity-70"
              style={{ color: 'var(--text)' }}
            >
              — {quote.author}
            </cite>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default QuoteOfTheDay;
