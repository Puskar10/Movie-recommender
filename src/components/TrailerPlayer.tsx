'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface TrailerPlayerProps {
  trailerId: string | null;
  onClose: () => void;
}

export default function TrailerPlayer({ trailerId, onClose }: TrailerPlayerProps) {
  // Prevent background body scroll when the video player modal is open
  useEffect(() => {
    if (trailerId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [trailerId]);

  return (
    <AnimatePresence>
      {trailerId && (
        <div 
          id="trailer-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md cursor-pointer"
          />

          {/* Player Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 z-10"
          >
            {/* Close Button */}
            <button
              id="close-trailer-button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white hover:text-red-500 border border-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Close Video Player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* YouTube Embed Player */}
            <iframe
              id="youtube-player-iframe"
              src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
