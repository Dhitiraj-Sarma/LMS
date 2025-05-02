import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function MediaProgressBar({ isMediaUploading, progress }) {
  const [showProgress, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progress);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMediaUploading, progress]);

  if (!showProgress) return null;
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 mb-4">
      <div className="relative w-full bg-gray-100 rounded-full h-2.5 shadow-sm overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${animatedProgress}%`,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          {progress >= 100 && isMediaUploading && (
            <motion.div
              className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-30"
              animate={{ x: ["0%", "100%", "0%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </motion.div>
      </div>
      <div className="flex justify-between mt-2 text-sm font-medium text-gray-600">
        <span>{animatedProgress.toFixed(0)}%</span>
        <span>{isMediaUploading ? "Uploading..." : "Complete"}</span>
      </div>
    </div>
  );
}

export default MediaProgressBar;
