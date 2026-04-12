# Flow Quest — Project Scope

## Overview

Flow Quest is a personal productivity app that turns tasks into quests.
Users manage daily work through a game-inspired system with progression, while AI helps them decide what to do next.

The goal of the project is to build a polished full-stack application with clear domain logic.

## Problem Statement

Flow Quest explores whether lightweight game mechanics and AI-assisted planning can make personal task management more engaging and easier to act on.

## Target User

Flow Quest is designed for individual users who want:

- a personal task manager
- more motivation through visible progress
- help deciding task priority
- a focused, clean experience instead of a complex productivity suite

## Core Product Idea

Tasks are represented as quests.
Completing quests improves the user's hero progression through XP, levels, and streaks.
An AI assistant supports planning by helping the user prioritize or estimate tasks.

## MVP Goals

The MVP includes:

- user registration and login
- authenticated user sessions
- create, edit, delete, and complete quests
- quest properties:
  - title
  - description
  - difficulty
  - deadline
  - status
  - XP reward
- hero progression:
  - XP
  - level
  - streak
- dashboard showing:
  - hero stats
  - active quests
  - completed quests
- one AI feature:
  - either daily planning
  - or task estimation

## Non-Goals

The MVP does not include:

- team collaboration
- social features
- achievements or badges
- inventory or items
- full RPG mechanics
- calendar sync
- notifications
- recurring tasks
- advanced analytics
- multiple AI modes at once

## Product Principles

Flow Quest should be:

- focused rather than feature-heavy
- visually distinctive but still usable
- domain-driven, not just CRUD-driven
- simple to explain
- consistent in UX and system behavior

## Core User Flows

The most important flows are:

1. User signs up or logs in
2. User lands on the dashboard
3. User creates a new quest
4. User completes a quest
5. Hero progression updates immediately
6. User gets help from one AI-powered planning feature

## Success Criteria

The MVP is considered successful if:

- authentication works reliably
- quest management is stable
- progression logic is consistent
- the dashboard feels coherent
- the AI feature is useful, not decorative
- the app feels like one product, not a collection of disconnected features

## Future Ideas

Possible future improvements:

- achievements and milestones
- richer hero state
- more advanced AI planning
- weekly summaries
- calendar-based views
- richer motion and interactions
