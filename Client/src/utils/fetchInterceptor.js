const { fetch: originalFetch } = window;

window.fetch = async (resource, config = {}) => {
  // Initialize config headers
  config.headers = config.headers || {};

  // Fetch token from localStorage
  const token = localStorage.getItem("jwt_token");
  if (token) {
    if (config.headers instanceof Headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else if (Array.isArray(config.headers)) {
      config.headers.push(["Authorization", `Bearer ${token}`]);
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Ensure credentials are sent (for cookies if browsers/settings allow them)
  config.credentials = "include";

  const response = await originalFetch(resource, config);

  // Extract the URL to inspect
  const url = typeof resource === "string" ? resource : (resource && resource.url);

  if (url) {
    // Check if the request is login, signup, resetPassword, or updatePassword
    const isAuthRequest =
      url.includes("/api/v1/users/login") ||
      url.includes("/api/v1/users/signup") ||
      url.includes("/api/v1/users/resetPassword") ||
      url.includes("/api/v1/users/updatePassword");

    if (isAuthRequest && response.ok) {
      const clonedRes = response.clone();
      try {
        const data = await clonedRes.json();
        if (data && data.token) {
          localStorage.setItem("jwt_token", data.token);
        }
      } catch (err) {
        console.error("Failed to parse auth response JSON for token extraction:", err);
      }
    } else if (url.includes("/api/v1/users/logout")) {
      localStorage.removeItem("jwt_token");
    }
  }

  // If a request fails with 401 Unauthorized, clear the invalid token
  if (response.status === 401) {
    localStorage.removeItem("jwt_token");
  }

  return response;
};
