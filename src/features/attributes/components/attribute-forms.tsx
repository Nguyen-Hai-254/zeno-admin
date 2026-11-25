'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useAppForm } from '@/lib/form';
import {
  createAttributeMutation,
  createOptionMutation,
  updateAttributeMutation,
  updateOptionMutation
} from '../api/mutations';
import { attributeKeys } from '../api/queries';
import type { Attribute, AttributeDataType, AttributeOption } from '../api/types';

export const dataTypeOptions: { value: AttributeDataType; label: string }[] = [
  { value: 'TEXT', label: 'Văn bản' },
  { value: 'NUMBER', label: 'Số' },
  { value: 'BOOLEAN', label: 'Đúng / sai' },
  { value: 'DATE', label: 'Ngày' },
  { value: 'SELECT', label: 'Một lựa chọn' },
  { value: 'MULTI_SELECT', label: 'Nhiều lựa chọn' }
];

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Không thể hoàn tất thao tác.';
}

const attributeSchema = z.object({
  name: z.string().trim().min(1, 'Nhập tên thuộc tính.').max(80),
  code: z
    .string()
    .trim()
    .max(60)
    .regex(/^[A-Z][A-Z0-9_]*$/, 'Mã bắt đầu bằng chữ in hoa và chỉ gồm A-Z, 0-9, _.'),
  dataType: z.enum(['TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'SELECT', 'MULTI_SELECT']),
  unit: z.string().trim().max(30),
  isActive: z.boolean()
});

const optionSchema = z.object({
  value: z.string().trim().min(1, 'Nhập giá trị.').max(120),
  label: z.string().trim().min(1, 'Nhập nhãn hiển thị.').max(120),
  sortOrder: z.number().int().min(0)
});

export function AttributeForm({
  attribute,
  onClose
}: {
  attribute: Attribute | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const createMutation = useMutation(createAttributeMutation);
  const updateMutation = useMutation(updateAttributeMutation);
  const form = useAppForm({
    defaultValues: {
      name: attribute?.name ?? '',
      code: attribute?.code ?? '',
      dataType: attribute?.dataType ?? ('TEXT' as AttributeDataType),
      unit: attribute?.unit ?? '',
      isActive: attribute?.isActive ?? true
    },
    validators: { onSubmit: attributeSchema },
    onSubmit: async ({ value }) => {
      try {
        const data = {
          ...value,
          name: value.name.trim(),
          code: value.code.trim(),
          unit: value.unit.trim()
        };
        if (attribute) await updateMutation.mutateAsync({ id: attribute.id, data });
        else await createMutation.mutateAsync(data);
        await queryClient.invalidateQueries({ queryKey: attributeKeys.all });
        toast.success(attribute ? 'Đã cập nhật thuộc tính.' : 'Đã tạo thuộc tính.');
        onClose();
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  });
  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{attribute ? 'Sửa thuộc tính' : 'Thêm thuộc tính'}</DialogTitle>
          <DialogDescription>
            Thông tin định nghĩa thuộc tính dùng chung cho sản phẩm.
          </DialogDescription>
        </DialogHeader>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.AppField
            name='name'
            children={(field) => <field.TextField label='Tên thuộc tính' required maxLength={80} />}
          />
          <form.AppField
            name='code'
            children={(field) => (
              <field.TextField label='Mã thuộc tính' required maxLength={60} placeholder='RAM' />
            )}
          />
          <form.AppField
            name='dataType'
            children={(field) => (
              <field.SelectField label='Kiểu dữ liệu' required options={dataTypeOptions} />
            )}
          />
          <form.AppField
            name='unit'
            children={(field) => (
              <field.TextField label='Đơn vị' maxLength={30} placeholder='Ví dụ: GB, inch' />
            )}
          />
          <form.AppField
            name='isActive'
            children={(field) => <field.SwitchField label='Đang sử dụng' />}
          />
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={pending}>
              Hủy
            </Button>
            <Button type='submit' disabled={pending}>
              {pending ? 'Đang lưu…' : 'Lưu thuộc tính'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function OptionForm({
  attribute,
  option,
  onClose
}: {
  attribute: Attribute;
  option: AttributeOption | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const createMutation = useMutation(createOptionMutation);
  const updateMutation = useMutation(updateOptionMutation);
  const form = useAppForm({
    defaultValues: {
      value: option?.value ?? '',
      label: option?.label ?? '',
      sortOrder: option?.sortOrder ?? 0
    },
    validators: { onSubmit: optionSchema },
    onSubmit: async ({ value }) => {
      try {
        const data = { ...value, value: value.value.trim(), label: value.label.trim() };
        if (option)
          await updateMutation.mutateAsync({
            attributeId: attribute.id,
            optionId: option.id,
            data
          });
        else await createMutation.mutateAsync({ attributeId: attribute.id, data });
        await queryClient.invalidateQueries({ queryKey: attributeKeys.all });
        toast.success(option ? 'Đã cập nhật lựa chọn.' : 'Đã thêm lựa chọn.');
        onClose();
      } catch (error) {
        toast.error(errorMessage(error));
      }
    }
  });
  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{option ? 'Sửa lựa chọn' : 'Thêm lựa chọn'}</DialogTitle>
          <DialogDescription>Giá trị cho thuộc tính {attribute.name}.</DialogDescription>
        </DialogHeader>
        <form
          className='space-y-4'
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.AppField
            name='value'
            children={(field) => <field.TextField label='Giá trị' required maxLength={120} />}
          />
          <form.AppField
            name='label'
            children={(field) => <field.TextField label='Nhãn hiển thị' required maxLength={120} />}
          />
          <form.AppField
            name='sortOrder'
            children={(field) => (
              <field.TextField label='Thứ tự' required type='number' min={0} step={1} />
            )}
          />
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose} disabled={pending}>
              Hủy
            </Button>
            <Button type='submit' disabled={pending}>
              {pending ? 'Đang lưu…' : 'Lưu lựa chọn'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
