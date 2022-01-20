# Quick start

## Install Kafka (MacOS)

```bash
# this will install java 1.8, zookeeper, and kafka
brew install kafka

# this will run ZK and kafka as services
brew services start zookeeper
brew services start kafka
```

## Access Zookeeper

```bash
/usr/local/opt/zookeeper/bin/zkCli
#> ls /
#> ls /brokers/topics
#> get /brokers/topics/test-topic
```

## Create topic

```bash
kafka-topics --create \
  --partitions 1 \
  --replication-factor 1 \
  --topic test-topic \
  --bootstrap-server localhost:9092

kafka-topics --describe \
  --topic test-topic \
  --bootstrap-server localhost:9092
```

## Write to topic

```bash
kafka-console-producer --topic test-topic --bootstrap-server localhost:9092
#> Write test in cli, press Enter, press Ctrl + C
```

## Read from topic

```bash
kafka-console-consumer --topic test-topic --from-beginning --bootstrap-server localhost:9092
```

## Terminate the Kafka environment

Stop services:

```bash
brew services stop kafka
brew services stop zookeeper
```

Uninstall:

```bash
brew uninstall zookeeper
brew uninstall kafka
# rm -rf /tmp/kafka-logs /tmp/zookeeper
```

# Run Node App

### Stream Processor

```
brew install librdkafka
brew install openssl
rm -rf node_modules
export CPPFLAGS=-I/usr/local/opt/openssl/include
export LDFLAGS=-L/usr/local/opt/openssl/lib
yarn
```

# Resources

- https://kafka.apache.org/quickstart
