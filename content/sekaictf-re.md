---
title: "SekaiCTF 2023 | Reverse Engineering"
date: "2023-08-27"
excerpt: "Wibu time, this writeup is about the RE challenges I solved in SekaiCTF 2023"
---

![](/images/sekaictf-re/featured-image.png)

Unfortunately, during the tournament, I was tricked into debugging the `Teyvat Travel Guide` challenge, which led me to go the wrong way and give up while making myself feel like I had no hope (when it was really only at medium level):< and lost. Quite a bit of effort for the `Guardians of the Kernel` challenge


## Azusawa’s Gacha World

![](/images/sekaictf-re/image-6.png)

Author: enscribe

> ❖ Note
The website only contains the challenge description, and is not needed to solve the challenge.


### Challenge structure analysis
In the first challenge, I received a full folder of Sekai's Gacha game (Created by Unity)

![](/images/sekaictf-re/image-7.png)

While searching through folders, I found a file named `Assembly-CSharp.dll`

![](/images/sekaictf-re/image-8.png)


Knowing it was related to Csharp, I loaded it into DnSpy to get started. Luckily, this file is not too complicated, the information is clear.

**1. Character**

![](/images/sekaictf-re/image-9.png)

**2. GachaRequest**

![](/images/sekaictf-re/image-10.png)

**3. GachaResponse**

![](/images/sekaictf-re/image-11.png)

Reading these 3 classes, I concluded that when I gacha, I will send the parameters in `GachaRequest` including `crystals`, `pulls` and `numPulls` to the server and receive `GachaResponse` containing the class `character` and which includes `flag`

### Where does the server receive requests?

**4. CreateGachaWebRequest**


![](/images/sekaictf-re/image-12.png)

```Csharp
// GachaManager
// Token: 0x06000016 RID: 22 RVA: 0x0000259C File Offset: 0x0000079C
private UnityWebRequest CreateGachaWebRequest(string json)
{
    byte[] bytes = Encoding.UTF8.GetBytes(json);
    string s = "aHR0cDovLzE3Mi44Ni42NC44OTozMDAwL2dhY2hh";
    UnityWebRequest unityWebRequest = new UnityWebRequest(Encoding.UTF8.GetString(Convert.FromBase64String(s)), "POST");
    unityWebRequest.uploadHandler = new UploadHandlerRaw(bytes);
    unityWebRequest.downloadHandler = new DownloadHandlerBuffer();
    unityWebRequest.SetRequestHeader("Content-Type", "application/json");
    unityWebRequest.SetRequestHeader("User-Agent", "SekaiCTF");
    return unityWebRequest;
}
```
`aHR0cDovLzE3Mi44Ni42NC44OTozMDAwL2dhY2hh` là mã hoá base64 của `http://172.86.64.89:3000/gacha`

Yah, so I have found a server + some payload setup, here I can solve it with burpsuite or send it via shell :>>, I choose via shell for convenience

P/s: There is also an option for game-style challs like this: [Cheat Engine](https://www.cheatengine.org/) is quite simple, it can determine the exact address of the objects and modify them (in this writeup I will not mention it because it is not pure REV)

### Gacha time
So, based on what I analyze, I can write a shell curl to retrieve data like I'm gacha with the example parameters being 1000, 1, 1. (ie I have 1000 diamonds, new spin 1 time and spin 1 more time)

```Shell
curl -s -X POST http://172.86.64.89:3000/gacha -d '{"crystals":1,"pulls":1,"numPulls":1}' -H 'Content-type: application/json' -H 'User-Agent: SekaiCTF' | jq .
```

![](/images/sekaictf-re/image-13.png)

Maybe I still need to open the game to check what the parameters are

![](/images/sekaictf-re/image-14.png)

Yah, here it is, the chance of winning gacha is 0% and can only be received when spinning 1 million times :)). So it's simple, because the number of spins per request is only between 1 and 10, so setup pulls will be 999999 and numPulls will be 1, and crystals will be set to 1000.

![](/images/sekaictf-re/image-15.png)

Put the jumbled part into cyberchef with base64 and convert it to an image

![FLAG](image-16.png)

**flag: SEKAI{D0N7_73LL_53G4_1_C0P13D_7H31R_G4M3}**
## Guardians of the Kernel

Author: Iyed

> ❖ Note
It’s just a warmup but with another layer which is the kernel.
### Challenge analysis
In this chall, I received an attachment consisting of 2 quite strange files

![](/images/sekaictf-re/image.png)

After researching, I understand that bzImage is a kernel image file that loads and initializes the kernel while booting the system and the `.cpio` file is like a file system restorer (because it manages data structures and file lists)

![](/images/sekaictf-re/image-1.png)

So I can completely build the kernel image (here I can use qemu), but this build chall is a bit redundant (I don't need debug).

We an easily run this kernel with the command:

```Shell
qemu-system-x86_64 -kernel bzImage -initrd initramfs.cpio -nographic   -monitor none   -no-reboot -append "console=ttyS0"
```

![](/images/sekaictf-re/image-17.png)

Instead, I decompress the files in `initramfs.cpio` with the command: `cpio -idv -F inittramfs.cpio`

![](/images/sekaictf-re/image-2.png)

Notice that there is a file `flag_checker.ko` (this file contains information about loading modules into the kernel), so maybe I won't need to debug through the kernel anymore, I'll just load it into IDA

![](/images/sekaictf-re/image-3.png)

Great, there is `device_ioctl` that handles I/O Control, so I exploited this part and bonus

![](/images/sekaictf-re/image-4.png)


The main stream

```c
__int64 __fastcall device_ioctl(__int64 a1, int a2, __int64 a3)
{
  __int64 result; // rax
  unsigned __int8 *v6; // rax
  int v7; // edx
  int v8; // eax
  unsigned int v9; // eax
  __int64 v10; // rdx

  if ( a2 == 28673 )
  {
    if ( !layers[1] )
      return 0LL;
    if ( !copy_from_user(buffer, a3, 7LL) )
    {
      buffer[7] = 0;
      v6 = buffer;
      while ( (unsigned __int8)(*v6 - 48) <= 9u )
      {
        if ( &buffer[7] == ++v6 )
        {
          v7 = 7 * __ROL4__(1507359807 * __ROR4__(422871738 * *(_DWORD *)buffer, 15), 11);
          v8 = __ROR4__(422871738 * ((buffer[5] << 8) ^ (buffer[6] << 16) ^ buffer[4]), 15);
          v9 = 1984242169
             * ((v7 + 1204333666) ^ (1507359807 * v8) ^ 7 ^ (((v7 + 1204333666) ^ (unsigned int)(1507359807 * v8)) >> 16));
          if ( (((-1817436554 * ((v9 >> 13) ^ v9)) >> 16) ^ (-1817436554 * ((v9 >> 13) ^ v9))) != 261736481 )
            return 0LL;
          return device_ioctl_cold();
        }
      }
      return 0LL;
    }
    return -14LL;
  }
  if ( a2 == 28674 )
  {
    if ( !layers[2] )
      return 0LL;
    v10 = copy_from_user(buffer, a3, 12LL);
    if ( !v10 )
    {
      do
      {
        buffer[v10] += buffer[v10 + 1] * ~(_BYTE)v10;
        ++v10;
      }
      while ( v10 != 12 );
      if ( *(_QWORD *)buffer != 0x788C88B91D88AF0ELL || *(_DWORD *)&buffer[8] != 2113081836 || buffer[12] )
        return 0LL;
      printk(&unk_2EB, a3);
      return 1LL;
    }
    return -14LL;
  }
  if ( a2 != 28672 )
  {
    printk(&unk_302, a3);
    return 0LL;
  }
  if ( copy_from_user(buffer, a3, 6LL) )
    return -14LL;
  if ( *(_DWORD *)buffer != 1095451987 || *(_WORD *)&buffer[4] != 31561 )
    return 0LL;
  printk(&unk_2B6, a3);
  result = 1LL;
  layers[1] = 1;
  return result;
}
```

As in the text view, we can see that the format of the flag is `SEKAI{`, then that is the end of the stream <-- Change the value from dec to char for clearer display

```c
if ( *(_DWORD *)buffer != 'AKES' || *(_WORD *)&buffer[4] != '{I' )
```
### Processing layer 1
Maybe this is the part that takes up all my time during the tournament :)))), being lazy should be punished by God :(

```c
if ( !copy_from_user(buffer, a3, 7LL) )
    {
      buffer[7] = 0;
      v6 = buffer;
      while ( (unsigned __int8)(*v6 - 48) <= 9u )
      {
        if ( &buffer[7] == ++v6 )
        {
          v7 = 7 * __ROL4__(1507359807 * __ROR4__(422871738 * *(_DWORD *)buffer, 15), 11);
          v8 = __ROR4__(422871738 * ((buffer[5] << 8) ^ (buffer[6] << 16) ^ buffer[4]), 15);
          v9 = 1984242169
             * ((v7 + 1204333666) ^ (1507359807 * v8) ^ 7 ^ (((v7 + 1204333666) ^ (unsigned int)(1507359807 * v8)) >> 16));
          if ( (((-1817436554 * ((v9 >> 13) ^ v9)) >> 16) ^ (-1817436554 * ((v9 >> 13) ^ v9))) != 261736481 )
            return 0LL;
          return device_ioctl_cold();
        }
      }
      return 0LL;
    }
```

After writing a lot of failed solutions using rev, I switched to bruteforce.

It can be seen that layer 1 contains 7 chars, the algorithm is a bit complicated (and still confused between signed and unsigned type), so I will bruteforce this quickly (actually, while thinking about how to write bruteforce, I can finish the third rev challenge 🐧)

script bruteforce: 
```py
def __ROL4__(val, bits, bit_size=32):
    return (val << bits % bit_size) & (2 ** bit_size - 1) | ((val & (2 ** bit_size - 1)) >> (bit_size - (bits % bit_size)))

def __ROR4__(val, bits, bit_size=32):
    return ((val & (2 ** bit_size - 1)) >> bits % bit_size) | (val << (bit_size - (bits % bit_size)) & (2 ** bit_size - 1))

for i in range(10000000):
  f = str(i).rjust(7, '0').encode()
  tmp = (f[3] << 24) | (f[2] << 16) | (f[1] << 8) | f[0]

  v7 = 7 * __ROL4__(1507359807 * __ROR4__(422871738 * tmp, 15), 11)
  v8 = __ROR4__(422871738 * ((f[5] << 8) ^ (f[6] << 16) ^ f[4]), 15)
  v9 = 1984242169 * (((v7 + 0x47C8AC62) & 0xFFFFFFFF) ^ ((1507359807 * v8) & 0xFFFFFFFF) ^ 7 ^ ((((v7 + 0x47C8AC62) & 0xFFFFFFFF) ^ ((1507359807 * v8) & 0xFFFFFFFF)) >> 16))
  v9 &= 0xFFFFFFFF
  if ((((2477530742 * ((v9 >> 13) ^ v9)) & 0xFFFFFFFF) >> 16) ^ ((2477530742 * ((v9 >> 13) ^ v9)) & 0xFFFFFFFF)) == 261736481:
    print(f)
```

--> `6001337`

The solution other with z3 makes me bitter
```py
from z3 import *

buffer = [BitVec(f'x{i}', 8) for i in range(7)]
_buffer = buffer[:]
buffer = [ZeroExt(24, x) for x in buffer]

v8 = 7 * RotateLeft(1507359807 * RotateRight(422871738 * Concat(*_buffer[:4][::-1]), 15), 11)
v9 = RotateRight(422871738 * ((buffer[5] << 8) ^ (buffer[6] << 16) ^ buffer[4]), 15)
v10 = 1984242169 * ((v8 + 1204333666) ^ (1507359807 * v9) ^ 7 ^ LShR((v8 + 1204333666) ^ (1507359807 * v9), 16))

s = Solver()

s.add([And(x >= 0x30, x <= 0x39) for x in _buffer])

shr13 = (LShR(v10, 13) ^ v10)
s.add((LShR((-1817436554 * shr13), 16) ^ (-1817436554 * shr13)) == 261736481)

print(bytes([s.model()[x].as_long() for x in _buffer]))
```

### Check layer 2
```c
v10 = copy_from_user(buffer, a3, 12LL);
if ( !v10 )
{
  do
  {
    buffer[v10] += buffer[v10 + 1] * ~(_BYTE)v10;
    ++v10;
  }
  while ( v10 != 12 );
  if ( *(_QWORD *)buffer != 0x788C88B91D88AF0ELL || *(_DWORD *)&buffer[8] != 2113081836 || buffer[12] )
    return 0LL;
  printk(&unk_2EB, a3);
  return 1LL;
    }
```

Layer 2, although it has 12 char, is easier to solve. Here, we will have 1 more hint to make solving easier, that the last character will be "}" :>

There are also other conditions:

- buffer[i] += buffer[i + 1] * ~(_BYTE)v10; (i from 0 to 12)
- buffer[12] = 0 so buffer[11] = '}'

Based on this, I can build the code through z3:

```py
def solve_buffer():
    s = Solver()
    buffer = [BitVec(i, 8) for i in range(13)]
    buffer_ = [BitVec(i, 8) for i in range(13)]

    for i in range(12):
        buffer_[i] = buffer[i] + buffer[i + 1] * ~BitVecVal(i, 8)

    for i in range(12):
        s.add(And(buffer[i] >= 0x20, buffer[i] <= 0x7e))

    s.add(Concat(buffer_[7], buffer_[6], buffer_[5], buffer_[4], buffer_[3], buffer_[2], buffer_[1], buffer_[0]) == 0x788C88B91D88AF0E)
    s.add(Concat(buffer_[11], buffer_[10], buffer_[9], buffer_[8]) == 2113081836)

    if s.check() == sat:
        x = s.model()
        result = []
        for i in range(13):
            result.append(int(str(x[buffer[i]])))
        return result
    else:
        return None

def main():
    result = solve_buffer()
    print(''.join(chr(val) for val in result))

if __name__ == "__main__":
    main()
```
--> `SEKAIPL@YER}`

**flag: SEKAI{6001337SEKAIPL@YER}**

## SekaiCTF 2023 - REV Reviews
1. The reverse challenges of SekaiCTF are diverse, new + extremely difficult
2. If I let myself play only one topic, I'll probably cry, so I should play a few more to keep rank :<
3. The most unfortunate thing about this tournament is probably not re3 but the lack of pwn1 (wasting too much time doing pwn2), that's all, stopping at top xx/981 is good, next year I will take revenge: >

![](/images/sekaictf-re/image-5.png)