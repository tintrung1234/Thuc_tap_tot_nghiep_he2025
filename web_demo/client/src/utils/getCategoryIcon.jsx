import { Briefcase, Rocket, Monitor, BarChart2, Circle } from "lucide-react";

export const getCategoryIcon = (category) => {
  switch (category) {
    case "Business":
      return <Briefcase size={18} />;
    case "Startup":
      return <Rocket size={18} />;
    case "Technology":
      return <Monitor size={18} />;
    case "Economic":
      return <BarChart2 size={18} />;
    default:
      return <Circle size={18} />;
  }
};
