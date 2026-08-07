import React from 'react';

export function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={
        'rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ' +
        className
      }
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }) {
  return <div className={'p-6 pb-3 ' + className}>{children}</div>;
}

export function CardTitle({ className = '', children }) {
  return (
    <h3 className={'text-lg font-semibold text-slate-900 ' + className}>{children}</h3>
  );
}

export function CardDescription({ className = '', children }) {
  return <p className={'mt-1 text-sm text-slate-500 ' + className}>{children}</p>;
}

export function CardBody({ className = '', children }) {
  return <div className={'p-6 pt-3 ' + className}>{children}</div>;
}

export function CardFooter({ className = '', children }) {
  return (
    <div className={'p-6 pt-0 flex items-center gap-3 ' + className}>{children}</div>
  );
}

export default Card;
