import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RoleModeProvider, RoleModeSelector } from "@/components/role-mode";
import { STORAGE_KEYS } from "@/lib/workflow-state";

describe("RoleModeSelector", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("does not read persisted storage during render without a provider", () => {
    window.localStorage.setItem(STORAGE_KEYS.role, "Auditor");

    render(<RoleModeSelector />);

    expect(screen.getByRole("combobox")).toHaveValue("Architect");
  });

  it("restores the saved role when mounted inside the provider", async () => {
    window.localStorage.setItem(STORAGE_KEYS.role, "Auditor");

    render(
      <RoleModeProvider>
        <RoleModeSelector />
      </RoleModeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("Auditor");
    });
  });

  it("persists a newly selected role", async () => {
    render(
      <RoleModeProvider>
        <RoleModeSelector />
      </RoleModeProvider>,
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Presales" },
    });

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.role)).toBe("Presales");
    });
  });
});
