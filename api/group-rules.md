# API ĐỌC NỘI QUY NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Query

| Chức năng | fb_api_req_friendly_name | doc_id (tham khảo) |
| --- | --- | --- |
| Nội quy nhóm | `CometGroupRulesContentQuery` | `9847255165329959` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm |
| `data.group.group_rules.edges[].node.id` | string | ID nội quy trong phản hồi |
| `data.group.group_rules.edges[].node.rule_title` | string | Tiêu đề nội quy |
| `data.group.group_rules.edges[].node.description` | string | Nội dung nội quy |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên Facebook |
| `variables` | JSON string | JSON chứa các tham số trong bảng |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Mở F12 → Network và sao chép Form Data của request đúng query này.
  const form = new URLSearchParams(prompt('Form Data của request GraphQL:') || '');
  const allowed = ["CometGroupRulesContentQuery"];
  const operation = form.get('fb_api_req_friendly_name');
  if (!allowed.includes(operation)) throw Error('Sai GraphQL query');
  const variables = JSON.parse(form.get('variables') || '{}');
  variables.groupID = prompt('Group ID:');
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

data.group.group_rules → count, edges[].node (id, rule_title, description), page_info.

**Lưu ý:** Cookie phiên được trình duyệt tự gửi. `doc_id` và các tham số nội bộ có thể thay đổi.
