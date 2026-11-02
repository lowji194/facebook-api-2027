# API đăng video lên trang cá nhân

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

**Mutation:** `ComposerStoryCreateMutation` — đã ghi nhận khi đăng video thử nghiệm ở chế độ Chỉ mình tôi.

## Body Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `fb_api_req_friendly_name` | string | `ComposerStoryCreateMutation` |
| `fb_api_caller_class` | string | `RelayModern` |
| `doc_id` | string | ID mutation của phiên Facebook hiện hành, lấy từ Network |
| `variables` | JSON string | JSON chứa `input` và các biến context |
| `variables.input.message.text` | string | **Nội dung bài đăng / caption video** |
| `variables.input.attachments[0].video.id` | string | **video_id** từ upload start |
| `variables.input.attachments[0].video.additional_video_metadata` | object | Thông tin thumbnail và metadata video |
| `variables.input.audience.privacy` | object | Quyền xem: công khai, bạn bè, chỉ mình tôi... |
| `variables.input.actor_id` | string | UID tài khoản đang đăng |
| `variables.input.idempotence_token` | string | Token chống trùng cho lượt đăng |
| `variables.input.client_mutation_id` | string | ID mutation phía client |
| `fb_dtsg`, `lsd`, `jazoest`, `av`, `__user`, `__spin_*`, ... | string | Field session bổ sung; giữ từ request gốc |

## Ví dụ variables (rút gọn theo đúng đường dẫn thực tế)

```json
{
  "input": {
    "message": {"ranges": [], "text": "Nội dung video muốn đăng"},
    "attachments": [{"video": {
      "id": "<VIDEO_ID_FROM_UPLOAD_START>",
      "additional_video_metadata": {"thumbnailType": "<VALUE>", "thumbnailFileID": "<VALUE>", "translatedAudioMetadata": []}
    }}],
    "actor_id": "<USER_ID>",
    "audience": {"privacy": {"base_state": "<PRIVACY>", "allow": [], "deny": [], "tag_expansion_state": "<VALUE>"}},
    "idempotence_token": "<SESSION_UNIQUE_TOKEN>",
    "client_mutation_id": "<CLIENT_MUTATION_ID>"
  }
}
```

JSON trên chỉ ghi phần nghiệp vụ; request thật còn nhiều field khác. **Không xóa các field gốc khi gửi.**

## Example Code — JavaScript Console

```javascript
// Dán nguyên Form Data của ComposerStoryCreateMutation từ Network.
const payload = new URLSearchParams(prompt('Form Data publish:'));
if (payload.get('fb_api_req_friendly_name') !== 'ComposerStoryCreateMutation')
  throw Error('Sai mutation');

const variables = JSON.parse(payload.get('variables'));
variables.input.message.text = 'Nội dung video muốn đăng';
variables.input.attachments[0].video.id = prompt('video_id sau upload:');
payload.set('variables', JSON.stringify(variables));

// Chỉ chạy khi chủ động muốn đăng; gửi lại có thể tạo bài trùng.
if (confirm('Đăng video bằng request này?')) {
  const response = await fetch('https://www.facebook.com/api/graphql/', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString()
  });
  console.log(response.status, await response.text());
}
```

## Response

Facebook trả phản hồi GraphQL JSON (có thể có tiền tố `for (;;);`). Kiểm tra `data`, `errors` và permalink thực tế; **HTTP 200 chưa chắc đã đăng thành công**. Sau khi gửi, không tự động retry nếu trạng thái không rõ.
