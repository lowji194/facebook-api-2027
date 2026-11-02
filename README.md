# Facebook API 2027

Tài liệu API request trực tiếp bằng JavaScript, dùng HTTP endpoint và cookie phiên Facebook. Không có Python, CDP, Playwright hoặc worker.

**Lưu ý:** Mã Workflow cũ không có API HTTP đăng video bằng cookie. Phương thức trước đó dùng trình duyệt Chrome đã đăng nhập, nên chưa xác minh được endpoint **upload/publish video**, doc_id và variables cho tác vụ đăng video. Không tuyên bố mã mẫu đã đăng video thành công.

## GraphQL HTTP (tham khảo)

| Trường | Giá trị |
| --- | --- |
| Endpoint | https://www.facebook.com/api/graphql/ |
| Method | POST |
| Content-Type | application/x-www-form-urlencoded |
| Authentication | Cookie Facebook |
| Tham số thường gặp | doc_id, variables, fb_dtsg, lsd |
| Response | JSON; có thể bắt đầu bằng tiền tố for (;;); |

Đây là endpoint GraphQL cơ bản, **không phải endpoint đăng video đã xác minh**. Quá trình đăng video có thể cần nhiều request upload và publish khác nhau.

## JavaScript fetch()

Xem ví dụ HTTP trực tiếp: [examples/request.js](examples/request.js). Yêu cầu Node.js >=20, không cần package ngoài.

Cấu hình biến môi trường của máy đang chạy: FACEBOOK_COOKIE, FACEBOOK_DOC_ID, FACEBOOK_FB_DTSG, tùy chọn FACEBOOK_LSD và FACEBOOK_VARIABLES.

~~~bash
node examples/request.js
~~~

Mã mẫu gửi request HTTP trực tiếp tới endpoint GraphQL với thông số được cung cấp. Nó không tự động đăng video và không tự đi lấy session.

## Để hoàn thiện tài liệu API upload video

Cần 2 request đã đối chiếu thực tế của một phiên Facebook được phép sử dụng: bước upload media và bước publish bài/video. Chỉ ghi URL, method, tên headers, field schema và response đã ẩn dữ liệu nhạy cảm; tuyệt đối không đưa cookie/token/session thật lên GitHub.
