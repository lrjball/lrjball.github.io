---
title:  "Source Code Poetry"
date: 2020-11-03
tags:
    - Python
    - Competition
categories:
    - Articles
authors:
  - lrjball
---

A review of my winning entry from the source code poetry competition 2020

<!-- more -->


The [Source Code Poetry][source_code_poetry] competition challenges participants to write some code that runs without any errors, but also reads as poetry. This post talks a little about my
thought process when writing my poem.

## Poem

!!! quote inline end "A Coronavirus Haiku"

    Global pandemic<br>
    Starts with short breath, ends with death<br>
    A new type of bug

    Make a difference<br>
    Be open to a small change<br>
    Care for those in need

    Extend distance now,<br>
    for then in time we'll be close<br>
    If all help: sorted!

    Stay strong and hopeful<br>
    While complex, they'll find a cure<br>
    - try not to object...

    Finally, a huge<br>
    thank you doctors and nurses<br>
    True superheroes

``` py linenums="1" title="coronavirus_haiku.py"
global pandemic
"".startswith("short breath"), \
"".endswith("death")
"a".__new__(type("of bug"))

{"make", "a"}.difference({})
be = open("to", "a"); "small change"
["care" for those in "need"]

[].extend(["distance", "now"])
for then in {"time": "we'll"}: be.close()
if all([help]): sorted("!")

stay:str("ong") and "hopeful"
while complex(): "they'll".find("a cure -")
try: not "to", object, ...

finally: a:"huge"
"thank you".__doc__+"tors" and "nurses"
True, super, "heroes"
```


## Explanation

It is a poem about the ongoing Covid-19 pandemic written in python and is made up of
5 haiku 

!!! info "Haiku"

    A Haiku is a type of poem originating in Japan that consists of 3 lines, with the lines having 5, 7 and 5 syllables respectively

As Python is my favourite language at the moment, that's what I chose to write the 
poem in. That turned out to be a great choice, as Python's clean syntax made it fairly 
easy to write readable code. Obviously you could make a python module that was a single
multiline string, but that isn't really in the spirit of the competition. Instead, I tried to
fit as much of Python's varied syntax as I could into a single poem, making use of as many 
builtins as possible. To get inspired, I pulled all the keywords/builtins from python with:

``` py
import keyword
words = keyword.kwlist + dir(__builtins__)
# Filtering out Errors/Warnings as straight away it was clear 
# they would be hard to fit into any poem
words = [w for w in words if 'Error' not in w and 'Warning' not in w]
print(words)
```
Output:
``` py
['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'BaseException', 'Ellipsis', 'Exception', 'False', 'GeneratorExit', 'KeyboardInterrupt', 'None', 'NotImplemented', 'StopAsyncIteration', 'StopIteration', 'SystemExit', 'True', '_', '__build_class__', '__debug__', '__doc__', '__import__', '__loader__', '__name__', '__package__', '__spec__', 'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'copyright', 'credits', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'exit', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'license', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip']
```

Reading through this list hoping to get some inspiration, the `global` keyword jumped straight out,
and I started trying to put together a short haiku around the current pandemic, making use of defining 
global variables in python with a first line of
``` py linenums="1"
global pandemic
```

It then snowballed from there and after adding in the builtin methods such 
as `startswith` and `difference`, I found myself with enough material for 
several paragraphs.

Some of the parts I am happiest with are:

``` py linenums="9 11"
be = open("to", "a");
...
for then in {"time": "we'll"}: be.close()
```
which creates and opens a file called 'to' in the current directory in 
append mode, then later closes it making use of the homophone 'close'.

And also

```python linenums="18"
try: not "to", object, ...

finally: a:"huge" 
```
which makes use of a try/finally clause over two paragraphs, which is valid syntax but less common than the
try/except or try/except/finally clauses.

I'm also glad I was able to make use of `if`, `while`, `for`, `try` as well as a list 
comprehension.

Overall I was pretty happy with the end result and thankful to the judges of the competition for selecting 
it as the winning entry.

[source_code_poetry]: https://www.sourcecodepoetry.com/
