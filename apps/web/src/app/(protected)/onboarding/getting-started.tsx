import { motion } from "motion/react";

import { Button } from "@repo/design/src/components/ui/button";

export const GettingStarted = ({
  onAbort,
  onProceed,
}: {
  onAbort: () => void;
  onProceed: () => void;
}) => {
  return (
    <motion.div
      key="second-screen"
      className="absolute flex h-screen w-full items-center justify-center"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute h-full w-full bg-[radial-gradient(circle_500px_at_50%_200px,#4F46E5,transparent)]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8 rounded-xl bg-white p-4 shadow-xl"
        >
          <svg
            className="mx-auto h-12 w-12 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>

        <motion.h3
          className="mb-4 text-center text-3xl font-medium text-blue-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Let's set up your clinic
        </motion.h3>

        <motion.p
          className="mb-8 text-center text-blue-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          We'll guide you through the steps to get your clinic management system
          up and running in minutes.
        </motion.p>

        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            onClick={onAbort}
            variant="outline"
            className="border-blue-300 px-6 text-blue-700"
          >
            Go Back
          </Button>

          <Button
            onClick={onProceed}
            className="bg-blue-600 px-6 text-white hover:bg-blue-700"
          >
            Continue
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
