import TestRenderer from "react-test-renderer";
import * as hookModule from "../../hooks/useGithubLinkHeaderPaginatedFetch";
import { mockGithubPublicRepositoriesResponse } from "../../utils/tests/mockData";

import { PublicReposList } from "./PublicReposList";
const { act } = TestRenderer;

describe("test PublicReposList", () => {
  const mockHookDependency = ({ loading, responseBody, fetchFailed }) => {
    return jest.fn().mockReturnValue({
      next: jest.fn(),
      prev: jest.fn(),
      loading,
      responseBody,
      fetchFailed,
      nextUrl: "https://example-next.com",
      prevUrl: "https://example-prev.com",
    });
  };
  const mockStore = {
    favorites: [],
    dispatch: jest.fn(),
    actions: {
      loadFromLocalstorage: jest.fn(),
      toggleFavorite: jest.fn(),
      addFavorite: jest.fn(),
      removeFavorite: jest.fn(),
    },
  };
  it("should render properly with proper successful api response", () => {
    hookModule.useGithubLinkHeaderPaginatedFetch = mockHookDependency({
      loading: false,
      responseBody: [
        mockGithubPublicRepositoriesResponse(5),
        mockGithubPublicRepositoriesResponse(3),
        mockGithubPublicRepositoriesResponse(11),
      ],
      fetchFailed: false,
    });
    const PublicReposListRenderer = TestRenderer.create(
      <PublicReposList {...mockStore} />
    );
    expect(PublicReposListRenderer.root.children).toBeTruthy();
  });
  it("should render error on failed api response", () => {
    hookModule.useGithubLinkHeaderPaginatedFetch = mockHookDependency({
      loading: false,
      responseBody: undefined,
      fetchFailed: true,
    });
    const PublicReposListRenderer = TestRenderer.create(
      <PublicReposList {...mockStore} />
    );
    expect(PublicReposListRenderer.root.children[0].props.className).toBe(
      "Error"
    );
  });
  it("should render loader after api response till answer comes", () => {
    // setup loading response of hook
    hookModule.useGithubLinkHeaderPaginatedFetch = mockHookDependency({
      loading: true,
      responseBody: undefined,
      fetchFailed: false,
    });
    const PublicReposListRenderer = TestRenderer.create(
      <PublicReposList {...mockStore} />
    );
    expect(PublicReposListRenderer.root.children[0].props.className).toBe(
      "ReposList--Loading"
    );

    // setup successful response of hook
    hookModule.useGithubLinkHeaderPaginatedFetch = mockHookDependency({
      loading: false,
      responseBody: [
        mockGithubPublicRepositoriesResponse(5),
        mockGithubPublicRepositoriesResponse(3),
        mockGithubPublicRepositoriesResponse(11),
      ],
      fetchFailed: false,
    });
    act(() => {
      PublicReposListRenderer.update(<PublicReposList {...mockStore} />);
    });
    expect(PublicReposListRenderer.root.children[0].props.className).toBe(
      "ReposList"
    );
  });
});
