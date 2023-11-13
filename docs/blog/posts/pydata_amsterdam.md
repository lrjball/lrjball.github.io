---
title: "PyData Amsterdam"
cover_image: /assets/pydata_amsterdam.png
date: 2023-09-19
tags:
    - Conferences
categories:
    - Articles
authors:
  - lrjball
---

Highlights from my time at PyData Amsterdam 2023

<!-- more -->

Below I've summarised a few of my favourite talks from the event. See [Pydata Amsterdam](https://amsterdam.pydata.org/) for more details.


## Python for imaging and AI for cultural heritage

Incredible talk, some really exciting work being done to preserve The Night's Watch by Rembrant at
incredibly high precision. A great deal of image processing techniques being used. Also loads of
image-based searches being done.

See here for the [Ultra high resolution photo](https://www.rijksmuseum.nl/en/stories/operation-night-watch/story/ultra-high-resolution-photo) of The Night's Watch.

## AI without distopia

Key message was to use skills for something good, so you can look back and say you have
made a positive impact on the word, not just competed in ad wars or made a company money.
Cited applications for environment, poverty, housing, social justice, equality etc.

In Q&A made interesting point. Question was asked about collecting sensitive data
e.g. race, religion etc to test and ensure fairness. She made the point that there are other
options (citing fairness through awareness paper). Also said that if a variable is a proxy for
a protected variable, then better to use that actual variable (better to be explicit than implicit)
e.g. if using postcode is a proxy for income in the model, just use income then at least you are being
clear and conscious about the feature. If income shouldn't be in the model, then don't use postcode.

## Processing billions of tokens for LLMs - Huggingface

Cool talk, mainly about how they processed the common crawl dataset to get good performance in their
LLM using messy initial data. After all cleaning (deduplication, parsing, filtering, sanitising etc)
ended up with only 10% of the data, but a much better result and even comparable to some of openai's
results. Interesting to hear the work they are doing, and to hear from the founder Thomas Wolff.