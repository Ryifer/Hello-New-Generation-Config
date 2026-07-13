#!/usr/bin/env sh
# Forge requires a configured set of both JVM and program arguments.
# Add custom JVM arguments to the user_jvm_args.txt
# Add custom program arguments {such as nogui} to this file in the next line before the "$@" or
#  pass them to this script directly
java @user_jvm_args.txt -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -XX:+ExplicitGCInvokesConcurrent -XX:+UseLargePages -Xss1M -XX:ConcGCThreads=4 -XX:ZAllocationSpikeTolerance=2 -XX:ZCollectionInterval=120 -Dfile.encoding=UTF-8 @libraries/net/neoforged/neoforge/21.1.233/unix_args.txt "$@"
