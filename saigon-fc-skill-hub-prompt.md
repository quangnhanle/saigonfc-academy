# Saigon FC Skill Hub - React Project Prompt

## Vai trò

Bạn là **senior front-end developer** kiêm **UI/UX designer**. Hãy xây dựng một website quản lý và xếp hạng kỹ năng học viên bóng đá cho **Saigon FC** với giao diện hiện đại, chuyên nghiệp, responsive.

Website cần được triển khai như một project React thực tế, không chỉ mô tả ý tưởng. Hãy tạo đầy đủ code, cấu trúc thư mục, component, hook, giao diện responsive và hướng dẫn chạy project.

---

# 1. Tech Stack Bắt Buộc

Sử dụng:

- `React`
- `Vite`
- `TypeScript`
- `Tailwind CSS`
- `React Router`
- `Recharts` cho radar chart
- `lucide-react` cho icon
- Component-based architecture
- Responsive design cho desktop và mobile

Ưu tiên tạo project bằng **Vite React TypeScript**.

```bash
npm create vite@latest saigon-fc-skill-hub -- --template react-ts
cd saigon-fc-skill-hub
npm install
npm install react-router-dom recharts lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

# 2. Mục Tiêu Sản Phẩm

Xây dựng website quản lý, đánh giá và xếp hạng kỹ năng học viên bóng đá cho **Saigon FC**.

Website cần tạo cảm giác:

- Chuyên nghiệp
- Cạnh tranh
- Có động lực luyện tập
- Giống hệ thống đào tạo bóng đá hiện đại
- Kết hợp phong cách:
  - `football academy`
  - `esports`
  - `football leaderboard`
  - `modern sports UI`

---

# 3. Branding Và Phong Cách Thiết Kế

## 3.1 Nhận diện thương hiệu

- Sử dụng logo Saigon FC làm nhận diện thương hiệu chính.
- Nếu chưa có logo thật, tạo placeholder `Saigon FC Logo`.
- Thiết kế code sao cho có thể thay logo dễ dàng bằng file:

```txt
public/saigon-fc-logo.png
```

## 3.2 Màu sắc chủ đạo

Tông màu chính:

- Trắng
- Đen
- Vàng theo logo Saigon FC

Gợi ý design token:

```ts
const theme = {
  colors: {
    background: "#F8F8F5",
    black: "#0B0B0D",
    yellow: "#F6C945",
    yellowGlow: "rgba(246, 201, 69, 0.35)",
    card: "#FFFFFF",
    muted: "#737373",
    border: "#E7E2D0"
  }
};
```

## 3.3 UI style

Thiết kế cần có:

- Giao diện hiện đại, tối giản, chuyên nghiệp
- Font mạnh mẽ, đậm chất thể thao
- Card bo góc lớn
- Shadow nhẹ
- Hover animation
- Glow vàng nhẹ
- Badge màu đẹp cho từng level đánh giá
- Bảng xếp hạng dễ đọc
- Responsive tốt trên mobile và desktop

---

# 4. Cấu Trúc Website

Website gồm 3 trang chính:

1. `HomePage` - Football Skill Leaderboard
2. `StudentProfilePage` - Hồ sơ học viên
3. `AdminPage` - Quản trị dữ liệu

Sử dụng `React Router` để routing.

Routes cần có:

```tsx
/
/students/:studentId
/admin
```

Bảo mật đơn giản: Muốn vào route /admin thì nhập số điện thoại để vào page

---

# 5. Trang 1: Trang Chủ - Football Skill Leaderboard

## 5.1 Mục tiêu

Hiển thị bảng xếp hạng kỹ năng học viên theo tiêu chuẩn đánh giá của Saigon FC.

## 5.2 Nội dung đầu trang

Hiển thị section:

```txt
Tiêu chuẩn đánh giá Saigon FC
```

Section này cần mô tả:

- Điểm chuẩn từng bài test
- Tất cả học viên được đánh giá dựa trên hệ thống tiêu chuẩn CLB
- Hệ thống tự động phân loại học viên dựa trên kết quả so với tiêu chuẩn

## 5.3 Danh sách kỹ năng

Bao gồm 6 kỹ năng:

- Dẫn bóng
- Chuyền bóng
- Sút bóng
- Tốc độ
- Sức bền
- Tư duy chơi bóng

## 5.4 Bảng xếp hạng

Bảng gồm các cột:

- `Hạng`
- `Tên học viên`
- `Kỹ năng`
- `Kết quả`
- `Chênh lệch với tiêu chuẩn CLB`
- `Xếp hạng đánh giá`

## 5.5 Tính năng

Cần có:

- Filter theo từng kỹ năng
- Filter mặc định là `Tất cả kỹ năng`
- Bảng tự cập nhật khi chọn filter
- Click vào học viên để đi đến trang hồ sơ học viên
- Badge màu theo từng level
- Hover animation trên từng row
- Responsive: trên mobile chuyển bảng thành card list nếu cần

## 5.6 Hệ thống phân loại tự động

Tạo hàm phân loại:

```ts
function getRating(scorePercent: number): SkillRating {
  if (scorePercent >= 90) return "Xuất sắc";
  if (scorePercent >= 75) return "Tốt";
  if (scorePercent >= 60) return "Đạt yêu cầu";
  return "Cần cải thiện";
}
```

Các mức đánh giá:

- `Xuất sắc`
- `Tốt`
- `Đạt yêu cầu`
- `Cần cải thiện`

---

# 6. Trang 2: Trang Hồ Sơ Học Viên

## 6.1 Mục tiêu

Hiển thị thông tin chi tiết và đánh giá kỹ năng của từng học viên.

## 6.2 Thông tin học viên

Hiển thị:

- Ảnh đại diện
- Họ tên
- Năm sinh
- Vị trí thi đấu
- Chân thuận

## 6.3 Chân thuận

Dùng icon bàn chân trái / phải hoặc icon thể thao phù hợp từ `lucide-react`.

Các lựa chọn:

- `Chân trái`
- `Chân phải`
- `Hai chân`

Mapping dữ liệu:

```ts
type PreferredFoot = "left" | "right" | "both";
```

Hiển thị:

```txt
left  -> Chân trái
right -> Chân phải
both  -> Hai chân
```

## 6.4 Hiển thị đánh giá kỹ năng

Hiển thị:

- Điểm từng kỹ năng
- Radar chart đa giác tổng hợp 6 kỹ năng
- Radar chart so sánh trực tiếp với tiêu chuẩn của Saigon FC
- Nếu học viên càng gần tiêu chuẩn thì vùng radar càng lớn

## 6.5 Radar chart

Dùng `Recharts`.

Chart cần so sánh 2 vùng dữ liệu:

- `Điểm học viên`
- `Tiêu chuẩn Saigon FC`

Data shape gợi ý:

```ts
type RadarSkillData = {
  skill: string;
  studentScore: number;
  clubStandard: number;
};
```

Giao diện radar chart:

- Nền card tối hoặc trắng tùy layout
- Đường tiêu chuẩn CLB màu vàng
- Vùng học viên màu đen hoặc vàng trong suốt
- Tooltip rõ ràng
- Responsive container

## 6.6 Yêu cầu thiết kế trang hồ sơ

- Card profile đẹp
- Radar chart nổi bật
- Layout hiện đại theo kiểu game football profile
- Có section `Tổng quan kỹ năng`
- Có section `So sánh với tiêu chuẩn CLB`
- Có nút quay lại leaderboard

---

# 7. Trang 3: Trang Admin

## 7.1 Mục tiêu

Admin có thể quản lý học viên, bài test, tiêu chuẩn CLB và kết quả xếp hạng.

## 7.2 Chức năng bắt buộc

Admin có thể:

- Thêm học viên
- Chỉnh sửa học viên
- Xóa học viên
- Cập nhật kết quả bài test
- Chỉnh sửa tiêu chuẩn đánh giá của CLB
- Quản lý bảng xếp hạng tự động

## 7.3 UI Admin

Chia thành các tab:

1. `Học viên`
2. `Bài test kỹ năng`
3. `Tiêu chuẩn CLB`
4. `Kết quả đánh giá`

## 7.4 Form học viên

Fields:

- `full_name`
- `birth_year`
- `position`
- `preferred_foot`
- `avatar_url`

## 7.5 Form cập nhật kết quả test

Fields:

- `student_id`
- `skill_test_id`
- `raw_result`
- `score`
- `note`

Khi lưu kết quả, hệ thống tự tính:

- Chênh lệch với tiêu chuẩn CLB
- Phần trăm đạt chuẩn
- Rating
- Ranking

---

# 11. Folder Structure Yêu Cầu

Tạo cấu trúc thư mục rõ ràng:

```txt
src/
  assets/
  components/
    common/
      Badge.tsx
      Button.tsx
      Card.tsx
      EmptyState.tsx
      LoadingState.tsx
    layout/
      AppLayout.tsx
      Header.tsx
      Sidebar.tsx
    leaderboard/
      LeaderboardTable.tsx
      SkillFilter.tsx
      StandardOverview.tsx
    students/
      StudentProfileCard.tsx
      StudentSkillRadar.tsx
      StudentSkillSummary.tsx
    admin/
      AdminTabs.tsx
      StudentForm.tsx
      SkillTestForm.tsx
      ClubStandardForm.tsx
      TestResultForm.tsx
  data/
    mockData.ts
  hooks/
    useStudents.ts
    useSkillTests.ts
    useClubStandards.ts
    useRankings.ts
    useTestResults.ts
  pages/
    HomePage.tsx
    StudentProfilePage.tsx
    AdminPage.tsx
  routes/
    AppRoutes.tsx
  types/
    database.ts
    football.ts
  utils/
    rating.ts
    ranking.ts
    score.ts
  App.tsx
  main.tsx
  index.css
```

---

# 12. TypeScript Types

Tạo types rõ ràng:

```ts
export type PreferredFoot = "left" | "right" | "both";

export type SkillName =
  | "Dẫn bóng"
  | "Chuyền bóng"
  | "Sút bóng"
  | "Tốc độ"
  | "Sức bền"
  | "Tư duy chơi bóng";

export type SkillRating =
  | "Xuất sắc"
  | "Tốt"
  | "Đạt yêu cầu"
  | "Cần cải thiện";

export type Student = {
  id: string;
  full_name: string;
  birth_year: number;
  position: string;
  preferred_foot: PreferredFoot;
  avatar_url?: string | null;
};

export type SkillTest = {
  id: string;
  skill_name: SkillName;
  test_name: string;
  description?: string | null;
  unit: string;
  higher_is_better: boolean;
};

export type ClubStandard = {
  id: string;
  skill_test_id: string;
  standard_value: number;
  max_score: number;
};

export type TestResult = {
  id: string;
  student_id: string;
  skill_test_id: string;
  raw_result: number;
  score: number;
  note?: string | null;
  tested_at: string;
};

export type Ranking = {
  id: string;
  student_id: string;
  skill_test_id: string;
  score: number;
  difference_from_standard: number;
  rating: SkillRating;
  rank_position: number;
};
```

---

# 13. Scoring Logic

Tạo file:

```txt
src/utils/score.ts
```

Yêu cầu:

- Nếu `higher_is_better = true`, điểm càng cao càng tốt.
- Nếu `higher_is_better = false`, kết quả càng thấp càng tốt, ví dụ bài test tốc độ tính bằng giây.
- Tính `scorePercent`
- Tính `differenceFromStandard`
- Tính `rating`

Gợi ý logic:

```ts
export function calculateScorePercent(params: {
  rawResult: number;
  standardValue: number;
  higherIsBetter: boolean;
}) {
  const { rawResult, standardValue, higherIsBetter } = params;

  if (higherIsBetter) {
    return Math.min((rawResult / standardValue) * 100, 120);
  }

  return Math.min((standardValue / rawResult) * 100, 120);
}
```

Tạo file:

```txt
src/utils/rating.ts
```

```ts
import type { SkillRating } from "../types/football";

export function getRating(scorePercent: number): SkillRating {
  if (scorePercent >= 90) return "Xuất sắc";
  if (scorePercent >= 75) return "Tốt";
  if (scorePercent >= 60) return "Đạt yêu cầu";
  return "Cần cải thiện";
}
```

Tạo file:

```txt
src/utils/ranking.ts
```

Yêu cầu:

- Sắp xếp học viên theo `score` giảm dần.
- Với bài test `higher_is_better = false`, vẫn dùng `scorePercent` đã quy đổi để ranking.
- Gán `rank_position` tự động.
- Nếu filter theo kỹ năng, chỉ ranking trong kỹ năng đó.

---

# 14. Components Bắt Buộc

## 14.1 Common components

Tạo:

- `Button`
- `Card`
- `Badge`
- `EmptyState`
- `LoadingState`

## 14.2 Layout components

Tạo:

- `AppLayout`
- `Header`
- `Sidebar`

## 14.3 Leaderboard components

Tạo:

- `StandardOverview`
- `SkillFilter`
- `LeaderboardTable`

## 14.4 Student components

Tạo:

- `StudentProfileCard`
- `StudentSkillRadar`
- `StudentSkillSummary`

## 14.5 Admin components

Tạo:

- `AdminTabs`
- `StudentForm`
- `SkillTestForm`
- `ClubStandardForm`
- `TestResultForm`

---

# 15. Responsive Behavior

## Desktop

- Sidebar cố định bên trái
- Nội dung chính bên phải
- Bảng leaderboard dạng table
- Profile page chia 2 cột: thông tin học viên và radar chart

## Mobile

- Sidebar chuyển thành top menu hoặc bottom navigation
- Leaderboard chuyển thành card list
- Profile page chuyển thành 1 cột
- Admin form full width
- Không bị tràn ngang màn hình

---

# 16. Data Fetching

Tạo custom hooks:

- `useStudents`
- `useSkillTests`
- `useClubStandards`
- `useRankings`
- `useTestResults`

Mỗi hook cần xử lý:

- `loading`
- `error`
- `data`
- `refetch`
- realtime subscription nếu phù hợp

Ví dụ:

```ts
type QueryState<T> = {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
```

---

# 17. Admin CRUD Requirement

Admin phải thực hiện được:

## Students

- Create student
- Read students
- Update student
- Delete student

## Skill tests

- Create skill test
- Read skill tests
- Update skill test
- Delete skill test

## Club standards

- Create standard
- Update standard
- Delete standard

## Test results

- Create test result
- Update test result
- Delete test result

Sau mỗi thao tác CRUD:

- Cập nhật Supabase
- Refetch dữ liệu hoặc realtime update
- Hiển thị toast hoặc thông báo trạng thái thành công/thất bại

---

# 18. Seed Data

Tạo seed data mẫu cho 6 kỹ năng:

```ts
const skillTests = [
  {
    skill_name: "Dẫn bóng",
    test_name: "Dẫn bóng zigzag 30m",
    unit: "giây",
    higher_is_better: false
  },
  {
    skill_name: "Chuyền bóng",
    test_name: "Chuyền bóng chính xác 15m",
    unit: "lần chính xác",
    higher_is_better: true
  },
  {
    skill_name: "Sút bóng",
    test_name: "Sút trúng mục tiêu",
    unit: "lần trúng",
    higher_is_better: true
  },
  {
    skill_name: "Tốc độ",
    test_name: "Chạy nước rút 30m",
    unit: "giây",
    higher_is_better: false
  },
  {
    skill_name: "Sức bền",
    test_name: "Yo-Yo endurance test",
    unit: "mét",
    higher_is_better: true
  },
  {
    skill_name: "Tư duy chơi bóng",
    test_name: "Đánh giá quyết định chiến thuật",
    unit: "điểm",
    higher_is_better: true
  }
];
```

Tạo ít nhất 8 học viên mẫu để test leaderboard.

---

# 19. UI Details Cần Có

## 19.1 Badge rating

- `Xuất sắc`: vàng nổi bật
- `Tốt`: xanh lá
- `Đạt yêu cầu`: xanh dương
- `Cần cải thiện`: đỏ/cam

## 19.2 Leaderboard rank

- Top 1: gold glow
- Top 2: silver style
- Top 3: bronze style
- Các hạng còn lại: neutral

## 19.3 Animation

Dùng Tailwind transition:

```txt
transition-all
duration-200
hover:-translate-y-1
hover:shadow-lg
hover:shadow-yellow-200/40
```

---

# 20. Output Bắt Buộc

Hãy tạo đầy đủ:

1. Project setup commands
2. Supabase SQL schema
3. Folder structure
4. TypeScript types
5. Supabase client
6. Routing setup
7. 3 pages chính:
   - `HomePage`
   - `StudentProfilePage`
   - `AdminPage`
8. Các component chính
9. Custom hooks kết nối Supabase
10. Radar chart bằng Recharts
11. Logic tính điểm, rating và ranking
12. Responsive UI bằng Tailwind CSS
13. Mock data hoặc seed data để demo
14. Hướng dẫn chạy project
15. Ghi chú các giả định nếu có

---

# 21. Điều Kiện Hoàn Thành

Website được xem là hoàn thành khi:

- Có đủ 3 trang chính
- Leaderboard hoạt động
- Filter kỹ năng hoạt động
- Trang hồ sơ hiển thị thông tin học viên
- Radar chart hiển thị 6 kỹ năng và so sánh với tiêu chuẩn CLB
- Admin có thể CRUD dữ liệu
- Dữ liệu lưu bằng Supabase
- Có realtime update
- UI responsive tốt trên mobile và desktop
- Giao diện bám sát nhận diện Saigon FC: trắng, đen, vàng
- Code rõ ràng, dễ mở rộng

---

# 22. Cách Xử Lý Khi Thiếu Thông Tin

Nếu có điểm chưa được chỉ định rõ, hãy tự chọn phương án hợp lý nhất để tiếp tục triển khai.

Ở cuối câu trả lời, thêm mục:

```md
## Assumptions
```

Ghi rõ các giả định đã dùng, ví dụ:

- Chưa có logo thật nên dùng `public/saigon-fc-logo.png` làm placeholder.
- Chưa có authentication admin nên admin page tạm thời không yêu cầu đăng nhập.
- Ranking được tính theo điểm phần trăm so với tiêu chuẩn CLB.
- Bài test tốc độ dùng `higher_is_better = false`.

---

# 23. Final Instruction

Generate the complete app directly, not only documentation.

Yêu cầu output phải bao gồm code thực tế. Không chỉ giải thích. Hãy tạo toàn bộ file cần thiết để project có thể chạy được sau khi cấu hình Supabase.
