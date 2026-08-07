import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] px-6">
      <div className="text-center max-w-md">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-900 text-white grid place-items-center text-lg font-semibold">404</div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you were looking for doesn't exist or was moved.</p>
        <div className="mt-6">
          <Link to="/">
            <Button variant="gradient">Back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
