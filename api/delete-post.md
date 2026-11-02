# API XÓA BÀI VIẾT

**Hai thao tác:** Chuyển bài/video vào thùng rác hoặc xóa vĩnh viễn khỏi thùng rác. Sử dụng `story_id` của bài, không nhầm với `video_id` của file.

## 1. Chuyển bài viết vào thùng rác

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

**Mutation:** `useCometTrashPostMutation`

### Body Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `fb_api_req_friendly_name` | string | `useCometTrashPostMutation` |
| `fb_api_caller_class` | string | `RelayModern` |
| `doc_id` | string | ID mutation từ Network hiện tại |
| `variables.input.story_id` | string | **Story ID** bài/video cần xóa (không nhất thiết giống video_id) |
| `variables.input.story_location` | string | Nguồn hiển thị bài viết, theo request gốc |
| `variables.input.actor_id` | string | UID người thực hiện |
| `variables.input.client_mutation_id` | string | ID mutation phía client |
| `fb_dtsg`, `lsd`, `jazoest`, `av`, `__user`, ... | string | Field session; lấy từ Network |

### Payload JSON

```json
{
  "input": {
    "story_id": "<STORY_ID>",
    "story_location": "<STORY_LOCATION>",
    "actor_id": "<USER_ID>",
    "client_mutation_id": "<MUTATION_ID>"
  }
}
```

### Example Code — JavaScript Console

```javascript
// Lấy Form Data đã ghi trong Network của useCometTrashPostMutation.
const payload = new URLSearchParams(prompt('Form Data delete:'));
if (payload.get('fb_api_req_friendly_name') !== 'useCometTrashPostMutation')
  throw Error('Sai mutation');

const variables = JSON.parse(payload.get('variables'));
variables.input.story_id = prompt('Story ID bài viết cần xóa:');
payload.set('variables', JSON.stringify(variables));

if (confirm('Chuyển bài/video này vào thùng rác?')) {
  const response = await fetch('https://www.facebook.com/api/graphql/', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString()
  });
  console.log(response.status, await response.text());
}
```

### Response

Trả JSON GraphQL `data` hoặc `errors`; kiểm tra bài không còn xuất hiện trên trang cá nhân.

**Lưu ý:** Đây là API **chuyển vào thùng rác**, không phải xóa vĩnh viễn. Facebook cho biết mục trong thùng rác tự động bị xóa sau **30 ngày**.

## 2. Xóa vĩnh viễn bài viết

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

**Mutation:** `CometActivityLogBulkActionMutation`

### Body Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `fb_api_req_friendly_name` | string | `CometActivityLogBulkActionMutation` |
| `doc_id` | string | ID mutation lấy từ Network |
| `variables.input.action` | string | Hành động xóa, giá trị theo request thực tế |
| `variables.input.category_key` | string | Danh mục Nhật ký hoạt động / Thùng rác |
| `variables.input.story_ids` | array | **Danh sách Story ID cần xóa** |
| `variables.input.render_location` | string | Nguồn giao diện |
| `variables.input.transaction_id` | string | ID giao dịch |
| `variables.input.actor_id` | string | UID người thao tác |
| `variables.input.client_mutation_id` | string | ID mutation phía client |
| `fb_dtsg`, `lsd`, `jazoest`, `__user`, ... | string | Tham số phiên, giữ từ Network |

### Payload JSON

```json
{
  "input": {
    "action": "<ACTION_FROM_NETWORK>",
    "category_key": "<CATEGORY_FROM_NETWORK>",
    "render_location": "<LOCATION_FROM_NETWORK>",
    "story_ids": ["<STORY_ID>"],
    "transaction_id": "<TRANSACTION_ID>",
    "actor_id": "<USER_ID>",
    "client_mutation_id": "<MUTATION_ID>"
  }
}
```

### Example Code — JavaScript Console

```javascript
// Form Data gốc: F12 -> Network khi Xóa trong Nhật ký hoạt động.
// Không dùng lại token hoặc mutation doc_id của tài khoản khác.
const payload = new URLSearchParams(prompt('Form Data permanent delete:'));
if (payload.get('fb_api_req_friendly_name') !== 'CometActivityLogBulkActionMutation')
  throw Error('Sai mutation');

const variables = JSON.parse(payload.get('variables'));
variables.input.story_ids = [prompt('Story ID cần xóa vĩnh viễn:')];
payload.set('variables', JSON.stringify(variables));

if (confirm('XÓA VĨNH VIỄN? Không thể khôi phục.')) {
  const response = await fetch('https://www.facebook.com/api/graphql/', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString()
  });
  console.log(response.status, await response.text());
}
```

### Response

GraphQL JSON; kiểm tra `errors` và mục còn tồn tại trong Thùng rác hay không. **Thao tác không thể khôi phục.** Chỉ dùng với bài/video thuộc tài khoản bạn quản lý.
