
NPM=pnpm
NPM_FLAGS=--offline
NPX=pnpx

SCH_OUTDIR  = out/json/
DTS_OUTFILE = out/ts/messages.d.ts
MD_OUTDIR   = out/md/
HTML_OUTDIR = out/html/

help:
	node makeme help

quickway:
	$(NPM) install $(NPM_FLAGS)
	$(CMD_GIT_CLONE)
	$(CMD_JS_INSTALL)
	$(CMD_APP_INSTALL)
	$(CMD_HTML)
	neu run

# INSTALLATIONS

CMD_GIT_CLONE   = node tools/@git.clone
CMD_JS_INSTALL  = node tools/@js.install --$(NPM) $(NPM_FLAGS)
CMD_APP_INSTALL = node tools/@test.app

git.clone:
	$(GIT_CLONE)

js.install:
	$(JS_INSTALL)

test.app:
	$(CMD_APP_INSTALL)


# GENERATORS

CMD_DTS  = node tools/@napi.dts  --napis api/*.yaml --outfile $(DTS_OUTFILE)
CMD_MD   = node tools/@napi.md   --apifiles api/*.yaml --outdir $(MD_OUTDIR)
CMD_HTML = node tools/@napi.html --mdfiles out/md/*.md --outdir $(HTML_OUTDIR)

sch:
#	node tools/@napi.sch --napis api/*.yaml --outdir $(SCH_OUTDIR)
	node tools/@napi.sch --napis api/models/*.yaml --outdir $(SCH_OUTDIR)/models/

dts:
	$(CMD_DTS)
dts.w:
	$(CMD_DTS) --watch

md:
	$(CMD_MD)
md.w:
	$(CMD_MD) --watch

html:
	$(CMD_HTML)


# USE CASE

CMD_START_SITE = node tools/@start.site --pnpm

edit.site:
	$(CMD_MD) --watch & $(CMD_START_SITE)

start.site:
	$(CMD_START_SITE)

# UTILITIES

napi.sch:
	$(NPX) ts-json-schema-generator --path tools/lib/neu-api.d.ts --type 'Napi' --no-type-check --out api/lib/neu-api.json
	$(NPX) ts-json-schema-generator --path tools/lib/neu-api.d.ts --type 'Root' --no-type-check --out api/lib/neu-sch.json

CMD_README = node tools/@readme --cmddir tools/ --outfile README.md --intro tools/INTRO.md

readme:
	$(CMD_README)

readme.w:
	$(CMD_README) --watch
