# API ĐĂNG BÀI VIẾT NHÓM (CHỮ / ẢNH)

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Endpoint / Mutation

| Chức năng | fb_api_req_friendly_name | doc_id / Endpoint (tham khảo) |
| --- | --- | --- |
| Đăng bài chữ và ảnh | `ComposerStoryCreateMutation` | `28973423695656561` |
| Upload ảnh | `POST https://upload.facebook.com/ajax/react_composer/attachments/photo/upload` | `multipart/form-data` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm nhận bài viết |
| `variables.input.audience.to_id` | string | ID nhóm nhận bài viết |
| `variables.input.message.text` | string | Nội dung bài viết |
| `variables.input.actor_id` | string | UID người đăng |
| `variables.input.client_mutation_id` | string | ID lượt đăng |
| `variables.input.attachments` | array | Mảng ảnh; để [] nếu đăng chữ |
| `variables.input.attachments[0].photo.id` | string | Photo ID từ bước upload ảnh |
| `Upload FormData.source` | string | 8 |
| `Upload FormData.profile_id` | string | UID người tải ảnh |
| `Upload FormData.waterfallxapp` | string | comet |
| `Upload FormData.farr` | File | Dữ liệu JPEG/PNG |
| `Upload FormData.upload_id` | string | ID duy nhất của lượt upload |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên từ Facebook |

### Upload ảnh trước khi đăng (JavaScript Console)

```javascript
(async () => {
  const file = await new Promise(resolve => {
    const el = document.createElement('input');
    el.type = 'file'; el.accept = 'image/png,image/jpeg';
    el.onchange = () => resolve(el.files[0]); el.click();
  });
  if (!file) return;
  const user = require('CurrentUserInitialData').USER_ID;
  const dtsg = require('DTSG').getToken();
  const lsd = require('LSD').token;
  const query = new URLSearchParams({av:user,__user:user,__a:'1',fb_dtsg:dtsg,lsd});
  const body = new FormData();
  body.append('source','8');
  body.append('profile_id', user);
  body.append('waterfallxapp','comet');
  body.append('farr',file,file.name);
  body.append('upload_id',crypto.randomUUID());
  const r = await fetch('https://upload.facebook.com/ajax/react_composer/attachments/photo/upload?'+query, {
    method:'POST', credentials:'include', body
  });
  console.log(r.status, await r.text()); // payload.photoID => photo.id khi đăng
})();
```
## Example Code — JavaScript Console

```javascript
(async () => {
  const form = new URLSearchParams(prompt('Form Data của ComposerStoryCreateMutation:') || '');
  if (form.get('fb_api_req_friendly_name') !== 'ComposerStoryCreateMutation') throw Error('Sai mutation');
  const variables = JSON.parse(form.get('variables'));
  const groupID = prompt('Group ID:');
  const text = prompt('Nội dung bài đăng:');
  const photoID = prompt('Photo ID đã upload (để trống nếu chỉ đăng chữ):') || '';
  variables.groupID = groupID;
  variables.input.audience.to_id = groupID;
  variables.input.actor_id = require('CurrentUserInitialData').USER_ID;
  variables.input.message = { text };
  variables.input.attachments = photoID ? [{ photo: { id: photoID } }] : [];
  if (variables.input.composed_text?.blocks) variables.input.composed_text.blocks = [text];
  variables.input.client_mutation_id = String(Date.now());
  form.set('variables', JSON.stringify(variables));
  if (!confirm('Đăng bài vào nhóm?')) return;
  const r = await fetch('/api/graphql/', { method:'POST', credentials:'include',body:form });
  console.log(r.status, await r.text());
})();
```

## Response

Bước ảnh: `payload.photoID`, `payload.originalPhotoID`, `payload.width`, `payload.height`. Bước đăng: `data.story_create` có thể chứa Post ID/permalink. Bài đăng có thể chuyển sang trạng thái chờ duyệt.

Dùng Photo ID đúng với ảnh đã upload. Không tự động gửi lại mutation khi kết quả chưa rõ vì có thể tạo bài trùng.
