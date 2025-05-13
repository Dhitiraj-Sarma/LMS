import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, TvMinimalPlay, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";

function StudentHeader() {
  const { resetCredentials } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Primary Links */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <GraduationCap className="h-8 w-8 mr-2 text-yellow-300" />
              <span className="font-extrabold text-lg md:text-2xl tracking-tight">
                LMS&nbsp;<span className="text-yellow-300">LEARN</span>
              </span>
            </Link>
            <nav className="hidden md:flex md:ml-10 space-x-4">
              <Link
                to="/courses"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 transition"
              >
                Explore Courses
              </Link>
              <Link
                to="/my-courses"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-white/20 transition"
              >
                <TvMinimalPlay className="w-5 h-5 mr-1" /> My Courses
              </Link>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="solid"
              className="bg-yellow-300 text-indigo-900 hover:bg-yellow-400 transition-shadow shadow-lg"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-white/20 transition"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-gradient-to-b from-purple-600 via-pink-600 to-pink-500">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <Link
              to="/courses"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/20 transition"
              onClick={() => setMobileOpen(false)}
            >
              Explore Courses
            </Link>
            <Link
              to="/my-courses"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-white/20 transition"
              onClick={() => setMobileOpen(false)}
            >
              <TvMinimalPlay className="w-5 h-5 mr-2" /> My Courses
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-white/20 transition"
            >
              Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export default StudentHeader;
