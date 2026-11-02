# API QUÉT BÀI CHỜ DUYỆT NHÓM

~~~http
POST https://www.facebook.com/api/graphql/
Content-Type: application/x-www-form-urlencoded
~~~

## Endpoint / Query

| Hàng đợi | fb_api_req_friendly_name | doc_id (đã kiểm tra 02/11/2026) |
| --- | --- | --- |
| Bài chờ duyệt | `GroupsCometPendingPostsPostsSectionQuery` | `29030302419938560` |
| Nội dung cần xem xét (spam) | `GroupsCometModminReviewFolderRootQuery` | `28881786671481084` |

## Body Parameters

| Parameter | Type | Value / Mô tả |
| --- | --- | --- |
| `fb_api_req_friendly_name` | string | Tên query trong bảng |
| `doc_id` | string | ID GraphQL tương ứng |
| `variables.groupID` | string | **ID nhóm cần quét** |
| `variables.feedLocation` | string | `GROUP_PENDING` hoặc `GROUPS_MODMIN_REVIEW_FOLDER` |
| `variables.renderLocation` | string | `group_pending_queue` hoặc `groups_modmin_review_folder` |
| `variables.currentSection` | string | Với spam: `MODMIN_REVIEW_FOLDER` |
| `variables.pro_tip_surface` | string | Với spam: `SPAM_QUEUE` |
| `variables.scale` | number | `1` |
| `variables.privacySelectorRenderLocation` | string | `COMET_STREAM` |
| `__user`, `fb_dtsg`, `jazoest`, `lsd` và `__*` | string | Thông số phiên từ request Facebook, không hardcode |
| `variables.__relay_internal__pv__*` | dynamic | Relay provider lấy nguyên từ request gốc |

## Example Code — JavaScript Console

Mở `https://www.facebook.com/groups/<GROUP_ID>/pending_posts`, vào F12 → Network, lấy **Form Data (view source)** của một request `/api/graphql/` rồi dán vào hộp thoại:

~~~javascript
(async () => {
  const form = new URLSearchParams(prompt('GraphQL Form Data từ Network:') || '');
  if (!form.get('fb_dtsg')) throw Error('Thiếu dữ liệu phiên');
  const groupID = prompt('Group ID:');
  const queue = prompt('pending hoặc spam:', 'pending');
  if (!groupID || !['pending', 'spam'].includes(queue)) return;

  const prior = JSON.parse(form.get('variables') || '{}');
  const relay = Object.fromEntries(
    Object.entries(prior).filter(([key]) => key.startsWith('__relay_internal__pv__'))
  );

  const pending = queue === 'pending';
  const variables = pending ? {
    ...relay,
    feedLocation: 'GROUP_PENDING',
    feedbackSource: 0,
    groupID,
    hoistedPostID: null,
    pendingStoriesOrderBy: null,
    privacySelectorRenderLocation: 'COMET_STREAM',
    renderLocation: 'group_pending_queue',
    scale: 1
  } : {
    ...relay,
    contentType: null,
    currentSection: 'MODMIN_REVIEW_FOLDER',
    feedbackSource: 0,
    feedLocation: 'GROUPS_MODMIN_REVIEW_FOLDER',
    groupID,
    privacySelectorRenderLocation: 'COMET_STREAM',
    pro_tip_surface: 'SPAM_QUEUE',
    renderLocation: 'groups_modmin_review_folder',
    scale: 1,
    searchTerm: null
  };

  form.set('fb_api_req_friendly_name', pending
    ? 'GroupsCometPendingPostsPostsSectionQuery'
    : 'GroupsCometModminReviewFolderRootQuery');
  form.set('doc_id', pending ? '29030302419938560' : '28881786671481084');
  form.set('variables', JSON.stringify(variables));
  form.set('server_timestamps', 'true');

  const response = await fetch('/api/graphql/', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString()
  });

  const raw = (await response.text()).replace(/for\s*\(;;\);/g, '');
  const results = raw.split(/\r?\n/).filter(Boolean).flatMap(line => {
    try { return [JSON.parse(line)]; } catch { return []; }
  });
  const errors = results.flatMap(x => x.errors || []);
  const edges = results.flatMap(x => (
    pending ? x.data?.group?.pending_posts_section_stories?.edges
            : x.data?.group?.modmin_review_folder?.edges
  ) || []);

  console.log('HTTP:', response.status, 'Errors:', errors);
  console.table(edges.map(({ node }) => ({
    story_id: node?.id,
    post_id: node?.post_id,
    author_id: node?.actors?.[0]?.id,
    author: node?.actors?.[0]?.name,
    created_time: node?.creation_time,
    permalink: node?.permalink_url,
    caption: node?.comet_sections?.content?.story?.message?.text
  })));
})();
~~~

## Response

~~~json
{
  "data": {
    "group": {
      "pending_posts_section_stories": {
        "edges": [
          {
            "node": {
              "id": "<STORY_ID>",
              "post_id": "<POST_ID>",
              "actors": [{"id": "<AUTHOR_ID>", "name": "<AUTHOR_NAME>"}],
              "creation_time": 1790000000,
              "permalink_url": "<POST_URL>",
              "comet_sections": {
                "content": {"story": {"message": {"text": "<CONTENT>"}}}
              },
              "attachments": []
            }
          }
        ],
        "page_info": {"has_next_page": false, "end_cursor": null}
      }
    }
  }
}
~~~

Với hàng đợi spam, thay `pending_posts_section_stories` bằng `modmin_review_folder`. Response mẫu trên minh họa các trường dữ liệu đã xử lý trong mã nguồn. Có thể lấy media (ảnh/video) từ `attachments`. **Phải có quyền quản trị/kiểm duyệt nhóm**.

**Kiểm thử chỉ đọc:** Đã chạy thành công hai query trên nhóm cấu hình của `/opt/facebook-moderator` ngày 02/11/2026; kết quả hiện có **0 bài** ở cả hai hàng đợi. Không có bài nào bị thay đổi.
