import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

describe("ErrorBoundary", () => {
  it("muestra el mensaje de recuperación si un descendiente falla", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const brokenChild = function () {
      throw new Error("Fallo de prueba");
    };

    render(
      <ErrorBoundary>
        {createElement(brokenChild)}
      </ErrorBoundary>
    );

    expect(screen.getByText("¡Ups! Algo salió mal.")).toBeTruthy();
    expect(screen.getByText(/intenta recargar la página/i)).toBeTruthy();
  });
});
