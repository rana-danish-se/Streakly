import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState({ text: "Loading quote...", author: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Using a CORS proxy to avoid CORS issues with ZenQuotes API in the browser
        const response = await fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/today');
        const data = await response.json();
        if (data && data[0]) {
          setQuote({ text: data[0].q, author: data[0].a });
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-500 p-8 text-white shadow-xl">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-black/10 blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {loading ? (
             <div className="h-20 flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
             </div>
          ) : (
            <>
              <h2 className="mb-6 font-serif text-2xl font-light italic leading-relaxed md:text-3xl">
                "{quote.text}"
              </h2>
              <p className="text-sm font-semibold tracking-wider text-teal-100 opacity-80">
                — {quote.author}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuoteOfTheDay;
