# MAKEME (Dratf)

`makeme` is a small tool for executing commands.

Originally, commands were started using the `make` command and a `makefile` file.
But some tasks were difficult.
As the `scripts` fields of a `package.json` file are even more limited, I wrote this tool.

Currently, `makeme` is a dedicated Neutralino tool and does nothing more than run js scripts and add a simple way to include documented commands.

The principle is **one file, one command**.

## Structure of command files

All batch files must be prefixed with `@` and have the extension `.js` like `@my-command.js`.

Inside the file, you can write the command information with a comment block like this:

~~~js
/*/
    This information is not displayed in the `README`.
    This is useful for writing development notes for example.

    OVERVIEW:
    Short description that should fit on one line

    OTHER_SECTION:
    Other sections to display in the `README`.
/*/
~~~

If this file is named `@my-command.js` and if you run

```bash
node makeme help
```

The console output is

```bash
my-command  Short description that should fit on one line
```

If you run:

```bash
noke makeme readme --cmddir ./ --outfile ./README.md
```

You should get a `README.md` file containing:

~~~md
## Command overview

command | overview
--- | ---
my-command | Short description that should fit on one line

## `my-command`

short description that should fit on one line

**OTHER_SECTION**

Other sections to display in the `README`.
~~~

**FORMAT**

- The block comment **must** start with the `/*/` line and end with the `/*/` line. Spaces are not allowed.

- The title of the sections **must be capitalized** and immediately **followed by `:`**. \
  The character `_` can be used instead of an esplace and will be replaced when generating the `README` \
  **Nothing else** can be present on this line.

- The `OVERVIEW` section is used to generate the command overview table.

- The other sections are simply printed one after the other.