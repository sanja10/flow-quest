# Flow Quest — Architecture

## High-Level Architecture

Flow Quest is built as a full-stack Next.js application.

The application contains:

- UI routes for authentication and dashboard flows
- API route handlers for server-side logic
- domain services for business rules
- Prisma as the database access layer
- PostgreSQL as the main relational database

## Architectural Approach

The architecture is designed around domain behavior, not only around resources.

The central domain concepts are:

- User
- Quest
- HeroStats
- XpLog
- RefreshToken

The most important system behavior is not generic CRUD.
It is the progression loop triggered when a quest is completed.

## Main Layers

### 1. Presentation Layer

Contains:

- pages
- layouts
- UI components
- client-side hooks

Responsibilities:

- render the interface
- collect user input
- display loading, success, and error states
- call API endpoints

This layer should not contain business rules such as XP calculation or level progression.

### 2. API Layer

Contains:

- route handlers under `app/api`

Responsibilities:

- authenticate requests
- validate input
- call domain services
- map results into API responses

Route handlers should stay thin.
They should orchestrate requests, not own the core business logic.

### 3. Domain / Service Layer

Contains:

- quest-related services
- progression logic
- AI-related domain actions
- auth support logic

Responsibilities:

- implement business rules
- coordinate multi-step domain actions
- keep important use cases centralized

Examples:

- complete a quest
- calculate XP gained
- update hero progression
- generate daily plan input for AI

### 4. Data Layer

Contains:

- Prisma schema
- Prisma client usage
- relational models in PostgreSQL

Responsibilities:

- persist application state
- provide transactional consistency
- support domain operations safely

## Domain Model

### User

Represents the authenticated account.

### Quest

Represents a task framed as a quest.
A quest belongs to one user and can move through statuses such as TODO, IN_PROGRESS, and DONE.

### HeroStats

Represents the user's progression state.
This includes XP, level, HP if used, and streak-related values.

### XpLog

Stores progression history and creates an audit trail for XP changes.

### RefreshToken

Supports session continuation through refresh token rotation.

## Key Use Case: Complete Quest

The most important domain action is completing a quest.

This flow should:

1. verify the authenticated user
2. load the quest
3. confirm ownership
4. confirm the quest is not already completed
5. load the user's hero state
6. calculate XP and progression changes
7. persist all updates in a transaction
8. return a structured response for the UI

This use case is intentionally separate from generic quest updates because it represents domain behavior, not just data modification.

## Authentication Strategy

Authentication is custom and token-based.

Current model:

- access token for authenticated API access
- refresh token for session renewal
- refresh token rotation for improved session handling

Goals:

- keep server-side verification centralized
- avoid duplicated auth logic in route handlers
- keep session behavior predictable

## API Design Principles

The API should follow these principles:

- authenticated routes require a verified user
- request validation is explicit
- responses use stable DTO shapes
- errors use a consistent structure
- domain actions have dedicated endpoints when needed

Example:
A `complete quest` endpoint is preferred over overloading a generic update endpoint with hidden side effects.

## Data Consistency

Important multi-step writes should be transactional.

Examples:

- marking a quest as completed
- updating hero progression
- writing XP logs

This prevents partial state updates and keeps the system internally consistent.

## Error Handling

The system should use a consistent error model.

Recommended categories:

- validation errors
- authentication errors
- authorization errors
- not found errors
- conflict errors
- internal errors

The frontend should never depend on inconsistent ad hoc error responses.

## Frontend State Strategy

The frontend is responsible for:

- displaying dashboard data
- handling auth-aware requests
- managing loading and error states
- updating UI after successful domain actions

The UI should be reactive, but business truth remains on the server.

## AI Integration Strategy

AI is an assistant, not the source of truth.

The AI feature should:

- support the user with planning or estimation
- operate on structured app data
- remain optional to the core product flow

The system should still work without AI.
This prevents the product from depending entirely on external model responses.

## Technical Priorities

The project prioritizes:

- correctness of core flows
- clarity of architecture
- stability of auth and session handling
- consistency of API contracts
- maintainable domain logic

It does not prioritize maximum feature count.

## Planned Refactoring Direction

The next architecture improvements should focus on:

- extracting centralized auth helpers
- introducing DTO contracts
- moving core orchestration into use-case services
- standardizing error responses
- stabilizing dashboard data flow

## Summary

Flow Quest is designed as a focused full-stack application with domain-driven behavior.
Its architectural value comes from clear boundaries, consistent rules, and a polished core loop rather than from feature volume.
