import { mutationOptions } from '@tanstack/react-query';
import {
  createAttribute,
  createAttributeOption,
  updateAttribute,
  updateAttributeOption
} from './service';
import type { AttributeOptionPayload, AttributePayload } from './types';

export const createAttributeMutation = mutationOptions({
  mutationFn: (data: AttributePayload) => createAttribute(data)
});

export const updateAttributeMutation = mutationOptions({
  mutationFn: ({ id, data }: { id: string; data: AttributePayload }) => updateAttribute(id, data)
});

export const createOptionMutation = mutationOptions({
  mutationFn: ({ attributeId, data }: { attributeId: string; data: AttributeOptionPayload }) =>
    createAttributeOption(attributeId, data)
});

export const updateOptionMutation = mutationOptions({
  mutationFn: ({
    attributeId,
    optionId,
    data
  }: {
    attributeId: string;
    optionId: string;
    data: AttributeOptionPayload;
  }) => updateAttributeOption(attributeId, optionId, data)
});
