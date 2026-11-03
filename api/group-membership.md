# API QUẢN LÝ THAM GIA NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Endpoint / Mutation

| Chức năng | fb_api_req_friendly_name | doc_id / Endpoint (tham khảo) |
| --- | --- | --- |
| Gửi yêu cầu tham gia | `useGroupRequestToJoinMutation` | `28794147596943314` |
| Rời nhóm / Hủy yêu cầu | `useGroupLeaveMutation` | `28829100566720377` |
| Gửi câu trả lời gia nhập | `useGroupMembershipAnswersSaveMutation` | `29365677003051638` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm |
| `variables.input.group_id` | string | ID nhóm |
| `variables.input.actor_id` | string | UID tài khoản gửi request |
| `variables.input.client_mutation_id` | string | ID mỗi lượt thao tác |
| `variables.input.answers` | array | Câu trả lời gia nhập (mutation Answers) |
| `variables.input.answers[].question_id` | string | ID câu hỏi lấy từ API thông tin nhóm |
| `variables.input.answers[].answer` | string/null | Văn bản cho FREE_TEXT; null cho RADIO/CHECKBOX |
| `variables.input.answers[].selected_options` | array/null | ID lựa chọn; RADIO 1 ID, CHECKBOX có thể nhiều ID |
| `variables.input.rules_agreement_status` | string/null | ACCEPT_RULES khi đồng ý nội quy, nếu được yêu cầu |
| `variables.input.action_source` | string | Nguồn hành động trong mẫu request |
| `variables.input.readd_policy` | string | Chính sách tham gia lại khi rời nhóm |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên từ Facebook |

## Example Code — JavaScript Console

```javascript
(async () => {
  const form = new URLSearchParams(prompt('Form Data của request JOIN/LEAVE/ANSWERS:') || '');
  const operation = form.get('fb_api_req_friendly_name');
  if (![
    'useGroupRequestToJoinMutation', 'useGroupLeaveMutation',
    'useGroupMembershipAnswersSaveMutation'
  ].includes(operation)) throw Error('Sai mutation');
  const variables = JSON.parse(form.get('variables') || '{}');
  const groupID = prompt('Group ID:');
  variables.groupID = groupID;
  variables.input.group_id = groupID;
  variables.input.actor_id = require('CurrentUserInitialData').USER_ID;
  variables.input.client_mutation_id = String(Date.now());
  if (operation === 'useGroupMembershipAnswersSaveMutation') {
    // Giữ nguyên question_id và selected_options từ câu hỏi thực tế.
    variables.input.answers = [
      { question_id: '<QUESTION_ID>', answer: 'Câu trả lời', selected_options: null }
    ];
    // Có thể đổi thành [{ question_id, answer: null, selected_options: ['<OPTION_ID>'] }]
    variables.input.rules_agreement_status = null;
  }
  form.set('variables', JSON.stringify(variables));
  if (!confirm('Gửi yêu cầu thay đổi trạng thái thành viên?')) return;
  const r = await fetch('/api/graphql/', { method:'POST',credentials:'include',body:form });
  console.log(r.status, await r.text());
})();
```

## Response

`data.group_request_to_join`, `data.group_leave` hoặc `data.group_membership_questions_answers_save`. Đọc lại `viewer_join_state` qua API thông tin nhóm để xác nhận.

Hủy yêu cầu đang chờ và rời nhóm cùng sử dụng `useGroupLeaveMutation`; kết quả phụ thuộc trạng thái thành viên hiện tại.
