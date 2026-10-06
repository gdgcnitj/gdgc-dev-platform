# Writing rules

Use ASD-STE100 principles for project docs and PR text.
See [the official ASD-STE100 guide](https://asd-ste100.org/STE_faq.html) for the standard's scope.

## Sentences

- Use active voice.
- Keep an instruction sentence to 20 words or fewer.
- Keep a description sentence to 25 words or fewer.
- Give one instruction in each procedure step.
- Put the condition before the instruction.
- Use the same term for the same concept.
- Define technical terms when a reader needs their meaning.
- Keep code, paths, commands, and variable names exact.
- Do not use contractions.

## Terms

| Term | Meaning |
| --- | --- |
| App | The Next.js website |
| Process | A command that mprocs controls |
| Database | The PostgreSQL data store |
| Migration | A file that changes the database schema |
| PR | A GitHub pull request |
| Check | A command that verifies the project |

## Pull requests

1. State the current problem.
2. State the change and resulting behavior.
3. List each check and its result.
4. Link the related docs.
5. State any check that did not run.

Use the Conventional Commit form for the title:

```text
chore: add the local development setup
```
