import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MOCK_LEADERBOARD } from "@/components/gamification/mock-data";

// Mock the services module
vi.mock("@/lib/services", () => ({
  useServicesMaybe: vi.fn(() => null),
}));

// Must import after vi.mock
const { useServicesMaybe } = await import("@/lib/services");

// Must import the hook after mocks are set up
const { useLeaderboard } = await import("@/hooks/use-leaderboard");

describe("useLeaderboard", () => {
  beforeEach(() => {
    vi.mocked(useServicesMaybe).mockReturnValue(null);
  });

  // ── Positive ──
  it("returns mock data when no services are available", async () => {
    const { result } = renderHook(() => useLeaderboard(0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(MOCK_LEADERBOARD.slice(0, 50));
    expect(result.current.error).toBeNull();
  });

  it("returns correct page of mock data", async () => {
    const { result } = renderHook(() => useLeaderboard(0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(50);
  });

  it("exposes refetch function", async () => {
    const { result } = renderHook(() => useLeaderboard(0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.refetch).toBe("function");
  });

  // ── Negative ──
  it("returns empty array for out-of-range page", async () => {
    const { result } = renderHook(() => useLeaderboard(100));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
  });

  // ── Edge ──
  it("has data after loading completes", async () => {
    const { result } = renderHook(() => useLeaderboard(0));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.data!.length).toBeGreaterThan(0);
  });

  it("handles page 0 as default", async () => {
    const { result } = renderHook(() => useLeaderboard());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(MOCK_LEADERBOARD.slice(0, 50));
  });
});
