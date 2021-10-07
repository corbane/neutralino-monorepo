

info: init?
	@echo
	@echo 'NOTE: On Windows, all commands except "make server" work in git bash (https://git-scm.com)'
	@echo '      "make server" must be running in PowerShell'

init?:
	@echo
	@echo 'init        - Initialize Git submodules and Node packages'
	@echo 'init-online - Same as 'init' except that 'pnpm' runs without a '--offline' flag'

init:

	git submodule init
	git submodule update
	cd spec &&  pnpm install --offline
	cd client &&  pnpm install --offline

init-online:

	git submodule init
	git submodule update
	cd spec &&  pnpm install
	cd client &&  pnpm install


spec:
	@echo
	@echo \# Build the specifications

	node spec/scripts/run.js --build-dts
	cp spec/dist/neutralino.api.d.ts  client/src/http
	cp spec/dist/neutralino.api.json  client/test


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


testapp: client-dev
	@echo
	@echo \# Copy the binary server to the client directory

	cp -ru  server/bin                  client
	cp -ru  server/bin/resources/icons  client/test
	cp -ru  server/bin/resources/js     client/test
	rm -r   client/bin/resources

	@echo
	@echo \# Use "make test" to show and test the api.

test:
	cd client && neu run


.PHONY: spec