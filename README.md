# shard

shard is a decentralised message store (similar to a pds or a tangled knot) that stores the actual content of your messages

## why a shard?

why not just store messages on pds?

because we need three things

1. good read speeds. generally speaking, messaging apps are extremely read-heavy. pds is not read-optimised enough for our use case.
2. data separation. pds is good for identity and content related to that identity. however, because of how real-time messaging works, message content must exist separately from a pds.
3. data privacy. while private data on protocol can mitigate this issue, it will still expose certain details about messages, such as when they are sent, by whom, and to which channel.

pds itself is fine for general identity purposes, and at gemstone, `pds` will act as the structure of _where_ the messages go, while `shard` will act as a simple store of the messages.

the ultimate aim of this system is to ensure that you have full control over your own data. by making the structure of the data exist on pds, unless shards are fully deleted, it will still be possible to easily retrieve and reconstruct the entire structure of your conversations.
