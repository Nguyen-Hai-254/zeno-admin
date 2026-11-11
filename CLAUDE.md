# Hướng dẫn làm việc với Claude trong Zeno Admin

`zeno-admin` là giao diện Next.js dành cho nhân viên vận hành hệ thống thương mại điện tử Zeno. Đây là source được phát triển từ mẫu dashboard; các màn hình demo còn trong mã nguồn không mặc nhiên là chức năng nghiệp vụ đã được duyệt.

## Tài liệu cần đọc

- [AGENTS.md](./AGENTS.md) — quy ước kỹ thuật và nghiệp vụ riêng của source này.
- [Hướng dẫn chung Zeno](../AGENTS.md) — bối cảnh sản phẩm và quy tắc áp dụng cho cả ba source.
- [Yêu cầu sản phẩm](../docs/product/requirements.md) và [quy tắc nghiệp vụ](../docs/product/business-rules.md).
- [Luồng nghiệp vụ](../docs/product/workflows.md) và [các câu hỏi cần làm rõ](../docs/product/open-questions.md).
- [Tổng quan kiến trúc](../docs/architecture/overview.md) và tài liệu liên quan trong `docs/`.
- [Biểu mẫu](./docs/forms.md), [giao diện/chủ đề](./docs/themes.md), [triển khai](./docs/deployment.md) khi làm các phần tương ứng.

## Nguyên tắc quan trọng

- Nội dung quy tắc, nghiệp vụ, cấu trúc và tài liệu mới phải viết bằng tiếng Việt theo `../AGENTS.md`. Tên công nghệ, tên mã, API và câu lệnh được giữ nguyên khi cần.
- Chỉ coi mục được đánh dấu **Đã xác nhận** trong tài liệu Zeno là yêu cầu chính thức. Không tự đặt chính sách tồn kho, giá, giảm giá, thanh toán, đổi trả, bảo hành, phân quyền hoặc giao nhận.
- `zeno-admin` trình bày và thu thập thao tác của nhân viên; `zeno-api` mới là nơi xác thực quyền và áp dụng quy tắc nghiệp vụ có thẩm quyền.
- Không dùng dữ liệu giả/demo như dữ liệu vận hành thật. Khi tích hợp tính năng, dùng API backend theo hợp đồng hiện có; nếu chưa có API hoặc quy tắc cần thiết, ghi rõ phần còn thiếu thay vì tự mô phỏng hành vi đã chốt.

