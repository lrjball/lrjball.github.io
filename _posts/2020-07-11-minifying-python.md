---
layout: post
title:  "Minifying Python?"
excerpt: "Just about everything you'll need to style in the theme: headings, paragraphs, blockquotes, tables, code blocks, and more."
date:   2020-07-11 23:14:06 +0100
categories: [python, codegolf]
comments: true
---

**Minification** is the process of making code more compact. For languages like Javascript this offers clear benefits 
as smaller files of code means less data needs to be downloaded, which means a more responsive web page. As a result, 
minification is best practice for Javascript. On the other hand, minifying Python code is pretty much unheard of. I have recently open sourced the package [minigolf][minigolf] and in the following post I will explore why you sometimes should (and sometimes definitely shouldn't!) be minifying your Python code.

# Reason 1: Because it is fun

There is a good chance that you have tried to minify your Python code without even realising it, in the form of code golf. Much like regular golf, the aim of code golf is to use the fewest (key)strokes possible. It is done as a bit of fun to push the language to its limits, and to test your own knowledge of a language. Here is an example of some golfed code
which print the first 50 fibonacci numbers:

{% highlight python %}
f,g=0,1
while f<9e9:print(f);f,g=g,f+g
{% endhighlight %}

It only uses **38** characters - see if you can beat it!


# Reason 2: Size

Okay, this one is probably overlooked most of the time, but is something which can make a real difference to production code out in the wild. If you are deploying a Python app to hundred or even thousands of servers, then even a small drop in file size will likely have a noticable impact on download times and deployment speed. But minification isn't just a small drop, we are talking about over a 50% reduction in file sizes. Think of all of the wasted bytes used for documentation, type hinting, comments, indentation, pretty variable naming etc. and before you know it you have created something which is far larger than it needs to be. Adding minification to the final step of your CI pipeline is an easy way to get a little bit more out of your infrastructure.

# Reason 3: Obfuscation

Minifying code makes it inherently harder to read, which provides an extra barrier in the way of anyone trying to reverse engineer your code. Obviously no amount of reformatting and variable renaming is going to prevent a determined attacker from stealing your logic (the machine needs to be able to interpret the code to run it after all!) but making it a bit harder for them is definitely worth doing. Developers aim to write code with nice comments, helpful docstrings and descriptive variable names to make it easy for other contributers to the project, but as soon as the code is sent out into the wild you are handing your ideas out to everyone on a silver platter! If you do not intend to open-source your project for the world to see, then you should take measures to make it as hard to understand as possible once you release it.

It is much easier for someone to steal your code if there is a function called:

{% highlight python %}
def our_proprietary_algorithm(
    text_data: List[str], threshold: Optional[int] = None
) -> float:
    """
    This function contains all of our trade secrets.
    Help yourself!
    """
    if threshold is None:
        threshold = 0
    secret_ingredient = get_secret_ingredient()  # useful comment
    results = [text.count(secret_ingredient) > threshold for text in text_data]
    mean_results = sum(results) / len(results)
    return mean_results
{% endhighlight %}

On the other hand, the minified code would look like:

{% highlight python %}
def a(b,c=None):
 if c is None:c=0
 d=e();f=[g.count(d)>c for g in b];return sum(f)/len(f)
{% endhighlight %}

Not impossible to understand, but certainly much harder. Now imagine scaling this up to a whole codebase with thousands of lines. Reverse engineering suddenly becomes a pretty daunting task!

# Reason 4: Professionalism

Code comments can often contain information about bugs which have yet to be fixed by the developers, hints at upcoming features, and maybe a few jokes and digs at other team members. Things like this are great when the code is being circulated internally, but it is unlikely that you would want them to be visible to clients. The following are all snippets I have come across in production apps, which probably should not have been in there:

{% highlight python %}
# fixme: fix this later, keeps breaking
{% endhighlight %}

{% highlight python %}
# Gary wrote this module - don't trust any of it
{% endhighlight %}

{% highlight python %}
# ^ PLEASE DO NOT REMOVE THIS LINE - everything seems to break without it ^
{% endhighlight %}

{% highlight python %}
"""
This function should be deprecated, but we have no idea how to 
remove it without everything breaking! Sorry ¯\_(ツ)_/¯
"""
{% endhighlight %}

Minification will remove comments and docstrings for free, so you never have to worry about this again. You are free to call Gary an idiot in a comment without any repercussions.


# Reason 5: 



[minigolf]: https://github.com/lrjball/minigolf

