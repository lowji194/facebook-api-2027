# API tải dữ liệu file video

```http
POST https://rupload-{region}.up.facebook.com/fb_video/{upload_token}
Content-Type: binary video data
```

Đây là **request truyền byte video thực tế**. Host `rupload-...` và `upload_token` do Facebook chỉ định trong quá trình upload, **không được cố định**.

## Headers / Payload

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

## Example Code — JavaScript Console

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

## Response (cấu trúc đã quan sát)

```json
{"dc":"<DATACENTER>","offset":11368}
```

*Facebook cũng có thể trả về JSON chứa trường `h` ở các request khác trong cùng luồng. Truyền file riêng lẻ chưa đủ để xuất bản bài viết.*
