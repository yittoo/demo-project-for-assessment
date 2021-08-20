import { cleanup, render } from "@testing-library/react";
import Title from "./Title";

describe("Title field", () => {
  afterEach(() => {
    cleanup();
  });
  it("without options renders h2 successfully", () => {
    const { container } = render(<Title />);
    expect(container.firstChild).toBeDefined();
    expect(container.firstChild.tagName).toBe("H2");
  });
  it("renders accordingly with custom options set 1", () => {
    const contentText = "Hello";
    const testClassName = "TestTitleClass";
    const { container } = render(
      <Title bold italic className={testClassName} spacing="md" element="h4">
        {contentText}
      </Title>
    );
    expect(container.firstChild.tagName).toBe("H4");
    expect(container.firstChild.textContent).toBe(contentText);
    expect(container.firstChild.className).toContain(testClassName);
    expect(container.firstChild.className).toContain("TitleSpacingMedium");
  });
  it("renders accordingly with custom options set 2", () => {
    const { container } = render(<Title spacing="lg" element="h1"></Title>);
    expect(container.firstChild.tagName).toBe("H1");
    expect(container.firstChild.className).toContain("TitleSpacingLarge");
  });
  it("renders accordingly with custom options set 3", () => {
    const { container } = render(
      <Title bold spacing="sm" element="h6"></Title>
    );
    expect(container.firstChild.tagName).toBe("H6");
    expect(container.firstChild.className).toContain("TitleSpacingSmall");
  });
});
