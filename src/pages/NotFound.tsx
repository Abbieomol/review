import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="mb-4 text-gray-700">Sorry, the page you are looking for does not exist.</p>
      <Link
        to="/"
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;


