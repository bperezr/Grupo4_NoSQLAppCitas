@echo off
setlocal

:: Formatear la fecha en YYYY-MM-DD
set "fecha=%date:~-4,4%-%date:~-7,2%-%date:~-10,2%"

:: Crear carpeta con la fecha actual
mkdir "%fecha%"
cd "%fecha%"

:: Ejecutar mongodump
mongodump --uri="mongodb+srv://grupo4:VPrLqhoVFg8JM1oW@mediconnect.omjxmo2.mongodb.net/mediConnect"

:: Fin del script
endlocal