---
layout: post
title:  "Decision Trees are Suboptimal!"
excerpt: "Decision trees don't always behave as you might think..."
date:   2019-09-01 22:07:14 +0100
categories: [python, machine learning]
comments: true
---


The decision tree is one of the first classification algorithms taught in any machine learning course. It is easy to understand and gives a very interpretable output. Despite this, most people don't realise that all tree building algorithms (e.g. CART, ID3, C.45, MARS) are suboptimal.

Suboptimal in this context is not referring to how good or bad these classifiers perform on an arbitrary dataset (and it is likely that a decision tree will not give the best results for most real world datasets). Instead, we are going to explore how well a decision tree does the job that it is supposed to do - classifying a dataset by repeatedly splitting on the features. You will see that even if the dataset can be classified perfectly using a tree, it is very unlikely that a decision tree algorithm will find that optimal tree successfully.

This behaviour is a necessary compromise to allow decision trees to scale well to large datasets, and trying to actually find the optimal tree is a problem that quickly becomes unachievable as we start talking about even a modestly sized dataset. So whilst unavoidable in any practical application, it is worth being aware of these limitations in the algorithms and this post will expore this in some detail.


```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap
import matplotlib.gridspec as gridspec
import random
from graphviz import Digraph
%matplotlib inline

#config for plot style:
from cycler import cycler
plt.rcParams['figure.figsize'] = [8, 4]
COLORS = ['#F5A623', '#000080']
CM = ListedColormap(colors=['#F5A623', '#000080'])
plt.rcParams['axes.prop_cycle'] = cycler(color= COLORS + 
                                         [c['color'] for c in plt.rcParams['axes.prop_cycle']])
SMALL_SIZE = 16
MEDIUM_SIZE = 18
LARGE_SIZE = 22

plt.rc('font', size=SMALL_SIZE)          
plt.rc('axes', titlesize=SMALL_SIZE)     
plt.rc('axes', labelsize=MEDIUM_SIZE)    
plt.rc('xtick', labelsize=SMALL_SIZE)    
plt.rc('ytick', labelsize=SMALL_SIZE)    
plt.rc('legend', fontsize=SMALL_SIZE)    
plt.rc('figure', titlesize=LARGE_SIZE)

from IPython.core.display import HTML
HTML("""
<style>
.output_png {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
</style>
""")
```


```python
def generate_random_points(n, x_lims, y_lims):
    """
    Generates n random (x, y) pairs where: 
        x ~ U(x_lims[0], x_lims[1])
    and   
        y ~ U(y_lims[0], y_lims[1])
    """
    return list(zip([random.uniform(*x_lims) for _ in range(n)], 
                    [random.uniform(*y_lims) for _ in range(n)]))

def split_datasize(n, scale=0):
    """
    Splits the integer n into two value x, y where x + y = n,
    and x ~ U(n/2 - n*scale, n/2 + n*scale)
    """
    split_int = random.randint(int(n/2 - n*scale), int(n/2 + n*scale))
    return split_int, n - split_int

def generate_datasets(n):
    size_0, size_1 = split_datasize(n)    
    quadrant_sizes_0 = split_datasize(size_0)
    quadrant_coords = [
        [[-2, 0], [-1, 2]],
        [[0, 2], [-2, 1]],
        [[-2, 0], [-2, -1]],
        [[0, 2], [1, 2]]
    ]
    data_0 = generate_random_points(quadrant_sizes_0[0], *quadrant_coords[0]) \
            + generate_random_points(quadrant_sizes_0[1], *quadrant_coords[1])
    
    quadrant_sizes_1 = split_datasize(size_1)
    data_1 = generate_random_points(quadrant_sizes_1[0], *quadrant_coords[2]) \
            + generate_random_points(quadrant_sizes_1[1], *quadrant_coords[3])
    return data_0, data_1


def _fit_decision_tree(n):
    x0, x1 = generate_datasets(n)
    y = [0] * len(x0) + [1] * len(x1)
    x = x0 + x1
    dt = DecisionTreeClassifier(random_state=2).fit(x, y)
    return x0, x1, dt
    

def generate_suboptimal_dataset(n_points, min_depth):
    """
    Generates a dataset which has been suboptimally 
    classified by a decision tree
    """
    i = 0
    while True:
        i += 1
        x0, x1, dt = _fit_decision_tree(n_points)
        depth = dt.get_depth()
        if depth >= min_depth:
            print(f'Found a decision tree of depth {depth} after {i} tries')
            break
    return x0, x1, dt


def calculate_optimal_ratio(n_points, optimal_depth=2, n_iter=1000):
    n_optimal = 0
    for _ in range(n_iter):
        _, _, dt = _fit_decision_tree(n_points)
        if dt.get_depth() == optimal_depth:
            n_optimal += 1
    return n_optimal/n_iter
        
        
def plot_optimal_ratio(x, n_iter=1000, ax=None):
    ratios = [calculate_optimal_ratio(val, n_iter=n_iter) for val in x]
    if ax is None:
        fig, ax = plt.subplots()
    ax.plot(x, ratios)
    ax.set_xlabel('Size of the dataset')
    ax.set_ylabel('Optimal ratio')
    ax.set_title('Ratio of optimal trees for a given size of dataset')
    

def plot_suboptimal_dataset(x0, x1, dt, ax=None):
    # x0, x1, dt = generate_suboptimal_dataset(n, min_depth, tree_depth)
    xx, yy = np.meshgrid(np.arange(-2.1, 2.1, 0.01), np.arange(-2.1, 2.1, 0.01))
    Z = dt.predict(np.c_[xx.ravel(), yy.ravel()]).reshape(xx.shape)
    # plot decision tree boundaries
    if ax is None:
        fig, ax = plt.subplots()
    ax.contourf(xx, yy, Z, cmap=CM, alpha=0.2)
    # plot datasets
    ax.plot([i[0] for i in x0], [i[1] for i in x0], '^', markersize=8)
    ax.plot([i[0] for i in x1], [i[1] for i in x1], 'o', markersize=8)
    # plot actual dataset boundaries
    ax.plot([0, 0], [-2.1, 2.1], 'g--')
    ax.plot([-2.1, 0], [-1, -1], 'g--')
    ax.plot([0, 2.1], [1, 1], 'g--')
    ax.set_xlabel('Feature_1')
    ax.set_ylabel('Feature_2')
    ax.set(xlim=[-2.1, 2.1], ylim = [-2.1, 2.1])
```

## The dataset


In order to put decision trees to the test, we need to generate a dataset which we know can be solved by a tree. To start off with, we will generate a dataset where one class is sampled uniformly from the 2 blue sections below, and the other class is sampled from the yellow sections (while making sure there is at least one point in each of the 4 sections). This dataset can then definitely be split by the tree of depth 2, and cannot be split by a tree of depth 1.


```python
fig, ax = plt.subplots()
ax.fill([-2, 0, 0, -2], [-1, -1, 2, 2], 'C0', alpha=0.2)
ax.fill([0, 2, 2, 0], [-2, -2, 1, 1], 'C0', alpha=0.2)
ax.fill([-2, 0, 0, -2], [-2, -2, -1, -1], 'C1', alpha=0.2)
ax.fill([0, 2, 2, 0], [1, 1, 2, 2], 'C1', alpha=0.2)
ax.plot([0, 0], [-2, 2], 'g--')
ax.plot([-2, 0], [-1, -1], 'g--')
ax.plot([0, 2], [1, 1], 'g--')
ax.set_xlim((-2, 2))
ax.set_ylim((-2, 2))
ax.set_xlabel('Feature_1')
ax.set_ylabel('Feature_2')
ax.set_title('Data sample distribution');
```


![png](/img/suboptimal_decision_trees/output_5_0.png)


For this dataset, an optimal decision tree should be able to split the data on the green dotted lines above, 
producing the following decision tree:


```python
u = Digraph('decision tree', node_attr={'color': 'black', 'fillcolor': '#f5f5f5', 'style': 'filled'})
u.attr(size='6,6')

u.edge('Feature_1 > 0', 'Feature_2 > -1', label=' no')
u.edge('Feature_1 > 0', 'Feature_2 > 1', label=' yes')
u.edge('Feature_2 > 1', '', label=' no')
u.edge('Feature_2 > 1', ' ', label=' yes')
u.edge('Feature_2 > -1', '  ', label=' no')
u.edge('Feature_2 > -1', '   ', label=' yes')

u.node('   ', color='black', fillcolor=COLORS[0])
u.node(' ', color='black', fillcolor=COLORS[1])
u.node('  ', color='black', fillcolor=COLORS[1])
u.node('', color='black', fillcolor=COLORS[0])
u
```




![svg](/img/suboptimal_decision_trees/output_7_0.svg)



## Initial results

Now we have defined our dataset, we can try to classify it using a CART decision tree. Note, there are no training/testing datasets here as we are just trying to see if the classifier can even fit to our dataset, without worrying about whether or not it overfits. 

For this we will be using the DecisionTreeClassifier from python's scikit-learn, but the implementation should not make too much difference to the conclusions drawn - there will be a very similar story for every decision tree algorithm. If you would like to follow along with the code, click the 'Toggle Code' button at the top of the page.

After trying out the decision tree on a dataset with 10 points, this is what we get:


```python
random.seed(9)
x0, x1, dt = generate_suboptimal_dataset(10, 3)
plot_suboptimal_dataset(x0, x1, dt)
```

    Found a decision tree of depth 3 after 2 tries



![png](/img/suboptimal_decision_trees/output_9_1.png)


The decision tree took 3 splits to separate the data! This may come as a surprise considering how obvious it is to the human eye that this dataset can be split in just 2 splits. A deeper tree will do a worse job at generalizing to new unseen data, and this is evident in the figure above. The blue background shows all of the points which would have been given the blue class, and you can see that this area is much larger than the area used to create the blue points.

## Was that a fluke?

After seeing this, your initial reaction may be that this dataset has been specifically crafted so that the decision tree does a poor job. To test this out, we can generate many datasets of various sizes, and see how many the decision tree manages to classify using an optimal (depth 2 in this case) tree. The results of that analysis are shown below:


```python
plot_optimal_ratio(list(range(5, 100))[::2])
```


![png](/img/suboptimal_decision_trees/output_11_0.png)


From this plot we can see that for very small datasets the decision tree finds the optimal tree most of the time, which makes sense because there are only a few possible trees which can be built when there are very few points. However, as soon as we get beyond 20 or so points it becomes very unlikely that the decision tree algorithm will find the optimal tree.

## So what is going on then?

The decision tree algorithm is greedy, and this is why it is falling short here. The datasets we are using are not particularly special, but they were chosen so that the best depth 1 tree does not produce the optimal depth 2 tree. This property is going to exist in pretty much every real world dataset to some extent, but our chosen data distribution highlights this shortcoming in an obvious way.

By plotting the decision boundaries at each depth of the decision tree, we can understand how the greedy algorithm came to generate a suboptimal tree.


```python
gs = gridspec.GridSpec(4, 4, figure=plt.figure(figsize=(15, 8)))
x = x0 + x1
y = [0]*len(x0) + [1]*len(x1)
plot_positions = [[slice(0, 2), slice(0, 2)], [slice(0, 2), slice(2, 4)], [slice(2, 4), slice(1, 3)]]
for i in range(1, 4):
    dt = DecisionTreeClassifier(max_depth=i, random_state=2).fit(x, y)
    ax = plt.subplot(gs[plot_positions[i - 1][0], plot_positions[i - 1][1]])
    plot_suboptimal_dataset(x0, x1, dt, ax=ax)
    ax.set_title(f'Depth {i}')
    ax.set_xticks([], [])
    ax.set_yticks([], [])
plt.tight_layout()
```


![png](/img/suboptimal_decision_trees/output_13_0.png)


The decision tree starts by finding the best initial split of the data. It manages to find a split which has a LHS gini impurity of:

$$
\\1 - \left(\frac{2}{6}\right) ^2 - \left(\frac{4}{6}\right) ^2 = 0.444... 
$$

and a RHS gini impurity of:

$$\\1 - \left(\frac{1}{4}\right) ^2 - \left(\frac{3}{4}\right) ^2 = 0.375 $$

leading to an average of $0.409...$.

In comparison, the optimal depth 2 tree at depth 1 has an average gini impurity of $0.5$.

A smaller gini impurity indicates a better split, with 0.5 being the worst possible value. So at the first level, the CART decision tree algorithm did a better job. In fact, by just looking at the first level of the eventual optimal tree, the impurity has not been improved at all and the dataset is just as unclassified as it would be if the classification was left to random chance.

However, by the second level the gini impurity of the decision tree algorithm drops to $0.222...$ while the optimal tree has an impurity of 0 indicating a perfect split. By being greedy at the first level, the decision tree algorithm failed to find the best possible solution after two levels.

It takes until the third level for the decision tree to completely separate the datasets.

In fact, it is not too hard to find a dataset where a decision tree will generate a far deeper tree, such as the one below of depth 7!


```python
random.seed(13)
fig, ax = plt.subplots(1, 2, figsize=(15, 4))
x0, x1, dt = generate_suboptimal_dataset(100, 7)
plot_suboptimal_dataset(x0, x1, dt, ax=ax[0])
ax[0].set_title('Decison Tree of depth 7')
ax[0].plot([1.75], [-0.5], 'kx', markersize=10, markeredgewidth=5)
dt = DecisionTreeClassifier(max_depth=2, random_state=2).fit(x0 + x1, [0]*len(x0) + [1]*len(x1))
plot_suboptimal_dataset(x0, x1, dt, ax=ax[1])
ax[1].set_title('The same Decison Tree, at depth 2')
ax[1].plot([1.75], [-0.5], 'kx', markersize=10, markeredgewidth=5);
```

    Found a decision tree of depth 7 after 13334 tries



![png](/img/suboptimal_decision_trees/output_15_1.png)


The depth 7 tree manages to correctly classify all the data, but is clearly going to generalize poorly. For example, the unseen point $(1.75, -0.5)$ shown as a black cross will be misclassified as blue, when it clearly should be yellow. By comparing this decision tree at depth 2 to the optimal tree, we can see that restricting the tree depth will not give a better solution here.

## Can we do better?

A way to potentially eleviate this problem is to use a random forest, which is a collection of decision trees trained on random subsets of the data.


```python
fig, ax = plt.subplots(1, 2, figsize=(15, 4))
rf = RandomForestClassifier(n_estimators=1000, max_depth=2).fit(x0 + x1, [0]*len(x0) + [1]*len(x1))
plot_suboptimal_dataset(x0, x1, rf, ax=ax[0])
ax[0].set_title('Random Forest of depth 2 decision trees')
rf = RandomForestClassifier(n_estimators=1000, max_depth=7).fit(x0 + x1, [0]*len(x0) + [1]*len(x1))
plot_suboptimal_dataset(x0, x1, rf, ax=ax[1])
ax[1].set_title('Random Forest of depth 7 decision trees');
```


![png](/img/suboptimal_decision_trees/output_17_0.png)


A random forest of depth 2 trees still does a very poor job on the dataset, and there is a whole region in the upper left where it fails to identify the correct class. However, a random forest of depth 7 trees does a better job on the dataset and it is clear that the imperfections of each tree individually have been smoothed out by the forest. Although, it is interesting to note that the combination of 1000 decision trees of depth 7 has still failed to optimally split a dataset which can be split by a simple tree of depth 2!

The fact is that there are simply too many possible trees to check every single one for the best score. Granted, in this case it would be pretty easy to write something to check all depth 1 and depth 2 trees to find the best one, but that will not scale when the depth of the tree gets into double (or even triple) digits, and it will also not scale well as the dataset grows. Ultimately every algorithm has to find a balance between accuracy and speed, and being greedy is the compromise made by most (if not all) decision tree implementations. This should not stop you from using them as tree methods still have a great number of benefits, but it should help give you a better idea about how the algorithm works.
