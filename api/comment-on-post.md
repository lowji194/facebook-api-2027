# API BÌNH LUẬN BÀI VIẾT NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Endpoint / Mutation

| Chức năng | fb_api_req_friendly_name | doc_id / Endpoint (tham khảo) |
| --- | --- | --- |
| Gửi bình luận | `useCometUFICreateCommentMutation` | `28903545979306763` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm |
| `variables.input.feedback_id` | string | Feedback ID của bài đăng (không phải Post ID) |
| `variables.input.actor_id` | string | UID tài khoản bình luận |
| `variables.input.message.text` | string | Nội dung bình luận |
| `variables.input.client_mutation_id` | string | ID lượt bình luận |
| `variables.input.idempotence_token` | string | Token chống lặp |
| `variables.input.session_id` | string | Session ID duy nhất |
| `variables.input.attachments` | array | Thông tin đính kèm (nếu có) |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên từ Facebook |

## Example Code — JavaScript Console

```javascript
(async () => {
  const form = new URLSearchParams(prompt('Form Data của useCometUFICreateCommentMutation:') || '');
  if (form.get('fb_api_req_friendly_name') !== 'useCometUFICreateCommentMutation') throw Error('Sai mutation');
  const variables = JSON.parse(form.get('variables'));
  variables.groupID = prompt('Group ID:');
  variables.input.feedback_id = prompt('Feedback ID của bài:');
  variables.input.actor_id = require('CurrentUserInitialData').USER_ID;
  variables.input.message.text = prompt('Nội dung bình luận:');
  variables.input.client_mutation_id = String(Date.now());
  variables.input.idempotence_token = 'client:'+crypto.randomUUID();
  variables.input.session_id = crypto.randomUUID();
  form.set('variables', JSON.stringify(variables));
  if (!confirm('Gửi bình luận?')) return;
  const r = await fetch('/api/graphql/', { method:'POST',credentials:'include',body:form });
  console.log(r.status, await r.text());
})();
```

## Response

Phản hồi JSON có `data` hoặc `errors`, có thể trả Comment ID. Dùng `CommentListComponentsRootQuery` để kiểm tra ID và permalink `?comment_id=...`.

`feedback_id` lấy từ API đọc bài viết, không tự chuyển Post ID thành Feedback ID. Không tự động retry nếu kết quả chưa rõ.
