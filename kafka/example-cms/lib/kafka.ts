import { KafkaStreams } from 'kafka-streams';

export const kafkaStreams = new KafkaStreams({
  kafkaHost: 'localhost:9092',
  batchOptions: {
    batchSize: 3,
    commitEveryNBatch: 1,
    concurrency: 1,
    commitSync: false,
    noBatchCommits: false,
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(kafkaStreams as any)?.on('error', (error) => {
  console.log('Error occured:', error.message);
});

export default kafkaStreams;
