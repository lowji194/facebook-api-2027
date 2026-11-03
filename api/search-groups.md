# API TÌM KIẾM NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Query

| Chức năng | fb_api_req_friendly_name | doc_id (tham khảo) |
| --- | --- | --- |
| Tìm nhóm | `SearchCometResultsPaginatedResultsQuery` | `29059909553668516` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.args.text` | string | Từ khóa tìm kiếm |
| `variables.count` | number | Số kết quả mỗi trang |
| `variables.cursor` | string/null | Con trỏ phân trang |
| `variables.fetch_filters` | object/array | Bộ lọc kết quả |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên Facebook |
| `variables` | JSON string | JSON chứa các tham số trong bảng |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Mở F12 → Network và sao chép Form Data của request đúng query này.
  const form = new URLSearchParams(prompt('Form Data của request GraphQL:') || '');
  const allowed = ["SearchCometResultsPaginatedResultsQuery"];
  const operation = form.get('fb_api_req_friendly_name');
  if (!allowed.includes(operation)) throw Error('Sai GraphQL query');
  const variables = JSON.parse(form.get('variables') || '{}');
  variables.args = variables.args || {};
    variables.args.text = prompt('Từ khóa tìm nhóm:');
    variables.cursor = null;
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

data → Search results → edges → rendering_strategy.view_model.profile (id, name, url); page_info (end_cursor, has_next_page).

**Lưu ý:** Cookie phiên được trình duyệt tự gửi. `doc_id` và các tham số nội bộ có thể thay đổi.
