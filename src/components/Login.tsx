import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');  // Type the state as string
  const [password, setPassword] = useState<string>('');  // Type the state as string
  const [message, setMessage] = useState<string>('');  // Type the state as string
  const [isError, setIsError] = useState<boolean>(false);  // Type the state as boolean
  const [isLoading, setIsLoading] = useState<boolean>(false);  // Type the state as boolean

  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    const validEmail = 'test.users@gmail.com';
    const validPassword = 'password123';

    // Set loading state to true before validation
    setIsLoading(true);
    setTimeout(() => {
      // Check if the provided email and password match the hardcoded credentials
      if (email === validEmail && password === validPassword) {
        setMessage(`Welcome, ${email}!`);
        setIsError(false); // Clear error when login is successful
        navigate('/dashboard'); // Redirect to the dashboard page
      } else {
        setMessage('Invalid email or password.');
        setIsError(true); // Set error state when login fails
      }
      setIsLoading(false); // Set loading state to false after the delay
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleLogin}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@company.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // Typing the event for input change
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Typing the event for input change
              required
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login to your account
          </button>
        </form>
        <p
          className={`mt-4 text-center text-sm ${isError ? 'text-red-500' : 'text-gray-500'} dark:text-gray-300`}
        >
          {isLoading ? 'Loading...' : message}
        </p>
      </div>
    </div>
  );
};

export default Login;
