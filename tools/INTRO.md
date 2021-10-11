# Neutralino devtools

Various tools to make Neutralino API dependencies consistent.

**NOTE** 

These script can use:
- wildcards `*` in path patterns
- sequential commands with `&&`
- parallel commands with `&`
- shebang `#!`

If like me you don't have a LINUX compatible terminal, a simple way is to use [Git bash](https://git-scm.com/downloads).

```bash
git clone https://github.com/corbane/neutralino-monorepo.git
cd neutralino-monorepo

npm install
# or: yarn install
# or: pnpmm install

node makeme init-git

node makeme init-js
# or: node makeme --yarn 
# or: node makeme --npm
# or: node makeme --pnpm
# default: --yarn 
```