# DevFlow — TypeScript Project Management

DevFlow is a software project management application for managing developers,
teams, tasks, and project events.

Its main objective is to demonstrate advanced TypeScript concepts through a
realistic application while respecting Clean Code, SOLID, and Object-Oriented
Programming principles.

## Concepts demonstrated

- Generic repositories and generic constraints
- Utility types: `Pick`, `Omit`, `Partial`, `Record`, `Parameters`, `ReturnType`, `Extract`, and `Exclude`
- Conditional types and `infer`
- Index signatures
- Type guards and discriminated unions
- Legacy TypeScript method decorators
- Encapsulation, inheritance, dependency injection, and single-purpose classes

## Requirements

- Node.js 18+
- npm

## Setup and run

```bash
npm install
npm start
```

## Type-check

```bash
npm run typecheck
```

## Project structure

- `src/types.ts` — domain models and advanced type examples
- `src/repository.ts` — reusable data-access abstractions
- `src/decorators.ts` — logging, timing, validation, and caching
- `src/main.ts` — DevFlow service and executable demonstrations

The project intentionally uses TypeScript's legacy decorator API, enabled by
`experimentalDecorators` in `tsconfig.json`.

