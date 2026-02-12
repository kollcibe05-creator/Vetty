import { Link } from 'react-router-dom';

const ErrorPage = ({ code = 404, message = "Oops! The page you are looking for does not exist." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full">
        <h1 className="text-6xl font-bold text-red-500 mb-4">{code}</h1>
        <p className="text-xl text-gray-700 mb-6">{message}</p>
        <Link
          to="/home"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold"
        >
          Go Home
        </Link>
      </div>
      <div className="mt-6 text-gray-400">
        <svg
          className="w-24 h-24 mx-auto opacity-50"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  );
};

export default ErrorPage;
