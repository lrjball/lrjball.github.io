---
layout: post
title:  "How Risky is Risk?"
excerpt: "Exploring and visualising the outcomes of battles in the board game Risk"
date:   2023-06-02 18:41:57 +0000
categories: [python, games, visualisation]
comments: true
mathjax: true
code: true
image:
  feature: risk/risk_infographic.png
---

'Risk' is an appropriately named board game which revolves around battling opposing armies with the aim of invading their territories and eventually conquering the world. The game involves a large amount of strategy and planning but  also some luck; battles are ultimately won and lost by the rolls of dice. This post is going to explore the battle mechanic in more detail, starting by calculating the probability of winning in different scenarios and then showing how we can get a deeper insight into these numbers with some data visualisation.


```python
import itertools
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.ticker import MultipleLocator
import matplotlib.gridspec as gridspec
from matplotlib.patches import ConnectionPatch
from matplotlib import rc
from math import gcd

rc('font',**{
    'family':'sans-serif',
    'sans-serif':['Roboto'], 'size': 16, 'weight': 'bold'}
  )
rc('text', usetex=True)

A_COLOR='xkcd:red'
D_COLOR='xkcd:ocean blue'
```


```python
"""
Functions to generate the infographic and plots
"""

def generate_rolls(n_dice: int, highest_bonus: int=0):
    """
    Generates all possible dice rolls given n dice,
    optionally with some bonus to add to the score of
    the highest dice
    """
    rolls = [sorted(i, reverse=True) for i in itertools.product(*[range(1, 7)]*n_dice)]
    if highest_bonus > 0:
        for roll in rolls:
            roll[0] += highest_bonus
    return rolls


def simplify_fraction(num: int, denom: int):
    """Gets string representation of simplified fraction"""
    shared = gcd(num, denom)
    if shared == denom:
        return f'{int(num/shared)}'
    return f'{int(num/shared)}/{int(denom/shared)}'


def battle(a: int, d: int, offset: int):
    """
    Calculates the expected number of losses to each side of the 
    battle.
    
    Parameters
    ----------
    a: int
        The number of attacking troops
    d: int
        The number of defending troops
    offset: int
        The advantage, where positive favours the attackers
        
    Returns
    -------
    expected_attack_loss: float
        Expected number of attacking troops lost in the battle
    expected_defense_loss: float
        Expected number of attacking troops lost in the battle
    simplified_attack_loss_frac : str
        String representation of exact fraction of the above float
    simplified_defense_loss_frac : str
        String representation of exact fraction of the above float
    """
    att_rolls = generate_rolls(a, max(0, offset))
    def_rolls = generate_rolls(d, -1*min(0, offset))
    att_lost = 0
    def_lost = 0
    for att_roll in att_rolls:
        for def_roll in def_rolls:
            for a, d in zip(att_roll, def_roll):
                if a > d:
                    def_lost += 1
                else:
                    att_lost += 1
    size = len(att_rolls)*len(def_rolls)
    att_frac_str = simplify_fraction(att_lost, size)
    def_frac_str = simplify_fraction(def_lost, size)
    return att_lost/size, def_lost/size, att_frac_str, def_frac_str

def get_all_scores(a_max, d_max, offset_range):
    results = []
    for a in range(1, a_max+1):
        for d in range(1, d_max+1):
            for offset in range(*offset_range):
                score = battle(a, d, offset)
                results.append([a, d, offset] + list(score))
    return results


def draw_dice(number, ax, facecolor='none', edgecolor='black', dotcolor='black'):
    coords = {
        'm': (0.5, 0.5),
        'bl': (0.2, 0.2),
        'br': (0.8, 0.2),
        'tl': (0.2, 0.8),
        'tr': (0.8, 0.8),
        'ml': (0.2, 0.5),
        'mr': (0.8, 0.5),
    }
    number_locations = {
        1: ['m'],
        2: ['tl', 'br'],
        3: ['bl', 'm', 'tr'],
        4: ['bl', 'tl', 'br', 'tr'],
        5: ['bl', 'tl', 'br', 'tr', 'm'],
        6: ['bl', 'tl', 'br', 'tr', 'ml', 'mr'],
    }
    ax.add_patch(patches.FancyBboxPatch((0, 0), 1, 1, 
                                        boxstyle="round,pad=-0.0040,rounding_size=0.1",
                        ec='none', fc=facecolor, alpha=0.2
                        ))
    ax.add_patch(patches.FancyBboxPatch((0, 0), 1, 1, 
                                        boxstyle="round,pad=-0.0040,rounding_size=0.1",
                        ec=edgecolor, fc='none', lw=2, alpha=1
                        ))
    locations = [coords[loc] for loc in number_locations[number]]
    for xy in locations:    
        ax.add_patch(patches.Circle(xy, 0.1, facecolor=dotcolor, edgecolor=dotcolor))
    
    ax.set_xlim(-0.1, 1.1)
    ax.set_ylim(-0.1, 1.1)
    ax.set_frame_on(False)
    ax.tick_params(left=False, bottom=False, labelleft=False, labelbottom=False, which='both')
    ax.set_aspect('equal')
    return ax


def draw_color_dice(number, ax, color):
    return draw_dice(number, ax, dotcolor=color, edgecolor=color, facecolor=color)


def add_rectangles(a_score: float, d_score: float, A_COLOR: str, D_COLOR: str, x: float, y: float, 
                   w: float, h: float, ax, hspace: float=0.2, alpha: float=1):
    num_rectangles = np.round(a_score + d_score)
    if num_rectangles > 2:
        raise ValueError('Too high a score')
    # for the shared rectangle:
    rects = []
    if num_rectangles == 2:
        if a_score >= 1:
            rects.append(patches.Rectangle((x - w - hspace/2, y-h/2), w, h, edgecolor='none',
                                           facecolor=A_COLOR, alpha=alpha))
            rects.append(patches.Rectangle((x - w - hspace/2, y-h/2), w, h, edgecolor=A_COLOR, facecolor='none'))
            x_other = x + hspace/2
        if d_score >= 1:
            rects.append(patches.Rectangle((x + hspace/2, y-h/2), w, h, edgecolor='none', 
                                           facecolor=D_COLOR, alpha=alpha))
            rects.append(patches.Rectangle((x + hspace/2, y-h/2), w, h, edgecolor=D_COLOR, 
                                           facecolor='none', alpha=1))
            x_other = x - w - hspace/2
    else:
        x_other = x - w/2
    
    h_a = (a_score % 1)*h
    h_d = (d_score % 1)*h
    if (h_a > 0) & (h_d > 0):
        y_a = y - h/2
        y_d = y - h/2 + h_a
        rects.append(patches.Rectangle((x_other, y_a), w, h_a, facecolor=A_COLOR, alpha=alpha))
        ax.plot([x_other, x_other], [y_a, y_a + h_a], color=A_COLOR)
        ax.plot([x_other, x_other + w], [y_a, y_a], color=A_COLOR)
        ax.plot([x_other + w, x_other + w], [y_a, y_a + h_a], color=A_COLOR)

        rects.append(patches.Rectangle((x_other, y - h/2 + h_a), w, h_d, facecolor=D_COLOR, alpha=alpha))
        ax.plot([x_other, x_other], [y_d, y_d + h_d], color=D_COLOR)
        ax.plot([x_other, x_other + w], [y_d + h_d, y_d + h_d], color=D_COLOR)
        ax.plot([x_other + w, x_other + w], [y_d, y_d + h_d], color=D_COLOR)
    
    for rect in rects:
        ax.add_patch(rect)
    return ax


def plot_risk_boxes(scores, A_COLOR='xkcd:red', D_COLOR='xkcd:ocean blue', ax=None, y_label=True):
    if ax is None:
        fig, ax = plt.subplots(figsize=(4, 6))

    for (a, d, a_score, d_score) in scores:
        ax = add_rectangles(a_score, d_score, A_COLOR, D_COLOR, d-0.5, a-0.5, w=0.3, h=0.6, 
                            ax=ax, hspace=0.1, alpha=0.5)
    ax.set_frame_on(False)
    ax.set_xticks([-0.5, 0.5, 1.5, 2.5], [0, 1, 2, 3], color=D_COLOR)
    ax.xaxis.tick_top()
    ax.xaxis.set_label_position('top') 
    ax.xaxis.set_minor_locator(MultipleLocator(1))
    ax.yaxis.set_minor_locator(MultipleLocator(1))
    ax.tick_params(left=False, bottom=False, top=False, which='both')
    ax.set_yticks([-0.5, 0.5, 1.5, 2.5], [0, 1, 2, 3], color=A_COLOR)
    ax.set_xlabel('Defending Troops', labelpad=10, color=D_COLOR)
    if y_label:
        ax.set_ylabel('Attacking Troops', labelpad=10, color=A_COLOR)
    ax.grid(which='minor')
    ax.set_xlim(0, 2.01)
    ax.set_ylim(-0.01, 3)
    return ax


def plot_legend(ax):
    ax.axis('off')
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 3)
    ax.text(0.35, 0.205, 'Each rectangle\nrepresents a\nlost troop', color='black', fontsize=12, va='center')
    
    ax.add_patch(
        patches.Rectangle((0.05, 0.01), 0.2, 0.4, facecolor='none', edgecolor='black')
    )
    
    
def plot_advantage_bar(ax, a_color, d_color):
    ax.plot([-2, 0], [-2, 0], color=d_color)
    ax.set_frame_on(False)
    ax.set_xticks([-2, -1, 0, 1], ['Defense +2', 'Defense +1', 'Even', 'Attack +1'])
    tick_labels = ax.xaxis.get_ticklabels()
    tick_labels[0].set_color(d_color)
    tick_labels[1].set_color(d_color)
    tick_labels[3].set_color(a_color)
    ax.fill_between([-2, 0], [-2, 0], [0, 0], color=d_color, alpha=0.5)
    ax.plot([0, 1], [0, 1], color=a_color)
    ax.set_frame_on(False)
    ax.fill_between([0, 1], [0, 1], [0, 0], color=a_color, alpha=0.5)
    ax.tick_params(left=False, bottom=False, labelleft=False, which='both')
    ax.set_ylabel('Advantage')
    ax.set_xlim(-2.45, 1.45)
    return ax

    
def plot_infographic(scores, a_color, d_color, figsize=(18, 8)):
    fig = plt.figure(tight_layout=True, figsize=figsize)
    fig.patch.set_facecolor('xkcd:off white')
    fig.patch.set_alpha(0.6)
    gs = gridspec.GridSpec(2, 5, height_ratios=[4, 1], width_ratios=[2, 2, 2, 2, 1])
    ax_bottom = fig.add_subplot(gs[1, :-1])
    axes = [fig.add_subplot(gs[0, i]) for i in range(4)]
    
    plot_advantage_bar(ax_bottom, a_color, d_color)
    for offset, ax in zip(range(-2, 2), axes):
        offset_scores = [[i[0], i[1], i[3], i[4]] for i in scores if i[2] == offset]
        plot_risk_boxes(offset_scores, ax=ax, y_label=(offset==-2))
        for points in [(0, 0), (2, 0)]:
            con = ConnectionPatch(xyA=(offset, offset), coordsA=ax_bottom.transData,
                          xyB=points, coordsB=ax.transData, color='#999999')
            fig.add_artist(con)
    ax_legend = fig.add_subplot(gs[0, 4])
    plot_legend(ax_legend)
    fig.text(0.04, 1.1, "Expected losses for a battle in the game Risk", fontweight='bold', size=22)
    fig.text(0.04, 1.03, "The expected number of lost troops for each side given the size of each army, and potentially some advantage for one side. Expected losses are represented by an \narea of either red for the attacking army or blue for the defenders.", size=16)
    plt.tight_layout()
    return fig, ax_bottom, axes
```

## Battles in Risk

The complete rules of Risk won't be described here ([see here](https://en.wikipedia.org/wiki/Risk_(game)) if interested) but it is worth describing how battles work in particular. The attacking side can take up to 3 troops into the battle and the defender can take up to 2 troops. Each player then rolls one dice for each of the troops and arranges their dice in descending order. Each players dice are then compared from highest to lowest, with any extra dice from one player being ignored. For each comparison, the player with the lowest dice roll loses a troop. If it is a draw the defender wins, so the attacker loses a troop. 

For example, if the attacker takes 3 troops and the defender takes 2, each player would roll that number of dice:


```python
fig, ax = plt.subplots(2, 3, figsize=(6, 4))
fig.subplots_adjust(wspace=0, hspace=0)

draw_color_dice(2, ax[0][0], color=A_COLOR)
draw_color_dice(5, ax[0][1], color=A_COLOR)
draw_color_dice(3, ax[0][2], color=A_COLOR)

draw_color_dice(3, ax[1][0], color=D_COLOR)
draw_color_dice(4, ax[1][1], color=D_COLOR)
ax[1][2].axis('off')
ax[0][0].set_ylabel('Attacking', color=A_COLOR)
ax[1][0].set_ylabel('Defending', color=D_COLOR);
```


    
![png](/img/risk/dice.png)
    


After rolling, they sort into ascending order, and the attacker would discard their smallest dice as they have one extra one:


```python
fig, ax = plt.subplots(2, 3, figsize=(6, 4))
fig.subplots_adjust(wspace=0, hspace=0)

draw_color_dice(5, ax[0][0], color=A_COLOR)
draw_color_dice(3, ax[0][1], color=A_COLOR)
ax[0][2].axis('off')

draw_color_dice(4, ax[1][0], color=D_COLOR)
draw_color_dice(3, ax[1][1], color=D_COLOR)
ax[1][2].axis('off')
ax[0][0].set_ylabel('Attacking', color=A_COLOR)
ax[1][0].set_ylabel('Defending', color=D_COLOR);
```


    
![png](/img/risk/dice_sorted.png)
    


Then the dice are compared in order, meaning in this case the attacker wins on the first dice and the defender wins on the second (as defense wins draws):


```python
fig, ax = plt.subplots(2, 3, figsize=(6, 4))
fig.subplots_adjust(wspace=0.1, hspace=0)

draw_color_dice(5, ax[0][0], color=A_COLOR)
draw_color_dice(3, ax[0][1], color=A_COLOR)
ax[0][2].axis('off')

draw_color_dice(4, ax[1][0], color=D_COLOR)
draw_color_dice(3, ax[1][1], color=D_COLOR)
ax[1][2].axis('off')
ax[0][0].set_ylabel('Attacking', color=A_COLOR)
ax[1][0].set_ylabel('Defending', color=D_COLOR)

ax[0][0].set_title('Attack wins', color=A_COLOR)
ax[0][1].set_title('Defense wins', color=D_COLOR)

def make_line(xyA, xyB, axA, axB, color, lw=3):
    return ConnectionPatch(xyA=xyA, coordsA=axA.transData,
        xyB=xyB, coordsB=axB.transData, color=color, lw=lw)

conns = [
    make_line((-0.1, -0.1), (-0.1, 1.1), ax[1][0], ax[0][0], A_COLOR),
    make_line((1.1, -0.1), (1.1, 1.1), ax[1][0], ax[0][0], A_COLOR),
    make_line((-0.1, 1.1), (1.1, 1.1), ax[0][0], ax[0][0], A_COLOR),
    make_line((-0.1, -0.1), (1.1, -0.1), ax[1][0], ax[1][0], A_COLOR),
    
    make_line((-0.1, -0.1), (-0.1, 1.1), ax[1][1], ax[0][1], D_COLOR),
    make_line((1.1, -0.1), (1.1, 1.1), ax[1][1], ax[0][1], D_COLOR),
    make_line((-0.1, 1.1), (1.1, 1.1), ax[0][1], ax[0][1], D_COLOR),
    make_line((-0.1, -0.1), (1.1, -0.1), ax[1][1], ax[1][1], D_COLOR),
]
for con in conns:
    fig.add_artist(con)
```


    
![png](/img/risk/dice_highlighted.png)    



So in this case, both players will lose one troop. 

There is certainly luck involved in the outcome, but each player does have some control in that they can choose how many troops they take into the battle. Intuitively, sending in more troops gives you more dice to roll and a better chance of winning, but it isn't immediately clear how much of an advantage each extra troop brings and whether that advantage is enough to risk losing that troop for the rest of the game.

In some versions of Risk, there is an additional battle mechanic where, depending on other game factors, either the attacker or defender can get an additional advantage in the form of adding a value to their highest dice before the comparison happens. In some cases, the attacker can get a +1 score added to their highest dice or the defender can get either a +1 or +2 advantage. These additions further complicate the situation - for example, is taking in a single troop with a +2 advantage better than takinmg in 2 troops with no advantage? The next section explores these probabilities in more detail.

## Battle Probabilities

There are $6^n$ different ways of rolling $n$ dice, if order is ignored. So if the attacker has n dice and the defender has m dice, there are $6^{m+n}$ possibilities, each equally likely to happen. As $m+n \le 5$, this is at most $6^5=7776$ possibilities.

This is small enough to allow every possibility to be evaluated computationally to determine the outcome of the battle in each scenario. Then the expected number of troops lost by each side can be calculated by averaging over the possible rolls. Doing this for 1, 2, or 3 attacking troops, 1 or 2 defending troops as well as optionally either +1 or +2 defensive advantage or a +1 attacking advantage gives the following results for the 24 different battle scenarios:


```python
scores = get_all_scores(3, 2, (-2, 2))
df = pd.DataFrame(scores, columns=[
    'Attacking Troops',
    'Defending Troops',
    'Advantage',
    'Expected Attacking Losses',
    'Expected Defensive Losses',
    'Expected Attacking Losses (Exact fraction)',
    'Expected Defensive Losses (Exact fraction)'
])
display_advantage = {1: '+1 Attack', 0: 'Even', -1: '+1 Defense', -2: '+2 Defense'}
df['Advantage'] = df['Advantage'].map(display_advantage)
df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th>Attacking Troops</th>
      <th>Defending Troops</th>
      <th>Advantage</th>
      <th>Expected Attacking Losses</th>
      <th>Expected Defensive Losses</th>
      <th>Expected Attacking Losses (Exact fraction)</th>
      <th>Expected Defensive Losses (Exact fraction)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>+2 Defense</td>
      <td>0.833333</td>
      <td>0.166667</td>
      <td>5/6</td>
      <td>1/6</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>+1 Defense</td>
      <td>0.722222</td>
      <td>0.277778</td>
      <td>13/18</td>
      <td>5/18</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>Even</td>
      <td>0.583333</td>
      <td>0.416667</td>
      <td>7/12</td>
      <td>5/12</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>+1 Attack</td>
      <td>0.416667</td>
      <td>0.583333</td>
      <td>5/12</td>
      <td>7/12</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>+2 Defense</td>
      <td>0.935185</td>
      <td>0.064815</td>
      <td>101/108</td>
      <td>7/108</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>+1 Defense</td>
      <td>0.861111</td>
      <td>0.138889</td>
      <td>31/36</td>
      <td>5/36</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>Even</td>
      <td>0.745370</td>
      <td>0.254630</td>
      <td>161/216</td>
      <td>55/216</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2</td>
      <td>+1 Attack</td>
      <td>0.578704</td>
      <td>0.421296</td>
      <td>125/216</td>
      <td>91/216</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>+2 Defense</td>
      <td>0.731481</td>
      <td>0.268519</td>
      <td>79/108</td>
      <td>29/108</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>+1 Defense</td>
      <td>0.583333</td>
      <td>0.416667</td>
      <td>7/12</td>
      <td>5/12</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>Even</td>
      <td>0.421296</td>
      <td>0.578704</td>
      <td>91/216</td>
      <td>125/216</td>
    </tr>
    <tr>
      <td>2</td>
      <td>1</td>
      <td>+1 Attack</td>
      <td>0.254630</td>
      <td>0.745370</td>
      <td>55/216</td>
      <td>161/216</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2</td>
      <td>+2 Defense</td>
      <td>1.500772</td>
      <td>0.499228</td>
      <td>1945/1296</td>
      <td>647/1296</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2</td>
      <td>+1 Defense</td>
      <td>1.386574</td>
      <td>0.613426</td>
      <td>599/432</td>
      <td>265/432</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2</td>
      <td>Even</td>
      <td>1.220679</td>
      <td>0.779321</td>
      <td>791/648</td>
      <td>505/648</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2</td>
      <td>+1 Attack</td>
      <td>1.000000</td>
      <td>1.000000</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>3</td>
      <td>1</td>
      <td>+2 Defense</td>
      <td>0.666667</td>
      <td>0.333333</td>
      <td>2/3</td>
      <td>1/3</td>
    </tr>
    <tr>
      <td>3</td>
      <td>1</td>
      <td>+1 Defense</td>
      <td>0.506173</td>
      <td>0.493827</td>
      <td>41/81</td>
      <td>40/81</td>
    </tr>
    <tr>
      <td>3</td>
      <td>1</td>
      <td>Even</td>
      <td>0.340278</td>
      <td>0.659722</td>
      <td>49/144</td>
      <td>95/144</td>
    </tr>
    <tr>
      <td>3</td>
      <td>1</td>
      <td>+1 Attack</td>
      <td>0.173611</td>
      <td>0.826389</td>
      <td>25/144</td>
      <td>119/144</td>
    </tr>
    <tr>
      <td>3</td>
      <td>2</td>
      <td>+2 Defense</td>
      <td>1.251029</td>
      <td>0.748971</td>
      <td>304/243</td>
      <td>182/243</td>
    </tr>
    <tr>
      <td>3</td>
      <td>2</td>
      <td>+1 Defense</td>
      <td>1.113169</td>
      <td>0.886831</td>
      <td>541/486</td>
      <td>431/486</td>
    </tr>
    <tr>
      <td>3</td>
      <td>2</td>
      <td>Even</td>
      <td>0.920910</td>
      <td>1.079090</td>
      <td>2387/2592</td>
      <td>2797/2592</td>
    </tr>
    <tr>
      <td>3</td>
      <td>2</td>
      <td>+1 Attack</td>
      <td>0.673225</td>
      <td>1.326775</td>
      <td>1745/2592</td>
      <td>3439/2592</td>
    </tr>
  </tbody>
</table>
</div>



Notice that the combined number of lost troops will always be $min($Attacking Troops, Defending Troops$)$.

An interesting scenario happens when both players take two troops to battle, and the attack has a +1 advantage to the higher dice. In this case the battle is perfectly balanced with both players expected to lose one of their two troops. This makes sense, with the +1 advantage for the attacker on the first dice reversing the natural bias towards the defender in the case of a draw, although that defensive bias still exists on the second dice, resulting overall in an expected draw.

To highlight the example from above, it turns out that having a +2 defensive advantage but only a single troop is better than having 2 troops without an advantage. Again, this makes sense after thinking about each case. For a single troop with a +2 advantage, the expected highest dice will be 5.5 (3.5 for a usual dice, then +2). For two dice with no advantage, the expected highest dice is $6*\frac{11}{36} + 5*\frac{9}{36} + 4*\frac{7}{36} + 3*\frac{5}{36} + 2*\frac{3}{36} + 1*\frac{1}{36}=4.47...$

These results are interesting, but it is still quite hard to consume this data in a raw state. The next section will explore how to better visualise this dataset.

## Visualising the Results

This raw dataset is 5 dimensional:
1. Number of attacking troops
2. Number of defending troops
3. Advantage
4. Expected Attacking Losses
5. Expected Defensive Losses

It would be difficult to display all of these dimensional in a traditional bar chart or line plot, and some of these dimensions would need to be dropped. Luckily though, some of these dimensions are discrete instead of continuous so can be visualised in a more creative way.

The infographic below represents this 5 dimensional dataset. Each of the 3x2 grids represents a subset of the possible scenarios for a given value of the advantage (shown at the bottom). Within each box of the grid there are rectangles representing all of the troops that will be lost in that battle, coloured according to the number of expected losses for each side.


```python
fig, ax_bottom, axes = plot_infographic(scores, A_COLOR, D_COLOR)
plt.savefig('risk_loss_visualisation.png', bbox_inches='tight', pad_inches=0.5)
```


    
![png](/img/risk/risk_infographic.png)
    


# Dissecting the Visualisation

As already mentioned, this infographic contains multiple dimensions of data and as a result can be interpreted in many different ways. For example, looking at one of the columns of the grids can aid with an attacking players battle plan, where they know the size of the defending army and the value of the advantage. Highlighted below is one of the columns, which shows the expected attacking loss for a single defending troop with a +2 advantage. It is clear that this scenario will likely not benefit the attacker as they stand to lose more troops than the defender regardless of how many they take into the battle, although if they have troops to spare they may still want to engage to weaken their opponent as well as themselves.


```python
fig, ax_bottom, axes = plot_infographic(scores, A_COLOR, D_COLOR)
m = 0.04
axes[0].add_patch(patches.Rectangle((m, m), 1-2*m, 3-2*m, edgecolor='black', facecolor='none', lw=10, zorder=10));
```


    
![png](/img/risk/risk_info_column.png)    


Equally, the defending player can use the rows of the grids to plan their strategy. The row highlighted below informs the defender that bringing an extra troop in this scenario would take them from likely losing by a large margin to being even in the battle. Also note that by bringing in a second troop, the number of lost troops will now be two as well, so the defender has increased their own expected loss by bringing in the extra troop, although they have increase the attacking losses by more. They could then factor this information into their decision along with knowledge of their available resources etc.


```python
fig, ax_bottom, axes = plot_infographic(scores, A_COLOR, D_COLOR)
m = 0.04
axes[3].add_patch(patches.Rectangle((m, 1+m), 2-2*m, 1-2*m, edgecolor='black', facecolor='none', lw=10, zorder=10));
```


    
![png](/img/risk/risk_info_row.png)        


By looking at the same cell in each of the four grids, the visualisation makes it clear what the effect of the advantage is. The highlighted cells below show how the battle changes favour as the advantage goes from defense to attack. This could be used to determine which terretories in the game to attack at which times and also allows for a better understanding of the benefit of an advantage in the game.


```python
fig, ax_bottom, axes = plot_infographic(scores, A_COLOR, D_COLOR)
m = 0.04
[ax.add_patch(patches.Rectangle((m, m), 1-2*m, 1-2*m, edgecolor='black', facecolor='none', lw=10, zorder=10)) for ax in axes];
```


    
![png](/img/risk/risk_info_advantage.png)        


## Final Word

In summary, this post has explored how battles work in Risk and shown how win probabilities can be calculated in the game. It has also explored the best way to visualise this data and has shown that sometimes custom visualisations can extract additional insights from a problem. This infographic demonstrates that it isn't enough to just look good - it is important to ask the right questions of the data before answering them visually.