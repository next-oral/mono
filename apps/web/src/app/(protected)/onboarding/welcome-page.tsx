"use client";

import { motion } from "motion/react";

import { Button } from "@repo/design/src/components/ui/button";

export const WelcomePage = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div
      key="welcome"
      className="absolute flex h-screen w-full flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background elements for parallax effect */}
      <motion.div
        className="absolute top-10 right-20 h-32 w-32 rounded-full bg-blue-100 opacity-40 blur-xl"
        initial={{ y: 0 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-indigo-100 opacity-40 blur-xl"
        initial={{ y: 0 }}
        animate={{ y: [0, 20, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Content with staggered animation */}
      <motion.div className="z-10 flex flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="h-8 w-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h3
          className="mb-4 text-4xl font-medium text-blue-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to NextOral
        </motion.h3>

        <motion.p
          className="mb-8 max-w-md text-center text-lg text-blue-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          NextOral is a purpose-built system for managing and running your
          clinic. Streamline issues, bookings, and consultations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            className="h-10 w-52 font-medium text-white shadow-lg"
            onClick={onClick}
          >
            Get Started
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
