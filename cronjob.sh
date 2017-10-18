#!/bin/bash
cd "$(dirname ${BASH_SOURCE[0]})"
./run.sh > logs/`date +%Y-%m-%d_%H:%M:%S`.log 2>&1
