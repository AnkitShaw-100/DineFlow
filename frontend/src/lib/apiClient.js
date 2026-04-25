const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export async function apiFetch(path, { token, method, body, headers } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: method ?? (body ? "POST" : "GET"),
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      payload?.error?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, { status: res.status, payload });
  }

  return payload;
}

