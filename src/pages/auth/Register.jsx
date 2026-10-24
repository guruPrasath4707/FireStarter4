import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../design-system/Button';
import { Card, CardBody } from '../../design-system/Card';
import { Field, Input } from '../../design-system/Input';
import { Badge } from '../../design-system/Badge';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setError(err?.message || 'Unable to create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="A few details and you're set up."
      footer={
        <span>
          Already have an account?{' '}
          <Link to="/login" className="text-slate-900 font-medium hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-5">
            <Badge tone="violet">Get started</Badge>
            <span className="text-xs text-slate-500">Free • No credit card</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name" htmlFor="name" required>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                required
              />
            </Field>
            <Field label="Email" htmlFor="email" required>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />
            </Field>
            <Field label="Password" htmlFor="password" hint="At least 6 characters." required>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                required
              />
            </Field>
            {error ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
            <Button type="submit" variant="brand" className="w-full" loading={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
            <p className="text-xs leading-relaxed text-slate-500 text-center">
              Privacy and Terms pages have not been published yet. This is a prototype; avoid entering sensitive personal information.
            </p>
          </form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}
