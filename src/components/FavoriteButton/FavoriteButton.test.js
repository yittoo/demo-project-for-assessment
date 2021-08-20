import { cleanup, render, act, fireEvent } from "@testing-library/react";
import TestRenderer from "react-test-renderer";
import FavoriteButton from "./FavoriteButton";

describe("FavoriteButton", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders properly", () => {
    const { container } = render(<FavoriteButton />);
    expect(container.firstChild).toBeDefined();
    expect(container.firstChild.tagName).toBe("BUTTON");
  });
  it("fires onClick when clicked", () => {
    const mockFn = jest.fn();
    const { container } = render(<FavoriteButton onClick={mockFn} />);
    const button = container.firstChild;
    act(() => {
      fireEvent.click(button);
    });
    expect(mockFn).toHaveBeenCalled();
  });
  it("renders heart-empty when `isFavorite` is false", () => {
    const buttonRenderer = TestRenderer.create(
      <FavoriteButton isFavorite={false} />
    );
    const button = buttonRenderer.root.children[0];
    expect(
      button.children.find((child) => child.props.iconType === "heart-fill")
    ).toBeTruthy();
  });
  it("renders two heart-fill when `isFavorite` is true", () => {
    const buttonRenderer = TestRenderer.create(
      <FavoriteButton isFavorite={true} />
    );
    const button = buttonRenderer.root.children[0];
    expect(
      button.children.filter((child) => child.props.iconType === "heart-fill")
        .length
    ).toBe(2);
  });
});
