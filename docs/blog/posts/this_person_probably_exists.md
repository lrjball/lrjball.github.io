---
title:  "This Person (Probably) Exists"
date: 2023-10-23
tags:
    - Privacy
    - Machine Learning
categories:
    - Today I Learned
authors:
  - lrjball
---

An interesting paper I came across recently that discusses privacy concerns surrounding generative machine learning models.

<!-- more -->


## Paper

The paper can be found on arXiv [here](https://arxiv.org/pdf/2107.06018.pdf)

!!! abstract

    Recently, generative adversarial networks (GANs) have achieved
    stunning realism, fooling even human observers. Indeed, the popular
    tongue-in-cheek website [http://thispersondoesnotexist.com](http://thispersondoesnotexist.com), taunts users
    with GAN generated images that seem too real to believe. On the other
    hand, GANs do leak information about their training data, as evidenced
    by membership attacks recently demonstrated in the literature. In this
    work, we challenge the assumption that GAN faces really are novel cre-
    ations, by constructing a successful membership attack of a new kind.
    Unlike previous works, our attack can accurately discern samples sharing
    the same identity as training samples without being the same samples.
    We demonstrate the interest of our attack across several popular face
    datasets and GAN training procedures. Notably, we show that even in
    the presence of significant dataset diversity, an over represented person
    can pose a privacy concern.

## Thoughts

This paper was mentioned in one of the talks at pyData Amsterdam. The paper shows that not every output of an image generation model (styleGAN in this case) is completely novel compared to the training set. They show that some of the generated images of people that are claimed to not exist are highly similar to real people from the training data. It makes for a really interesting read and makes you wonder how privacy as well as copyrights are going to be impacted by the ever-increasing use of generative models. In cases where the model is not generating novel output and is mimicking inputs it was trained on, who owns the rights to what is produced?