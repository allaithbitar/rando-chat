import { InputHTMLAttributes } from "react";

const DefaultInput = ({ ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:opacity-50"
    {...rest}
  />
);

export default DefaultInput;
