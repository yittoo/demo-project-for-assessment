import { mockJsonObject, mockErrorMessage } from "./mockData";

// function to mock default browser fetch
const mockFetch = (url, options) =>
  new Promise((resolve, reject) => {
    if (typeof url !== "string") reject(mockErrorMessage);
    if (typeof options === "undefined" || typeof options === "object") {
      const jsonResolver = () =>
        new Promise((jsonResolve, _) => {
          jsonResolve(mockJsonObject);
        });
      resolve({ json: jsonResolver });
    } else {
      reject(mockErrorMessage);
    }
  });

export default mockFetch;
