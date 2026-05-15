"use client";
import { motion } from 'framer-motion';

export function ScopedBackdrop({ opacity }: { opacity: any }) {
  return (
    <motion.img 
      src="/bg.png?v=5" 
      style={{ opacity }}
      className="fixed inset-0 w-full h-full object-contain z-0 pointer-events-none select-none"
      alt="Narrative Backdrop"
    />
  );
}
