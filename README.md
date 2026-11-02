# Facebook API 2027

Tài liệu sử dụng **Facebook web API bằng JavaScript thuần**, theo cấu trúc: endpoint, method, headers, payload, response và ví dụ fetch() chạy trực tiếp tại **DevTools Console của https://www.facebook.com/**.

Không dùng Node.js, Python, CDP, Playwright hay các thư viện.

> **Trạng thái xác minh:** Trong Workflow cũ đã quan sát được request có tên ComposerStoryCreateMutation để tạo bài đăng và ProfileCometTimelineFeedRefetchQuery để đọc timeline. Workflow đó đăng qua giao diện Chrome, **không lưu lại đầy đủ Request Payload, doc_id hay request upload video**. Vì vậy tài liệu không tự nhận có một endpoint upload video hoàn chỉnh đã được thử nghiệm.

## Danh sách API

| Chức năng | Method | Endpoint | Trạng thái |
| --- | --- | --- | --- |
| Tạo bài đăng: ComposerStoryCreateMutation | POST | https://www.facebook.com/api/graphql/ | Đã nhận diện mutation, cần payload thực tế |
| Đọc timeline: ProfileCometTimelineFeedRefetchQuery | POST | https://www.facebook.com/api/graphql/ | Đã nhận diện query, cần payload thực tế |
| Upload tệp video | Chưa xác định | Trích từ Network khi upload | Chưa có bản ghi HTTP gốc |

## API 1 — Tạo bài đăng (ComposerStoryCreateMutation)

### Endpoint

~~~http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
~~~

### Authentication

Sử dụng cookie phiên Facebook đang đăng nhập. Chạy trong Console tại facebook.com, trình duyệt tự gửi cookie với tùy chọn credentials: "include". **Không cố gán header Cookie trong fetch() phía trình duyệt**.

### Tham số Body (Payload)

| Parameter | Type | Value / Description |
| --- | --- | --- |
| fb_api_req_friendly_name | string | ComposerStoryCreateMutation |
| doc_id | string | Mã mutation, thay đổi theo phiên bản; đọc từ Network |
| variables | JSON string | Payload của bài đăng; phải giữ đủ cấu trúc input và thông tin media |
| fb_dtsg | string | Giá trị phiên bảo vệ request; lấy từ Network |
| lsd | string | Có thể xuất hiện trong request thực tế |
| fb_api_caller_class | string | Thường là RelayModern |
| __a | string | Thường là 1 |
| Các field khác | string | Giữ nguyên theo request thực tế |

Đây là các field đã nhận diện hoặc thường gặp, **không phải toàn bộ field bắt buộc cho mọi tài khoản**.

### Cấu trúc JavaScript Payload

~~~javascript
// Ví dụ minh họa cách mã hóa form payload.
// Phần variables bên dưới chỉ là ví dụ cấu trúc, KHÔNG đủ để đăng video.

const variables = {
  input: {
    message: { text: 'Nội dung bài viết' }
  }
};

const payload = new URLSearchParams({
  __a: '1',
  fb_api_caller_class: 'RelayModern',
  fb_api_req_friendly_name: 'ComposerStoryCreateMutation',
  doc_id: 'DOC_ID_LAY_TU_NETWORK',
  fb_dtsg: 'FB_DTSG_LAY_TU_NETWORK',
  variables: JSON.stringify(variables)
});

console.log(Object.fromEntries(payload));
// Không gửi request trong ví dụ này.
~~~

### Cách lấy Request Payload thật

1. Vào https://www.facebook.com/ bằng tài khoản bạn được phép sử dụng, mở F12 > Network và bật Preserve log.
2. Thực hiện một lần đăng bài/video chủ động. Lọc graphql trong Network; tìm request có tham số fb_api_req_friendly_name bằng ComposerStoryCreateMutation.
3. Vào Payload > Form Data > view source (nếu có). Sao chép **nguyên body URL-encoded** (doc_id, variables, fb_dtsg và mọi field liên quan).
4. Chạy đoạn mã bên dưới trong Console trên cùng trang Facebook. Mã sẽ hỏi payload rồi **yêu cầu xác nhận trước khi gửi lại**, vì một mutation được gửi lần nữa có thể đăng trùng.

### JavaScript fetch() chạy trực tiếp trong Chrome Console

~~~javascript
(async () => {
  const raw = prompt(
    'Dán Form Data URL-encoded của ComposerStoryCreateMutation:'
  );
  if (!raw) return;

  const payload = new URLSearchParams(raw.trim());
  const operation = payload.get('fb_api_req_friendly_name');
  const docId = payload.get('doc_id');
  const rawVariables = payload.get('variables');

  if (operation !== 'ComposerStoryCreateMutation') {
    throw new Error('Không đúng mutation tạo bài đăng');
  }
  if (!docId || !rawVariables) {
    throw new Error('Thiếu doc_id hoặc variables');
  }
  const variables = JSON.parse(rawVariables);
  console.log('Mutation:', operation);
  console.log('Payload hợp lệ dạng JSON:', !!variables);

  if (!confirm(
    'Gửi lại mutation có thể tạo bài đăng trùng. Bạn muốn gửi?'
  )) return;

  const response = await fetch('/api/graphql/', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: payload.toString()
  });

  const resultText = await response.text();
  // Một phản hồi có thể có tiền tố for (;;); và nhiều JSON object.
  const normalized = resultText.replace(/^\s*for\s*\(;;\);\s*/, '');
  const objects = normalized.split(/\r?\n/).filter(Boolean).map((line) => {
    try { return JSON.parse(line); }
    catch { return { text: line.slice(0, 500) }; }
  });

  console.log('HTTP:', response.status);
  console.log('Response:', objects);
})();
~~~

**Không phải trình upload video hoàn chỉnh:** mã này chỉ phát lại một GraphQL mutation hợp lệ đã được lấy từ Network. Upload video thường là request riêng, cần có media identifier trước khi tạo bài. Không retry mù khi kết quả chưa rõ.

### Response (minh họa kiểu dữ liệu)

~~~json
{
  "data": {},
  "errors": [
    { "message": "Request was rejected or required fields are missing" }
  ]
}
~~~

Response có thể có trường data, errors, extensions và được chia thành nhiều dòng. **HTTP 200 không chứng minh bài được đăng thành công**; kiểm tra permalink trên timeline.

## API 2 — Đọc timeline (ProfileCometTimelineFeedRefetchQuery)

~~~http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
~~~

| Parameter | Type | Description |
| --- | --- | --- |
| fb_api_req_friendly_name | string | ProfileCometTimelineFeedRefetchQuery |
| doc_id | string | Lấy từ request timeline mới nhất |
| variables | JSON string | Payload truy vấn timeline của phiên đang đăng nhập |
| fb_dtsg, các field khác | string | Giữ nguyên như Network |

Cách dùng: mở trang cá nhân, lấy Request Payload của ProfileCometTimelineFeedRefetchQuery rồi dùng cùng mẫu fetch() ở trên (đổi phần kiểm tra operation thành ProfileCometTimelineFeedRefetchQuery). Đây là **query đọc**, không phải mutation đăng bài. Có thể tìm các trường permalink_url / ID trong JSON response.

## API 3 — Upload video bằng request HTTP

Luồng đăng video thực tế cần ít nhất các bước sau:

1. Upload file video từ trình duyệt tới endpoint nhận media mà Network ghi nhận.
2. Đọc media identifier và trạng thái xử lý từ response upload.
3. Gửi mutation ComposerStoryCreateMutation với variables **đúng cấu trúc phiên hiện tại**, bao gồm tham chiếu tới media.
4. Xác minh kết quả trên timeline hoặc video/reels.

Hiện chưa có request upload thực tế được lưu trong mã Workflow cũ nên **không cung cấp URL, field hay body upload suy đoán**. Khi có bản ghi Network đã ẩn token và cookie, có thể bổ sung từng endpoint với bảng payload, response và mã Console tương tự API 1.

## Lưu ý bảo mật và giới hạn

- API GraphQL web là giao diện nội bộ của Facebook, **không phải Meta Graph API chính thức**.
- JavaScript chỉ chạy tại website Facebook đang đăng nhập, không cần dùng header Cookie tùy chỉnh.
- Không đưa cookie, fb_dtsg, lsd, full payload thực tế, token hoặc dữ liệu cá nhân lên GitHub.
- Đừng tự động gửi lại mutation tạo bài nếu lần đầu chưa có kết quả xác minh.
- Chưa thực hiện đăng thử lên tài khoản Facebook trong quá trình viết tài liệu này.

## Tham khảo

- https://github.com/imhiendev/API_FACEBOOK — mẫu bố cục tài liệu API.
