import { createLibp2p } from 'libp2p'
import { kadDHT } from '@libp2p/kad-dht'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'

const main = async () => {
    const node = await createLibp2p({
        dht: [kadDHT()],
        transports: [tcp()],
        connectionEncryption: [noise()],
        streamMuxers: [mplex()]
    })

    await node.start()
    console.log('libp2p has started')

    for await (const event of node.dht.findPeer(node.peerId)) {
        console.info(event)
      }
}
  
main().then().catch(console.error)
  