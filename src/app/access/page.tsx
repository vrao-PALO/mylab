"use client";

import { useState } from "react";

export default function AccessPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    const res = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });

    if (!res.ok) {
      setError("Access key is invalid.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <section className="mx-auto mt-20 max-w-md rounded-xl border border-[#c9d5e6] bg-white p-6">
      <h2 className="text-xl font-semibold text-[#10203d]">Access Gate</h2>
      <p className="mt-2 text-sm text-[#33496f]">Enter your internal access key to open the refresher workspace.</p>
      <input
        type="password"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="mt-4 w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm"
        placeholder="Internal access key"
      />
      {error ? <p className="mt-2 text-sm text-[#9f2d2d]">{error}</p> : null}
      <button
        type="button"
        onClick={submit}
        className="mt-4 rounded-md bg-[#1f4f97] px-4 py-2 text-sm font-medium text-white hover:bg-[#173f79]"
      >
        Continue
      </button>
    </section>
  );
}
