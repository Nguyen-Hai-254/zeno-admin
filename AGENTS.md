# Hướng dẫn cho tác nhân AI — Zeno Admin

Các hướng dẫn này bổ sung cho `../AGENTS.md`. Khi làm việc trong source này, hãy đọc cả hai cùng tài liệu sản phẩm liên quan trong `../docs/`.

## Ngôn ngữ và nguồn sự thật

- Mọi quy tắc, nghiệp vụ, cấu trúc, yêu cầu, quyết định, hướng dẫn và tài liệu bổ sung/cập nhật phải viết bằng tiếng Việt.
- Tên công nghệ, thư viện, file, biến, API, câu lệnh và mã nguồn có thể giữ nguyên dạng gốc; phần giải thích vẫn viết bằng tiếng Việt.
- Tài liệu nghiệp vụ dùng chung ở `../docs/`. Tài liệu này chỉ quy định cách phát triển giao diện quản trị.
- Chỉ mục **Đã xác nhận** mới là yêu cầu chính thức. Các mục **Cần làm rõ** trong tài liệu Zeno không được tự chuyển thành hành vi trong giao diện.

## Vai trò của source

`zeno-admin` là ứng dụng giao diện cho nhân viên quản trị/vận hành và dự kiến bao gồm POS. Các khu vực nghiệp vụ dự kiến có thể gồm sản phẩm, đơn hàng, tồn kho, cửa hàng/kho, thanh toán và bán tại quầy. Phạm vi vai trò, quyền truy cập và luồng chi tiết vẫn theo tài liệu sản phẩm; không coi các trang demo hiện có là tính năng đã được duyệt.

`zeno-api` (NestJS, Prisma, PostgreSQL) là backend dùng chung. Backend chịu trách nhiệm xác thực quyền và thực thi quy tắc về giá, đơn hàng, thanh toán, tồn kho, luân chuyển hàng và hoàn tất giao dịch. Giao diện có thể kiểm tra dữ liệu để phản hồi sớm, nhưng không được là nơi duy nhất áp dụng quy tắc.

## Công nghệ và cấu trúc hiện có

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4.
- Thành phần giao diện shadcn/ui trên Base UI; biểu đồ dùng Recharts.
- Dữ liệu và trạng thái truy vấn dùng TanStack React Query; bảng dùng TanStack Table; biểu mẫu dùng TanStack Form và Zod; trạng thái query string dùng `nuqs`.
- Bun là package manager của source này. Xem `package.json` để biết lệnh chính xác.
- Source hiện tổ chức trực tiếp dưới các thư mục gốc như `app/`, `components/`, `config/`, `features/`, `hooks/`, `lib/`, `styles/` và `types/` (không giả định có thư mục `src/`).
- Các thư mục `features/`, `app/` và component có thể còn mã mẫu. Kiểm tra cách triển khai hiện tại trước khi thêm hoặc thay thế một luồng.

## Quy ước giao diện và mã nguồn

- Ưu tiên Server Components; chỉ dùng `'use client'` khi cần state phía trình duyệt, hook hoặc tương tác phía client.
- Theo cấu trúc feature hiện có. Với tính năng dùng API, giữ tầng dữ liệu riêng theo mẫu của source: `api/types.ts` → `api/service.ts` → `api/queries.ts` nếu phù hợp.
- Component gọi service/query của feature, không đọc trực tiếp mock API. Chỉ dùng mock khi rõ ràng đang xây dựng bản mẫu; không để mock bị hiểu nhầm là dữ liệu thật.
- Dùng React Query cho truy vấn và mutation theo mẫu đã có: query key factory, invalidation sau mutation và trạng thái tải/lỗi/rỗng phù hợp. Dùng prefetch/hydration/Suspense khi tính năng hiện tại đang theo mẫu đó.
- Dùng `nuqs` cho trạng thái bộ lọc/phân trang cần phản ánh trên URL nếu phù hợp với pattern trong feature.
- Dùng `useAppForm` từ `lib/form` và các field dùng chung trong `components/forms/fields` cho biểu mẫu theo mẫu hiện có. Dùng Zod để kiểm tra dữ liệu ở giao diện; backend vẫn phải kiểm tra lại.
- Dùng `PageContainer` cho tiêu đề trang theo quy ước của source.
- Chỉ lấy icon qua `Icons` từ `components/icons`; không import trực tiếp từ `@tabler/icons-react` trong feature/component.
- Dùng `cn()` để ghép class. Không sửa trực tiếp primitive trong `components/ui/` nếu có thể mở rộng qua component bọc.
- Giữ định dạng hiện tại: dấu nháy đơn trong TypeScript/JSX, thụt lề 2 khoảng trắng, không dấu phẩy cuối theo cấu hình formatter của dự án.
- Không thêm thư viện hoặc mẫu kiến trúc mới nếu thư viện/pattern hiện có đã đáp ứng; nếu cần thay đổi lớn, nêu lý do và cập nhật tài liệu phù hợp.

## Kết nối backend và bảo mật

- Gọi API NestJS qua service/API client hiện có; không kết nối trình duyệt trực tiếp tới PostgreSQL/Prisma.
- Không để secret, connection string, khóa cổng thanh toán hoặc thông tin xác thực trong mã client hay biến `NEXT_PUBLIC_*`.
- Không xác nhận thanh toán từ thông tin redirect trình duyệt. Chỉ hiển thị trạng thái backend đã xác minh.
- Không tự gộp tồn kho tổng và tồn cửa hàng thành lượng có thể bán. Hiển thị theo địa điểm dựa trên dữ liệu và chính sách backend.
- Giao dịch tồn kho, trạng thái đơn và quyền nhân viên phải phản ánh kết quả API; không suy đoán thành công khi API lỗi hoặc phản hồi chưa rõ.
- Nếu chưa có API, hợp đồng dữ liệu, quyền hoặc quy tắc để hoàn tất một giao diện, ghi lại phụ thuộc đó và hỏi/đề xuất làm rõ trong tài liệu thay vì tự tạo nghiệp vụ.

## Các mẫu màn hình cần tính đến

- Giao diện nhân viên cần làm rõ đang thao tác ở cửa hàng/kho nào nếu API và phân quyền cung cấp ngữ cảnh đó.
- POS cần tối ưu thao tác nhanh, có trạng thái đang xử lý/thành công/thất bại rõ ràng và ngăn gửi trùng giao dịch.
- Màn hình quản lý đơn, tồn và thanh toán phải dùng trạng thái từ hợp đồng backend; không tự đặt thêm trạng thái nghiệp vụ.
- Thao tác có ảnh hưởng dữ liệu cần hiển thị xác nhận và lỗi có thể hiểu được; mức xác nhận cụ thể tuân theo chính sách đã duyệt.
- Hỗ trợ bàn phím, focus, nhãn biểu mẫu có ngữ nghĩa và độ tương phản phù hợp.

## Lệnh phát triển

Chạy lệnh từ thư mục `zeno-admin/`:

```bash
bun install
bun run dev
bun run typecheck
bun run lint
bun run build
```

Máy chủ phát triển mặc định dùng cổng `3001`. Các lệnh migration, sinh Prisma Client và thao tác database thuộc `zeno-api/`, không chạy trong source này.

## Quy trình khi thay đổi

1. Đọc yêu cầu đã xác nhận và luồng liên quan trong `../docs/`.
2. Tìm feature/component tương tự và kiểm tra dữ liệu hiện tại trước khi sửa.
3. Nếu yêu cầu phụ thuộc quy tắc chưa chốt, ghi nhận phụ thuộc và không tự quyết thay chủ sản phẩm.
4. Giữ hợp đồng API, kiểu dữ liệu và cách hiển thị trạng thái nhất quán với `zeno-api` và `zeno-client`.
5. Khi thay đổi nghiệp vụ hoặc kiến trúc, cập nhật tài liệu chung tương ứng bằng tiếng Việt.
6. Khi bàn giao, nêu phần đã làm, phần còn giả định/phụ thuộc và các lệnh kiểm tra đã chạy.

