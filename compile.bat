call tsc -p tsconfig.json --diagnostics
echo Built at %DATE% %TIME% > build\timestamp
rem WINDOWS COMMANDLINE SUCKS