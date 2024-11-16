def func_5(a1, a2):
    v9 = 0
    for i in range(17):
        v2 = ord(a1[i])
        v9 += v2 + ord(a2[i])

    v12 = bytearray(17)
    v8 = bytearray(1)
    v8[0] = 0

    v13 = "R{{xqpMuYu`qKLPLP"
    for j in range(17):
        v4 = (v9 + 46) % 256
        v5 = ord(v13[j])
        v12[j] = v4 ^ v5

    return bytes(v12)

a1 = "SeventeenChars!!!"
a2 = "ThatsHardcoded!!!"
result = func_5(a1, a2)
print(result)
# b'FooledYaMate_XDXD'