import {
  CreateSituationInput,
  Situation,
  SituationListResponse,
} from '../types/situation';

export const API_URL = 'http://localhost:12345';

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchSituation(id: number): Promise<Situation> {
  return requestJson<Situation>(`${API_URL}/situations/${id}`);
}

export async function fetchSituations(
  search = '',
  page = 1,
  pageSize = 50,
): Promise<SituationListResponse> {
  const params = new URLSearchParams({
    search,
    page: String(page),
    page_size: String(pageSize),
  });

  return requestJson<SituationListResponse>(
    `${API_URL}/situations?${params.toString()}`,
  );
}

export async function createSituation(
  payload: CreateSituationInput,
): Promise<Situation> {
  return requestJson<Situation>(`${API_URL}/situations`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateFavorite(
  id: number,
  isFavorite: boolean,
): Promise<Situation> {
  return requestJson<Situation>(`${API_URL}/situations/${id}/favorite`, {
    method: 'PATCH',
    body: JSON.stringify({ is_favorite: isFavorite }),
  });
}
