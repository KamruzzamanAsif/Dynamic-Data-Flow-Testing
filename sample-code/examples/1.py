def foo(x, y):
    a = x - bar(y)
    for i in range(a):
        x += i
    z = bar(x) - y
    y = 5
    return x * y
