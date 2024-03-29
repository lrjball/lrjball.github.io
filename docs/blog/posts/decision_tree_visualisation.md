---
title:  "Decision Tree Game"
date:   2019-09-01
tags:
    - Visualisation
    - Machine Learning
    - Javascript
categories:
    - Articles
authors:
  - lrjball
---

An interactive game to demonstrate how decision trees work. Built using D3.js
<!-- more -->

<body style="cursor:pointer">

<div class='row justify-content-center'>
<button type="button" class="btn btn-primary ml-4" data-toggle="modal" data-target="#exampleModalCenter">
        How To Play
</button>
<a class="btn btn-danger" data-toggle='modal' data-target="#exampleModalCenter2"
    id='generateNew' style="color: white;">
    Generate New Data
    </a>

    <!-- Button trigger modal -->
    <div class="modal fade"  data-backdrop="false" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title" id="exampleModalCenterTitle2"  style="margin: 0;">Generate a New Random Dataset</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                        <p>Data Generation Method:</p>
                    <div class="custom-control custom-radio">
                        <input type="radio" id="customRadio1" name="customRadio" class="custom-control-input">
                        <label class="custom-control-label" for="customRadio1">Random
                            <i class="fas fa-info-circle" data-toggle='tooltip'
                            title='Points generated and labelled completely at random, although constrained so that they do not overlap.'></i></label>
                    </div>
                    <div class="custom-control custom-radio">
                        <input type="radio" id="customRadio2" name="customRadio" class="custom-control-input">
                        <label class="custom-control-label" for="customRadio2">Diagonal
                            <i class="fas fa-info-circle" data-toggle='tooltip'
                            title='Points generated at random, but labelled according to the x=y diagonal boundary.'></i>
                        </label>
                    </div>
                    <div class="custom-control custom-radio">
                        <input type="radio" id="customRadio3" name="customRadio" class="custom-control-input">
                        <label class="custom-control-label" for="customRadio3">Curved
                            <i class="fas fa-info-circle" data-toggle='tooltip'
                            title='Points generated at random, but labelled according to a curved boundary.'></i>
                        </label>
                    </div>
                    <label for="pointsRange" id="pointsRangeLabel" class="pt-3">Number of points: 10</label>
                    <input type="range" class="custom-range col pt-3" id="pointsRange">
                    <div class="alert alert-warning" role="alert">
                        Warning: By generating a new dataset your high scores will be reset.
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" data-dismiss="modal" onclick="restart()">Go</button>
                </div>
            </div>
        </div>
    </div>

<a class="btn btn-warning" onclick="retry()" data-toggle='popover' data-trigger='hover'
    data-placement='top' title="Try again on the same dataset" data-content="See if you can separate the
    two classes using even fewer splits, or in a quicker time"
    style="color: white;">Retry</a>

<a type="button" class="btn btn-info"
onclick="reveal()" data-toggle='popover' data-trigger='hover'
data-placement='top' title='Reveal the solution'
data-content="Show the solution from a Decision Tree algorithm, and see how you compared!"
style="color: white;">Reveal Solution</a>

<!-- Button trigger modal -->
<div class="modal fade"  data-backdrop="false" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
    <div class="modal-content">
    <div class="modal-header">
        <h2 class="modal-title" id="exampleModalCenterTitle" style="margin: 0;">How To Play</h2>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
        <p>
            By clicking the mouse, a split will be made according to where the mouse is positioned in the current region. For example,
            if the mouse is in the bottom triangle, a vertical boundary will be drawn with
            <span style="background-color: #B1D6FF;">blue</span>
            on the right, and <span style="background-color: #FCE8B7;">yellow</span>
            on the left. Play around in the below square to get the hang of how it works.
        </p>
        <div id="my_dataviz_example"></div>
        <p>
            The aim is to split the given dataset so that every <span style="background-color: #B1D6FF;">blue</span>
                point is on a <span style="background-color: #B1D6FF;">blue</span> background, and every
            <span style="background-color: #FCE8B7;">yellow</span>
            point is on a <span style="background-color: #FCE8B7;">yellow</span> background in as few splits and as fast
            as possible. When you are done, you can compare your result to the solution from a decision tree algorithm.
        </p>
    </div>
    <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Done</button>
            </div>
    </div>
</div>
</div>

<div class='row justify-content-center'>
    <div class="custom-control custom-switch my-auto mx-2 pt-2">
        <input type="checkbox" class="custom-control-input" id="customSwitch1">
        <label class="custom-control-label" for="customSwitch1">Guidelines</label>
    </div>
</div>
    
<div class="row">
    <div class="col-md-6">
            <div id="my_dataviz"></div>
    </div>
    <div class="col-md-6">
            <div id="my_dataviz2"></div>
    </div>
</div>

<!-- Completion modal -->
<div class="modal fade" id="completionModal" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="completionModal" style="margin: 0;">Congratulations!</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Dismiss</button>
            </div>
        </div>
    </div>
</div>

</div>

<!-- <script src="/js/tree_viz/tree_viz.js"></script> -->

</body>