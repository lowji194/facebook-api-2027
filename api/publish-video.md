# API ĐĂNG VIDEO

**Luồng API:** Khởi tạo upload → Gửi file video → Xác nhận upload → Đăng video. Bốn HTTP request thuộc **một chức năng đăng video**.

**Authentication:** Chrome F12 → Console trên Facebook đã đăng nhập; `credentials: 'include'`. Các giá trị phiên và ID lấy từ Network/response thực tế.

## 1. Khởi tạo upload

```http
POST https://vupload2.facebook.com/ajax/video/upload/requests/start/
Content-Type: application/x-www-form-urlencoded
```

### Body Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `waterfall_id` | string | ID theo dõi lượt upload, tạo mới theo phiên |
| `target_id` | string | UID tài khoản đích |
| `source` | string | `composer` |
| `composer_entry_point_ref` | string | `timeline` |
| `supports_chunking` | string | `true` |
| `supports_file_api` | string | `true` |
| `file_size` | string | Kích thước file, đơn vị byte |
| `file_extension` | string | Ví dụ `mp4` |
| `partition_start_offset` | string | `0` cho file đầu |
| `partition_end_offset` | string | Số byte cuối chunk, ví dụ `11368` |
| `composer_dialog_version` | string | `V2` |
| `video_publisher_action_source` | string | Có thể để trống |
| `fb_dtsg`, `jazoest`, `lsd` | string | Giá trị phiên Facebook |
| `__user`, `__a`, `__req`, `__spin_*`, ... | string | Các trường động khác của request web; giữ nguyên từ Network |

### Example Code — JavaScript Console

```javascript
// Dán Form Data đã lấy từ Network -> Payload -> view source.
const body = new URLSearchParams(prompt('Form Data của upload start:'));
const file = await new Promise(resolve => {
  const el = document.createElement('input');
  el.type = 'file'; el.accept = 'video/*';
  el.onchange = () => resolve(el.files[0]); el.click();
});

if (!file) throw Error('Chưa chọn video');
body.set('file_size', String(file.size));
body.set('file_extension', file.name.split('.').pop().toLowerCase());
body.set('partition_start_offset', '0');
body.set('partition_end_offset', String(file.size));

const res = await fetch('https://vupload2.facebook.com/ajax/video/upload/requests/start/', {
  method: 'POST', credentials: 'include',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString()
});
console.log(res.status, await res.text());
```

### Response

```json
{
  "__ar": 1,
  "payload": {
    "video_id": "<VIDEO_ID>",
    "upload_session_id": "<UPLOAD_SESSION_ID>",
    "start_offset": 0,
    "end_offset": 11368,
    "skip_upload": false
  },
  "rid": "<REQUEST_ID>",
  "lid": "<LOG_ID>"
}
```

*Các ID và offset phụ thuộc vào file và phiên upload. Không sử dụng lại `waterfall_id` của phiên khác.*

## 2. Upload dữ liệu file video

```http
POST https://rupload-{region}.up.facebook.com/fb_video/{upload_token}
Content-Type: binary video data
```

Đây là request truyền **dữ liệu byte của video**. Host `rupload-...` và `upload_token` do Facebook chỉ định trong quá trình upload, **không được cố định**.

### Headers / Payload

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| Request Body | bytes | **Dữ liệu file MP4** hoặc chunk, không phải URL file |
| `id` | string | ID phiên/media từ upload |
| `product_media_id` | string | Media ID được server trả về |
| `composer_session_id` | string | ID phiên trình soạn bài |
| `x-entity-type` | string | `video/mp4` |
| `x-entity-length` | string | Số byte chunk |
| `x-total-asset-size` | string | Tổng kích thước file (byte) |
| `start_offset` | string | Byte bắt đầu, ví dụ `0` |
| `end_offset` | string | Byte kết thúc, ví dụ `11368` |
| `offset` | string | Offset Facebook yêu cầu theo từng request |
| `x-entity-name` | string | Tên entity/file theo request thực tế |

### Example Code — JavaScript Console

```javascript
// file: đối tượng File đã chọn từ input[type=file].
// URL và các header động lấy từ request upload trong Network.
const file = await new Promise(resolve => {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'video/mp4';
  input.onchange = () => resolve(input.files[0]); input.click();
});
const uploadUrl = prompt('URL rupload/fb_video thực tế:');
const mediaId = prompt('Header product_media_id từ Network:');
const chunkId = prompt('Header id từ Network:');
const sessionId = prompt('Header composer_session_id từ Network:');
const entityName = prompt('Header x-entity-name từ Network:');

const response = await fetch(uploadUrl, {
  method: 'POST', credentials: 'include',
  headers: {
    'id': chunkId,
    'product_media_id': mediaId,
    'composer_session_id': sessionId,
    'x-entity-name': entityName,
    'x-entity-type': file.type || 'video/mp4',
    'x-entity-length': String(file.size),
    'x-total-asset-size': String(file.size),
    'start_offset': '0',
    'end_offset': String(file.size),
    'offset': prompt('Header offset từ Network:'),
    // Giữ thêm các header khác nếu có trong Network.
  },
  body: file
});
console.log(response.status, await response.text());
```

### Response

```json
{"dc":"<DATACENTER>","offset":11368}
```

*Facebook cũng có thể trả về JSON chứa trường `h` ở các request khác trong cùng luồng. Truyền file riêng lẻ chưa đủ để xuất bản bài viết.*

## 3. Xác nhận upload

```http
POST https://vupload2.facebook.com/ajax/video/upload/requests/receive/
Content-Type: application/x-www-form-urlencoded
```

### Body Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `waterfall_id` | string | Cùng upload start |
| `target_id` | string | UID tài khoản |
| `video_id` | string | Từ `payload.video_id` của upload start |
| `source` | string | `composer` |
| `composer_entry_point_ref` | string | `timeline` |
| `supports_chunking` | string | `true` |
| `supports_upload_service` | string | `true` |
| `partition_start_offset` | string | `0` |
| `partition_end_offset` | string | Số byte cuối, ví dụ `11368` |
| `start_offset`, `end_offset` | string | Offset của chunk |
| `upload_speed` | string | Tốc độ upload |
| `fbuploader_video_file_chunk` | string | Chuỗi định danh chunk do Facebook tạo: `index:base64(filename):mime:token` |
| `composer_dialog_version` | string | `V2` |
| `fb_dtsg`, `jazoest`, `lsd`, `__user`, ... | string | Giá trị session và các field web lấy từ Network |

### Example Code — JavaScript Console

```javascript
const data = new URLSearchParams(prompt('Form Data receive từ Network:'));
data.set('video_id', prompt('video_id từ response start:'));
// Giữ nguyên trường fbuploader_video_file_chunk của lượt upload hiện tại.
const response = await fetch(
  'https://vupload2.facebook.com/ajax/video/upload/requests/receive/',
  {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: data.toString()
  }
);
console.log(response.status, await response.text());
```

### Response (cấu trúc thực tế)

```json
{
  "__ar": 1,
  "payload": {"start_offset": 0, "end_offset": 11368},
  "rid": "<REQUEST_ID>",
  "lid": "<LOG_ID>"
}
```

## 4. Đăng video (caption, video_id, quyền riêng tư)

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

**Mutation:** `ComposerStoryCreateMutation`

### Body Parameters

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

### Payload JSON (rút gọn)

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

Giữ nguyên các field bổ sung của request khi gửi.

### Example Code — JavaScript Console

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

### Response

Facebook trả phản hồi GraphQL JSON (có thể có tiền tố `for (;;);`). Kiểm tra `data`, `errors` và permalink thực tế; **HTTP 200 chưa chắc đã đăng thành công**. Sau khi gửi, không tự động retry nếu trạng thái không rõ.
