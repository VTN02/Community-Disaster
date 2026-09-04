import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({
  children,
  title,
  subtitle,
  actions,
  navItems,
  portalName = 'Admin Portal',
}) => {
  return (
    <Sidebar navItems={navItems} portalName={portalName}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {(title || actions) && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {title && (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
          </div>
        )}

        {children}
      </div>
    </Sidebar>
  );
};

export default DashboardLayout;
