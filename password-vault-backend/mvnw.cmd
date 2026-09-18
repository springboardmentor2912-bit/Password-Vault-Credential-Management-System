@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

if not defined JAVA_HOME (
  echo ERROR: JAVA_HOME is not set.
  exit /b 1
)

set MAVEN_WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar
if not exist "%MAVEN_WRAPPER_JAR%" (
  echo ERROR: Maven wrapper JAR not found: %MAVEN_WRAPPER_JAR%
  exit /b 1
)

java -jar "%MAVEN_WRAPPER_JAR%" %*
