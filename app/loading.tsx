import React from "react";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return <p className="text-xl">{message}</p>;
};

export default Loading;
