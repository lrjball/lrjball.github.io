---
layout: post
title:  "Decision Tree Visualization"
excerpt: "See how a decision tree works on a dataset, and see if you can beat it!"
date:   2019-11-24 19:35:00 +0100
categories: [machine learning, visualization]
comments: true
bootstrap: true
---

A decision tree is a classification algorithm which essentially tries to classify a dataset by repeatedly splitting the data along a plane parallel to one of the axes. In the previous post, we explored how most greedy decision tree algorithms work. Knowing that they are not perfect, here is your chance to try and beat the algorithm!

Hover over the box below to draw a line going through your mouse, and click to confirm the split. Repeat this until the dataset has been fully classified, aiming to do it in as few splits and as little time as possible. When you are done, click on 'Reveal Solution' to see how the decision tree algorithm did on the dataset. Then mix up the dataset to give yourself more of a challenge, by clicking on 'Generate New Data' and increasing thw number of points.

Good luck!

{% include tree_viz.html %}

<br>
# Get the App

This visualization has been turned into a fun puzzle game which is available on the Google Play Store. There are over 100 challenging levels, with loads of added features.

<div class='row'>
    <img style="float: left; height: 200px; margin-right: 20px;" src="/img/tree_viz/decision_logo.png">
    <img style="float: left; height: 200px; margin-right: 20px;" src="/img/tree_viz/decision_preview_1.png">
    <img style="float: left; height: 200px; margin-right: 20px;" src="/img/tree_viz/decision_preview_2.png">
    <img style="float: left; height: 200px; margin-right: 20px;" src="/img/tree_viz/decision_preview_3.png">
    <img style="float: left; height: 200px; margin-right: 20px;" src="/img/tree_viz/decision_preview_4.png">
</div>

<a class='btn btn-large' href='https://play.google.com/store/apps/details?id=playdecision.decision&hl=en_GB' style="font-size: 25px">Download App&nbsp;<i class="fab fa-google-play"></i></a>