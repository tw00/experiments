#!/bin/sh

# Run:
# ./example-fruits/purge-topic.sh my-input-topic
# ./example-fruits/purge-topic.sh my-output-topic

# kafka-configs \
#   --zookeeper localhost:2181 \
#   --entity-type topics \
#   --alter \
#   --entity-name $1 \
#   --add-config retention.ms=1000

kafka-topics \
  --delete \
  --topic $1 \
  --bootstrap-server localhost:9092

kafka-topics \
  --create \
  --partitions 1 \
  --replication-factor 1 \
  --topic $1 \
  --bootstrap-server localhost:9092

kafka-topics --list --bootstrap-server localhost:9092