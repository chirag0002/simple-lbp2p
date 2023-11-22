import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { tcp } from "@libp2p/tcp";
import { webRTC } from "@libp2p/webrtc";
import { webSockets } from "@libp2p/websockets";
import { webTransport } from "@libp2p/webtransport";
import { createLibp2p } from "libp2p";
import { kadDHT } from "@libp2p/kad-dht";
import { bootstrap } from "@libp2p/bootstrap";
import { mdns } from '@libp2p/mdns';
import pkg from 'libp2p-identify';
const { identifyService } = pkg;


const node = await createLibp2p({
    transports: [tcp(), webSockets(), webTransport(), webRTC()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    services: {
        dht: kadDHT(),
        identify: identifyService
    },

    peerDiscovery: [bootstrap({
        list: [
            "/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
            "/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        ],
        timeout: 1000, // in ms,
        tagName: 'bootstrap',
        tagValue: 50,
        tagTTL: 120000 // in ms
    }),
    mdns()],

    addresses: {
        listen: ['/ip4/0.0.0.0/tcp/42542']
    },
});
await node.start()

const peerId = node.peerId;
console.log(peerId);

node.addEventListener('peer:discovery', (evt) => {
    console.log('Discovered %s', evt.detail.id.toString()) // Log discovered peer
});
