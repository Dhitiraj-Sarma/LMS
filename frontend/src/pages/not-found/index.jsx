import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-8xl font-extrabold text-indigo-600 dark:text-indigo-400">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Oops! Page Not Found
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          We can’t find the page you’re looking for.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
