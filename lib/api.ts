const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

// Debug logging to check environment variable loading
console.log("[v0] Environment check:");
console.log(
  "[v0] process.env.NEXT_PUBLIC_API_BASE_URL:",
  process.env.NEXT_PUBLIC_API_BASE_URL
);
console.log("[v0] Final API_BASE_URL:", API_BASE_URL);

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  console.log(
    "[v0] Token from localStorage:",
    token ? `${token.substring(0, 20)}...` : "null"
  );

  // Ensure headers are a plain object and use lowercase `authorization` key
  const extraHeaders = (options.headers || {}) as Record<string, string>;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  let fullUrl: string;
  if (url.startsWith("http")) {
    fullUrl = url;
  } else {
    // Force the correct base URL if environment variable isn't working
    const baseUrl = API_BASE_URL.includes("api-ngin.oudom.dev")
      ? API_BASE_URL
      : "https://api.api-ngin.oudom.dev/api";
    fullUrl = `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
  }

  console.log("[v0] Making API request to:", fullUrl);
  console.log("[v0] Request headers:", headers);
  console.log("[v0] Authorization header:", headers.authorization || "Not set");

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  console.log("[v0] Response status:", response.status);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchUsers = () => apiRequest("/admin/users");
