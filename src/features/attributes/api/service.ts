import { apiClient } from '@/lib/api-client';
import type {
  Attribute,
  AttributeOption,
  AttributeOptionPayload,
  AttributePayload,
  AttributesResponse
} from './types';

export function getAttributes(page: number, search: string) {
  const params = new URLSearchParams({ page: String(page), limit: '10' });
  if (search) params.set('search', search);
  return apiClient<AttributesResponse>(`/attributes?${params}`);
}

export function createAttribute(data: AttributePayload) {
  return apiClient<Attribute>('/attributes', { method: 'POST', body: JSON.stringify(data) });
}

export function updateAttribute(id: string, data: AttributePayload) {
  return apiClient<Attribute>(`/attributes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export function createAttributeOption(attributeId: string, data: AttributeOptionPayload) {
  return apiClient<AttributeOption>(`/attributes/${encodeURIComponent(attributeId)}/options`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export function updateAttributeOption(
  attributeId: string,
  optionId: string,
  data: AttributeOptionPayload
) {
  return apiClient<AttributeOption>(
    `/attributes/${encodeURIComponent(attributeId)}/options/${encodeURIComponent(optionId)}`,
    { method: 'PUT', body: JSON.stringify(data) }
  );
}
