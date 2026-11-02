# Facebook API 2027

Tài liệu API Facebook Web đã bắt request thực tế trên Chrome 9223 (02/11/2026).

## DANH SÁCH API

| API | Endpoint chính | Tài liệu |
| --- | --- | --- |
| **Đăng video** | `POST https://www.facebook.com/api/graphql/` + các request upload video | [API ĐĂNG VIDEO](api/publish-video.md) |
| **Xóa bài viết** | `POST https://www.facebook.com/api/graphql/` (thùng rác / xóa vĩnh viễn) | [API XÓA BÀI VIẾT](api/delete-post.md) |

Mỗi API có **endpoint, method, bảng tham số payload, response, Example Code JavaScript** chạy trong F12 → Console trình duyệt; không dùng Node.js.

**Đã thử nghiệm:** Upload và đăng video 3 giây ở chế độ Chỉ mình tôi; chuyển vào thùng rác và xóa vĩnh viễn. Facebook Web API là API nội bộ, các trường phiên và `doc_id` có thể thay đổi. Không công khai cookie, token hoặc Form Data chứa thông tin phiên.
