Aims to be similiar to this "official" word count example:

https://github.com/apache/kafka/blob/0.10.0/streams/examples/src/main/java/org/apache/kafka/streams/examples/wordcount/WordCountDemo.java

the input topic could look like this:

```
  "fruit banana"
  "fruit cherry"
  "vegetable broccoli"
  "fruit strawberry"
  "vegetable lettuce"
```

the output topic would then look like this:

```
  "fruit 3"
```

(yet for the sake of this example, there is a second stream that is used to produce
to the topic)

Example message:

```js
{
  value: 'fruit banana',
  size: 12,
  key: null,
  topic: 'my-input-topic',
  offset: 5,
  partition: 0,
  timestamp: 1642548253292
}
```
