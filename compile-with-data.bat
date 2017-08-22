rem TODO: Set up a proper build task
cd nodejs\gamexmlparser
call tsc
call genfromxml.bat
cd ..\..
call compile.bat