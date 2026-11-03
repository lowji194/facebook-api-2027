# API QUÉT BÀI VIẾT TRONG NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Query

| Chức năng | fb_api_req_friendly_name | doc_id (tham khảo) |
| --- | --- | --- |
| Đọc bảng tin nhóm | `GroupsCometFeedRegularStoriesPaginationQuery` | `29313562134943537` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.id` | string | ID nhóm |
| `variables.cursor` | string/null | Con trỏ trang tiếp theo |
| `variables.count` | number | Số bài viết cần lấy |
| `variables.sortingSetting` | string | CHRONOLOGICAL để lấy bài mới |
| `variables.feedLocation` | string | Ngữ cảnh feed |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên Facebook |
| `variables` | JSON string | JSON chứa các tham số trong bảng |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Mở F12 → Network và sao chép Form Data của request đúng query này.
  const form = new URLSearchParams(prompt('Form Data của request GraphQL:') || '');
  const allowed = ["GroupsCometFeedRegularStoriesPaginationQuery"];
  const operation = form.get('fb_api_req_friendly_name');
  if (!allowed.includes(operation)) throw Error('Sai GraphQL query');
  const variables = JSON.parse(form.get('variables') || '{}');
  variables.id = prompt('Group ID:');
    variables.cursor = null;
    variables.sortingSetting = 'CHRONOLOGICAL';
  form.set('variables', JSON.stringify(variables));
  const response = await fetch('/api/graphql/', {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  });
  console.log('HTTP:', response.status, 'Response:', await response.text());
})();
```

## Response

Các story trong feed → id (story_id), post_id, creation_time, permalink_url, message.text, attachments, feedback.id; page_info.

**Lưu ý:** Cookie phiên được trình duyệt tự gửi. `doc_id` và các tham số nội bộ có thể thay đổi.
