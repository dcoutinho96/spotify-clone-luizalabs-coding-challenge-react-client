import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Text } from "../Text";

type BackButtonProps = {
  children?: React.ReactNode;
  className?: string;
};

export const BackButton = ({ children, className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <button
      data-testid="back-icon"
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 bg-transparent border-0 p-0 cursor-pointer ${className}`}
    >
      <ArrowLeft className="text-primary" width={32} height={32} />
      <Text className="leading-none text-base font-bold">{children}</Text>
    </button>
  );
};
