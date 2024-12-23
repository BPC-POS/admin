import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  People,
  Inventory,
  ShoppingCart,
  Assessment,
  Settings,
  ChevronLeft,
  ChevronRight,
  Restaurant,
  FamilyRestroom,
  TableRestaurant
} from '@mui/icons-material';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home sx={{ fontSize: 28 }} />, text: 'Dashboard', href: '/admin/dashboard' },
    { icon: <People sx={{ fontSize: 28 }} />, text: 'Users', href: '/admin/users' },
    { icon: <FamilyRestroom sx={{ fontSize: 28 }} />, text: 'Staff', href: '/admin/staff' },
    { icon: <Inventory sx={{ fontSize: 28 }} />, text: 'Products', href: '/admin/products' },
    { icon: <Restaurant sx={{ fontSize: 28 }} />, text: 'Menu', href: '/admin/menu' },
    { icon: <TableRestaurant sx={{ fontSize: 28 }} />, text: 'Tables', href: '/admin/tables' },
    { icon: <ShoppingCart sx={{ fontSize: 28 }} />, text: 'Orders', href: '/admin/orders' },
    { icon: <Assessment sx={{ fontSize: 28 }} />, text: 'Reports', href: '/admin/reports' },
    { icon: <Settings sx={{ fontSize: 28 }} />, text: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside 
      className={`h-full p-4 text-black font-poppins backdrop-blur-2 rounded-lg transition-all duration-300 ease-in-out  ${
        isCollapsed ? 'w-20' : 'w-64'
      }`} 
      style={{backgroundColor: "#DFDDC5"}}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-xl font-bold ${isCollapsed ? 'hidden' : 'block'}`}>
          Admin Menu
        </h2>
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-700/10 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight sx={{ fontSize: 24 }} /> : <ChevronLeft sx={{ fontSize: 24 }} />}
        </button>
      </div>
      <nav className="h-[calc(100%-4rem)]">
        <ul className="space-y-6 flex flex-col justify-between h-full ">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={index}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-4 hover:bg-gray-700/10 rounded-lg transition-colors duration-200 ${
                    isCollapsed ? 'justify-center' : ''
                  } ${isActive ? 'bg-gray-700/10' : ''}`}
                >
                  <span className={`${!isCollapsed && 'mr-4'}`}>
                    {React.cloneElement(item.icon, {
                      sx: { 
                        fontSize: 28,
                        color: isActive ? '#FFFFFF' : 'inherit'
                      }
                    })}
                  </span>
                  {!isCollapsed && (
                    <span className={`font-medium text-lg ${isActive ? 'text-white' : ''}`}>
                      {item.text}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;