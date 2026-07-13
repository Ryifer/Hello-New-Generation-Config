@echo off
REM Forge requires a configured set of both JVM and program arguments.
REM Add custom JVM arguments to the user_jvm_args.txt
REM Add custom program arguments {such as nogui} to this file in the next line before the %* or
REM  pass them to this script directly
".\Oracle-jdk-21\bin\java.exe" @user_jvm_args.txt -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -XX:+ExplicitGCInvokesConcurrent -XX:+UseLargePages -Xss1M -XX:ConcGCThreads=4 -XX:ZAllocationSpikeTolerance=2 -XX:ZCollectionInterval=120 -Dfile.encoding=UTF-8 @libraries/net/neoforged/neoforge/21.1.233/win_args.txt %* nogui
pause
