'use client';

import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { attributesQueryOptions } from '../api/queries';
import type { Attribute, AttributeOption } from '../api/types';
import { AttributeForm, OptionForm, dataTypeOptions, errorMessage } from './attribute-forms';

export function AttributeManagementPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null | undefined>();
  const [editingOption, setEditingOption] = useState<AttributeOption | null | undefined>();
  const { data, isPending, isError, error, isFetching, refetch } = useQuery(
    attributesQueryOptions(page, search)
  );
  const selected = data?.items.find((item) => item.id === selectedId) ?? data?.items[0];

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
    setSelectedId(null);
  }

  return (
    <PageContainer>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Quản lý thuộc tính</h1>
          <p className='text-muted-foreground'>
            Định nghĩa thông số và lựa chọn dùng chung cho sản phẩm.
          </p>
        </div>
        <Button onClick={() => setEditingAttribute(null)}>Thêm thuộc tính</Button>
      </div>
      <Tabs defaultValue='definitions' className='mt-6'>
        <TabsList>
          <TabsTrigger value='definitions'>Định nghĩa thuộc tính</TabsTrigger>
          <TabsTrigger value='options'>Lựa chọn thuộc tính</TabsTrigger>
        </TabsList>
        <TabsContent value='definitions' className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Định nghĩa thuộc tính</CardTitle>
              <CardDescription>
                {data ? `${data.pagination.total} thuộc tính` : 'Danh sách thuộc tính'}
              </CardDescription>
              <form onSubmit={submitSearch} className='flex max-w-md gap-2 pt-2'>
                <Input
                  aria-label='Tìm thuộc tính'
                  placeholder='Tìm theo tên hoặc mã'
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  maxLength={100}
                />
                <Button type='submit' variant='outline'>
                  Tìm
                </Button>
              </form>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <p role='status'>Đang tải thuộc tính…</p>
              ) : isError ? (
                <div role='alert' className='space-y-2 text-destructive'>
                  <p>{errorMessage(error)}</p>
                  <Button variant='outline' onClick={() => void refetch()}>
                    Thử lại
                  </Button>
                </div>
              ) : !data?.items.length ? (
                <p className='text-muted-foreground'>Không tìm thấy thuộc tính.</p>
              ) : (
                <>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm'>
                      <thead>
                        <tr className='border-b text-left'>
                          <th className='p-3'>Mã</th>
                          <th className='p-3'>Tên thuộc tính</th>
                          <th className='p-3'>Kiểu dữ liệu</th>
                          <th className='p-3'>Đơn vị</th>
                          <th className='p-3'>Trạng thái</th>
                          <th className='p-3'>Lựa chọn</th>
                          <th className='p-3'>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.items.map((item) => (
                          <tr key={item.id} className='border-b last:border-0'>
                            <td className='p-3 font-mono'>{item.code}</td>
                            <td className='p-3 font-medium'>{item.name}</td>
                            <td className='p-3'>
                              {dataTypeOptions.find((type) => type.value === item.dataType)
                                ?.label ?? item.dataType}
                            </td>
                            <td className='p-3'>{item.unit || '—'}</td>
                            <td className='p-3'>
                              {item.isActive ? 'Đang sử dụng' : 'Ngừng sử dụng'}
                            </td>
                            <td className='p-3'>{item.options.length}</td>
                            <td className='p-3'>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setEditingAttribute(item)}
                              >
                                Sửa
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className='flex items-center justify-between gap-3 pt-4 text-sm'>
                    <span>
                      Trang {data.pagination.page}/{data.pagination.totalPages}
                      {isFetching ? ' · Đang cập nhật…' : ''}
                    </span>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={page <= 1 || isFetching}
                        onClick={() => {
                          setPage(page - 1);
                          setSelectedId(null);
                        }}
                      >
                        Trước
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled={page >= data.pagination.totalPages || isFetching}
                        onClick={() => {
                          setPage(page + 1);
                          setSelectedId(null);
                        }}
                      >
                        Sau
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='options' className='mt-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between gap-4'>
              <div>
                <CardTitle>Lựa chọn thuộc tính</CardTitle>
                <CardDescription>
                  Chọn thuộc tính trong trang hiện tại để quản lý giá trị.
                </CardDescription>
              </div>
              <Button
                onClick={() => setEditingOption(null)}
                disabled={!selected || !['SELECT', 'MULTI_SELECT'].includes(selected.dataType)}
              >
                Thêm lựa chọn
              </Button>
            </CardHeader>
            <CardContent className='space-y-5'>
              <form onSubmit={submitSearch} className='flex max-w-md gap-2'>
                <Input
                  aria-label='Tìm thuộc tính cho lựa chọn'
                  placeholder='Tìm theo tên hoặc mã'
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  maxLength={100}
                />
                <Button type='submit' variant='outline'>
                  Tìm
                </Button>
              </form>
              {isPending ? (
                <p role='status'>Đang tải thuộc tính…</p>
              ) : isError ? (
                <p role='alert' className='text-destructive'>
                  {errorMessage(error)}
                </p>
              ) : !selected ? (
                <p className='text-muted-foreground'>Chưa có thuộc tính trong trang này.</p>
              ) : (
                <>
                  <label className='grid max-w-sm gap-2 text-sm font-medium'>
                    Thuộc tính
                    <select
                      className='h-10 rounded-md border bg-background px-3'
                      value={selected.id}
                      onChange={(event) => setSelectedId(event.target.value)}
                    >
                      {data?.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.code})
                        </option>
                      ))}
                    </select>
                  </label>
                  {!['SELECT', 'MULTI_SELECT'].includes(selected.dataType) ? (
                    <p className='text-muted-foreground'>
                      Thuộc tính này không dùng danh sách lựa chọn.
                    </p>
                  ) : !selected.options.length ? (
                    <p className='text-muted-foreground'>Chưa có lựa chọn nào.</p>
                  ) : (
                    <div className='overflow-x-auto'>
                      <table className='w-full text-sm'>
                        <thead>
                          <tr className='border-b text-left'>
                            <th className='p-3'>Giá trị</th>
                            <th className='p-3'>Nhãn hiển thị</th>
                            <th className='p-3'>Thứ tự</th>
                            <th className='p-3'>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.options.map((option) => (
                            <tr key={option.id} className='border-b last:border-0'>
                              <td className='p-3 font-mono'>{option.value}</td>
                              <td className='p-3'>{option.label}</td>
                              <td className='p-3'>{option.sortOrder}</td>
                              <td className='p-3'>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => setEditingOption(option)}
                                >
                                  Sửa
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
              {data && data.pagination.totalPages > 1 && (
                <div className='flex items-center justify-between gap-3 pt-2 text-sm'>
                  <span>
                    Trang {data.pagination.page}/{data.pagination.totalPages}
                  </span>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page <= 1 || isFetching}
                      onClick={() => {
                        setPage(page - 1);
                        setSelectedId(null);
                      }}
                    >
                      Trước
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      disabled={page >= data.pagination.totalPages || isFetching}
                      onClick={() => {
                        setPage(page + 1);
                        setSelectedId(null);
                      }}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {editingAttribute !== undefined && (
        <AttributeForm
          key={editingAttribute?.id ?? 'new'}
          attribute={editingAttribute}
          onClose={() => setEditingAttribute(undefined)}
        />
      )}
      {editingOption !== undefined && selected && (
        <OptionForm
          key={editingOption?.id ?? 'new'}
          attribute={selected}
          option={editingOption}
          onClose={() => setEditingOption(undefined)}
        />
      )}
    </PageContainer>
  );
}
