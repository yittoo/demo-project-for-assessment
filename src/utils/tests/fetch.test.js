import { jsonFetchBase } from "../fetch";
import mockFetch from "./mockFetch";
import { mockFetchUrl } from "./mockData";

describe("jsonFetchBase", () => {
  beforeAll(() => {
    // eslint-disable-next-line
    fetch = mockFetch;
  });
  it("resolves to expected result", async () => {
    await expect(jsonFetchBase(mockFetchUrl)).resolves.toBeInstanceOf(Object);
  });
  it("should be called with POST method when option is provided", async () => {
    // eslint-disable-next-line
    fetch = jest.fn();
    const expectedHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const options = { method: "POST" };
    const expectedOptions = {
      headers: expectedHeaders,
      method: "POST",
    };
    await jsonFetchBase(mockFetchUrl, options);
    expect(fetch).toHaveBeenCalledWith(mockFetchUrl, expectedOptions);
  });
  it("should be called with default parameters when options are provided", async () => {
    // eslint-disable-next-line
    fetch = jest.fn();
    const expectedHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const expectedOptions = {
      headers: expectedHeaders,
      method: "GET",
    };
    await jsonFetchBase(mockFetchUrl);
    expect(fetch).toHaveBeenCalledWith(mockFetchUrl, expectedOptions);
  });
  it("should be called with custom headers when option is provided", async () => {
    // eslint-disable-next-line
    fetch = jest.fn();
    const customHeader = { custom: "header" };
    const expectedHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customHeader,
    };
    const options = { headers: customHeader };
    const expectedOptions = {
      headers: expectedHeaders,
      method: "GET",
    };
    await jsonFetchBase(mockFetchUrl, options);
    expect(fetch).toHaveBeenCalledWith(mockFetchUrl, expectedOptions);
  });
});
