import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/test-utils";
import { LeaderboardPagination } from "../_components/leaderboard-pagination";

function renderPagination(overrides?: {
  page?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}) {
  const props = {
    page: 0,
    totalPages: 3,
    totalItems: 150,
    pageSize: 50,
    onPageChange: vi.fn(),
    ...overrides,
  };
  const result = render(<LeaderboardPagination {...props} />);
  return { ...result, ...props };
}

describe("LeaderboardPagination", () => {
  // ── Positive ──
  it("renders page info and showing range", () => {
    renderPagination();

    expect(screen.getByText("Showing 1-50")).toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 3/)).toBeInTheDocument();
  });

  it("calls onPageChange with next page when next button is clicked", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 0, totalPages: 3 });

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1]!;
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange with previous page when prev button is clicked", async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderPagination({ page: 1, totalPages: 3 });

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0]!;
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it("disables prev button on first page", () => {
    renderPagination({ page: 0 });

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
  });

  it("disables next button on last page", () => {
    renderPagination({ page: 2, totalPages: 3 });

    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toBeDisabled();
  });

  // ── Negative ──
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <LeaderboardPagination
        page={0}
        totalPages={1}
        onPageChange={vi.fn()}
        totalItems={10}
        pageSize={50}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  // ── Edge ──
  it("shows correct range on last page with partial items", () => {
    renderPagination({
      page: 2,
      totalPages: 3,
      totalItems: 120,
      pageSize: 50,
    });

    expect(screen.getByText("Showing 101-120")).toBeInTheDocument();
  });

  it("shows correct info for middle page", () => {
    renderPagination({
      page: 1,
      totalPages: 3,
      totalItems: 150,
      pageSize: 50,
    });

    expect(screen.getByText("Showing 51-100")).toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 3/)).toBeInTheDocument();
  });
});
