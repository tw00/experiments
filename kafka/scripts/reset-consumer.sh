#!/bin/sh

kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --group kafka-node-group \
  --topic $1 \
  --execute \
  --reset-offsets \
  --to-earliest