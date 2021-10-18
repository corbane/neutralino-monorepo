
# Which package manager should I use ?
NPM       = pnpm
NPM_FLAGS = --offline
NPX       = pnpx

# Where are the sources ?
API_FILES = api/yaml/*.yaml
SCH_FILES = api/yaml/models/*.yaml

# Where to save the generated files ?
SCH_OUTDIR  = api/json/
DTS_OUTFILE = api/ts/messages.d.ts
MD_OUTDIR   = api/md/
HTML_OUTDIR = api/html/

default:
	neu run

#-------------------------------------------------------------------------------
# GENERATORS
#-------------------------------------------------------------------------------

CMD_DTS  = node tools/@napi.dts  --napis $(API_FILES) --outfile $(DTS_OUTFILE)
CMD_MD   = node tools/@napi.md   --napis $(API_FILES) --outdir $(MD_OUTDIR)
CMD_HTML = node tools/@napi.html --napis $(API_FILES) --outdir $(HTML_OUTDIR)

sch:
#	node tools/@napi.sch --napis $(API_FILES) --outdir $(SCH_OUTDIR)
	node tools/@napi.sch --napis $(SCH_FILES) --outdir $(SCH_OUTDIR)/models/

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
html.w:
	$(CMD_HTML) --watch

#-------------------------------------------------------------------------------
# APP
#-------------------------------------------------------------------------------

start.app:
# --debug-mode don't start the localhost:5050 server
#	test/bin/neutralino-win_x64.exe  --load-dir-res --path=. --debug-mode
	test/bin/neutralino-win_x64.exe  --load-dir-res --path=.

#-------------------------------------------------------------------------------
# UTILITIES
#-------------------------------------------------------------------------------

napi.sch:
	$(NPX) ts-json-schema-generator --path tools/lib/neu-api.d.ts --type 'Napi' \
	                                --no-type-check --out api/json/neu-api.json
	$(NPX) ts-json-schema-generator --path tools/lib/neu-api.d.ts --type 'Root' \
	                                --no-type-check --out api/json/neu-sch.json

CMD_README = node tools/@readme --cmddir tools/ --outfile tools/README.md

readme:
	$(CMD_README)

readme.w:
	$(CMD_README) --watch
