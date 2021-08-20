export function jsonFetchBase(url: string, options?: any): Promise<Response> {
  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (options?.headers) {
    headers = { ...headers, ...options.headers };
  }
  const finalOptions = {
    method: "GET",
    ...options,
    headers,
  };
  return fetch(url, finalOptions);
}
