# API THAY BÀI VIẾT ĐANG CHỜ DUYỆT

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Endpoint / Mutation

| Chức năng | fb_api_req_friendly_name | doc_id / Endpoint (tham khảo) |
| --- | --- | --- |
| Xóa bài chờ duyệt | `useCometFeedStoryDeleteMutation` | `29100969972853465` |
| Đăng bài thay thế | `ComposerStoryCreateMutation` | `28973423695656561` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `old_story_id` | string | Story ID bài chờ duyệt cũ |
| `groupID` | string | ID nhóm |
| `new_text` | string | Nội dung bài mới |
| `new_photo_id` | string/null | Photo ID nếu đăng bài mới có ảnh |
| `variables.input.story_id` | string | Story ID cần xóa |
| `variables.input.message.text` | string | Caption bài thay thế |
| `variables.input.attachments[0].photo.id` | string | Photo ID bài mới |
| `variables.input.actor_id` | string | UID người đăng |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên từ Facebook |

## Example Code — JavaScript Console

```javascript
(async () => {
  const groupID = prompt('Group ID:');
  const oldID = prompt('Story ID bài chờ duyệt cũ:');
  const text = prompt('Nội dung bài mới:');
  const photoID = prompt('Photo ID mới (bỏ trống nếu chỉ có chữ):') || '';
  const user = require('CurrentUserInitialData').USER_ID;
  const del = new URLSearchParams(prompt('Form Data xóa bài chờ duyệt:') || '');
  const create = new URLSearchParams(prompt('Form Data tạo bài:') || '');
  if (del.get('fb_api_req_friendly_name') !== 'useCometFeedStoryDeleteMutation' ||
      create.get('fb_api_req_friendly_name') !== 'ComposerStoryCreateMutation') throw Error('Sai mutation');
  const dv = JSON.parse(del.get('variables'));
  dv.groupID = groupID; dv.input.story_id = oldID; dv.input.actor_id = user;
  dv.input.client_mutation_id = crypto.randomUUID();
  del.set('variables', JSON.stringify(dv));
  const cv = JSON.parse(create.get('variables'));
  cv.groupID = groupID; cv.input.audience.to_id = groupID;
  cv.input.actor_id = user; cv.input.message.text = text;
  cv.input.attachments = photoID ? [{photo:{id:photoID}}] : [];
  cv.input.client_mutation_id = String(Date.now());
  create.set('variables', JSON.stringify(cv));
  // Thực hiện xóa trước. Kiểm tra thành công rồi mới gửi tạo bài mới.
  if (!confirm('Xóa bài chờ duyệt cũ?')) return;
  const removed = await fetch('/api/graphql/', {method:'POST',credentials:'include',body:del});
  const body = await removed.text();
  console.log('Delete:',removed.status,body);
  if (removed.status !== 200 || body.includes('"errors"')) return;
  if (!confirm('Đã xác minh bài cũ biến mất? Đăng bài mới?')) return;
  const posted = await fetch('/api/graphql/', {method:'POST',credentials:'include',body:create});
  console.log('Create:',posted.status,await posted.text());
})();
```

## Response

Kết quả gồm response `story_delete` và `story_create`. Phải xác minh bài cũ không còn và bài mới xuất hiện/chờ duyệt; tránh gửi lại khi kết quả mơ hồ.

Đây là quy trình gồm **hai mutation**, không phải một endpoint riêng. Không xóa nội dung của người khác khi không có quyền.
