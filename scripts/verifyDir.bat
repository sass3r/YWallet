@echo off
IF exist %APPDATA%/MultiChain/YanaptiChain ( echo "Existe directorio" && rmdir /S /Q "%APPDATA%/MultiChain/YanaptiChain"  ) ELSE ( echo "No existe directorio" )