import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="relative">
      <ScrollRestoration />
      <Outlet />
    </div>
  );
};

export default Layout;
