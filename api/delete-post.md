# API xóa bài viết / video (chuyển vào thùng rác)

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

**Mutation:** `useCometTrashPostMutation` — đã ghi nhận khi chuyển video thử nghiệm vào thùng rác.

## Body Parameters

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

## Ví dụ variables (cấu trúc thực tế)

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

## Example Code — JavaScript Console

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

## Response

Trả JSON GraphQL `data` hoặc `errors`; kiểm tra bài không còn xuất hiện trên trang cá nhân.

**Lưu ý:** Đây là API **chuyển vào thùng rác**, không phải xóa vĩnh viễn. Facebook cho biết mục trong thùng rác tự động bị xóa sau **30 ngày**.
