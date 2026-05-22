# Saigon FC Skill Hub

Hệ thống xếp hạng & quản lý kỹ năng học viên bóng đá cho **Saigon FC**.

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- React Router v6
- Recharts (radar chart)
- lucide-react (icon)
- Dữ liệu in-memory qua React Context (mock data có sẵn)

## Cài đặt

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Cấu trúc trang

| Route                  | Mô tả                                          |
| ---------------------- | ---------------------------------------------- |
| `/`                    | Football Skill Leaderboard + filter kỹ năng    |
| `/students`            | Danh sách học viên (lưới)                      |
| `/students/:studentId` | Hồ sơ học viên + radar chart vs chuẩn CLB      |
| `/admin`               | Quản trị CRUD (yêu cầu xác thực số điện thoại) |

### Truy cập trang admin

Trang admin yêu cầu nhập số điện thoại trong danh sách cho phép (mock):

- `0901234567`
- `0987654321`
- `0123456789`

Phiên xác thực được lưu tạm trong `sessionStorage`.

## Hệ thống đánh giá

- **Xuất sắc** ≥ 90% so với chuẩn CLB
- **Tốt** ≥ 75%
- **Đạt yêu cầu** ≥ 60%
- **Cần cải thiện** < 60%

Bài test có `higher_is_better=false` (ví dụ tốc độ, dẫn bóng tính bằng
giây) sẽ tự động quy đổi: `scorePercent = standard / raw * 100`.

## Thay logo

Thay file `public/saigon-fc-logo.png` bằng logo thật.

## Kết nối Supabase / backend thật

Toàn bộ data layer được tập trung tại `src/data/DataProvider.tsx`. Các
hook (`useStudents`, `useSkillTests`, `useClubStandards`,
`useTestResults`, `useRankings`) gọi qua provider này. Khi cần kết nối
Supabase / API thật, chỉ cần thay phần state + CRUD trong
`DataProvider` mà không phải sửa UI.
