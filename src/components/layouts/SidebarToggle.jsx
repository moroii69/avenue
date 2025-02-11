import { FiMenu } from "react-icons/fi";
import { useSidebar } from "../../contexts/SidebarContext";

const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="hidden md:block p-2 rounded-lg bg-[#1A1A1A] text-white hover:bg-[#333333] transition-all duration-300"
    >
      <FiMenu size={20} />
    </button>
  );
};

export default SidebarToggle;
