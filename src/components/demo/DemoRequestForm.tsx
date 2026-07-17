'use client';

// ─────────────────────────────────────────────────────────────────────────────
// DemoRequestForm — Sprint 12.3 Commercial Navigation Polish
//
// Replaces the previous mailto: flow for "Request Private Demo". This is a
// FRONTEND-ONLY demonstration: on submit it performs NO network call, NO email,
// NO backend and NO storage. It simply shows a professional confirmation.
// ─────────────────────────────────────────────────────────────────────────────

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

const DEPLOYMENT_OPTIONS = [
  'Cloud SaaS',
  'Private Cloud',
  'On-Premise',
  'Enterprise License',
] as const;

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200';

export function DemoRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const uid = useId();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Frontend-only: never send data anywhere. Just show confirmation.
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Thank you.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Your request has been recorded. Our enterprise team will contact you shortly to schedule a
          private discovery session.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise · Private discovery session
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Request a Private Demo
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 dark:text-gray-400">
          Tell us about your organization and deployment interest. Our enterprise team will reach
          out to schedule a tailored, private walkthrough.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-company`} className={labelClass}>
              Company
            </label>
            <input
              id={`${uid}-company`}
              name="company"
              type="text"
              required
              autoComplete="organization"
              className={inputClass}
              placeholder="Acme Capital"
            />
          </div>

          <div>
            <label htmlFor={`${uid}-name`} className={labelClass}>
              Full Name
            </label>
            <input
              id={`${uid}-name`}
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className={inputClass}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label htmlFor={`${uid}-email`} className={labelClass}>
              Business Email
            </label>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClass}
              placeholder="jane@acme.com"
            />
          </div>

          <div>
            <label htmlFor={`${uid}-country`} className={labelClass}>
              Country
            </label>
            <input
              id={`${uid}-country`}
              name="country"
              type="text"
              required
              autoComplete="country-name"
              className={inputClass}
              placeholder="Switzerland"
            />
          </div>

          <div>
            <label htmlFor={`${uid}-role`} className={labelClass}>
              Role
            </label>
            <input
              id={`${uid}-role`}
              name="role"
              type="text"
              required
              autoComplete="organization-title"
              className={inputClass}
              placeholder="Head of Digital Assets"
            />
          </div>

          <div>
            <label htmlFor={`${uid}-deployment`} className={labelClass}>
              Deployment Interest
            </label>
            <select
              id={`${uid}-deployment`}
              name="deployment"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select an option
              </option>
              {DEPLOYMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-aum`} className={labelClass}>
              Estimated Assets Under Management
            </label>
            <input
              id={`${uid}-aum`}
              name="aum"
              type="text"
              className={inputClass}
              placeholder="e.g. €50M – €250M"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor={`${uid}-message`} className={labelClass}>
              Optional Message
            </label>
            <textarea
              id={`${uid}-message`}
              name="message"
              rows={4}
              className={`${inputClass} resize-y`}
              placeholder="Anything you would like us to know ahead of the session."
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus-visible:ring-offset-gray-900"
        >
          <Sparkles className="h-4 w-4" />
          Request Private Demo
        </button>

        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          This is a demonstration form. No data is transmitted or stored.
        </p>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Demo
        </Link>
      </div>
    </div>
  );
}
