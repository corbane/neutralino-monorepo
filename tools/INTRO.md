# Neutralino devtools

Various tools to make Neutralino API dependencies consistent.

**NOTE** 

These script can use:
- wildcards `*` in path patterns
- sequential commands with `&&`
- parallel commands with `&`
- shebang `#!`

If like me you don't have a LINUX compatible terminal, a simple way is to use [Git bash](https://git-scm.com/downloads).

## The quick way

```bash
git clone https://github.com/corbane/neutralino-monorepo.git
cd neutralino-monorepo

npm install # you can use also yarn or pnpm package manager
 
# download sources of Neutralino
node makeme init-git

# run npm on downloaded subfolders
node makeme init-js --npm # or --yarn or --pnpm

# Generate a bundled JSON API
node makeme api.json --apis spec/api/*.yaml --outfile out/neutralino.messages.json

# initialize a test application
node makeme testapp

# run the app
neu run
```