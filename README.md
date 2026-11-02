# Badminton Club Manager · Quản lý sân cầu lông

Web app mobile-first dành cho nhóm cầu lông **8–14 người, 2–3 sân**. Ứng dụng xử lý trọn một buổi chơi: điểm danh, xếp đội cân bằng giới tính và trình độ, theo dõi lượt, quản lý sân/trận, tính tiền cầu – tiền sân và lưu toàn bộ lịch sử.

**Stack:** React 18 · TypeScript · Tailwind CSS · Lucide · TanStack Query · Express · PostgreSQL · Prisma · JWT HttpOnly.

<p>
  <img src="docs/screenshots/overview-desktop.png" alt="Tổng quan desktop" width="68%" />
  <img src="docs/screenshots/overview-mobile.png" alt="Tổng quan mobile" width="27%" />
</p>

---

## Tính năng chính

- **Tổng quan live:** buổi hiện tại, sân hoạt động, trận đang chạy, người chờ, tổng lượt.
- **Thành viên:** thêm/sửa/lưu trữ, giới tính, 4 cấp trình độ, điểm danh, lượt chơi, W/L.
- **Sân:** trạng thái Trống / Đang chơi / Tạm khóa, đội hình trực tiếp, giờ bắt đầu, kết thúc trận.
- **Xếp trận:** tự động theo thuật toán, xếp tay, chọn đội, đổi đội, chia đội cân bằng, xếp bổ sung.
- **An toàn dữ liệu:** transaction Serializable + con trỏ `currentMatchId` bảo đảm một người không thể ở hai sân.
- **Tính tiền:** tiền cầu + tiền sân, chia đều hoặc hệ số Nam/Nữ, thu tiền từng người, tổng đã thu/còn thiếu.
- **Lịch sử:** xem lại buổi cũ, chi phí, lượt chơi, kết quả trận. Dữ liệu cũ không bị xóa.
- **UI:** tiếng Việt, dark/light mode, bottom navigation, bottom sheet, card, thao tác lớn một tay.

### Ảnh giao diện

| Xếp trận tự động | Tính tiền | Lịch sử |
|---|---|---|
| ![](docs/screenshots/auto-lineup-mobile.png) | ![](docs/screenshots/payments-mobile.png) | ![](docs/screenshots/history-modal.png) |

| Thành viên | Sân | Dark/Light |
|---|---|---|
| ![](docs/screenshots/members-mobile.png) | ![](docs/screenshots/courts-mobile.png) | ![](docs/screenshots/overview-light-desktop.png) |

---

## Chạy nhanh

### 1. Yêu cầu

- Node.js **20+** (khuyến nghị 22/24)
- PostgreSQL 15+ **hoặc** Docker Desktop

### 2. Cài dependencies

```bash
npm install
```

### 3. Cơ sở dữ liệu

**Cách A — Docker (khuyến nghị):**

```bash
docker compose up -d
```

Sao chép `.env.example` thành `.env` và dùng:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/badminton_club?schema=public"
```

**Cách B — PostgreSQL có sẵn:** tạo database `badminton_club` và trỏ `DATABASE_URL` tới database đó.

Sau đó tạo bảng và nạp dữ liệu demo:

```bash
npm run db:push
npm run db:seed
```

### 4. Chạy development

```bash
npm run dev
```

- Web: <http://localhost:5173>
- API: <http://localhost:4100>

**Tài khoản demo**

```text
Email:    host@caulong.vn
Mật khẩu: host123
```

Dữ liệu seed gồm 14 thành viên, 3 sân, 2 trận đang chơi, 1 trận đã xong, 2 buổi lịch sử và cấu hình chi phí mẫu.

### 5. Production

```bash
npm run build
npm start
```

Sau khi build, Express phục vụ cả API và frontend tại <http://localhost:4100>.

> Trong workspace demo hiện tại, PostgreSQL được khởi tạo riêng ở cổng `55432` và `.env` đã trỏ sẵn vào đó. Khi dùng Docker, hãy đổi `DATABASE_URL` về cổng `5432` như hướng dẫn trên.

---

## Scripts

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy API + Vite song song |
| `npm run dev:api` | API với tsx watch |
| `npm run dev:web` | Vite dev server |
| `npm run build` | Typecheck + build frontend |
| `npm start` | Chạy Express, phục vụ `dist/` |
| `npm run db:push` | Đồng bộ Prisma schema vào PostgreSQL |
| `npm run db:seed` | Reset và nạp dữ liệu demo |
| `npm run db:setup` | `db:push` + `db:seed` |
| `npm test` | Unit test thuật toán xếp sân |

---

## Cấu trúc

```text
├─ docs/
│  ├─ ARCHITECTURE.md          # kiến trúc, ERD, luồng, pseudocode, wireframe
│  └─ screenshots/
├─ prisma/
│  ├─ schema.prisma            # PostgreSQL + Prisma
│  ├─ schema.sql               # DDL tương ứng (fallback)
│  └─ seed.ts
├─ server/
│  ├─ index.ts                 # Express bootstrap
│  ├─ auth.ts                  # JWT cookie, requireAuth
│  ├─ transaction.ts           # Serializable + retry P2034
│  ├─ routes/
│  │  ├─ auth.ts
│  │  ├─ members.ts
│  │  ├─ sessions.ts
│  │  ├─ matches.ts
│  │  └─ finish-match.ts
│  └─ services/
│     ├─ lineup.ts             # thuật toán xếp sân (pure, dễ test)
│     ├─ lineup.test.ts
│     ├─ billing.ts            # chia tiền chính xác đến đồng
│     └─ session-query.ts
├─ src/
│  ├─ pages/                   # Tổng quan, Xếp trận, Sân, Thành viên, Tính tiền
│  ├─ components/              # Layout, CourtCard, modals, UI kit
│  ├─ context/                 # Auth, Theme, Toast
│  └─ lib/                     # API client, format helpers, types
└─ docker-compose.yml
```

---

## Thuật toán xếp sân

1. Loại người không tham gia, đang chơi, đang tạm nghỉ.
2. Xếp hạng theo `playedCount` tăng dần, rồi thời điểm chờ (`lastFinishedAt`/`joinedAt`).
3. Sinh mọi tổ hợp 4 người; chỉ xét nhóm công bằng nhất (max lượt nhỏ nhất, rồi tổng lượt nhỏ nhất).
4. Trong nhóm đó: ưu tiên **2 nam + 2 nữ**, mỗi đội 1 nam + 1 nữ.
5. Thử mọi cách chia đội, chọn tổng điểm trình độ hai bên gần nhau nhất.
6. Ưu tiên người chờ lâu; tie-break ổn định để preview và xác nhận cho cùng kết quả.
7. Khi xếp nhiều sân, loại người đã chọn khỏi lượt gợi ý tiếp theo.

Điểm trình độ: `Newbie 1 · Yếu 2 · Trung bình yếu 3 · Trung bình 4`.

Chi tiết pseudocode và các trường hợp biên: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

### Chống xếp trùng

- `SessionMember.currentMatchId`: mỗi người chỉ có một dòng trong buổi → tối đa một trận hoạt động.
- `Court.currentMatchId` unique: một sân chỉ có một trận.
- `MatchParticipant @@unique(matchId, sessionMemberId)`.
- Toàn bộ thao tác bắt đầu/kết thúc/xếp tự động nằm trong transaction **Serializable**; API kiểm tra lại trạng thái ngay trước khi ghi.
- Frontend chặn chọn trùng; backend vẫn kiểm tra độc lập.

---

## API chính

```text
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/members
POST   /api/members
PATCH  /api/members/:id
DELETE /api/members/:id                 # archive

GET    /api/sessions/current
GET    /api/sessions                    # lịch sử
GET    /api/sessions/:id
POST   /api/sessions
POST   /api/sessions/:id/finish
PATCH  /api/sessions/:id/attendance
PATCH  /api/sessions/:id/costs
PATCH  /api/sessions/:id/payment
PATCH  /api/sessions/:id/courts/:courtId

POST   /api/sessions/:id/matches
GET    /api/sessions/:id/auto/preview
POST   /api/sessions/:id/auto
POST   /api/sessions/:id/split-preview
POST   /api/matches/:id/finish
```

Mọi response lỗi:

```json
{ "error": { "code": "PLAYER_BUSY", "message": "Minh không còn ở trạng thái chờ." } }
```

---

## Kiểm thử

```bash
npm test
```

Đã kiểm thử:

- Ưu tiên người ít lượt, người chờ lâu.
- 2 nam + 2 nữ luôn chia mỗi đội 1 nam + 1 nữ.
- Cân bằng tổng điểm trình độ.
- Nhiều sân không lặp người.
- 3 nam + 1 nữ vẫn tạo được trận và bị đánh dấu chưa cân bằng.
- API: chặn người đang chơi, tự động xếp, kết thúc trận, giải phóng sân, cộng lượt đúng một lần.
- Hai request đồng thời dùng cùng 4 người: chỉ một trận được tạo.
- Chia tiền: tổng phần từng người luôn khớp tổng chi phí.

---

## Deploy công khai

Ứng dụng là một web service Node.js phục vụ cả API và frontend đã build, nên cách đơn giản nhất là deploy **một service + một PostgreSQL**.

### Render / Railway

1. Đưa source lên GitHub (không commit `.env`).
2. Tạo PostgreSQL managed, lấy `DATABASE_URL`. Với database bên ngoài (Neon/Supabase) thêm `?sslmode=require`.
3. Tạo Web Service:
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Health check: `/api/health`
4. Thêm biến môi trường:

```env
DATABASE_URL=...
JWT_SECRET=<chuỗi-ngẫu-nhiên-dài>
NODE_ENV=production
HOST_EMAIL=host@caulong.vn
HOST_PASSWORD=<mật-khẩu-mới>
CLIENT_ORIGIN=https://ten-app-cua-ban
```

5. Chạy **một lần** trong shell của service:

```bash
npx prisma db push
npm run db:seed
```

> `db:seed` xóa dữ liệu hiện có để tạo dữ liệu demo. Không đưa lệnh này vào build/pre-deploy tự động. Sau khi đã dùng thật, chỉ chạy `prisma db push` khi schema thay đổi.

### Chia sẻ tạm bằng Cloudflare Tunnel

Nếu chỉ muốn bạn bè vào thử ngay từ máy đang chạy:

```bash
winget install --id Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:4100
```

Cloudflare trả về một URL `https://...trycloudflare.com`. Cách này chỉ hoạt động khi máy + PostgreSQL + server còn chạy, không phù hợp lâu dài.

### Về "nhiều người cùng làm host"

Hiện tại app có **một tài khoản Host** và một buổi ACTIVE / tài khoản. Nếu cả nhóm dùng chung tài khoản đó, mọi người đều thao tác được như Host và transaction vẫn chống xếp trùng người/sân.

Nếu muốn **mỗi người có email/mật khẩu riêng**, cần bổ sung mô hình `Club` + `ClubHost` + lời mời tham gia, và chuyển phạm vi dữ liệu từ `hostId` sang `clubId`. Đây là thay đổi kiến trúc, không chỉ là cấu hình deploy.

---

## Ghi chú thiết kế

- **Một buổi ACTIVE / host:** ràng buộc `Session.activeKey = hostId` unique; kết thúc buổi mới giải phóng.
- **Không sửa đội hình trận đang chơi:** trận đã bắt đầu bị khóa để bảo vệ lượt và tính công bằng; Host kết thúc rồi xếp trận mới. Thao tác xếp tay chỉ áp dụng cho trận chưa bắt đầu.
- **Archive thay vì xóa cứng:** lịch sử trận, lượt và thanh toán của thành viên cũ vẫn còn.
- **Tiền tệ:** số nguyên VNĐ, phân bổ phần dư theo largest remainder để tổng luôn khớp.
- **Bảo mật:** mật khẩu bcrypt, JWT trong cookie `HttpOnly` + `SameSite=Lax`, mọi route nghiệp vụ yêu cầu Host đã đăng nhập. Không lưu dữ liệu nghiệp vụ trong localStorage (chỉ lưu lựa chọn theme).
