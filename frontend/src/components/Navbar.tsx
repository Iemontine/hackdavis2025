import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              YourAppName
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/workout" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Workout
                </Link>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;