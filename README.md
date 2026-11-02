# Facebook API 2027

Tài liệu API Facebook Web **đã bắt request thực tế trên Chrome 9223 (02/11/2026)**. Ví dụ JavaScript là mã \`fetch()\` **dán trực tiếp trong Console trình duyệt**, không phải Node.js.

## API

| API | Method | Endpoint | Tài liệu |
| --- | --- | --- | --- |
| Khởi tạo upload video | POST | \`vupload2.facebook.com/ajax/video/upload/requests/start/\` | [Upload Start](api/upload-start.md) |
| Gửi dữ liệu file video | POST | \`rupload-{region}.up.facebook.com/fb_video/{upload_token}\` | [Upload Binary](api/upload-binary.md) |
| Xác nhận dữ liệu video | POST | \`vupload2.facebook.com/ajax/video/upload/requests/receive/\` | [Upload Receive](api/upload-receive.md) |
| Đăng video lên trang cá nhân | POST | \`www.facebook.com/api/graphql/\` — \`ComposerStoryCreateMutation\` | [Publish Video](api/publish-video.md) |
| Xóa bài/video (vào thùng rác) | POST | \`www.facebook.com/api/graphql/\` — \`useCometTrashPostMutation\` | [Delete Post](api/delete-post.md) |

**Thử nghiệm:** Upload và đăng video 3 giây ở chế độ **Chỉ mình tôi** thành công; đã chuyển bài thử nghiệm vào thùng rác. Các endpoint là API nội bộ của Facebook, có thể đổi. Những giá trị phiên như \`fb_dtsg\`, \`lsd\`, \`doc_id\`, \`waterfall_id\`, \`video_id\`, \`story_id\` phải lấy từ request/response thực tế, không cố định.

**Authentication:** Dán mã vào F12 → Console trên \`https://www.facebook.com/\`. Trình duyệt tự gửi cookie đã đăng nhập với \`credentials: "include"\`. Không tự đặt header \`Cookie\`; không chia sẻ token, cookie hoặc full payload chứa dữ liệu phiên.
