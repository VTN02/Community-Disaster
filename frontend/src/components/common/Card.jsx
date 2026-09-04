import React from 'react';

const Card = ({
  children,
  hover = false,
  glass = false,
  className = '',
  borderAccent = '', // e.g. 'border-l-4 border-l-blue-600'
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        glass
          ? 'glass-card'
          : 'bg-white border-slate-200/80 shadow-sm'
      } ${hover ? 'hover:shadow-md hover:border-slate-300' : ''} ${borderAccent} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-5 pb-3 border-b border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-base sm:text-lg font-bold text-slate-900 leading-snug ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
