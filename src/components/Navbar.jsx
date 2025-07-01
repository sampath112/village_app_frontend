import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white text-text fixed w-full top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl sm:text-3xl font-bold text-primary">
          Mana Chinnabondapalli
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-lg font-medium text-text hover:text-primary">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-lg font-medium text-text hover:text-primary">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-lg font-medium text-text hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin" className="text-lg font-medium text-text hover:text-primary">
              Admin Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 px-4">
          <Link to="/" className="block py-2 text-text hover:text-primary">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block py-2 text-text hover:text-primary">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-text hover:text-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/admin" className="block py-2 text-text hover:text-primary">
              Admin Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;