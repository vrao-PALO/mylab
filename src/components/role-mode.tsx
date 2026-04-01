"use client";

import * as React from "react";

type RoleMode = "Viewer" | "Editor";

function getSavedMode(): RoleMode {
  if (typeof window === "undefined") return "Viewer";
  const saved = window.localStorage.getItem("sa-role-mode");
  if (saved === "Viewer" || saved === "Editor") {
    return saved;
  }
  return "Viewer";
}

export function RoleModeSelector() {
  const [mode, setMode] = React.useState<RoleMode>(getSavedMode);

  function onChange(next: RoleMode) {
    setMode(next);
    window.localStorage.setItem("sa-role-mode", next);
  }

  return (
    <label className="flex items-center gap-2 rounded-md border border-[#b9c6da] bg-white px-3 py-1.5 text-sm text-[#1b355f]">
      Role
      <select
        value={mode}
        onChange={(e) => onChange(e.target.value as RoleMode)}
        className="rounded border border-[#cfd8e6] bg-[#f8fbff] px-2 py-1 text-sm text-[#1b355f]"
      >
        <option value="Viewer">Viewer</option>
        <option value="Editor">Editor</option>
      </select>
    </label>
  );
}
