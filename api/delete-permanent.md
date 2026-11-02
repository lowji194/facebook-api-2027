# API xóa vĩnh viễn bài viết / video

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

**Mutation:** `CometActivityLogBulkActionMutation` — bắt được khi **xóa vĩnh viễn video thử nghiệm khỏi Thùng rác** trong Nhật ký hoạt động.

## Body Parameters

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

## Payload JSON (đúng cấu trúc đã bắt)

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

## Example Code — JavaScript Console

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

## Response

GraphQL JSON; kiểm tra `errors` và mục còn tồn tại trong Thùng rác hay không. **Thao tác không thể khôi phục.** Chỉ dùng với bài/video thuộc tài khoản bạn quản lý.
