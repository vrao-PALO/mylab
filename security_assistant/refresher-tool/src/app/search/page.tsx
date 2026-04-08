"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  searchKnowledgeBase,
  quickAnswers,
  SearchResult,
  SearchResultType,
} from "@/lib/knowledge-base";

const TYPE_META: Record<
  SearchResultType,
  { label: string; bg: string; text: string; border: string }
> = {
  story: { label: "Workflow", bg: "bg-[#edf3fc]", text: "text-[#1f4f97]", border: "border-[#c9d5e6]" },
  framework: { label: "Framework", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  control: { label: "Control", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  glossary: { label: "Glossary", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  quickanswer: { label: "Quick ans.", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

type Filter = "all" | SearchResultType;

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "story", label: "Workflows" },
  { value: "framework", label: "Frameworks" },
  { value: "control", label: "Controls" },
  { value: "glossary", label: "Glossary" },
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
    const updated = [term, ...existing.filter((item) => item !== term)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage failures in the browser
  }
}

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>(loadRecent);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [committed, setCommitted] = useState("");

  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed.length >= 2) {
        setCommitted(trimmed);
      } else {
        setCommitted("");
      }
    }, 200);

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [query]);

  const rawResults = useMemo(
    () => (committed ? searchKnowledgeBase(committed) : []),
    [committed],
  );

  const results = useMemo(
    () => (filter === "all" ? rawResults : rawResults.filter((result) => result.type === filter)),
    [rawResults, filter],
  );

  const countByType = useMemo(() => {
    const counts: Partial<Record<SearchResultType, number>> = {};
    for (const result of rawResults) {
      counts[result.type] = (counts[result.type] ?? 0) + 1;
    }
    return counts;
  }, [rawResults]);

  const filteredQA = useMemo(() => {
    const lowered = committed.toLowerCase();
    if (!lowered) {
      return quickAnswers;
    }
    return quickAnswers.filter((qa) =>
      `${qa.question} ${qa.answer} ${qa.tags.join(" ")}`.toLowerCase().includes(lowered),
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
    if (result.route) {
      return result.route;
    }
    if (result.type === "framework" || result.type === "control") {
      return "/control-mapping";
    }
    if (result.type === "glossary") {
      return "/plain-english";
    }
    return "/";
  }

  return (
    <section className="space-y-5">
      <header className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-xl font-semibold text-[#10203d]">Search</h2>
        <p className="mt-1 text-sm text-[#33496f]">
          Search across workflows, frameworks, controls, glossary terms, and quick answers.
        </p>
        <div className="relative mt-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && query.trim().length >= 2) {
                saveRecent(query.trim());
                setRecent(loadRecent());
              }
            }}
            placeholder="MAS TRM, PDPA, audit logging, bias threshold, Zero Trust..."
            className="w-full rounded-lg border border-[#c9d5e6] bg-[#f8fbff] px-4 py-3 pr-10 text-sm text-[#1b355f] focus:border-[#1f4f97] focus:outline-none focus:ring-1 focus:ring-[#1f4f97]"
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none text-[#6a8ab0] hover:text-[#1f4f97]"
              aria-label="Clear"
            >
              x
            </button>
          )}
        </div>

        {rawResults.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {FILTER_OPTIONS.map(({ value, label }) => {
              const count = value === "all" ? rawResults.length : (countByType[value as SearchResultType] ?? 0);
              if (value !== "all" && count === 0) {
                return null;
              }
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`rounded-full border px-3 py-0.5 text-xs font-medium transition-colors ${filter === value ? "border-[#1f4f97] bg-[#1f4f97] text-white" : "border-[#c9d5e6] bg-[#f8fbff] text-[#2a4a80] hover:border-[#1f4f97]"}`}
                >
                  {label}{count ? ` (${count})` : ""}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {!committed && (
        <div className="space-y-4">
          {recent.length > 0 && (
            <div className="rounded-xl border border-[#c9d5e6] bg-white p-5">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3a5480]">Recent searches</h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button
                    key={term}
                    onClick={() => runQuery(term)}
                    className="rounded-full border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs text-[#1f4f97] transition-colors hover:border-[#1f4f97]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-[#c9d5e6] bg-white p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3a5480]">Suggested topics</h3>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => runQuery(topic)}
                  className="rounded-full border border-[#c9d5e6] bg-[#f8fbff] px-3 py-1 text-xs text-[#2a4a80] transition-colors hover:border-[#1f4f97] hover:bg-[#edf3fc]"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {committed && (
        <div>
          {results.length === 0 ? (
            <div className="rounded-xl border border-[#c9d5e6] bg-white p-8 text-center">
              <p className="text-sm text-[#6a8ab0]">No results for <strong className="text-[#10203d]">&ldquo;{committed}&rdquo;</strong></p>
              <p className="mt-1 text-xs text-[#6a8ab0]">Try a different term or select a suggested topic below.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="px-1 text-xs text-[#6a8ab0]">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{committed}&rdquo;</p>
              {results.map((result) => {
                const meta = TYPE_META[result.type];
                const isQA = result.type === "quickanswer";
                const isExpanded = expanded === result.id;
                return (
                  <article key={result.id} className={`overflow-hidden rounded-xl border bg-white ${isQA ? "cursor-pointer" : ""} ${meta.border}`}>
                    <div
                      className={`flex items-start justify-between gap-3 p-4 transition-colors ${isQA ? "hover:bg-[#fffdf5]" : ""}`}
                      onClick={() => isQA && setExpanded(isExpanded ? null : result.id)}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap gap-2">
                          <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${meta.bg} ${meta.text} ${meta.border}`}>{meta.label}</span>
                          {result.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{tag}</span>
                          ))}
                        </div>
                        <p className="text-sm font-semibold leading-snug text-[#10203d]">{result.title}</p>
                        {(!isQA || isExpanded) && (
                          <p className="mt-1 text-xs leading-relaxed text-[#4a6080]">{result.summary}</p>
                        )}
                        {isQA && !isExpanded && (
                          <p className="mt-0.5 text-xs italic text-[#6a8ab0]">Tap to expand answer</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {isQA ? (
                          <span className="text-sm text-[#6a8ab0]">{isExpanded ? "▲" : "▼"}</span>
                        ) : (
                          <Link href={getRoute(result)} className="rounded-md border border-[#c9d5e6] bg-[#edf3fc] px-3 py-1 text-xs font-medium text-[#1f4f97] transition-colors hover:bg-[#1f4f97] hover:text-white">Open -&gt;</Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#c9d5e6] bg-white">
        <div className="border-b border-[#e4eaf4] bg-[#f8fbff] px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3a5480]">
            Quick answers {committed && filteredQA.length < quickAnswers.length ? `- ${filteredQA.length} matching` : ""}
          </h3>
          <p className="mt-0.5 text-xs text-[#6a8ab0]">Ready-to-use responses for live briefings and presales discussions</p>
        </div>
        <div className="divide-y divide-[#edf1f8]">
          {(committed ? filteredQA : quickAnswers).map((qa) => {
            const isOpen = expanded === qa.id;
            return (
              <div key={qa.id}>
                <button
                  onClick={() => setExpanded(isOpen ? null : qa.id)}
                  className="flex w-full items-start justify-between px-5 py-3 text-left transition-colors hover:bg-[#f8fbff]"
                >
                  <div className="flex-1 pr-3">
                    <p className="text-sm font-semibold text-[#10203d]">{qa.question}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {qa.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs text-amber-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm text-[#6a8ab0]">{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
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
