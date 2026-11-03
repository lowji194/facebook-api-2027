# API DUYỆT YÊU CẦU THAM GIA NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Endpoint / Mutation

| Chức năng | fb_api_req_friendly_name | doc_id / Endpoint (tham khảo) |
| --- | --- | --- |
| Phê duyệt thành viên chờ | `GroupsCometApprovePendingMemberMutation` | `28385045111162926` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm |
| `variables.user_id` | string | UID thành viên cần duyệt |
| `variables.input.group_id` | string | ID nhóm |
| `variables.input.user_id` | string | UID thành viên được duyệt |
| `variables.input.actor_id` | string | UID quản trị viên |
| `variables.input.client_mutation_id` | string | ID lượt thao tác |
| `variables.input.pending_member_filters` | object | Bộ lọc yêu cầu |
| `variables.input.name_search_string` | string | Từ khóa tìm thành viên (nếu có) |
| `variables.currentSection` | string | Vị trí trong trang quản trị |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên từ Facebook |

## Example Code — JavaScript Console

```javascript
(async () => {
  const form = new URLSearchParams(prompt('Form Data của GroupsCometApprovePendingMemberMutation:') || '');
  if (form.get('fb_api_req_friendly_name') !== 'GroupsCometApprovePendingMemberMutation') throw Error('Sai mutation');
  const variables = JSON.parse(form.get('variables'));
  const groupID = prompt('Group ID:');
  const userID = prompt('UID thành viên:');
  variables.groupID = groupID;
  variables.user_id = userID;
  variables.input.group_id = groupID;
  variables.input.user_id = userID;
  variables.input.actor_id = require('CurrentUserInitialData').USER_ID;
  variables.input.client_mutation_id = String(Date.now());
  form.set('variables', JSON.stringify(variables));
  if (!confirm('Duyệt thành viên '+userID+'?')) return;
  const r = await fetch('/api/graphql/', { method:'POST',credentials:'include',body:form });
  console.log(r.status, await r.text());
})();
```

## Response

JSON GraphQL trả `data` hoặc `errors`; kiểm tra lại danh sách yêu cầu tham gia và `viewer_join_state` của thành viên.

Yêu cầu quyền quản trị hoặc quyền duyệt thành viên. Không tự động suy diễn người dùng đã thành thành viên chỉ từ HTTP 200.
