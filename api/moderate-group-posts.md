# API DUYỆT BÀI NHÓM

~~~http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
~~~

## Mutation

| Hàng đợi | Hành động | fb_api_req_friendly_name | doc_id trong mã nguồn |
| --- | --- | --- | --- |
| Chờ duyệt | Duyệt | `GroupsCometApprovePendingStoryMutation` | `28651000911229192` |
| Chờ duyệt | Từ chối | `GroupsCometDeclinePendingStoryMutation` | `29098726336483292` |
| Spam | Duyệt | `GroupsCometModminReviewFolderApproveContentMutation` | `9662498830453426` |
| Spam | Từ chối | `GroupsCometModminReviewFolderDeclineContentMutation` | `30216535437945305` |

## Body Parameters

| Parameter | Type | Value / Mô tả |
| --- | --- | --- |
| `doc_id` | string | ID mutation tương ứng trong bảng |
| `fb_api_req_friendly_name` | string | Tên mutation tương ứng |
| `variables.input.group_id` | string | **Group ID** |
| `variables.input.story_id` | string | **Story ID bài đang chờ duyệt**, lấy từ API quét |
| `variables.input.actor_id` | string | UID người quản trị đang thực hiện |
| `variables.input.client_mutation_id` | string | ID mới cho lượt xử lý |
| `variables.input.action_source` | string | `GROUP_PENDING_POSTS` hoặc `GROUP_MODMIN_REVIEW_FOLDER` |
| `variables.input.trust_author` | boolean | `false` khi duyệt hàng đợi pending |
| `variables.memberID` | string/null | UID tác giả bài viết (pending) |
| `variables.member_id` | string/null | UID tác giả bài viết (spam/từ chối) |
| `fb_dtsg`, `lsd`, `jazoest` và `__*` | string | Thông số phiên từ request Facebook |

## Example Code — JavaScript Console

Dùng Form Data từ **GraphQL request tại trang chờ duyệt** làm mẫu phiên. Ví dụ dưới đây hỗ trợ duyệt hoặc từ chối ở hai hàng đợi.

~~~javascript
(async () => {
  const form = new URLSearchParams(prompt('GraphQL Form Data từ Network:') || '');
  if (!form.get('fb_dtsg') || !form.get('__user')) throw Error('Thiếu session');
  const groupID = prompt('Group ID:');
  const storyID = prompt('Story ID bài cần xử lý:');
  const authorID = prompt('Author ID bài viết:') || null;
  const queue = prompt('pending hoặc spam:', 'pending');
  const action = prompt('approve hoặc decline:', 'approve');
  if (!groupID || !storyID || !['pending','spam'].includes(queue) ||
      !['approve','decline'].includes(action)) return;

  const source = JSON.parse(form.get('variables') || '{}');
  const relay = Object.fromEntries(
    Object.entries(source).filter(([key]) => key.startsWith('__relay_internal__pv__'))
  );
  const spam = queue === 'spam';
  const approve = action === 'approve';
  const operations = spam
    ? (approve
      ? ['GroupsCometModminReviewFolderApproveContentMutation', '9662498830453426']
      : ['GroupsCometModminReviewFolderDeclineContentMutation', '30216535437945305'])
    : (approve
      ? ['GroupsCometApprovePendingStoryMutation', '28651000911229192']
      : ['GroupsCometDeclinePendingStoryMutation', '29098726336483292']);

  const input = {
    action_source: spam ? 'GROUP_MODMIN_REVIEW_FOLDER' : 'GROUP_PENDING_POSTS',
    group_id: groupID,
    story_id: storyID,
    actor_id: form.get('__user'),
    client_mutation_id: crypto.randomUUID()
  };

  let variables;
  if (spam) {
    variables = approve ? { input } : { input, contentType: 'GROUP_POST', member_id: authorID };
  } else if (!approve) {
    variables = { currentSection: 'pending_posts', input, memberID: authorID, scale: 1 };
  } else {
    input.trust_author = false;
    variables = {
      ...relay,
      currentSection: 'pending_posts',
      input,
      feedLocation: 'GROUP_PENDING',
      feedbackSource: 0,
      focusCommentID: null,
      groupID,
      hasHoistStories: false,
      hoistStories: [],
      hoistStoriesCount: 0,
      memberID: authorID,
      privacySelectorRenderLocation: 'COMET_STREAM',
      referringStoryRenderLocation: null,
      renderLocation: 'group_pending_queue',
      scale: 1,
      shouldDeferMainFeed: false,
      sortingSetting: null,
      useDefaultActor: false
    };
  }

  form.set('fb_api_req_friendly_name', operations[0]);
  form.set('doc_id', operations[1]);
  form.set('variables', JSON.stringify(variables));
  form.set('server_timestamps', 'true');

  if (!confirm((approve ? 'DUYỆT' : 'TỪ CHỐI') + ' bài ' + storyID + '?')) return;
  const response = await fetch('/api/graphql/', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  });
  const result = await response.text();
  console.log('HTTP:', response.status, 'Response:', result);
})();
~~~

## Response

Response GraphQL trả về `data` hoặc `errors`; HTTP 200 chưa chứng minh thành công. **Quét lại hàng đợi** và xác nhận `story_id` đã rời danh sách cần duyệt.

**Nguồn:** `/opt/facebook-moderator/facebook_moderation_graphql.py`. Các mutation và cấu trúc `variables` lấy trực tiếp từ mã đang sử dụng. **Chưa có bài chờ duyệt để thử mutation trực tiếp** trong phiên kiểm tra ngày 02/11/2026, vì vậy không khẳng định các `doc_id` mutation vẫn hoạt động ở phiên mới.
