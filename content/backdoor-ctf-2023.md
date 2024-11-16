---
title: "Backdoor CTF 2023 | Reverse Engineering"
date: "2023-12-18"
excerpt: "The last CTF i joined in 2023. Happy New Year!!!"
featured: "/images/backdoorctf-2023-re/featured.png"
---
![](/images/backdoorctf-2023-re/featured.png)

In this CTF, I didn't get a chance to do many rev challenges, partly because I had too many deadlines, and also partly because my old machine was breaking down.


## Open Sesame
Attachment: [open_sesame.apk](https://ufile.io/lk5xm0v2)

Here is an easy challenge apk. Use [Decompiler.com](https://www.decompiler.com/) to decompile this apk file then check `sources/com/example/open_sesame/MainActivity.java` to find main logic of this file:

```java
package com.example.open_sesame;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

public class MainActivity extends AppCompatActivity {
    private static final int[] valid_password = {52, AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR, 49, 98, 97, 98, 97};
    private static final String valid_user = "Jack Ma";
    private Button buttonLogin;
    private EditText editTextPassword;
    private EditText editTextUsername;

    /* access modifiers changed from: protected */
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_main);
        this.editTextUsername = (EditText) findViewById(R.id.editTextUsername);
        this.editTextPassword = (EditText) findViewById(R.id.editTextPassword);
        Button button = (Button) findViewById(R.id.buttonLogin);
        this.buttonLogin = button;
        button.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                MainActivity.this.validateCredentials();
            }
        });
    }

    /* access modifiers changed from: private */
    public void validateCredentials() {
        String trim = this.editTextUsername.getText().toString().trim();
        String trim2 = this.editTextPassword.getText().toString().trim();
        if (!trim.equals(valid_user) || !n4ut1lus(trim2)) {
            showToast("Invalid credentials. Please try again.");
            return;
        }
        "flag{" + flag(Integer.toString(sl4y3r(sh4dy(trim2))), "U|]rURuoU^PoR_FDMo@X]uBUg") + "}";
    }

    private boolean n4ut1lus(String str) {
        int[] it4chi = it4chi(str);
        if (it4chi.length != valid_password.length) {
            return false;
        }
        for (int i = 0; i < it4chi.length; i++) {
            if (it4chi[i] != valid_password[i]) {
                return false;
            }
        }
        return true;
    }

    private int[] it4chi(String str) {
        int[] iArr = new int[str.length()];
        for (int i = 0; i < str.length(); i++) {
            iArr[i] = str.charAt(i);
        }
        return iArr;
    }

    private String sh4dy(String str) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char charAt = str.charAt(i);
            if (Character.isDigit(charAt)) {
                sb.append(charAt);
            }
        }
        return sb.toString();
    }

    private int sl4y3r(String str) {
        return Integer.parseInt(str) - 1;
    }

    private String flag(String str, String str2) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str2.length(); i++) {
            sb.append((char) (str2.charAt(i) ^ str.charAt(i % str.length())));
        }
        return sb.toString();
    }

    private void showToast(String str) {
        Toast.makeText(this, str, 0).show();
    }
}
```

We should pay attention to some section:
- `"flag{" + flag(Integer.toString(sl4y3r(sh4dy(trim2))), "U|]rURuoU^PoR_FDMo@X]uBUg") + "}";`
- `valid_password = {52, AppCompatDelegate.FEATURE_SUPPORT_ACTION_BAR, 49, 98, 97, 98, 97};`
- `valid_user = "Jack Ma";`

Here there are functions we need to pay attention to: `it4chi`, `sh4dy`, `sl4y3r` (each function has 1 different encoding, consisting only of simple calculations and xor operations) and `valid_user` & `valid_password`. 
Detail:
- `it4chi` get a string `str` as input and returns an array of integers
- `sh4dy` get a string str as input and returns a new string containing only the numeric characters from the original string 
- `sl4y3r` get a string str as input, converts it to an integer using Integer.parseInt, subtracts 1 from the resulting value, and returns the result
- `flag` takes 2 strings and XOR char by char with length of shorter string
Here's my script to reverse this program to get the flag:

```python
def get_flag():
    valid_password = [52, 108, 49, 98, 97, 98, 97]
    valid_user = "Jack Ma"
    str2 = "U|]rURuoU^PoR_FDMo@X]uBUg"

    def it4chi(str):
        return [ord(c) for c in str]

    def sh4dy(str):
        return ''.join(c for c in str if c.isdigit())

    def sl4y3r(str):
        return int(str) - 1

    def flag(str, str2):
        return ''.join(chr(ord(str2[i]) ^ ord(str[i % len(str)])) for i in range(len(str2)))

    password = ''.join(chr(i) for i in valid_password)
    str1 = sh4dy(password)
    str_res = str1
    str_res = str(sl4y3r(str_res))
    return "flag{" + flag(str_res, str2) + "}"

print(get_flag())
# flag{aLiBabA_and_forty_thiEveS}
```

## Secret Door

Attachment: 
- [chall.out](https://ufile.io/208po3g0)
- [encoded.bin](https://ufile.io/88taxfpg)

This is a C program written quite simply like to check the password and if correct, will decrypt the encoded file.bin to issue the flag image 

dump IDA (main function): 

```C
int __cdecl main(int argc, const char **argv, const char **envp)
{
  __int64 v3; // rax
  char v5; // [rsp+13h] [rbp-EDh] BYREF
  int v6; // [rsp+14h] [rbp-ECh]
  int *v7; // [rsp+18h] [rbp-E8h]
  char v8[32]; // [rsp+20h] [rbp-E0h] BYREF
  char v9[32]; // [rsp+40h] [rbp-C0h] BYREF
  char v10[32]; // [rsp+60h] [rbp-A0h] BYREF
  char v11[32]; // [rsp+80h] [rbp-80h] BYREF
  int v12[18]; // [rsp+A0h] [rbp-60h]
  unsigned __int64 v13; // [rsp+E8h] [rbp-18h]

  v13 = __readfsqword(0x28u);
  if ( argc != 2 )
  {
    std::operator<<<std::char_traits<char>>(&std::cout, "Just try to get the door");
    exit(0);
  }
  if ( strlen(argv[1]) != 17 )
  {
    std::operator<<<std::char_traits<char>>(&std::cout, "that's not even a door :p");
    exit(0);
  }
  v6 = 0;
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string(v8);
  v12[0] = 66;
  v12[1] = 119;
  v12[2] = 101;
  v12[3] = 113;
  v12[4] = 123;
  v12[5] = 98;
  v12[6] = 114;
  v12[7] = 125;
  v12[8] = 119;
  v12[9] = 89;
  v12[10] = 115;
  v12[11] = 125;
  v12[12] = 111;
  v12[13] = 109;
  v12[14] = 62;
  v12[15] = 1;
  v12[16] = 0;
  while ( v6 <= 16 )
  {
    std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::push_back(
      v8,
      (unsigned int)(char)(LOBYTE(v12[v6]) ^ (v6 + 17)));
    ++v6;
  }
  std::allocator<char>::allocator(&v5);
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string<std::allocator<char>>(
    v9,
    "ThatsHardcoded!!!",
    &v5);
  std::allocator<char>::~allocator(&v5);
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string(v11, v9);
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string(v10, v8);
  func_5(v10, v11);
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::~basic_string(v10);
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::~basic_string(v11);
  v7 = (int *)operator new[](0x44uLL);
  v3 = func_4(v8, argv[1]);
  v7 = (int *)func_3(v3, v9);
  if ( (unsigned __int8)func_2(v7) )
    func_1(*v7, v7[16]);
  else
    std::operator<<<std::char_traits<char>>(&std::cout, "Wrong door");
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::~basic_string(v9);
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::~basic_string(v8);
  return 0;
}
```

In this execute file, we must input 1 argv and length of argv is 17

```c
if ( argc != 2 )
  {
    std::operator<<<std::char_traits<char>>(&std::cout, "Just try to get the door");
    exit(0);
  }
  if ( strlen(argv[1]) != 17 )
  {
    std::operator<<<std::char_traits<char>>(&std::cout, "that's not even a door :p");
    exit(0);
  }
```

- In each iteration, v8 will append the value ((v12[i]) ^ (i + 17)) (i ascending)

--> `v8 += chr((v12[i]) ^ (i + 17))`

we can find v8: 
```python
v6 = 0
v8 = ""
v12 = [
    66, 119, 101, 113, 123, 98, 114, 125,
    119, 89, 115, 125, 111, 109, 62, 1, 0
]
while v6 <= 16:
    v8 += chr(v12[v6] ^ (v6 + 17))
    v6 += 1
print(v8)
# v8 = "SeventeenChars!!!"
```

The other side:
```c
std::allocator<char>::allocator(&v5);
std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string<std::allocator<char>>(
v9,"ThatsHardcoded!!!",&v5);
```
we have `v9 = "ThatsHardcoded!!!"`

**1.**  func_5
 
`func_5` is a joke hix :((( so we can ignore it (not related to the program flow), if you want decode `func_5`, here is [raw data dumped from IDA](/images/backdoorctf-2023-re/script/raw_func_5.txt) and [script](/images/backdoorctf-2023-re/script/script_func_5.py)

**2.** func_4

```c
__int64 __fastcall func_4(__int64 a1, __int64 a2)
{
  unsigned __int64 i; // [rsp+18h] [rbp-18h]
  unsigned __int64 v4; // [rsp+20h] [rbp-10h]
  __int64 v5; // [rsp+28h] [rbp-8h]

  v4 = std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::size(a1);
  v5 = operator new[](0x44uLL);
  for ( i = 0LL; i < v4; ++i )
    *(v5 + 4 * i) = (*(a2 + i) ^ *std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::operator[](
                                    a1,
                                    i));
  return v5;
}
```

**3.** func_3
```c
__int64 __fastcall func_3(__int64 a1, __int64 a2)
{
  int i; // [rsp+14h] [rbp-Ch]
  __int64 v4; // [rsp+18h] [rbp-8h]

  v4 = operator new[](0x44uLL);
  for ( i = 0; i <= 16; ++i )
    *(4LL * i + v4) = *std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::operator[](a2, i) ^ *(4LL * i + a1);
  return v4;
}
```

**4.** func_2 
```c
_BOOL8 __fastcall func_2(int *a1)
{
  return *a1 == 78
      && a1[1] != (*a1 == 15)
      && a1[2] == 120
      && a1[3] != (a1[2] == 31)
      && a1[4] == 120
      && a1[5] != (a1[4] == 11)
      && a1[6] == 116
      && a1[6] != (a1[7] == 6)
      && a1[8] == 100
      && a1[9] != (a1[8] == 33)
      && a1[10] == 99
      && a1[11] != (a1[10] == 34)
      && a1[12] == 120
      && a1[13] == a1[12]
      && a1[14] == 114
      && a1[15] == a1[14] + 1
      && a1[16] == 33;
}
```

so here is logic of `func_3` & `func_4`:
```python
def func_4(a1, a2):
    v4 = len(a1)
    v5 = bytearray()
    for i in range(v4):
        v5.append((ord(a2[i]) ^ ord(a1[i])) % 256)
    return v5

def func_3(a1, a2):
    v4 = [0]*17
    for i in range(17):
        v4[i] = ord(a2[i]) ^ a1[i]
    return v4
```
So we can find a1 to `func_2` is True with z3 python then we can use `func_3`, `func_4` to find key:

```python
from z3 import *

flags = [BitVec(f'char_{i}', 8) for i in range(17)]
unk1 = [BitVec(f'z1_{i}', 8) for i in range(17)]

s = Solver()
s.add(len(flags) == 17)

for i in range(17):
    s.add(And(flags[i] >= 33, flags[i] <= 125))

str1 = "SeventeenChars!!!"
str2 = "ThatsHardcoded!!!" 

for i in range(17):
    unk1[i] = flags[i] ^ ord(str1[i])

for i in range(17):
    unk1[i] = unk1[i] ^ BitVecVal(ord(str2[i]), 8)

condition = And(
    unk1[0] == 78,
    unk1[1] != If(unk1[0] == 15, BitVecVal(1, 8), BitVecVal(0, 8)),
    unk1[2] == 120,
    unk1[3] != If(unk1[2] == 31, BitVecVal(1, 8), BitVecVal(0, 8)),
    unk1[4] == 120,
    unk1[5] != If(unk1[4] == 11, BitVecVal(1, 8), BitVecVal(0, 8)),
    unk1[6] == 116,
    unk1[7] != If(unk1[6] == 6, BitVecVal(1, 8), BitVecVal(0, 8)),
    unk1[8] == 100,
    unk1[9] != If(unk1[8] == 33, BitVecVal(1, 8), BitVecVal(0, 8)),
    unk1[10] == 99,
    unk1[11] != If(unk1[10] == 34, BitVecVal(1, 8), BitVecVal(0, 8)),
    unk1[12] == 120,
    unk1[13] == unk1[12],
    unk1[14] == 114,
    unk1[15] == unk1[14] + 1,
    unk1[16] == 33
)

s.add(condition)

if s.check() == sat:
    m = s.model()
    flag = ''.join([chr(m[flags[i]].as_long()) for i in range(17)])
    print(f"Pass: {flag}")
else:
    print("No solution found!")

# Pass: I$o0e!p0n0d0oors!
```
When i put it like as argv it false: 

![](/images/backdoorctf-2023-re/image.png)

I think `$` in the key is special character in Linux, so i edit this command from `./chall.out I$o0e!p0n0d0oors!` to `./chall.out $(echo SSRvMGUhcDBuMGQwb29ycyE= | base64 -d)` and here is the flag: 

![](/images/backdoorctf-2023-re/image-1.png)

## baby eBPF
Attachment: [babyebpf.o](https://ufile.io/qi9jtasd)

eBPF (extended Berkeley Packet Filter) is a technology in the Linux kernel that allows the execution of custom programs within the kernel itself. These programs are typically used for monitoring and filtering network events and can be attached to various hook points in the kernel.

In this chall, we must use process EBPF from https://github.com/zandi/eBPF_processor to dissasemble this file 

![](/images/backdoorctf-2023-re/image-2.png)

![](/images/backdoorctf-2023-re/image-3.png)

```c
detect_execve:
    mov            r1, 0x1C050444
    stxw           [r10-8], r1
    lddw           r1, 0x954094701340819
    stxdw          [r10-0x10], r1
    lddw           r1, 0x10523251403E5713
    stxdw          [r10-0x18], r1
    lddw           r1, 0x43075A150E130D0B
    stxdw          [r10-0x20], r1
    mov            r1, 0

LBB0_1:
    lddw           r2, 0
    add            r2, r1
    ldxb           r2, [r2]
    mov            r3, r10
    add            r3, -0x20
    add            r3, r1
    ldxb           r4, [r3]
    xor            r2, r4
    stxb           [r3], r2
    add            r1, 1
    jeq            r1, 0x1C, LBB0_2
    ja             LBB0_1
--------------------------------------
LBB0_2:
    mov            r3, r10
    add            r3, -0x20
    lddw           r1, 0x1C
    mov            r2, 4
    call           6

    mov            r0, 1
    ret
--------------------------------------   
szmarinkitagawa:db "marinkitagawamarinkitagawama",0
```

This is simple assembly code, so I have the script to get the flag, notice that the key is `marinkitagawamarinkitagawama`:

```python
key = "marinkitagawamarinkitagawama"
data = [
    0x1C050444,
    0x954094701340819,
    0x10523251403E5713,
    0x43075A150E130D0B
]
rote = [((value >> i) & 0xFF) for value in reversed(data) for i in range(0, 64, 8)]
flag = ''.join(chr(b ^ ord(key[i % len(key)])) for i, b in enumerate(rote))
print(flag)
# flag{1n7r0_70_3bpf_h3h3h3eh}mari
```
or we can guess easily xor with length of key and data xD

## Sl4ydroid
Attachment: [sl4ydroid.apk](https://ufile.io/mrao1dkw)
like the Open Sesame challenge, we will use [Decompiler.com](https://www.decompiler.com/) to decompile this apk 

In this challenge, during the ctf, I only completed 3/4 of flag, which is quite unfortunate

I use `jadx` to decompile this apk and export lib because nothing java usefull in source :<< 

![](/images/backdoorctf-2023-re/image-6.png)

![](/images/backdoorctf-2023-re/image-4.png)

When i load `libsl4ydroid.so` to IDA, the first function i see RC4 hash:

```c
int __stdcall firsts(int a1)
{
  unsigned int v1; // eax
  unsigned int v2; // eax
  int v4; // [esp+10h] [ebp-58h]
  int v5; // [esp+18h] [ebp-50h]
  char v6; // [esp+1Fh] [ebp-49h]
  unsigned int i; // [esp+30h] [ebp-38h]
  char v8[16]; // [esp+40h] [ebp-28h] BYREF
  char v9[16]; // [esp+50h] [ebp-18h] BYREF
  unsigned int v10; // [esp+60h] [ebp-8h]

  v10 = __readgsdword(0x14u);
  std::string::basic_string<decltype(nullptr)>(a1, "b5)c]d/ZP1:\"");
  std::string::basic_string<decltype(nullptr)>(v9, "R00rkee");
  std::string::basic_string<decltype(nullptr)>(v8, "R1zz");
  for ( i = 0; i <= sub_1AC20(a1) - 1; ++i )
  {
    v4 = *sub_1AC50(a1, i);
    v1 = sub_1AC20(v9);
    v5 = *sub_1AC50(v9, i % v1) ^ v4;
    v2 = sub_1AC20(v8);
    v6 = *sub_1AC50(v8, i % v2) ^ v5;
    *sub_1AC50(a1, i) = v6;
  }
  std::string::~string(v8);
  std::string::~string(v9);
  return a1;
}
```

when i convert it to python and run, i receive `b4ckd00r2023`, so it will be RC4

**1.** Java_com_backdoor_sl4ydroid_MainActivity_kim
```c
unsigned int __cdecl Java_com_backdoor_sl4ydroid_MainActivity_kim(_JNIEnv *a1, int a2, int a3)
{
    _BYTE *v3; // eax
    const char *v4; // eax
    int v6; // [esp+34h] [ebp-64h]
    int StringUTFChars; // [esp+40h] [ebp-58h]
    int MethodID; // [esp+4Ch] [ebp-4Ch]
    int v9; // [esp+50h] [ebp-48h]
    int ObjectClass; // [esp+54h] [ebp-44h]
    char v11[8]; // [esp+58h] [ebp-40h] BYREF
    char v12[8]; // [esp+60h] [ebp-38h] BYREF
    char v13[16]; // [esp+68h] [ebp-30h] BYREF
    char v14[16]; // [esp+78h] [ebp-20h] BYREF
    unsigned int v15; // [esp+88h] [ebp-10h]

    v15 = __readgsdword(0x14u);
    ObjectClass = _JNIEnv::GetObjectClass(a1, a2);
    ring(v14, &s1, &us3_m3);
    v9 = sub_1BCB0(v14);
    MethodID = _JNIEnv::GetMethodID(a1, ObjectClass, v9, "(Ljava/lang/String;)V");
    StringUTFChars = _JNIEnv::GetStringUTFChars(a1, a3, 0);
    std::string::basic_string<decltype(nullptr)>(v13, StringUTFChars);
    _JNIEnv::ReleaseStringUTFChars(a1, a3, StringUTFChars);
    sub_1B850(v12);
    sub_1B8A0(v11);
    while ( (sub_1B910(v12, v11) & 1) != 0 )
    {
        v3 = sub_1B950(v12);
        *v3 += 8;
        *v3 ^= 7u;
        sub_1B960(v12);
    }

    v4 = sub_1BCB0(v13);
    v6 = _JNIEnv::NewStringUTF(a1, v4);
    _JNIEnv::CallVoidMethod(a1, a2, MethodID, v6);
    _JNIEnv::DeleteLocalRef(a1, v6);
    std::string::~string(v13);
    std::string::~string(v14);
    return __readgsdword(0x14u);
}
```
Here is simple encrypt with +8 and ^7 so i use script:
```python
def encrypt_string(input_str, key):
    result = bytearray()

    for i in range(len(key)):
        encrypted_char = (ord(key[i]) + 8) ^ 7
        result += encrypted_char.to_bytes(1, byteorder="little")

    return result
    
k1 = "Yc^XtMfu"
m1 = "d23ba52679c5e1"

encrypted_result = encrypt_string(m1, k1)
print("Encrypted Result:", encrypted_result.hex())
# 666c61677b52697a --> flag{Riz
```

**2.** Java_com_backdoor_sl4ydroid_MainActivity_damn
```c
unsigned int __cdecl Java_com_backdoor_sl4ydroid_MainActivity_damn(_JNIEnv *a1, int a2, int a3)
{
    int v3; // eax
    const char *v4; // eax
    char v6; // [esp+27h] [ebp-71h]
    int v7; // [esp+38h] [ebp-60h]
    int i; // [esp+3Ch] [ebp-5Ch]
    int StringUTFChars; // [esp+40h] [ebp-58h]
    int MethodID; // [esp+4Ch] [ebp-4Ch]
    int v11; // [esp+50h] [ebp-48h]
    int ObjectClass; // [esp+54h] [ebp-44h]
    char v13[16]; // [esp+58h] [ebp-40h] BYREF
    char v14[16]; // [esp+68h] [ebp-30h] BYREF
    char v15[16]; // [esp+78h] [ebp-20h] BYREF
    unsigned int v16; // [esp+88h] [ebp-10h]

    v16 = __readgsdword(0x14u);
    ObjectClass = _JNIEnv::GetObjectClass(a1, a2);
    ring(v15, &r1, &us3_m3);
    v11 = sub_1BCB0(v15);
    MethodID = _JNIEnv::GetMethodID(a1, ObjectClass, v11, "(Ljava/lang/String;)V");
    StringUTFChars = _JNIEnv::GetStringUTFChars(a1, a3, 0);
    std::string::basic_string<decltype(nullptr)>(v14, StringUTFChars);
    _JNIEnv::ReleaseStringUTFChars(a1, a3, StringUTFChars);
    std::string::basic_string(v13, v14);
    for ( i = sub_1AC20(v13) - 1; i >= 0; --i )
    {
        v6 = *sub_1AC50(v13, i) ^ 0xC;
        v3 = sub_1AC20(v14);
        *sub_1AC50(v14, v3 - 1 - i) = v6;
    }

    v4 = sub_1BCB0(v14);
    v7 = _JNIEnv::NewStringUTF(a1, v4);
    _JNIEnv::CallVoidMethod(a1, a2, MethodID, v7);
    _JNIEnv::DeleteLocalRef(a1, v7);
    std::string::~string(v13);
    std::string::~string(v14);
    std::string::~string(v15);
    return __readgsdword(0x14u);
}
```

Here is simple xor with 0xC and reverse strings

```python
def damn(k3):
    v14 = k3
    for i in range(len(k3)-1, -1, -1):
        v6 = ord(k3[i]) ^ 0xC
        v14 = v14[:len(k3)-1-i] + chr(v6) + v14[len(k3)-1-i+1:]
    return v14

k3 = "~?z?^S8o"
result = damn(k3)
print(result)

# c4_R3v3r
```

**3.** Java_com_backdoor_sl4ydroid_MainActivity_k2

```c
unsigned int __cdecl Java_com_backdoor_sl4ydroid_MainActivity_k2(_JNIEnv *a1, int a2, int a3)
{
    unsigned int v3; // eax
    const char *v4; // eax
    char v6; // [esp+1Ch] [ebp-6Ch]
    char v7; // [esp+23h] [ebp-65h]
    int v8; // [esp+38h] [ebp-50h]
    unsigned int i; // [esp+3Ch] [ebp-4Ch]
    int StringUTFChars; // [esp+40h] [ebp-48h]
    int MethodID; // [esp+4Ch] [ebp-3Ch]
    int v12; // [esp+50h] [ebp-38h]
    int ObjectClass; // [esp+54h] [ebp-34h]
    char v14[16]; // [esp+58h] [ebp-30h] BYREF
    char v15[16]; // [esp+68h] [ebp-20h] BYREF
    unsigned int v16; // [esp+78h] [ebp-10h]

    v16 = __readgsdword(0x14u);
    ObjectClass = _JNIEnv::GetObjectClass(a1, a2);
    ring(v15, &r2, &us3_m3);
    v12 = sub_1BCB0(v15);
    MethodID = _JNIEnv::GetMethodID(a1, ObjectClass, v12, "(Ljava/lang/String;)V");
    StringUTFChars = _JNIEnv::GetStringUTFChars(a1, a3, 0);
    std::string::basic_string<decltype(nullptr)>(v14, StringUTFChars);
    _JNIEnv::ReleaseStringUTFChars(a1, a3, StringUTFChars);
    for ( i = 0; i <= sub_1AC20(v14) - 1; ++i )
    {
        v6 = *sub_1AC50(v14, i);
        v3 = sub_1AC20(&v2);
        v7 = *sub_1AC50(&v2, i % v3) ^ v6;
        *sub_1AC50(v14, i) = v7;
    }

    v4 = sub_1BCB0(v14);
    v8 = _JNIEnv::NewStringUTF(a1, v4);
    _JNIEnv::CallVoidMethod(a1, a2, MethodID, v8);
    _JNIEnv::DeleteLocalRef(a1, v8);
    std::string::~string(v14);
    std::string::~string(v15);
    return __readgsdword(0x14u);
}
```

Here use RC4 with %v2 corresponds to m2 
```python
k4 = "xP78V`m?3XeL"


r = b""
m2 = "May_1??"
for i in range(len(k4)):
    ra = ord(m2[i % len(m2)]) ^ ord(k4[i])
    r += ra.to_bytes(2, byteorder="little")

print(r.replace(b"\x00",b""))
# b'51Ngg_RrR!:}'
```

I receive `flag{Riz....c4_R3v3r51Ngg_RrR!:}` and stuck with `ring` function in `Java_com_backdoor_sl4ydroid_MainActivity_nim`.  

We can use gdb to debug this function & get script
```python
x = "yeahh"
k2 = "0,S[)"
flag2 = ""

for i in range(len(k2)):
    flag2+= chr(ord(x[i]) ^ (ord(k2[i]) ^ 0x13))
    
print(flag2)
# ZZ! R
```

flag: `flag{RizZZ! Rc4_R3v3r51Ngg_RrR!:}`

It's a pity because this challenge is't hard hix :((. We can use log in Android Studio to check flag easily xDDD (From Vietzett)

![](/images/backdoorctf-2023-re/image-5.png)
