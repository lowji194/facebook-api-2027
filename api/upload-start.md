# API khởi tạo upload video

```http
POST https://vupload2.facebook.com/ajax/video/upload/requests/start/
Content-Type: application/x-www-form-urlencoded
```

## Body Parameters

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
| `video_publisher_action_source` | string | Trống trong lượt thử |
| `fb_dtsg`, `jazoest`, `lsd` | string | Giá trị phiên Facebook |
| `__user`, `__a`, `__req`, `__spin_*`, ... | string | Các trường động khác của request web; giữ nguyên từ Network |

## Example Code — JavaScript Console

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

## Response (cấu trúc thực tế)

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

*Các ID là placeholder; offset ví dụ thuộc video 11.368 byte. Không sử dụng lại `waterfall_id` của phiên khác.*
