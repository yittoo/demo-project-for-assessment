/**
 * All the I/O operations for the project
 * with Github is written here
 * provides re-useable foundation for pagination across
 * similar structure that allows paginations with
 * `Link` header
 */

import { useState, useEffect } from "react";
import parseLinkHeader from "parse-link-header";

import { jsonFetchBase } from "../utils/fetch";

export interface IuseGithubLinkHeaderPaginatedFetch<T> {
  loading: boolean;
  next: Function;
  prev: Function;
  nextUrl: string | undefined;
  prevUrl: string | undefined;
  responseBody?: T[];
  fetchFailed: boolean;
}

enum handleResponseOptions {
  clearPrevious,
  appendAtEnd,
  appendAtBeginning,
}

// original library does not accept null whereas the res.headers.get(string) could return null thus an escape is written
// would require improvement to extend UX but it's sufficient for this scenario
const parseLinkHeaderWithNullHandling = (
  LinkHeader: string | null
): parseLinkHeader.Links | null => {
  if (typeof LinkHeader === "string") return parseLinkHeader(LinkHeader);
  else return null;
};

export const useGithubLinkHeaderPaginatedFetch = <T>(
  url: string,
  options?: any
): IuseGithubLinkHeaderPaginatedFetch<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [nextUrl, setNextUrl] = useState<string | undefined>(undefined);
  const [prevUrl, setPrevUrl] = useState<string | undefined>(undefined);
  const [responseBody, setResponseBody] = useState<T[] | undefined>(undefined);
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);

  useEffect(() => {
    fetchData(url, options).then((res) =>
      handleResponse(res, handleResponseOptions.clearPrevious)
    );
    // remove dependency warning as we want to run this on mount only
    // eslint-disable-next-line
  }, []);

  async function fetchData(
    url: string,
    options?: any
  ): Promise<Response | null> {
    if (!options?.shouldAvoidSettingLoading) {
      setLoading(true);
    }
    let res = null;
    try {
      res = await jsonFetchBase(url, options);
    } catch (err) {
      setFetchFailed(true);
      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
    return res;
  }

  async function handleResponse(
    res: Response | null,
    handleType: handleResponseOptions
  ) {
    if (res?.ok) {
      setNextAndPrev(res);
      const body = await res.json();
      let oldBody: T[] = [];
      // if there is previously fetched data
      if (Array.isArray(responseBody)) oldBody = [...responseBody];

      switch (handleType) {
        case handleResponseOptions.clearPrevious:
          setResponseBody(body);
          break;
        case handleResponseOptions.appendAtBeginning:
          setResponseBody([...body, ...oldBody]);
          break;
        case handleResponseOptions.appendAtEnd:
          setResponseBody([...oldBody, ...body]);
          break;
        default:
          setResponseBody(body);
          break;
      }
    } else {
      setFetchFailed(true);
    }
  }

  async function setNextAndPrev(res: Response) {
    const LinkHeader = res.headers.get("Link");
    const linkHeaderParsed = parseLinkHeaderWithNullHandling(LinkHeader);
    castPaginationLinksToMethods(linkHeaderParsed);
  }

  const castPaginationLinksToMethods = (
    linkHeaderParsed: parseLinkHeader.Links | null
  ) => {
    if (linkHeaderParsed) {
      if (linkHeaderParsed.next?.url) setNextUrl(linkHeaderParsed.next.url);
      if (linkHeaderParsed.prev?.url) setPrevUrl(linkHeaderParsed.prev.url);
    }
  };

  const next = (shouldClearPrevious?: boolean) => {
    if (typeof nextUrl === "string") {
      fetchData(nextUrl, {
        shouldAvoidSettingLoading: !shouldClearPrevious,
      }).then((res) => {
        const handleResponseOptionToPass = shouldClearPrevious
          ? handleResponseOptions.clearPrevious
          : handleResponseOptions.appendAtEnd;
        handleResponse(res, handleResponseOptionToPass);
      });
    }
  };

  // unused for our project but might aswell build it
  const prev = (shouldClearPrevious?: boolean) => {
    if (typeof prevUrl === "string") {
      fetchData(prevUrl, {
        shouldAvoidSettingLoading: !shouldClearPrevious,
      }).then((res) => {
        const handleResponseOptionToPass = shouldClearPrevious
          ? handleResponseOptions.clearPrevious
          : handleResponseOptions.appendAtBeginning;
        handleResponse(res, handleResponseOptionToPass);
      });
    }
  };

  return {
    next,
    prev,
    loading,
    responseBody,
    fetchFailed,
    nextUrl,
    prevUrl,
  };
};
