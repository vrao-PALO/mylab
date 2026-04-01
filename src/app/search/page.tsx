"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { knowledgeItems, quickAnswers } from "@/lib/knowledge-base";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredKnowledge = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return knowledgeItems;
    return knowledgeItems.filter((item) => {
      const haystack = `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const filteredAnswers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return quickAnswers;
    return quickAnswers.filter((item) => {
      const haystack = `${item.question} ${item.answer} ${item.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Search and Quick Answers</h2>
        <p className="mt-2 text-sm text-[#33496f]">
          Search across workflow knowledge and retrieve fast advisory responses for live discussions.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search MAS TRM, PDPA, risk exception, audit evidence..."
          className="mt-4 w-full rounded-md border border-[#cfd8e6] px-3 py-2 text-sm text-[#1b355f]"
        />
      </header>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Knowledge matches</h3>
        <div className="mt-3 space-y-2">
          {filteredKnowledge.map((item) => (
            <div key={item.id} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3">
              <p className="text-sm font-semibold text-[#15305a]">{item.title}</p>
              <p className="mt-1 text-sm text-[#30476f]">{item.summary}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-[#4a5f82]">Tags: {item.tags.join(", ")}</p>
                <Link href={item.route} className="text-sm font-medium text-[#1f4f97] hover:underline">
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#3a5480]">Quick answers</h3>
        <div className="mt-3 space-y-2">
          {filteredAnswers.map((item) => (
            <div key={item.id} className="rounded-md border border-[#d8e0ed] bg-[#f8fbff] p-3">
              <p className="text-sm font-semibold text-[#15305a]">Q: {item.question}</p>
              <p className="mt-1 text-sm text-[#30476f]">A: {item.answer}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
