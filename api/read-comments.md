# API ĐỌC DANH SÁCH BÌNH LUẬN

```http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
```

## Query

| Chức năng | fb_api_req_friendly_name | doc_id (tham khảo) |
| --- | --- | --- |
| Danh sách bình luận | `CommentListComponentsRootQuery` | `40687836624148365` |
| Trang bình luận tiếp theo | `CommentsListComponentsPaginationQuery` | `40096710839942530` |

## Payload / Parameters

| Parameter | Type | Value / Ý nghĩa |
| --- | --- | --- |
| `variables.id` | string | Feedback ID của bài viết |
| `variables.focusCommentID` | string/null | Comment ID cần tìm |
| `variables.commentsAfterCursor` | string/null | Con trỏ phân trang (pagination) |
| `variables.commentsAfterCount` | number | Số bình luận lấy tiếp |
| `variables.feedLocation` | string | Vị trí hiển thị |
| `fb_dtsg`, `lsd`, `__user` | string | Tham số phiên Facebook |
| `variables` | JSON string | JSON chứa các tham số trong bảng |

## Example Code — JavaScript Console

```javascript
(async () => {
  // Mở F12 → Network và sao chép Form Data của request đúng query này.
  const form = new URLSearchParams(prompt('Form Data của request GraphQL:') || '');
  const allowed = ["CommentListComponentsRootQuery","CommentsListComponentsPaginationQuery"];
  const operation = form.get('fb_api_req_friendly_name');
  if (!allowed.includes(operation)) throw Error('Sai GraphQL query');
  const variables = JSON.parse(form.get('variables') || '{}');
  variables.id = prompt('Feedback ID:');
    if (Object.hasOwn(variables, 'focusCommentID')) variables.focusCommentID = null;
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

data.node.comment_rendering_instance_for_feed_location.comments.edges[].node → legacy_fbid (comment_id), author.id, body.text, feedback.url, page_info.

**Lưu ý:** Cookie phiên được trình duyệt tự gửi. `doc_id` và các tham số nội bộ có thể thay đổi.
