"use client";
import React, { useState } from "react";
import CustomDatePicker from "./components/CustomDatePicker";
import { setDateFromString } from "./util";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  location: string;
  device: "smartphone" | "desktop" | "";
  internet: "high" | "medium" | "low" | "";
  availability: string;
  experience: string;
  agreeConfidential: boolean;
  resumeBase64?: string; // optional, client will send base64
};

export default function Home() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    location: "",
    device: "",
    internet: "",
    availability: "",
    experience: "",
    agreeConfidential: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDateChange = (date: Date | null, name: string) => {
    if (!date) return;
    // if (new Date(date) > new Date()) {
    //   setShowAlert("date cannot be in the future", "red");
    //   return;
    // }

    setForm({
      ...form,
      [name]: date,
    });
  };

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.match(/^\S+@\S+\.\S+$/))
      e.email = "Valid email is required.";
    if (!form.dob || Number(form.dob) < 18)
      e.dob = "You must be at least 18 years old.";
    if (!form.device) e.device = "Please select the device you will use.";
    if (!form.internet)
      e.internet = "Please select your internet connection quality.";
    if (!form.agreeConfidential)
      e.agreeConfidential =
        "You must agree to confidentiality and research guidelines.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleFile(file: File | null) {
    if (!file) return;
    // convert to base64 so API can accept without multipart libs
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise<string>((res, rej) => {
      reader.onload = () => {
        if (typeof reader.result === "string") res(reader.result);
        else rej(new Error("Failed to read file"));
      };
      reader.onerror = () => rej(new Error("File read error"));
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Prepare payload
      const payload: any = { ...form };
      // send resume if present (already base64)
      // If user attached a file, it should have been converted before

      const resp = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (resp.ok) {
        setMessage("Application submitted successfully — thank you!");
        setForm({
          fullName: "",
          email: "",
          phone: "",
          dob: "",
          location: "",
          device: "",
          internet: "",
          availability: "",
          experience: "",
          agreeConfidential: false,
        });
        setErrors({});
      } else {
        setMessage(data?.error || "Submission failed");
      }
    } catch (err: any) {
      setMessage(err?.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Vector Design Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Geometric shapes */}
      <div className="absolute top-1/4 right-1/4">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="opacity-10"
        >
          <polygon points="50,0 100,50 50,100 0,50" fill="#4F46E5" />
        </svg>
      </div>
      <div className="absolute bottom-1/3 left-10">
        <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-10">
          <circle cx="40" cy="40" r="35" fill="#6366F1" />
        </svg>
      </div>

      <div className="max-w-3xl mx-auto p-6 relative z-10">
        <h1 className="text-3xl font-semibold mb-2 text-gray-800">
          Apply: Part-Time Panelist & Data Entry Clerk
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          ApexFocusGroup — Flexible, remote & in-person market research
          opportunities
        </p>

        <form
          onSubmit={onSubmit}
          className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/50 text-gray-600"
        >
          <div>
            <label className="block text-sm font-medium">Full name</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jane Doe"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder=""
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <CustomDatePicker
                name="dob"
                value={form.dob}
                onChange={handleDateChange}
              />

              {errors.age && (
                <p className="text-red-600 text-sm">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Availability (hrs / week)
              </label>
              <input
                value={form.availability}
                onChange={(e) =>
                  setForm({ ...form, availability: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. 5-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Device (required)
              </label>
              <select
                value={form.device}
                onChange={(e) =>
                  setForm({ ...form, device: e.target.value as any })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select device</option>
                <option value="smartphone">Smartphone with camera</option>
                <option value="desktop">Desktop / Laptop with webcam</option>
              </select>
              {errors.device && (
                <p className="text-red-600 text-sm">{errors.device}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">
                Internet connection
              </label>
              <select
                value={form.internet}
                onChange={(e) =>
                  setForm({ ...form, internet: e.target.value as any })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="high">High-speed</option>
                <option value="medium">Medium</option>
                <option value="low">Low / unreliable</option>
              </select>
              {errors.internet && (
                <p className="text-red-600 text-sm">{errors.internet}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Tell us briefly about any relevant experience (surveys, focus
              groups, data entry) — optional
            </label>
            <textarea
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Attach resume / CV (optional)
            </label>
            <input
              type="file"
              accept="application/pdf,application/msword,.doc,.docx"
              onChange={async (e) => {
                const f = e.target.files?.[0] ?? null;
                if (!f) return;
                try {
                  const b64 = await handleFile(f);
                  setForm((prev) => ({ ...prev, resumeBase64: b64 }));
                } catch (err) {
                  console.error(err);
                }
              }}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              We accept PDF/DOC. Files are encoded client-side before sending.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <input
              id="agree"
              type="checkbox"
              checked={form.agreeConfidential}
              onChange={(e) =>
                setForm({ ...form, agreeConfidential: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="agree" className="text-sm">
              I agree to maintain confidentiality and follow research
              guidelines. (required)
            </label>
          </div>
          {errors.agreeConfidential && (
            <p className="text-red-600 text-sm">{errors.agreeConfidential}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              disabled={submitting}
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
            <p className="text-sm text-gray-500">
              You may earn up to $750/week depending on sessions.
            </p>
          </div>

          {message && (
            <div className="rounded-md border p-3 mt-2 bg-blue-50 border-blue-200 text-blue-700">
              {message}
            </div>
          )}
        </form>

        <section className="mt-6 text-sm text-gray-700 bg-white/80 backdrop-blur-sm p-4 rounded-md border border-white/50 shadow">
          <h3 className="font-semibold">What happens next?</h3>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>We receive your application and review basic eligibility.</li>
            <li>
              If selected, you'll receive an email with session invites and
              instructions.
            </li>
            <li>
              For paid sessions, payments are processed after participation
              according to the study terms.
            </li>
          </ol>
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
