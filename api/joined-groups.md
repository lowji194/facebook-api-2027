# API LẤY DANH SÁCH NHÓM ĐÃ THAM GIA

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Query

| Chức năng | fb_api_req_friendly_name | doc_id (tham khảo) |
| --- | --- | --- |
| Danh sách nhóm | `GroupsCometAllJoinedGroupsSectionPaginationQuery` | `9974006939348139` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.count` | number | Số nhóm cần lấy |
| `variables.cursor` | string/null | Con trỏ trang tiếp theo |
| `variables.ordering` | string | Thứ tự sắp xếp |
| `variables.scale` | number | Tỷ lệ hiển thị |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên Facebook |
| `variables` | JSON string | JSON chứa các tham số trong bảng |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Mở F12 → Network và sao chép Form Data của request đúng query này.
  const form = new URLSearchParams(prompt('Form Data của request GraphQL:') || '');
  const allowed = ["GroupsCometAllJoinedGroupsSectionPaginationQuery"];
  const operation = form.get('fb_api_req_friendly_name');
  if (!allowed.includes(operation)) throw Error('Sai GraphQL query');
  const variables = JSON.parse(form.get('variables') || '{}');
  variables.count = 30;
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

data.viewer.all_joined_groups.tab_groups_list.edges[].node → id, name, url, viewer_join_state; page_info.

**Lưu ý:** Cookie phiên được trình duyệt tự gửi. `doc_id` và các tham số nội bộ có thể thay đổi.
