# API QUÉT YÊU CẦU THAM GIA NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Query

| Chức năng | fb_api_req_friendly_name | doc_id (tham khảo) |
| --- | --- | --- |
| Danh sách thành viên chờ duyệt | `CometGroupMemberRequestsRootQuery` | `29026848710281033` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm |
| `variables.currentSection` | string | Phần đang xem trong quản trị nhóm |
| `variables.pending_member_filters` | object | Lọc yêu cầu gia nhập |
| `variables.orderby` | string | Thứ tự hiển thị |
| `variables.scale` | number | Tỷ lệ hiển thị |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên Facebook |
| `variables` | JSON string | JSON chứa các tham số trong bảng |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Mở F12 → Network và sao chép Form Data của request đúng query này.
  const form = new URLSearchParams(prompt('Form Data của request GraphQL:') || '');
  const allowed = ["CometGroupMemberRequestsRootQuery"];
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

data.group và các danh sách pending member requests, người gửi, trạng thái và phân trang (cấu trúc chi tiết theo bản Facebook).

**Lưu ý:** Cookie phiên được trình duyệt tự gửi. `doc_id` và các tham số nội bộ có thể thay đổi.
