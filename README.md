# Grade Calculator [![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FTimJentzsch%2Fgrade-calculator%2Fbadge&style=flat)](https://actions-badge.atrox.dev/TimJentzsch/grade-calculator/goto) [![Coverage](https://img.shields.io/codecov/c/github/TimJentzsch/grade-calculator)](https://codecov.io/gh/TimJentzsch/grade-calculator)

A tool to determine the grade of your curriculum.

Available at https://timjentzsch.github.io/grade-calculator/.

## Current Features

- Upload your Notenspiegel PDF exported from RWTH Online: the course of study and its examination regulations are detected and your grades are filled in (currently Computer Science B.Sc., PO 2018, and Computer Science M.Sc., PO 2023). The PDF is read in your browser and never uploaded.
- Built-in curricula with their module areas, credit limits and elimination rules, which can't be changed by accident. Only electives and other freely chosen modules are added by you.
- Custom curricula for other courses of study, defined in a separate editor. A built-in curriculum can be copied as a starting point.
- Calculation of grades and credits for module areas and curriculum
- Calculation of best and worst possible grades
- Automatic elimination of modules for the best grade
- Support for ungraded and differently weighted modules and additional modules (Zusatzleistungen)
- Saving and loading your grades, which are also kept in your browser

## Development

The app is built with [SvelteKit](https://svelte.dev/docs/kit) and deployed as a static site to GitHub Pages.

```sh
pnpm install
pnpm dev      # start the development server
pnpm test     # run the unit tests
pnpm check    # type-check the project
pnpm lint     # lint the code
pnpm build    # build the static site into build/
```
