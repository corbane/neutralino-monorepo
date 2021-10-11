# Neutralino devtools

Various tools to make Neutralino API dependencies consistent.

```txt
                 ┌─> out/neutralino.config.schema.json
spec/api/*.yaml ─┼─> client/src/http/neutralino.messages.d.ts
                 └─> site/docs/api/*.md

spec/models/*.yaml ─┬─> site/docs/configuration/neutralino.config.schema.json
                    └─> server/resources/neutralino.config.schema.json
```

**NOTE** 

These script can use:
- wildcards `*` in path patterns
- sequential commands with `&&`
- parallel commands with `&`
- shebang `#!`

If like me you don't have a LINUX compatible terminal, a simple way is to use [Git bash](https://git-scm.com/downloads).

To facilitate the operation you must have Gnu Make on your system.
If you are on Windows, you can install this [complete package, except sources](http://gnuwin32.sourceforge.net/packages/make.htm)

## The quick way

```bash
git clone https://github.com/corbane/neutralino-monorepo.git
cd neutralino-monorepo
make quickway
```