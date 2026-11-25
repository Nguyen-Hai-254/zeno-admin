export type AttributeDataType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE' | 'SELECT' | 'MULTI_SELECT';

export type AttributeOption = {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
};

export type Attribute = {
  id: string;
  code: string;
  name: string;
  dataType: AttributeDataType;
  unit: string | null;
  isActive: boolean;
  options: AttributeOption[];
};

export type AttributesResponse = {
  items: Attribute[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type AttributePayload = Pick<Attribute, 'code' | 'name' | 'dataType' | 'isActive'> & {
  unit?: string;
};

export type AttributeOptionPayload = Pick<AttributeOption, 'value' | 'label' | 'sortOrder'>;
