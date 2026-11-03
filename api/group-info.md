# API ĐỌC THÔNG TIN NHÓM

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Query

| Chức năng | fb_api_req_friendly_name | doc_id (tham khảo) |
| --- | --- | --- |
| Trạng thái và thông tin nhóm | `CometGroupRootQuery` | `28401524729543492` |
| Thông tin giới thiệu | `CometGroupAboutRootQuery` | `28729876439996579` |
| Câu hỏi gia nhập và nội quy | `GroupsCometMembershipQuestionsPreloadedDialogQuery` | `28942458795384041` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.groupID` | string | ID nhóm đối với các query thông tin |
| `variables.group_id` | string | ID nhóm với query câu hỏi gia nhập |
| `variables.scale` | number | Tỷ lệ hiển thị (nếu có) |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên Facebook |
| `variables` | JSON string | JSON chứa các tham số trong bảng |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Mở F12 → Network và sao chép Form Data của request đúng query này.
  const form = new URLSearchParams(prompt('Form Data của request GraphQL:') || '');
  const allowed = ["CometGroupRootQuery","CometGroupAboutRootQuery","GroupsCometMembershipQuestionsPreloadedDialogQuery"];
  const operation = form.get('fb_api_req_friendly_name');
  if (!allowed.includes(operation)) throw Error('Sai GraphQL query');
  const variables = JSON.parse(form.get('variables') || '{}');
  const groupID = prompt('Group ID:');
    if (Object.hasOwn(variables, 'group_id')) variables.group_id = groupID;
    else variables.groupID = groupID;
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

data.group → id, name, viewer_join_state, viewer_forum_join_state, is_rules_agreement_enabled, if_viewer_can_see_membership_questions.

**Lưu ý:** Cookie phiên được trình duyệt tự gửi. `doc_id` và các tham số nội bộ có thể thay đổi.
