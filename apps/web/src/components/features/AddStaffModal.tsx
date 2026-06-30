"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { X, UserPlus, Loader2, CheckCircle2, Mail } from "lucide-react";
import { createStaffAccountAction } from "@/lib/actions";
import { toast } from "@/components/ui/Toast";

type Classroom = { id: string; name: string; ageGroup: string };

type Props = {
  classrooms: Classroom[];
  onClose: () => void;
  onAdded: (member: { name: string; email: string; roleTitle: string }) => void;
};

const ROLE_TITLES = [
  "Lead Teacher",
  "Assistant Teacher",
  "Nursery Nurse",
  "Teaching Assistant",
  "Administrator",
  "Driver / Escort",
  "Kitchen Staff",
  "Security",
];

export function AddStaffModal({ classrooms, onClose, onAdded }: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [addedName, setAddedName] = useState("");
  const [addedEmail, setAddedEmail] = useState("");
  const [error, setError] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    const fullName = (fd.get("fullName") as string).trim();
    const email = (fd.get("email") as string).trim();
    const role = fd.get("role") as string;
    const phone = (fd.get("phone") as string).trim();
    const assignedClassroomId = fd.get("classroomId") as string || undefined;

    startTransition(async () => {
      const result = await createStaffAccountAction({ fullName, email, role, phone: phone || undefined, assignedClassroomId });
      if (result.ok) {
        setAddedName(fullName);
        setAddedEmail(email);
        setDone(true);
        onAdded({ name: fullName, email, roleTitle: role });
      } else {
        setError("Could not create staff account. Check the email isn't already in use, and that email is configured.");
      }
    });
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(20,22,39,0.5)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="glass-strong w-full max-w-md rounded-3xl shadow-2xl animate-rise overflow-hidden">

        {/* Rainbow top bar */}
        <div className="h-[3px] bg-rainbow" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-grad shadow-md">
              <UserPlus className="h-5 w-5 text-white" />
            </span>
            <div>
              <h2 className="text-base font-bold text-ink leading-tight">Add staff member</h2>
              <p className="text-xs text-muted">An invite link will be emailed to them</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-ink-100 hover:text-ink transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        {done ? (
          <SuccessView name={addedName} email={addedEmail} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Field label="Full name" required>
              <input
                name="fullName"
                type="text"
                required
                placeholder="e.g. Amara Mensah"
                className="field-input"
                autoFocus
              />
            </Field>

            <Field label="Email address" required>
              <input
                name="email"
                type="email"
                required
                placeholder="amara@example.com"
                className="field-input"
              />
            </Field>

            <Field label="Role / title" required>
              <select name="role" required defaultValue="" className="field-input bg-white">
                <option value="" disabled>Select a role…</option>
                {ROLE_TITLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>

            {classrooms.length > 0 && (
              <Field label="Assign to classroom (optional)">
                <select name="classroomId" defaultValue="" className="field-input bg-white">
                  <option value="">None — assign later</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} · {c.ageGroup}</option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Phone number (optional)">
              <input
                name="phone"
                type="tel"
                placeholder="+27 81 234 5678"
                className="field-input"
              />
            </Field>

            <div className="flex items-start gap-2.5 rounded-2xl bg-blue-50 px-4 py-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <p className="text-xs leading-relaxed text-blue-700">
                The staff member will receive an email with a secure link to set their own password. No temporary password to share.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-medium text-ink hover:bg-ink-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 hover:opacity-90 transition disabled:opacity-60"
              >
                {pending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> Create & send invite</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .field-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(20,22,39,0.12);
          background: rgba(255,255,255,0.85);
          padding: 10px 14px;
          font-size: 14px;
          color: #141627;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input:focus {
          border-color: #2D8CE0;
          box-shadow: 0 0 0 3px rgba(45,140,224,0.15);
        }
        .field-input::placeholder { color: #9CA3AF; }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.07em] text-ink-600">
        {label}{required && <span className="ml-0.5 text-brand-pink">*</span>}
      </label>
      {children}
    </div>
  );
}

function SuccessView({ name, email, onClose }: { name: string; email: string; onClose: () => void }) {
  return (
    <div className="px-6 pb-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 className="h-9 w-9 text-green-500" />
      </div>
      <h3 className="text-lg font-bold text-ink">{name} added!</h3>
      <p className="mt-1.5 text-sm text-muted">
        An invitation has been sent to <span className="font-medium text-ink">{email}</span>.
      </p>
      <p className="mt-1 text-xs text-muted">
        They&apos;ll click the link to set their password and activate their account.
      </p>
      <button
        onClick={onClose}
        className="mt-6 rounded-xl bg-accent px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 hover:opacity-90 transition"
      >
        Done
      </button>
    </div>
  );
}
