# API CẤU HÌNH NHÓM VÀ CÂU HỎI THAM GIA

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Endpoint / Mutation

| Chức năng | fb_api_req_friendly_name | doc_id / Endpoint (tham khảo) |
| --- | --- | --- |
| Tạo nội quy | `useGroupRulesCreateRuleMutation` | `10099396610084756` |
| Bật/tắt xác nhận nội quy | `useGroupRulesAgreementEnableMutation` | `23967233292902197` |
| Tạo/sửa câu hỏi gia nhập | `useGroupMembershipQuestionSaveMutation` | `24849360678090924` |
| Bật/tắt duyệt bài | `useGroupsCometPostApprovalModeSettingMutation` | `9700862846662254` |
| Quyền đăng bài trong nhóm | `GroupsEditPostPermissionMutation` | `39486209520992727` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.input.group_id` | string | ID nhóm |
| `variables.input.actor_id` | string | UID quản trị viên |
| `variables.input.client_mutation_id` | string | ID lượt thao tác |
| `variables.input.title` | string | Tiêu đề nội quy |
| `variables.input.description` | string | Mô tả nội quy |
| `variables.input.question` | string | Nội dung câu hỏi gia nhập |
| `variables.input.question_type` | string | Kiểu câu hỏi: PARAGRAPH / MULTIPLE_CHOICE / CHECKBOXES |
| `variables.input.question_options` | array | Lựa chọn cho RADIO/CHECKBOX |
| `variables.input.question_id` | string/null | ID câu hỏi khi chỉnh sửa |
| `variables.input.setting_type` | string | Loại thiết lập duyệt bài |
| `variables.input.string_value` | string | Giá trị thiết lập |
| `variables.input.post_permission_setting` | string | Quyền đăng bài (theo lựa chọn Facebook) |
| `variables.input.*` | dynamic | Các field khác phải giữ đúng theo request của tính năng |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên từ Facebook |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Lấy Form Data của thao tác cài đặt tương ứng từ Network.
  const form = new URLSearchParams(prompt('Form Data mutation cài đặt nhóm:') || '');
  const operations = [
    'useGroupRulesCreateRuleMutation',
    'useGroupRulesAgreementEnableMutation',
    'useGroupMembershipQuestionSaveMutation',
    'useGroupsCometPostApprovalModeSettingMutation',
    'GroupsEditPostPermissionMutation'
  ];
  const op = form.get('fb_api_req_friendly_name');
  if (!operations.includes(op)) throw Error('Sai mutation');
  const variables = JSON.parse(form.get('variables'));
  variables.input.group_id = prompt('Group ID:');
  variables.input.actor_id = require('CurrentUserInitialData').USER_ID;
  if (Object.hasOwn(variables.input, 'client_mutation_id'))
    variables.input.client_mutation_id = crypto.randomUUID();
  // Chỉnh giá trị chuyên biệt như title, question_options, setting_type
  // ngay trong variables.input theo bảng tham số.
  console.log('Input hiện tại:', variables.input);
  form.set('variables', JSON.stringify(variables));
  if (!confirm('Áp dụng thay đổi cấu hình nhóm?')) return;
  const r = await fetch('/api/graphql/', { method:'POST', credentials:'include',body:form });
  console.log(r.status, await r.text());
})();
```

## Response

JSON GraphQL `data` hoặc `errors`; xác minh lại bằng các query đọc cấu hình nhóm và nội quy.

Chỉ sử dụng khi tài khoản có quyền quản trị nhóm. `setting_type`, `string_value` và các tùy chọn câu hỏi phải lấy đúng giá trị Facebook cung cấp.
