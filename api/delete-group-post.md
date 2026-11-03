# API XÓA BÀI ĐÃ ĐĂNG / BÀI CHỜ DUYỆT TRONG NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Endpoint / Mutation

| Chức năng | fb_api_req_friendly_name | doc_id / Endpoint (tham khảo) |
| --- | --- | --- |
| Xóa bài chữ/ảnh (đã đăng hoặc chờ duyệt) | `useCometFeedStoryDeleteMutation` | `29100969972853465` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm |
| `variables.input.story_id` | string | Story ID của bài cần xóa |
| `variables.input.story_location` | string | Vị trí bài viết theo request gốc |
| `variables.input.actor_id` | string | UID người thực hiện |
| `variables.input.client_mutation_id` | string | ID mutation mới |
| `variables.renderLocation` | string | Ngữ cảnh giao diện |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên từ Facebook |

## Example Code — JavaScript Console

```javascript
(async () => {
  const form = new URLSearchParams(prompt('Form Data của useCometFeedStoryDeleteMutation:') || '');
  if (form.get('fb_api_req_friendly_name') !== 'useCometFeedStoryDeleteMutation') throw Error('Sai mutation');
  const variables = JSON.parse(form.get('variables'));
  variables.groupID = prompt('Group ID:');
  variables.input.story_id = prompt('Story ID cần xóa:');
  variables.input.actor_id = require('CurrentUserInitialData').USER_ID;
  variables.input.client_mutation_id = crypto.randomUUID();
  form.set('variables', JSON.stringify(variables));
  if (!confirm('XÓA bài này?')) return;
  const r = await fetch('/api/graphql/', { method:'POST', credentials:'include',body:form });
  console.log(r.status, await r.text());
})();
```

## Response

`data.story_delete.deleted_story_id` và `data.story_delete.to.id` (tùy phiên bản). Đọc lại danh sách bài/chờ duyệt để xác minh Story ID không còn.

Yêu cầu quyền sở hữu bài hoặc quyền kiểm duyệt phù hợp. Xóa bài chờ duyệt và bài đã đăng dùng chung mutation nhưng phải lấy `story_id` chính xác.
