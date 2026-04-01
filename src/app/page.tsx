import Link from "next/link";
import { foundationRoutes } from "@/lib/workflow-data";

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-[#c9d5e6] bg-white p-6">
        <h2 className="text-2xl font-semibold text-[#10203d]">Phase 1 Foundation Dashboard</h2>
        <p className="mt-2 max-w-3xl text-sm text-[#33496f]">
          Step 2 is in progress. This foundation includes shared domain types, zod schemas, and the first
          workflow pages for Intake, Scope, and Data Inputs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {foundationRoutes.map((route) => (
          <article key={route.path} className="rounded-xl border border-[#c9d5e6] bg-white p-5">
            <h3 className="text-base font-semibold text-[#15305a]">{route.title}</h3>
            <p className="mt-2 text-sm text-[#3f5579]">{route.summary}</p>
            <Link
              href={route.path}
              className="mt-4 inline-block rounded-md bg-[#1f4f97] px-3 py-2 text-sm font-medium text-white hover:bg-[#173f79]"
            >
              Open page
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
