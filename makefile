

info:
	@echo 
	@echo '# Initialization'
	@echo 'init-git    - '
	@echo 'pnpm        - Initialize Git submodules and Node packages'
	@echo 'pnpm-online - Same as 'init' except that 'pnpm' runs without a '--offline' flag'
	@echo 
	@echo '# API specification'
	@echo 'spec        - Generate a bundled JSON API, model schemas and Typescript definition file'
	@echo 'spec-watch  - Watch mode of the 'json' command'
	@echo 
	@echo '# Application test'
	@echo 'app         - Generate the Neutralino test application'
	@echo 
	@echo '# NOTE'
	@echo 'On Windows, all commands except "make server" work in git bash (https://git-scm.com)'
	@echo '"make server" must be running in PowerShell'

init-git:
	git clone https://github.com/corbane/v2-client-specification.git  spec
	git clone https://github.com/corbane/neutralino.js.git            client
	git clone https://github.com/corbane/neutralinojs.git             server

pnpm:
	cd spec &&  pnpm install --offline
	cd client &&  pnpm install --offline

pnpm-online:
	cd spec &&  pnpm install
	cd client &&  pnpm install


spec:
	@echo
	@echo \# Build the specifications

	node spec/scripts/run.js --build-dts
	cp spec/dist/neutralino.api.d.ts  client/src/http

spec-watch:
	node spec/scripts/run.js --watch-json


client: spec
	@echo 
	@echo \# Build the JavaScript client file

	cd client && node build.mjs

client-dev: spec
	@echo
	@echo \# Build the JavaScript client file

	cd client && node build.mjs --dev
	cp client/out/*  server/bin/resources/js


server:
	@echo
	@echo \# Build the server

	cd server && build_windows.bat


app: client-dev
	@echo
	@echo \# Copy the binary server to the root directory

	cp -ru  server/bin                  .
	cp -ru  server/bin/resources/icons  ./test
	cp -ru  server/bin/resources/js     ./test
	rm -r   ./bin/resources

	@echo
	@echo \# Use "neu run" to show and test the api.


.PHONY: spec server