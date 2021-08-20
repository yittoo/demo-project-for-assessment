import { rest } from "msw";
import { setupServer } from "msw/node";
// import mockFetch from "../../utils/tests/mockFetch";
import TestRenderer from "react-test-renderer";
import { mockGithubPublicRepositoriesResponse } from "../../utils/tests/mockData";
import { useGithubLinkHeaderPaginatedFetch } from "../useGithubLinkHeaderPaginatedFetch";

const { act } = TestRenderer;
const exampleUri = "/hello-sir";

const nextUrl = "https://api.github.com/repositories?page=2&since=369";

const server = setupServer(
  rest.get(exampleUri, (req, res, { status, set, delay, json }) => {
    return res(
      status(200),
      set({
        Link: `<${nextUrl}>; rel="next", <https://api.github.com/repositories{?since}>; rel="first"`,
      }),
      delay(10),
      json([
        mockGithubPublicRepositoriesResponse(5),
        mockGithubPublicRepositoriesResponse(3),
      ])
    );
  })
);
const sleep = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

// A component hack that exposes the hook methods onto props of a div
function TestComponent({ url }) {
  const { fetchFailed, loading, next, prev, responseBody, nextUrl, prevUrl } =
    useGithubLinkHeaderPaginatedFetch(url);

  return (
    <div
      fetchFailed={fetchFailed}
      loading={loading}
      next={next}
      prev={prev}
      responseBody={responseBody}
      nextUrl={nextUrl}
      prevUrl={prevUrl}
    ></div>
  );
}
describe("useGithubLinkHeaderPaginatedFetch", () => {
  beforeAll(() => {
    // jest.spyOn(global, "fetch").mockImplementation(mockFetch);
    server.listen();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => {
    server.close();
    // global.fetch.mockClear();
  });
  it("should initialize without errors when called", () => {
    const TestComponentRenderer = TestRenderer.create(
      <TestComponent url={exampleUri} />
    );
    const component = TestComponentRenderer.root.children[0];
    expect(component).toBeTruthy();
  });
  it("should have proper nextUrl parsed", async () => {
    const TestComponentRenderer = TestRenderer.create(
      <TestComponent url={exampleUri} />
    );

    const component = TestComponentRenderer.root.children[0];
    await act(async () => {
      setTimeout(() => {
        expect(component.props.nextUrl).toBe(nextUrl);
      }, 200);
      await sleep(1000);
    });
  });
});
