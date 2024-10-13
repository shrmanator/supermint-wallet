import React from "react";

interface PageErrorProps {
  message: string;
}

const PageError: React.FC<PageErrorProps> = ({ message }) => {
  return <p className="text-xl text-red-500">Error: {message}</p>;
};

export default PageError;
