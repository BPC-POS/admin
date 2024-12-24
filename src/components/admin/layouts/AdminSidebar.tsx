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
  Restaurant,
  FamilyRestroom,
  TableRestaurant,
  Warehouse,
  Category,
  LocalCafe,
  Kitchen,
  Store,
  Receipt,
  LocalShipping,
  EventNote
} from '@mui/icons-material';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home sx={{ fontSize: 24 }} />, text: 'Dashboard', href: '/admin/dashboard' },
    { icon: <People sx={{ fontSize: 24 }} />, text: 'Users', href: '/admin/users' },
    { icon: <FamilyRestroom sx={{ fontSize: 24 }} />, text: 'Staff', href: '/admin/staff' },
    { icon: <Inventory sx={{ fontSize: 24 }} />, text: 'Products', href: '/admin/products' },
    { icon: <Restaurant sx={{ fontSize: 24 }} />, text: 'Menu', href: '/admin/menu' },
    { icon: <TableRestaurant sx={{ fontSize: 24 }} />, text: 'Tables', href: '/admin/tables' },
    { icon: <Store sx={{ fontSize: 24 }} />, text: 'POS', href: '/admin/pos' },
    { icon: <ShoppingCart sx={{ fontSize: 24 }} />, text: 'Orders', href: '/admin/orders' },
    { icon: <Warehouse sx={{ fontSize: 24 }} />, text: 'Inventory', href: '/admin/inventory' },
    { icon: <LocalShipping sx={{ fontSize: 24 }} />, text: 'Suppliers', href: '/admin/suppliers' },
    { icon: <Assessment sx={{ fontSize: 24 }} />, text: 'Reports', href: '/admin/reports' },
    { icon: <Settings sx={{ fontSize: 24 }} />, text: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside 
      className={`h-full ${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-[#2C3E50] to-[#3498DB] text-white font-poppins shadow-xl transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-400">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Admin Panel
          </Link>
        )}
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-blue-600 transition-colors">
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="p-3 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100/20 hover:scrollbar-thumb-blue-500">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <li key={index}>
                <Link 
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 shadow-lg transform scale-105' 
                      : 'hover:bg-blue-500/50'
                  }`}
                >
                  <span className={`${isCollapsed ? 'mx-auto' : 'mr-4'}`}>
                    {React.cloneElement(item.icon, {
                      sx: { 
                        fontSize: 24,
                        color: isActive ? '#FFFFFF' : '#E0E0E0'
                      }
                    })}
                  </span>
                  {!isCollapsed && (
                    <span className={`font-medium text-sm whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-gray-200'
                    }`}>
                      {item.text}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
          transition: all 0.2s ease;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </aside>
  );
};

export default AdminSidebar;