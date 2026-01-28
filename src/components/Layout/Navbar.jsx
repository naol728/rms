import React, { useState } from 'react';
import { useAuth } from '../Auth/AuthContextSimple';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChefHat, LogOut, User, Key } from 'lucide-react';
import ChangePassword from '../Auth/ChangePassword';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              Restaurant Management System
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.name}</span>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>
            
            <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Key className="h-4 w-4" />
                  <span>Change Password</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <ChangePassword onClose={() => setChangePasswordOpen(false)} />
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

