---
title: "Cyber SEA Game 2023 | Recap"
date: "2023-11-10"
excerpt: "Post này chỉ để kể câu chuyện đội mình đi thi Cyber SEA Game 2023 tại Bangkok, Thailand (9-10/11/2023)"
---
![](/images/cyberseagame2023/featured.png)

Post này chỉ để kể câu chuyện đội mình đi thi Cyber SEA Game 2023 tại Bangkok, Thailand (9-10/11/2023)
##  Cyber SEA Game 2023 (Bangkok - Thailand)

![](/images/cyberseagame2023/image-4.png)

## Tổng quan về cuộc thi của đội Việt Nam
Trong 5 phút đầu tiên, khi team Việt Nam nhận server và tài khoản cũng như thực hiện các thao tác về đổi mật khẩu và kiểm tra, chúng tôi ngạc nhiên khi thấy có tới 6 team khác đã lần lượt submit các chủ đề, nhưng chưa rõ điều gì đã xảy ra.

Các thành viên trong đội tự quản lý khối lượng công việc một cách rõ ràng, mặc dù hơi tiếc rằng Huy và Thành, chuyên sâu về Binary và Web Exploitation, lại không có chủ đề nào liên quan đến sở trường của họ. Cụ thể:

-  Việt Anh đảm nhận `Cryptography` và `Network`
-  Hoàng Huy chịu trách nhiệm cho `Hacking Challenge 1`
-  Thái Sơn thực hiện các nhiệm vụ `OSINT`, `Steganography`, `Forensic`, `Reversing`, và `Memory`
-  Chí Thành đảm nhiệm `Hacking Challenge 2`.

Chúng tôi cảm thấy áp lực khi đội Singapore thực hiện nhanh chóng và hoàn thành trong thời gian ngắn. Tuy nhiên, RobinHust không nản chí và cố gắng hết mình để hoàn thành các thách thức của mình. Đặc biệt, các thách thức không chỉ đòi hỏi sử dụng các kỹ thuật tấn công cơ bản mà còn đòi hỏi sự sáng tạo và "cảm nhận từ giác quan" (hay còn gọi 1 cách khác là bruteforce :3):

- ![](/images/cyberseagame2023/image.png)

- Trong bài `Flag #03: Cracking a Zip File` của chủ đề `Cryptography`, có một yêu cầu là phải giải mã mật khẩu `openthesamesenovemberXXXX`, và việc bruteforce 4 ký tự cuối có thể mất một khoảng thời gian (theo lời giải chính thức đến từ BTC). Tuy nhiên, thông qua khả năng suy luận, chúng tôi đã thử nghiệm thành công với 4 ký tự cuối là `2023`, giúp quá trình trở nên nhanh chóng và dễ dàng
- Hoàng Huy tấn công thành công `Hacking Challenge 1`, liên tục vượt qua các thách thức. Team Việt Nam đã thể hiện khả năng xuất sắc trong việc giải quyết thử thách này nhờ đọc kỹ tài liệu từ BTC và thử nghiệm trước.
- Thái Sơn đã xử lý thành công các thử thách về `Steganography`, `Memory`, `Reversing` và mở các thử thách `Forensic`.
- Thành đã chuyển sang hỗ trợ Sơn và Việt Anh trong các thử thách `Forensic` và `Crypto`, sau đó quay trở lại cùng Hoàng Huy để giải quyết `Hacking Challenge 2`.
- Mọi thứ diễn ra mượt mà và suôn sẻ, đội đã hoàn thành toàn bộ các thách thức trong vòng 3 tiếng 30 phút.
- Trong cuộc thi, hầu hết các đội đều có tỉ lệ submit sai khá lớn cùng 1 lượng thời gian lãng phí quá nhiều vì phải đoán trong thử thách `Flag #03 Initial execution` của chủ đề điều tra số `Forensic` đưa ra 1 danh sách khá nhiều những flag giả mà chúng tôi phải thử để giải quyết


![](/images/cyberseagame2023/image-5.png)

## Phase 1: khởi đầu của cuộc thi (Khoảng 1 tiếng từ sau khi cuộc thi bắt đầu)

Đội của chúng tôi khởi đầu không mấy thuận lợi khi trở thành đội chậm nhất trong số 10 đội giải quyết thử thách đầu tiên.

![](/images/cyberseagame2023/image-6.png)

Các đội khác bắt đầu submit từng thử thách từ 12:00 và đến tận 12:22 team Việt Nam mới submit được challenge đầu của Việt Anh (Thật sự khâm phục các thành viên trong đội vì giữ được sự bình tĩnh đến không ngờ)

Sau đó các thành viên lần lượt submit các bài đầu tiên của từng chủ đề (tới lúc này vẫn giữ vị trí cuối bảng do các đội khác đã submit rất nhiều các thử thách khác từ trước đó một lúc)

![](/images/cyberseagame2023/image-2.png)

## Phase 2: mid game (Khoảng 2 tiếng từ sau khi cuộc thi bắt đầu)
Sau khi bị mắc kẹt ở những thử thách ban đầu, đội của chúng tôi đã khôi phục được phong độ và thành công trong việc giải quyết các thách thức tiếp theo một cách nhanh chóng.

**Bứt tốc lần 1**: sau khoảng 30 phút kể từ khi giải được challenge đầu tiên, team đã bứt tốc từ vị trí cuối bảng lên vị trí 6, bị dẫn trước bởi các team Singapore, Malaysia, Thái, Brunei và Myanmar


![](/images/cyberseagame2023/image-7.png)

Sau hơn một giờ diễn ra cuộc thi, đội Singapore đã gây ấn tượng khi hoàn thành tất cả các thử thách, kèm theo việc lắc chuông mỗi khi "clear" một chủ đề nào đó. Lúc này, tâm lý của đội chúng tôi có chút "sốc", nhưng đã nhanh chóng ổn định tinh thần và tiếp tục vượt qua mọi thách thức.

![](/images/cyberseagame2023/image-8.png)
    
**Bứt tốc lần 2**: Khoảng 1 giờ 45 phút đến 2 giờ sau khi cuộc thi bắt đầu, đội của chúng tôi liên tục giải quyết các thử thách về `Crypto`, `Hacking Challenge 1` và `Forensic`. Việc này giúp đội chúng tôi vượt qua đội Thái Lan, đồng thời chiếm top 3 trên Bảng xếp hạng, chỉ đứng sau đội Singapore và Malaysia.

![](/images/cyberseagame2023/image-9.png)

## Phase 3: End game
**Bứt tốc lần 3**: Sau một thời gian dài bế tắc ở các thách thức `Forensic` và `Hacking Challenge 2` bởi độ guessing của chúng, bằng thiên phú "bruteforce" của các thành viên, đội của chúng tôi cuối cùng cũng vượt qua khó khăn, giải quyết một lượt toàn bộ các thử thách Forensic (tới lúc này Thái Sơn gần như đã thuộc toàn bộ source của 7 thử thách `Forensic` vì luẩn quẩn ở đây quá lâu 🤣) 

![](/images/cyberseagame2023/image-10.png)

Chốt hạ `Cyber SEA Game 2023` với Việt Nam là thử thách cuối của `Hacking Challenge 2` bằng cú submit của Hoàng Huy. Điều này giúp chúng tôi vượt qua đội Malaysia, trở thành đội thứ hai giải toàn bộ các thử thách, sau gần 4 tiếng đồng hồ.

![](/images/cyberseagame2023/image-11.png)

P/s: Sau đó khoảng 1 tiếng thì đội thứ 3 là Team Thailand cũng hoàn thành toàn bộ thử thách và BTC đã có thể định ra 3 đội trao Nhất, Nhì, Ba của toàn giải Cyber SEA Game.

## Bảng xếp hạng

![](/images/cyberseagame2023/image-12.png)

## Trao Giải
Tuy có chút tiếc nuối về việc không đạt được chiếc cúp vô địch của **Cyber SEA Game** nhưng `Nu_RobinHust` cũng rút ra được bài học rất lớn về việc chuẩn bị kỹ càng mọi thứ trước khi tham gia 1 cuộc thi cũng như sự bình tĩnh khi gặp các khó khăn đột ngột.

![](/images/cyberseagame2023/image-13.png)

Đây sẽ là bước tiến rất lớn cho team cũng như Đại học Bách khoa Hà Nội, chúng mình cũng sẽ lấy đó làm kinh nghiệm và động lực để phát triển bản thân mình trong tương lai.