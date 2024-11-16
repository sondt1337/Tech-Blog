---
title: "CorCTF 2022 | Reverse Engineering"
date: "2022-08-09"
excerpt: "CorCTF 2022 | Reverse Engineering"
---

![](/images/corctf2022-re/featured-image.png)

## Microsoft ❤️ Linux 
Microsoft’s latest addition to the world of Open Source: a flag checker…

### Part 1 analysis
Check file --> elf 

![](/images/corctf2022-re/image.png)

![](/images/corctf2022-re/image-1.png)

check the `start` function:

![](/images/corctf2022-re/image-2.png)

So easy to see in the `loc_100063` stream along with the LINUX system commands, the conclusion is that that the input will be scanned 18 times (1 element each time) then stored in `byte_100111`, then rol with 0Dh (left shift 13 bits) and compaerd to `byte_100210` (in the local)

Check `byte_100210` (local):

```asm
00100210 byte_100210     db 6Ch                  ; DATA XREF: start+1D↑r
00100211                 dd offset byte_8E6C4EED
00100215                 align 2
00100216                 dd offset byte_4CAD666F
0010021A                 dd offset word_666C864E
0010021E                 dd offset byte_8E0F6685
00100222                 dd offset word_2169633E
00100226                 dd offset word_3C79553E
0010022A                 dd offset byte_3C786A63
0010022E                 dd offset dword_2C2C6538
00100232                 dw 703Ch
```

We can `byte_100210`: `b'l\xedNl\x8e\xccof\xadLN\x86lf\x85f\x0f\x8e>ci!>Uy<cjx<8e,,<p'`

Now just write a scipt to find the original flag :333 (reverse the encoding of `byte_100210` from the original flag):

### Script part 1
```python
from pwn import ror

input_data = b'l\xedNl\x8e\xccof\xadLN\x86lf\x85f\x0f\x8e>ci!>Uy<cjx<8e,,<p'

shifted_data = bytearray()
for byte in input_data:
    shifted_byte = ror(byte, 13, 8)  
    shifted_data.append(shifted_byte)

print(shifted_data.decode('latin-1'))
```

And what we get is ... 

![](/images/corctf2022-re/image-3.png)

`corctf{3mbr4c3,3xtñ\x1bK    ñªËá\x1bSÃáÁ+aaá`

It seems like i can only get the first half of the flag, which isn't easy by i can input it hix ...

![](/images/corctf2022-re/image-4.png)

### Part 2 analysis
i will carefully check IDA again & see that between function `start` & `byte_100111` along with `byte_100210`
```asm
001000C2                 dd offset dword_168D0AB4
001000C6                 dd offset byte_6C60211
001000CA                 dd offset byte_C6FF0211
001000CE                 dw 1206h
001000D0                 dd offset word_21CDFF02
001000D4                 dd 0FE83F631h, 8A117412h, 34021384h, 229C8A0Dh, 75D83803h
001000D4                 dd 0EAEB4609h, 33406C7h, 0DB310001h, 3E8309B4h, 74010334h
001000D4                 dd 9F168D0Ah, 0B421CD03h, 8D21CD4Ch, 0CD033616h, 0CD4CB421h
00100110                 db 21h
```

Switching to reading the code, we get the following

```asm
001000C2                 mov     ah, 0Ah
001000C4                 lea     edx, [esi]
001000C6                 adc     [edx], eax
001000C8                 mov     byte ptr [esi], 11h
001000CB                 add     bh, bh
001000CD                 mov     byte ptr [esi], 12h
001000D0                 add     bh, bh
001000D2                 int     21h             ; DOS - BUFFERED KEYBOARD INPUT
001000D2                                         ; DS:DX -> buffer
001000D4                 xor     esi, esi
001000D6
001000D6 loc_1000D6:                             ; CODE XREF: 001000EA↓j
001000D6                 cmp     esi, 12h
001000D9                 jz      short loc_1000EC
001000DB                 mov     al, [ebx+edx-75F2CBFEh]
001000E2                 pushf
001000E3                 and     al, [ebx]
001000E5                 cmp     al, bl
001000E7                 jnz     short loc_1000F2
001000E9                 inc     esi
001000EA                 jmp     short loc_1000D6
001000EC ; ---------------------------------------------------------------------------
001000EC
001000EC loc_1000EC:                             ; CODE XREF: 001000D9↑j
001000EC                 mov     dword ptr [esi], 10334h
001000F2
001000F2 loc_1000F2:                             ; CODE XREF: 001000E7↑j
001000F2                 xor     ebx, ebx
001000F4                 mov     ah, 9
001000F6                 cmp     dword ptr [esi], 34h ; '4'
001000F9                 add     eax, [ecx]
001000FB                 jz      short near ptr loc_100102+5
001000FD                 lea     edx, [esi]
001000FF                 lahf
00100100                 add     ecx, ebp
00100102
00100102 loc_100102:                             ; CODE XREF: 001000FB↑j
00100102                 and     [esp+ecx*2+168D21CDh], esi
00100109                 db      36h
00100109                 add     ecx, ebp
```

Combined with assigning `0xd` to edx, perhaps this half of the flag will do something with `0xd`

Maybe i though too much (just xor with `0xd`)

![](/images/corctf2022-re/image-5.png)

**flag: `corctf{3mbr4c3,3xt3nd,3Xt1ngu15h!!1}`**

## turbocrab

Description: 🚀🚀 blazinglyer faster 🚀🚀 SHA256 hash of the flag: `dc136f8bf4ba6cc1b3d2f35708a0b2b55cb32c2deb03bdab1e45fcd1102ae00a`

### Check the file

![](/images/corctf2022-re/image-6.png)

Setup and run file:

![](/images/corctf2022-re/image-8.png)

When i load `turbocrab` into IDA64

![](/images/corctf2022-re/image-9.png)

Looking at this decompiled rust, I came up with the idea of ​​searching the string from the previous check flag section to find the function 🤡

![](/images/corctf2022-re/image-11.png)

![](/images/corctf2022-re/image-12.png)

function `turbocrab::execute_shellcode::h6984ce5848b31780`:

![](/images/corctf2022-re/image-13.png)

```Rust
void __cdecl turbocrab::execute_shellcode::h6984ce5848b31780(__u8_ shellcode)
{
  __u8_ v1; // rdi
  __int64 v2; // r15
  __int64 v3; // rdx
  usize v4; // [rsp+8h] [rbp-190h]
  u8 *v5; // [rsp+10h] [rbp-188h]
  usize len; // [rsp+20h] [rbp-178h]
  __int64 count; // [rsp+28h] [rbp-170h]
  core::ffi::c_void *src; // [rsp+30h] [rbp-168h]
  core::ffi::c_void *dst; // [rsp+48h] [rbp-150h]
  _BYTE v10[29]; // [rsp+63h] [rbp-135h] BYREF
  alloc::vec::Vec<u8,alloc::alloc::Global> self; // [rsp+80h] [rbp-118h] BYREF
  u8 *v12; // [rsp+98h] [rbp-100h]
  __int64 v13; // [rsp+A0h] [rbp-F8h] BYREF
  core::fmt::Arguments v14; // [rsp+A8h] [rbp-F0h] BYREF
  core::fmt::Arguments v15; // [rsp+D8h] [rbp-C0h] BYREF
  __u8_ v16; // [rsp+108h] [rbp-90h]
  core::ffi::c_void *v17; // [rsp+118h] [rbp-80h]
  __int64 *v18; // [rsp+130h] [rbp-68h]
  __int64 v19; // [rsp+138h] [rbp-60h]
  __int64 v20; // [rsp+140h] [rbp-58h]
  __int64 v21; // [rsp+148h] [rbp-50h]
  core::ffi::c_void *v22; // [rsp+150h] [rbp-48h]
  core::ffi::c_void *v23; // [rsp+158h] [rbp-40h]
  __int64 v24; // [rsp+160h] [rbp-38h]
  __int64 v25; // [rsp+168h] [rbp-30h]
  u8 *v26; // [rsp+170h] [rbp-28h]
  __int64 v27; // [rsp+178h] [rbp-20h]
  u8 *v28; // [rsp+180h] [rbp-18h]

  v16 = shellcode;
  v25 = 0LL;
  dst = mmap(0LL, shellcode.length, 3, 33, -1, 0LL);
  v17 = dst;
  qmemcpy(v10, "R^CRIWJM<6.[5I.G`.C3G3CB5_V?P", sizeof(v10));
  alloc::vec::from_elem::hba0d51ad3cb1207d(&self, 0, 0x4000uLL);
  v26 = alloc::vec::Vec$LT$T$C$A$GT$::as_ptr::h0252951c7d91d004(&self);
  v27 = 49602LL;
  v28 = v26 + 49602;
  v12 = v26 + 49602;
  src = core::slice::_$LT$impl$u20$$u5b$T$u5d$$GT$::as_ptr::h869fdf96852d8c48(shellcode);
  count = core::slice::_$LT$impl$u20$$u5b$T$u5d$$GT$::len::h00af0a2d7a9c0658(shellcode);
  v22 = dst;
  v23 = src;
  v24 = count;
  core::intrinsics::copy::h46e3e522e297e890(src, dst, count);
  len = core::slice::_$LT$impl$u20$$u5b$T$u5d$$GT$::len::h00af0a2d7a9c0658(shellcode);
  mprotect(dst, len, 5);
  v13 = v20;
  v18 = &v13;
  v1.data_ptr = v10;
  v1.length = 29LL;
  v5 = core::slice::_$LT$impl$u20$$u5b$T$u5d$$GT$::as_ptr::h869fdf96852d8c48(v1);
  v1.data_ptr = v10;
  v1.length = 29LL;
  v4 = core::slice::_$LT$impl$u20$$u5b$T$u5d$$GT$::len::h00af0a2d7a9c0658(v1);
  v2 = v12;
  v13 = (dst)(v10, 29LL, v3, dst, v5, v4);
  v12 = v2;
  v19 = v13;
  v21 = v13;
  if ( v13 == 1 )
    core::fmt::Arguments::new_v1::h610d7aa66ccb1a0c(&v14, __PAIR128__(1LL, &stru_5620902FFF78), &stru_562090296240);
  else
    core::fmt::Arguments::new_v1::h610d7aa66ccb1a0c(&v15, __PAIR128__(1LL, &stru_5620902FFF68), &stru_562090296240);
  std::io::stdio::_print::hccc6c4adfff98fee();
  core::ptr::drop_in_place$LT$alloc..vec..Vec$LT$u8$GT$$GT$::h34608ea8b4b90afb(&self);
}
```
My conclusion here is:
- ```R^CRIWJM<6.[5I.G`.C3G3CB5_V?P``` looks like it's been encrypted

- `shellcode` and source `dst` are unknown
`v13 == 1 --> Correct!` and vice versa

### Debugging
Setup virtual machine for debugging with breakpoint set at `v13 = (dst)(v10, 29LL, v3, dst, v5, v4);` 

![](/images/corctf2022-re/image-7.png)

Step into continuously and when it comes to `call close ptr unk_7F8C04CC62B2` there is a section `LINUX-sys_read` --> Interrupt for input, we will see the section after that will have the input you entered and also the local encoding flag

Continue and understand that the flow of the program is xor with 13 then sub with 1Eh (each character) like the asm fragment below:

```asm
zero:00007FE17840D120 loc_7FE17840D120:                       ; CODE XREF: zero:00007FE17840D06F↑j
zero:00007FE17840D120 mov     rax, r9
zero:00007FE17840D123 xor     rax, r9
zero:00007FE17840D126 mov     r9, rax
zero:00007FE17840D129 mov     al, [r8]
zero:00007FE17840D12C mov     r9b, al
zero:00007FE17840D12F mov     al, r9b
zero:00007FE17840D132 xor     al, 13h
zero:00007FE17840D134 mov     r9b, al
zero:00007FE17840D137 pushfq
zero:00007FE17840D138 mov     al, r9b
zero:00007FE17840D13B mov     rbx, rax
zero:00007FE17840D13E mov     al, 80h
zero:00007FE17840D140 mov     rcx, 2
zero:00007FE17840D14A cmp     rbx, rax
zero:00007FE17840D14D jz      short loc_7FE17840D158
zero:00007FE17840D14F sbb     rcx, rcx
zero:00007FE17840D152 and     ecx, 0FFFFFFFDh
zero:00007FE17840D155 add     ecx, 4
zero:00007FE17840D158
zero:00007FE17840D158 loc_7FE17840D158:                       ; CODE XREF: zero:00007FE17840D14D↑j
zero:00007FE17840D158 mov     r14, rcx
zero:00007FE17840D15B popfq
zero:00007FE17840D15C mov     rax, r14
zero:00007FE17840D15F and     al, 4
zero:00007FE17840D161 test    al, al
zero:00007FE17840D163 jz      short loc_7FE17840D16D
zero:00007FE17840D165 mov     al, r9b
zero:00007FE17840D168 xor     al, 37h
zero:00007FE17840D16A mov     r9b, al
zero:00007FE17840D16D
zero:00007FE17840D16D loc_7FE17840D16D:                       ; CODE XREF: zero:00007FE17840D163↑j
zero:00007FE17840D16D mov     al, r9b
zero:00007FE17840D170 sub     al, 1Eh
zero:00007FE17840D172 mov     r9b, al
zero:00007FE17840D175 pushfq
zero:00007FE17840D176 mov     al, r9b
zero:00007FE17840D179 mov     rbx, rax
zero:00007FE17840D17C mov     al, 10h
zero:00007FE17840D17E mov     rcx, 2
zero:00007FE17840D188 cmp     rbx, rax
zero:00007FE17840D18B jz      short loc_7FE17840D196
zero:00007FE17840D18D sbb     rcx, rcx
zero:00007FE17840D190 and     ecx, 0FFFFFFFDh
zero:00007FE17840D193 add     ecx, 4
zero:00007FE17840D196
zero:00007FE17840D196 loc_7FE17840D196:                       ; CODE XREF: zero:00007FE17840D18B↑j
zero:00007FE17840D196 mov     r14, rcx
zero:00007FE17840D199 popfq
zero:00007FE17840D19A mov     rax, r14
zero:00007FE17840D19D and     al, 3
zero:00007FE17840D19F test    al, al
zero:00007FE17840D1A1 jz      short loc_7FE17840D1AB
zero:00007FE17840D1A3 mov     al, r9b
zero:00007FE17840D1A6 xor     al, 31h
zero:00007FE17840D1A8 mov     r9b, al
zero:00007FE17840D1AB
zero:00007FE17840D1AB loc_7FE17840D1AB:                       ; CODE XREF: zero:00007FE17840D1A1↑j
zero:00007FE17840D1AB mov     al, r9b
zero:00007FE17840D1AE mov     [r8], al
zero:00007FE17840D1B1 mov     rax, [r15]
zero:00007FE17840D1B4 add     r15, 8
zero:00007FE17840D1B8 jmp     rax
```

### Solve Script

```python
encrypt = b"R^CRIWJM<6.[5I.G`.C3G3CB5_V?P"
for i in encrypt:
    print(chr((i + 0x1e) ^ 0x13), end = "")
```
--> `corctf{xIG_j@t_vm_rBvBrs@ngN}`

It seems that the flag still has no meaning, but now I notice the sha256 part in the Description: `dc136f8bf4ba6cc1b3d2f35708a0b2b55cb32c2deb03bdab1e45fcd1102ae00a`

I can only think of one direction: bruteforce until the two sha256 codes are the same, then initial flag with some identifiable characteristics to save time such as: `B` can be `3`, `e` or `E` and `@` can be `1`, `i`, `I` or `!`.

Based on those, we can write a script to get the flag:

```python
import hashlib

target_hash = "dc136f8bf4ba6cc1b3d2f35708a0b2b55cb32c2deb03bdab1e45fcd1102ae00a"

characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.!?;:'-()[]{}<>\/@#$%^&*_+="
guess1 = ["1", "i", "I", "!"]
guess2 = ["3", "e", "E"]

for i in range(len(characters)):
    for j in range(len(characters)):
        for k in range(len(guess1)):
            for l in range(len(guess2)):
                for m in range(len(characters)):
                    candidate = f"corctf{{x{characters[i]}{characters[j]}_j{guess1[k]}t_vm_r{guess2[l]}v{guess2[l]}rs{guess1[k]}ng{characters[m]}}}"
                    hashed = hashlib.sha256(candidate.encode('utf-8')).hexdigest()
                    if hashed == target_hash:
                        print("Found:", candidate)
                        break
```
**flag:`corctf{x86_j1t_vm_r3v3rs1ng?}`**
