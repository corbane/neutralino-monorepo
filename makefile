
info:
	node makeme help

NPM=pnpm
NPM_FLAG=--offline

quickway:
	$(NPM) install $(NPM_FLAG)
	make git.clone
	make js.install
	make api.json
	make test.app
	neu run

api.json:
	node makeme api.json --apis spec/api/*.yaml --outfile out/neutralino.messages.json

api.md:
	node makeme api.md  --apis spec/api/*.yaml  --outdir site/docs/api 

api.ts:
	node makeme api.ts

api.ts.def:
	node makeme api.ts.def  --api out/neutralino.messages.json  --outfile client/src/http/neutralino.messages.d.ts

git.clone:
	node makeme git.clone

js.install:
	node makeme js.install --$(NPM) $(NPM_FLAG)

readme:
	node makeme readme --cmddir tools/ --outfile README.md --intro tools/INTRO.md

schema.json:
	node makeme schema.json --schemas spec/models/*.schema.yaml --outdir out/

schema.md:
	node makeme schema.md --schemas spec/models/neutralino.config.schema.yaml --outdir site/docs/configuration/

test.app:
	node makeme test.app


	
