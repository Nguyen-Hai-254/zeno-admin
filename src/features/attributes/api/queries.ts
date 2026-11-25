import { queryOptions } from '@tanstack/react-query';
import { getAttributes } from './service';

export const attributeKeys = {
  all: ['attributes'] as const,
  list: (page: number, search: string) => [...attributeKeys.all, 'list', page, search] as const
};

export const attributesQueryOptions = (page: number, search: string) =>
  queryOptions({
    queryKey: attributeKeys.list(page, search),
    queryFn: () => getAttributes(page, search)
  });
