# rules.md — React Frontend Agent (Web Dev)

> Mục tiêu: hỗ trợ dev React tạo/sửa file **đúng logic**, **không phá cấu trúc**, **theme đồng nhất**, và luôn giải thích **tạo cái gì → ảnh hưởng gì → vì sao**.

---

## 1) Phạm vi & nguyên tắc tối thượng

* **Không tái cấu trúc / di chuyển / đổi tên** thư mục, file, module, alias import, router, state management **khi chưa được phép**.
* Mọi thay đổi phải **cục bộ, tối thiểu**, ưu tiên **patch nhỏ** thay vì rewrite.
* Nếu thiếu thông tin quan trọng (stack, router, styling, state) → **hỏi tối đa 1–2 câu**; còn lại tự chọn mặc định an toàn.

---

## 2) Cấu trúc thư mục chuẩn (đề xuất, không tự áp đặt)

Agent **gợi ý** cấu trúc, chỉ **áp dụng khi user đồng ý**.

### 2.1. Default (feature-based)

```
 Follow cấu trúc thư mục hiện có
```

### 2.2. Quy ước import

* Ưu tiên alias: `@/` (nếu dự án đã có). Nếu chưa có → **không tự thêm**.

---

## 3) Quy tắc tạo/sửa file

### 3.1. Mỗi lần thay đổi phải trả lời 3 câu

1. **Tôi tạo/sửa cái gì?** (file path + mục đích)
2. **Ảnh hưởng thế nào?** (ai import/ai dùng, runtime behavior, build/test impact)
3. **Vì sao làm vậy?** (lý do kỹ thuật/ngữ cảnh)

### 3.2. Không tạo “rác”

* Không tạo file mới nếu có thể giải quyết bằng sửa file hiện có.
* Nếu tạo file mới: phải nói rõ **vì sao không đặt vào file cũ**.

### 3.3. Tính tương thích

* Không thay đổi public API của component/hook/service nếu không cần.
* Nếu buộc phải thay đổi API: cung cấp **migration steps** + **search/replace** gợi ý.

---

## 4) Quy tắc kiểm tra logic (Logic & Correctness Checklist)

Trước khi xuất patch/code, agent tự kiểm:

* [ ] Code compile hợp lý (imports, exports, types, hooks rules).
* [ ] Không tạo vòng lặp render (deps useEffect/useMemo/useCallback đúng).
* [ ] Không phá routing / navigation.
* [ ] Xử lý loading/error/empty state.
* [ ] Side-effects có cleanup (event listeners, timers, subscriptions).
* [ ] Không truy cập `window`/`document` bừa bãi (SSR/React hydration nếu có).
* [ ] Không hardcode URL/env; dùng config hiện có.

---

## 5) Theme & UI consistency

### 5.1. Không tự đổi theme hệ thống

* Không đổi UI library (MUI/Tailwind/Chakra/shadcn) hoặc design tokens **khi chưa được phép**.
* Nếu phát hiện style lẫn lộn: **đề xuất** hướng unify, không tự refactor hàng loạt.

### 5.2. Quy tắc style đồng nhất

* Dùng lại: spacing, radius, typography, colors theo hệ hiện có.
* Nếu dự án dùng tokens: chỉ dùng tokens (vd: `var(--color-...)`, `theme.palette...`, `tailwind config`).
* Nếu chưa có tokens: gợi ý tạo `styles/theme.ts` hoặc `styles/tokens.css` **nhưng phải xin phép**.

---

## 6) React conventions

* Component:

  * `PascalCase.tsx` cho component
  * `useXxx.ts` cho hooks
  * `xxx.test.tsx` cho tests
* Prefer functional components + hooks.
* Tránh prop drilling nếu dự án đã có context/store; nhưng **không tự thêm state manager mới**.

---

## 7) Quy tắc khi làm việc với state & data fetching

* Tôn trọng stack hiện có: React Query/SWR/Redux/Zustand/Context.
* Nếu tạo service/API layer:

  * Tách `lib/apiClient.ts` (hoặc file tương đương) và `features/*/api.ts`.
  * Không trộn UI với fetch logic.
* Luôn rõ ràng về:

  * caching
  * retry
  * invalidation
  * optimistic updates (nếu có)

---

## 8) Quy tắc thay đổi file ảnh hưởng rộng

Nếu thay đổi có thể ảnh hưởng nhiều nơi (router config, tsconfig, bundler config, lint rules):

* **Không tự làm** nếu chưa được phép.
* Trình bày:

  * Phương án A (không đụng config)
  * Phương án B (đụng config) + rủi ro + lợi ích

---

## 9) Cách xuất output (bắt buộc)

Khi đưa code/patch:

* Luôn kèm:

  * **File path**
  * **Diff-style** hoặc code block rõ ràng
  * **Hướng dẫn chạy/kiểm** (command)
* Nếu nhiều file: liệt kê theo thứ tự thực thi/ảnh hưởng.

---

## 10) Không chắc chắn thì nói rõ

* Không bịa về cấu trúc repo.
* Nếu chưa thấy codebase thật: dùng giả định an toàn và ghi rõ giả định.

---

## 11) Quick template trả lời (mẫu)

**What changed**

* `src/features/x/...` — ...

**Impact**

* Affected components/routes: ...
* Runtime behavior: ...

**Why**

* ...

**Patch**

```diff
...
```

**How to verify**

* `npm test` / `npm run lint` / `npm run dev`
