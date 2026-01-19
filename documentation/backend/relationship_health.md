# Relationship Health Algorithm Specification

## Abstract

To help determine the urgency with which a user should prioritize reaching out to a contact, each friend has been given a *relationship health* score, $h$, where  $h\in(0,1]$. This metric distinguishes "dead" relationships from relationships that are still thriving and strong. This distinction allows for the prioritization of "healthy" relationships ($h\rightarrow1$), which are at the risk of ruin, over relationships that are already unhealthy $(h\rightarrow0)$. This report also specifies a function $H$ for computing a given friend's $h$ value.

## The $H$ function

$H = {Consideration}\times{(Time\space spent\space with\space them,\space proportional\space to\space relationship\space tier)}$

$Consideration = \frac{m}{2} + \frac{1}{2} = \frac{m + 1}{2}$, where $m\in\mathbb{R}$ is the proportion of the friend's special dates you haven't missed (birthdays, weddings, anniversaries, Christmas, etc.)

${Time\space spent\space with\space them,\space proportional\space to\space relationship\space tier} = \frac{t_{interaction}(\bar{t_{interaction}} - t_{interaction}')}{Minimum\space required\space time\space between\space interactions}$, where:



- $t_{interaction}$ is the number of days since the last interaction
- $\bar{t_{interaction}}$ is the average number of days between interactions over the last year
- $\bar{t_{interaction}}'$ is the average rate at which the number of days between interactions changes over the last year (if you start interacting more frequently then $\bar{t_i}>0$ and *vice versa*)
- $T(r, t_{first})$ is the maximum number of days between interactions necessary to maintain a relationship of tier $R$ based on when the friendship began ($t_{first}$), where $T(r) \in \mathbb{R}, T\ge0$ 

$Minimum\space required\space time\space between\space interactions = \max(T_r^{minimum}), \min(\frac{t_{first}}{365}T_r^{maximum}))$, where:

- $r$ is the friend's relationship tier, where $R\in\mathbb{N}$
- $t_{first}$ is the number of days since the first interaction
- $T_r^{minimum}$ and $T_r^{maximum}$ are the minimum and maximum allowed days between interactions at relationship tier $r$


### Inputs

- $r$ - The friend's relationship tier, where $R\in\mathbb{N}$
- $t_{first}$ - The number of days since the first interaction
- $t_{interaction}$ - The number of days since the last interaction
- $T(r, t_{first})$ - The maximum number of days between interactions necessary to maintain a relationship of tier $R$ based on when the friendship began ($t_{first}$), where $T(r) \in \mathbb{R}, T\ge0$

