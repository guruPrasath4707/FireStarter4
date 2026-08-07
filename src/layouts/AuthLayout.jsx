import React from 'react';
import { Outlet } from 'react-router-dom';
import { Brand } from '../components/layout/Brand';

export function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_55%,#4f46e5_100%)] text-white overflow-hidden">
        <div className="relative z-10">
          <Brand />
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Your personalized path to the right career.
          </h2>
          <p className="mt-4 text-white/80 leading-relaxed">
            Build adaptive learning paths, take intelligent assessments, and chat with an AI mentor —
            all designed around your goals.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur">
              <div className="text-2xl font-semibold">9</div>
              <div className="mt-1 text-white/70">Stream tracks</div>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur">
              <div className="text-2xl font-semibold">120+</div>
              <div className="mt-1 text-white/70">Career paths</div>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/15 p-4 backdrop-blur">
              <div className="text-2xl font-semibold">AI</div>
              <div className="mt-1 text-white/70">Mentor chat</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} Pathlight. Built for learners, by learners.
        </div>
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-fuchsia-400/20 bg-violet-400/20 blur-3xl" />
      </div>

      <div className="flex flex-col justify-center px-6 sm:px-10 py-12 lg:py-0">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Brand />
          </div>
          {title ? (
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 text-slate-500">{subtitle}</p>
          ) : null}
          <div className="mt-8">{children ?? <Outlet />}</div>
          {footer ? (
            <div className="mt-6 text-sm text-slate-500">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
