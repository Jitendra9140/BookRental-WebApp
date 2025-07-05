import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import logo from '../../images/logo-png.png';
import { UserContext } from '../../contexts/UserContext';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);


  const id = user ? user._id : window.localStorage.getItem('Id');

  return (
    <nav className="bg-white border-gray-200 z-20 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center">
          <img src={logo} className="h-16 w-48" alt="Logo" />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:border-gray-700">
            <li>
              <Link
                to="/home"
                className="block py-2 pl-3 pr-4 text-red-600 rounded md:bg-transparent md:p-0 font-semibold"
                aria-current="page"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to={`/${id}/products`}
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Book
              </Link>
            </li>
            <li>
              <Link
                to="/buyHistory"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Purchased
              </Link>
            </li>
            <li>
              <Link
                to="/Return"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                ReturnBook
              </Link>
            </li>
            <li>
              <Link
  to={id ? `/cart/${id}` : "/"} // Redirect to home if ID is null
  className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
  onClick={(e) => {
    if (!id) {
      e.preventDefault();
      toast.error("Please login first");
      navigate("/"); // Redirect to login page
    }
    setIsMenuOpen(false);
  }}
>
  Cart
</Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/invoice"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Invoices
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 font-semibold md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
