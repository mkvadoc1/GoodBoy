export const API_BASE_URL =
  "https://frontend-assignment-api.goodrequest.dev/api/v1";

export type Shelter = {
  id: number;
  name: string;
};

export type SheltersResponse = {
  shelters: Shelter[];
};

export type SheltersResultsResponse = {
  contributors: number;
  contribution: number | null;
};

export type ContributorPayload = {
  firstName?: string;
  lastName: string;
  email: string;
  phone?: string | null;
};

export type ContributePayload = {
  contributors: ContributorPayload[];
  shelterID?: number | null;
  value: number;
};

export type ContributeResponse = {
  messages: Array<{ message: string; type: "ERROR" | "WARNING" | "INFO" | "SUCCESS" }>;
};

export type ApiError<T = unknown> = Error & {
  data?: T;
  status?: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data: T | null = null;
  if (text.trim().length > 0) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (data as ContributeResponse | null)?.messages?.[0]?.message ??
      `Request failed: ${response.status}`;
    const error: ApiError<T> = new Error(message);
    error.data = data ?? undefined;
    error.status = response.status;
    throw error;
  }

  return (data ?? ({} as T)) as T;
}

export async function getShelters(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return fetchJson<SheltersResponse>(`${API_BASE_URL}/shelters/${params}`);
}

export async function getSheltersResults(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return fetchJson<SheltersResultsResponse>(
    `${API_BASE_URL}/shelters/results${params}`
  );
}

export async function contribute(payload: ContributePayload) {
  return postJson<ContributeResponse>(
    `${API_BASE_URL}/shelters/contribute`,
    payload
  );
}
