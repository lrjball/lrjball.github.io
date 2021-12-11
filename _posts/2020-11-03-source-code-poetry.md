---
layout: post
title:  "Source Code Poetry"
excerpt: "A review of my winning entry from the source code poetry competition 2020"
date:   2020-11-03 12:14:00 +0100
categories: [python, poetry]
comments: true
bootstrap: true
showcode: true
---

The [Source Code Poetry][source_code_poetry] competition challenges participants to write some code that
runs without any errors, but also reads as poetry. This post talks a little about my
thought process when writing my poem. But first, here it is:

```python
"""A Coronavirus Haiku"""

global pandemic                                         # Global pandemic
"".startswith("short breath"), "".endswith("death")     # Starts with short breath, ends with death
"a".__new__(type("of bug"))                             # A new type of bug

{"make", "a"}.difference({})                            # Make a difference
be = open("to", "a"); "small change"                    # Be open to a small change
["care" for those in "need"]                            # Care for those in need

[].extend(["distance", "now"])                          # Extend distance now,
for then in {"time": "we'll"}: be.close()               # for then in time we'll be close
if all([help]): sorted("!")                             # If all help: sorted!

stay:str("ong") and "hopeful"                           # Stay strong and hopeful
while complex(): "they'll".find("a cure -")             # While complex, they'll find a cure -
try: not "to", object, ...                              # try not to object...

finally: a:"huge"                                       # Finally, a huge
"thank you".__doc__+"tors" and "nurses"                 # thank you doctors and nurses
True, super, "heroes"                                   # True superheroes
```

It is a poem about the ongoing Covid-19 pandemic written in python and is made up of
5 haiku (3 lines each, with the lines having 5, 7 and 5 syllables respectively).

As Python is my favourite language at the moment, that is what I chose to write the 
poem in. That turned out to be a great choice, as Python's clean syntax made it fairly 
easy to write readable code. Obviously you could make a python module that was a single
multiline string, but that isn't really in the spirit of the competition. Instead, I tried to
fit as much of Python's varied syntax as I could into a single poem, making use of as many 
builtins as possible. To get inspired, I pulled all the keywords/builtins from python with:

```python
import keyword
words = keyword.kwlist + dir(__builtins__)
# Filtering out Errors/Warnings as straight away it was clear 
# they would be hard to fit into any poem
words = [w for w in words if 'Error' not in w and 'Warning' not in w]
print(words)
```
Output:
```
['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'BaseException', 'Ellipsis', 'Exception', 'False', 'GeneratorExit', 'KeyboardInterrupt', 'None', 'NotImplemented', 'StopAsyncIteration', 'StopIteration', 'SystemExit', 'True', '_', '__build_class__', '__debug__', '__doc__', '__import__', '__loader__', '__name__', '__package__', '__spec__', 'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'copyright', 'credits', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'exit', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'license', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'quit', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip']
```

Reading through this list hoping to get some inspiration, the `global` keyword jumped straight out,
and I started trying to put together a short haiku around the current pandemic, making use of defining 
global variables in python with a first line of
```python
global pandemic
```

It then snowballed from there and after adding in the builtin methods such 
as `startswith` and `difference`, I found myself with enough material for 
several paragraphs.

Some of the parts I am happiest with are:

```python
be = open("to", "a");
...
be.close()
```
which creates and opens a file called 'to' in the current directory in 
append mode, then later closes it making use of the homophone 'close'.

And also

```python
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
