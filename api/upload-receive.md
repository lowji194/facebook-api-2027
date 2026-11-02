# API xác nhận video đã upload

```http
POST https://vupload2.facebook.com/ajax/video/upload/requests/receive/
Content-Type: application/x-www-form-urlencoded
```

## Body Parameters

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
| `upload_speed` | string | Thống kê upload (lượt thử: `0`) |
| `fbuploader_video_file_chunk` | string | Chuỗi định danh chunk do Facebook tạo: `index:base64(filename):mime:token` |
| `composer_dialog_version` | string | `V2` |
| `fb_dtsg`, `jazoest`, `lsd`, `__user`, ... | string | Giá trị session và các field web lấy từ Network |

## Example Code — JavaScript Console

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

## Response (cấu trúc thực tế)

```json
{
  "__ar": 1,
  "payload": {"start_offset": 0, "end_offset": 11368},
  "rid": "<REQUEST_ID>",
  "lid": "<LOG_ID>"
}
```
