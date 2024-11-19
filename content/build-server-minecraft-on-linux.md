---
title: "Hướng Dẫn Xây Dựng Server Minecraft Trên Linux – Đơn Giản Và Chuyên Nghiệp"
date: "2024-11-20"
excerpt: "Hướng Dẫn Xây Dựng Server Minecraft Trên Linux – Đơn Giản Và Chuyên Nghiệp"
featured: "https://tmdpc.vn/media/news/0206_CuhnhchiMinecrafttrnPCkhnglogitlag1.jpg"
---

# Hướng Dẫn Xây Dựng Server Minecraft Trên Linux – Đơn Giản Và Chuyên Nghiệp

Minecraft là một trong những tựa game sandbox phổ biến nhất, nơi mà người chơi có thể tự do sáng tạo, phiêu lưu và sinh tồn trong một thế giới không giới hạn. Việc xây dựng một server Minecraft riêng để mời bạn bè cùng tham gia là một trải nghiệm vô cùng thú vị. Bài viết này sẽ hướng dẫn bạn chi tiết cách tạo một server Minecraft trên Linux, từ cài đặt cho đến cấu hình và kết nối với bạn bè.

![](https://tmdpc.vn/media/news/0206_CuhnhchiMinecrafttrnPCkhnglogitlag1.jpg)


## Tại Sao Chọn Linux Để Chạy Server Minecraft?
Linux nổi tiếng với sự ổn định, bảo mật cao và khả năng tối ưu tài nguyên hệ thống. Đây là môi trường lý tưởng để vận hành một server Minecraft mượt mà, ngay cả trên các máy chủ phần cứng khiêm tốn. Với Linux, bạn sẽ có toàn quyền kiểm soát server, đồng thời tận dụng được cộng đồng hỗ trợ mạnh mẽ.

![image](https://hackmd.io/_uploads/SygQ1w5f1l.png)

## Yêu Cầu Hệ Thống
Để bắt đầu, bạn cần chuẩn bị:
- **Hệ điều hành Linux**: Ubuntu, CentOS, Debian, hoặc bất kỳ bản phân phối nào bạn quen thuộc.
- **Quyền truy cập root hoặc sudo**.
- **Kết nối Internet ổn định**.
- **Ít nhất 1GB RAM** dành riêng cho server (khuyến nghị từ 2GB trở lên để tối ưu trải nghiệm).

## Bước 1: Tạo Thư Mục Lưu Trữ Server Minecraft

Đầu tiên, tạo một thư mục mới để lưu trữ các file server Minecraft:

```bash
mkdir ~/minecraft-server
cd ~/minecraft-server
```

## Bước 2: Tải File Server Minecraft
Tải xuống phiên bản server Minecraft mới nhất từ Mojang bằng lệnh `wget`. Đây là một trong những cách nhanh chóng và tiện lợi nhất để cập nhật:

```bash
wget https://piston-data.mojang.com/v1/objects/45810d238246d90e811d896f87b14695b7fb6839/server.jar
```

Link tải này có thể thay đổi, bạn nên kiểm tra trang web chính thức của Minecraft để có link mới nhất: [Minecraft Server Download](https://www.minecraft.net/en-us/download/server).

![image](https://hackmd.io/_uploads/rkznKLcfyg.png)

## Bước 3: Cài Đặt Hoặc Cập Nhật Phiên Bản Java Mới Nhất
Server Minecraft yêu cầu Java để hoạt động. Bạn cần cài đặt Java phiên bản 17 hoặc mới hơn. Dưới đây là cách cài đặt Java trên Ubuntu:

```
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt update
sudo apt install openjdk-21-jdk
```

Đảm bảo kiểm tra phiên bản Java sau khi cài đặt:

```bash
java -version
```

## Bước 4: Khởi Chạy Server Minecraft Lần Đầu

Sau khi đã có Java và tải server.jar, chúng ta có thể khởi chạy server lần đầu tiên bằng lệnh sau:

```bash
java -Xmx1024M -Xms1024M -jar server.jar nogui
```

Khi chạy lần đầu, server sẽ tạo một tệp `eula.txt`. Bạn cần chấp nhận thỏa thuận **EULA** (End User License Agreement) của Mojang bằng cách chỉnh sửa tệp này:

```bash
nano eula.txt
```

Thay đổi dòng:
```bash
eula=false
``` 
thành:
```bash
eula=true`
```

![image](https://hackmd.io/_uploads/HkDw989G1x.png)

Sau đó lưu và thoát (`Ctrl + O`, `Enter`, `Ctrl + X`).

## Bước 5: Cài Đặt Các Thông Số Server

Tiếp theo, hãy mở file `server.properties` để cấu hình các thông số server theo nhu cầu của bạn. Trong file này, bạn có thể tùy chỉnh nhiều thông số như tên thế giới, số người chơi tối đa, hay các cài đặt sinh tồn,... 

Ở đây, chúng ta sửa `online-mode` thành `false` để cho phép người chơi đăng nhập mà không cần tài khoản chính thức từ Mojang, tương tự như cách sử file `eula.txt`:

```bash
nano server.properties
```

![image](https://hackmd.io/_uploads/S1NIjI9zkl.png)

Một số thông số quan trọng bạn có thể tùy chỉnh:
- `online-mode=true`: Thay đổi thành false nếu muốn cho phép người chơi không có tài khoản Mojang.
- `max-players=20`: Giới hạn số lượng người chơi tối đa.
- `level-name=world`: Đặt tên thế giới Minecraft.
- `difficulty=1`: 0 (Peaceful), 1 (Easy), 2 (Normal), 3 (Hard).


Sau khi chỉnh sửa, lưu và thoát (`Ctrl + O`, `Enter`, `Ctrl + X`).

## Bước 6: Khởi Động Server Minecraft

Khởi động lại server với lệnh sau:

```bash
java -Xmx2G -Xms1G -jar server.jar nogui
```

Giải thích tham số:
- `Xmx2G`: Giới hạn bộ nhớ RAM tối đa là 2GB.
- `Xms1G`: Đặt bộ nhớ RAM tối thiểu là 1GB.

Server sẽ chạy trên port mặc định là 25565, và đã sẵn sàng đón các thành viên tham gia.

![image](https://hackmd.io/_uploads/HkjzhU9M1e.png)

## Bước 7: Chia Sẻ Server Với Bạn Bè

### Trường Hợp Có IP Public
Chỉ cần chia sẻ IP server của bạn cho bạn bè để tham gia. Ví dụ: `103.123.120.32:25565`.

![image](https://hackmd.io/_uploads/B1lZYCIcGkg.png)

Sau khi có người tham gia World:

![image](https://hackmd.io/_uploads/ByHSnLcz1x.png)

### Trường Hợp Không Có IP Public
Bạn có thể sử dụng [ngrok](https://ngrok.com/) để expose server của bạn ra Internet. Ngrok cho phép bạn kết nối với server tại nhà mà không cần IP công khai:

Ngrok sẽ cung cấp cho bạn một địa chỉ, ví dụ: `0.tcp.jp.ngrok.io:13880`. Bạn chỉ cần chia sẻ domain này cho bạn bè để tham gia server.

1. Cài đặt ngrok:
    ```bash
    wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip
    unzip ngrok-stable-linux-amd64.zip
    sudo mv ngrok /usr/local/bin
    ```

2. Chạy ngrok trên cổng 25565:
    ```bash
    ngrok tcp 25565
    ```

Ngrok sẽ cung cấp một địa chỉ như `0.tcp.ngrok.io:12345`. Chia sẻ địa chỉ này với bạn bè để họ tham gia server của bạn.

![image](https://hackmd.io/_uploads/SkX4pUcMyl.png)

Lúc này chúng ta hoàn toàn có thể kết nối đến từ các máy khác thông qua link ngrok tcp này, với ví dụ của mình thì sẽ kết nối đến Server có Address là `0.tcp.jp.ngrok.io:13880`.

## Tối Ưu Server Minecraft
- **Cài đặt Plugin hoặc Mods**: Sử dụng các công cụ như Bukkit hoặc Spigot để thêm plugin hỗ trợ quản lý và cải thiện trải nghiệm chơi game.
- **Giới hạn RAM hợp lý**: Đảm bảo server không sử dụng quá nhiều tài nguyên, đặc biệt nếu bạn dùng máy tính cá nhân.
- **Bảo mật**: Sử dụng tường lửa hoặc ứng dụng như UFW để giới hạn truy cập từ các địa chỉ IP không mong muốn.


## Kết Luận
Việc tự xây dựng và vận hành một server Minecraft trên Linux không chỉ mang lại trải nghiệm chơi game độc đáo mà còn giúp bạn nâng cao kỹ năng quản trị hệ thống. Với server riêng, bạn có toàn quyền kiểm soát, từ việc tùy chỉnh game play đến mời bạn bè cùng tham gia vào một thế giới sáng tạo không giới hạn.

Hãy bắt đầu ngay hôm nay và tận hưởng niềm vui từ việc sáng tạo thế giới Minecraft của riêng bạn! 🌟
