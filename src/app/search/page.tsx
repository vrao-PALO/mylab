"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  searchKnowledgeBase,
  quickAnswers,
  SearchResult,
  SearchResultType,
} from "@/lib/knowledge-base";

// ── Type metadata ────────────────────────────────────────────────────────────

const TYPE_META: Record<
  SearchResultType,
  { label: string; bg: string; text: string; border: string }
> = {
  story:       { label: "Workflow",   bg: "bg-[#edf3fc]", text: "text-[#1f4f97]", border: "border-[#c9d5e6]" },
  framework:   { label: "Framework",  bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200" },
  control:     { label: "Control",    bg: "bg-indigo-50",  text: "text-indigo-700", border: "border-indigo-200" },
  glossary:    { label: "Glossary",   bg: "bg-green-50",   text: "text-green-700",  border: "border-green-200"  },
  quickanswer: { label: "Quick ans.", bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200"  },
};

type Filter = "all" | SearchResultType;

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all",         label: "All" },
  { value: "story",       label: "Workflows" },
  { value: "framework",   label: "Frameworks" },
  { value: "control",     label: "Controls" },
  { value: "glossary",    label: "Glossary" },
  { value: "quickanswer", label: "Quick answers" },
];

const SUGGESTED_TOPICS = [
  "MAS TRM", "PDPA", "RBAC", "VAPT", "Zero Trust", "Audit logging",
  "Branch protection", "Data classification", "SOC 2", "Incident response",
  "Third party risk", "Bias", "Retention", "Least privilege",
];

const RECENT_KEY = "search-recent";
const MAX_RECENT = 8;

function saveRecent(term: string) {
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    const updated = [term, ...existing.filter((t) => t !== term)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

function loadRecent(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"); } catch { return []; }
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [committed, setCommitted] = useState("");

  useEffect(() => { setRecent(loadRecent()); }, []);

  // Debounce actual search by 200ms so it doesn't fire on every keystroke
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const q = query.trim();
      if (q.length >= 2) {
        setCommitted(q);
      } else {
        setCommitted("");
      }
    }, 200);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [query]);

  const rawResults = useMemo(
    () => (committed ? searchKnowledgeBase(committed) : []),
    [committed]
  );

  const results = useMemo(
    () => (filter === "all" ? rawResults : rawResults.filter((r) => r.type === filter)),
    [rawResults, filter]
  );

  const countByType = useMemo(() => {
    const c: Partial<Record<SearchResultType, number>> = {};
    for (const r of rawResults) c[r.type] = (c[r.type] ?? 0) + 1;
    return c;
  }, [rawResults]);

  const filteredQA = useMemo(() => {
    const q = committed.toLowerCase();
    if (!q) return quickAnswers;
    return quickAnswers.filter((qa) =>
      `${qa.question} ${qa.answer} ${qa.tags.join(" ")}`.toLowerCase().includes(q)
    );
  }, [committed]);

  function runQuery(term: string) {
    setQuery(term);
    saveRecent(term);
    setRecent(loadRecent());
    setFilter("all");
    inputRef.current?.focus();
  }

  function clearQuery() {
    setQuery("");
    setCommitted("");
    inputRef.current?.focus();
  }

  function getRoute(result: SearchResult): string {
    if (result.route) return result.route;
    if (result.type === "framework" || result.type === "control") return "/control-mapping";
    if (result.type === "glossary") return "/plain-english";
    return "/";
  }

  return (
    <section className="space-y-5">

      {/* ── Search bar ────────────────────────────────────────────────────── */}
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Search</h2>
        <p className="mt-1 text-sm text-[#33496f]">
          Search across workflows, frameworks, controls, glossary terms, and quick answers.
        </p>
        <div className="relative mt-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim().length >= 2) {
                saveRecent(query.trim());
                setRecent(loadRecent());
              }
            }}
            placeholder="MAS TRM, PDPA, audit logging, bias threshold, Zero Trust…"
            className="w-full rounded-lg border border-[#c9d5e6] bg-[#f8fbff] px-4 py-3 pr-10 text-sm text-[#1b355f] focus:border-[#1f4f97] focus:outline-none focus:ring-1 focus:ring-[#1f4f97]"
          />
          {query && (
            <button onClick={clearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6a8ab0] hover:text-[#1f4f97] text-lg leading-none"
              aria-label="Clear"
            >×</button>
          )}
        </div>

        {/* Type filter pills — only shown when there are results */}
        {rawResults.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {FILTER_OPTIONS.map(({ value, label }) => {
              const count = value === "all" ? rawResults.length : (countByType[value as SearchResultType] ?? 0);
              if (value !== "all" && count === 0) return null;
              return (
                <button key={value} onClick={() => setFilter(value)}
                  className={`rounded-full px-3 py-0.5 text-xs font-medium border transition-colors ${filter === value ? "bg-[#1f4f97] text-white border-[#1f4f97]" : "bg-[#f8fbff] text-[#2a4a80] border-[#c9d5e6] hover:border-[#1f4f97]"}`}
                >{label}{count ? ` (${count})` : ""}</button>
              );
            })}
          </div>
        )}
      </header>

      {/* ── No query: suggestions ─────────────────────────────────────────── */}
      {!committed && (
        <div className="space-y-4">
          {recent.length > 0 && (
            <div className="rounded-xl border border-[#c9d5e6] bg-white p-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3a5480] mb-3">Recent searches</h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button key={term} onClick={() => runQuery(term)}
                    className="rounded-full bg-[#edf3fc] text-[#1f4f97] border border-[#c9d5e6] px-3 py-1 text-xs hover:border-[#1f4f97] transition-colors"
                  >{term}</button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[#c9d5e6] bg-white p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3a5480] mb-3">Suggested topics</h3>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TOPICS.map((t) => (
                <button key={t} onClick={() => runQuery(t)}
                  className="rounded-full bg-[#f8fbff] border border-[#c9d5e6] text-[#2a4a80] px-3 py-1 text-xs hover:bg-[#edf3fc] hover:border-[#1f4f97] transition-colors"
                >{t}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Search results ────────────────────────────────────────────────── */}
      {committed && (
        <div>
          {results.length === 0 ? (
            <div className="rounded-xl border border-[#c9d5e6] bg-white p-8 text-center">
              <p className="text-sm text-[#6a8ab0]">No results for <strong className="text-[#10203d]">&ldquo;{committed}&rdquo;</strong></p>
              <p className="mt-1 text-xs text-[#6a8ab0]">Try a different term or select a suggested topic below.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-[#6a8ab0] px-1">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{committed}&rdquo;</p>
              {results.map((result) => {
                const meta = TYPE_META[result.type];
                const isQA = result.type === "quickanswer";
                const isExpanded = expanded === result.id;
                return (
                  <article key={result.id}
                    className={`rounded-xl border bg-white overflow-hidden ${isQA ? "cursor-pointer" : ""} ${meta.border}`}
                  >
                    <div
                      className={`flex items-start justify-between p-4 gap-3 ${isQA ? "hover:bg-[#fffdf5]" : ""} transition-colors`}
                      onClick={() => isQA && setExpanded(isExpanded ? null : result.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 mb-1 flex-wrap">
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${meta.bg} ${meta.text} ${meta.border}`}>{meta.label}</span>
                          {result.tags.slice(0, 3).map((t) => (
                            <span key={t} className="rounded-full bg-gray-100 text-gray-500 px-2 py-0.5 text-xs">{t}</span>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-[#10203d] leading-snug">{result.title}</p>
                        {(!isQA || isExpanded) && (
                          <p className="mt-1 text-xs text-[#4a6080] leading-relaxed">{result.summary}</p>
                        )}
                        {isQA && !isExpanded && (
                          <p className="mt-0.5 text-xs text-[#6a8ab0] italic">Tap to expand answer</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {isQA
                          ? <span className="text-[#6a8ab0] text-sm">{isExpanded ? "▲" : "▼"}</span>
                          : <Link href={getRoute(result)} className="rounded-md bg-[#edf3fc] border border-[#c9d5e6] px-3 py-1 text-xs font-medium text-[#1f4f97] hover:bg-[#1f4f97] hover:text-white transition-colors">Open →</Link>
                        }
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Quick answers panel ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#c9d5e6] bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-[#e4eaf4] bg-[#f8fbff]">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3a5480]">
            Quick answers {committed && filteredQA.length < quickAnswers.length ? `— ${filteredQA.length} matching` : ""}
          </h3>
          <p className="text-xs text-[#6a8ab0] mt-0.5">Ready-to-use responses for live briefings and presales discussions</p>
        </div>
        <div className="divide-y divide-[#edf1f8]">
          {(committed ? filteredQA : quickAnswers).map((qa) => {
            const isOpen = expanded === qa.id;
            return (
              <div key={qa.id}>
                <button
                  onClick={() => setExpanded(isOpen ? null : qa.id)}
                  className="w-full flex items-start justify-between px-5 py-3 text-left hover:bg-[#f8fbff] transition-colors"
                >
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-semibold text-[#10203d]">{qa.question}</p>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {qa.tags.map((t) => (
                        <span key={t} className="rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 text-xs">{t}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[#6a8ab0] text-sm shrink-0">{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                      <p className="text-sm text-[#5a3a00]">{qa.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {committed && filteredQA.length === 0 && (
            <p className="px-5 py-4 text-xs text-[#6a8ab0]">No quick answers match &ldquo;{committed}&rdquo;</p>
          )}
        </div>
      </div>

    </section>
  );
}