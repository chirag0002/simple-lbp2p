import { createLibp2p } from 'libp2p'
import { webSockets } from '@libp2p/websockets'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { yamux } from '@chainsafe/libp2p-yamux'
import { pingService } from 'libp2p/ping'
import { bootstrap } from '@libp2p/bootstrap'
import { mdns } from '@libp2p/mdns'


// Known peers addresses
const bootstrapMultiaddrs = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
]

const node = await createLibp2p({
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0']
  },
  transports: [tcp(),webSockets()],
  connectionEncryption: [noise()],
  streamMuxers: [yamux(), mplex()],
  peerDiscovery: [
    bootstrap({
        list: bootstrapMultiaddrs, // provide array of multiaddrs
    }),
    mdns({
      interval: 20000
    })
  ], 
  
  services: {
    ping: pingService({
      protocolPrefix: 'ipfs', // default
    }),
  },
})

await node.start()
console.log('libp2p has started')

node.addEventListener('peer:discovery', (evt) => {
  console.log('Discovered %s', evt.detail.id) // Log discovered peer
})

node.addEventListener('peer:connect', (evt) => {
  console.log('Connected to %s', evt.detail) // Log connected peer
})


// import { createLibp2p } from 'libp2p';
// import { webSockets } from '@libp2p/websockets';
// import { tcp } from '@libp2p/tcp';
// import { noise } from '@chainsafe/libp2p-noise';
// import { mplex } from '@libp2p/mplex';
// import { yamux } from '@chainsafe/libp2p-yamux';
// import { pingService } from 'libp2p/ping';
// import { mdns } from '@libp2p/mdns';

// const createNode = async () => {
//   const node = await createLibp2p({
//     addresses: {
//       listen: ['/ip4/0.0.0.0/tcp/0']
//     },
//     transports: [tcp(), webSockets()],
//     connectionEncryption: [noise()],
//     streamMuxers: [yamux(), mplex()],
//     peerDiscovery: [
//       mdns({
//         interval: 20e3
//       })
//     ],
//     config: {
//       peerDiscovery: {
//         [mdns.tag]: true
//       }
//     },
//     services: {
//       ping: pingService({
//         protocolPrefix: 'ipfs'
//       })
//     }
//   });

//   await node.start();
//   console.log('libp2p has started');

//   // node.addEventListener('peer:discovery', (evt) => {
//   //   console.log('Discovered %s', evt.detail.id);
//   // });

//   node.addEventListener('peer:connect', (evt) => {
//     console.log('Connected to %s', evt.detail);
//   });

//   return node;
// };

// (async () => {
//   const [node1, node2, node3] = await Promise.all([
//     createNode(),
//     createNode(),
//     createNode()
//   ]);

//   node1.addEventListener('peer:discovery', (evt) => console.log('Discovered by 1:', evt.detail.id.toString()))
//   node2.addEventListener('peer:discovery', (evt) => console.log('Discovered by 2:', evt.detail.id.toString()))
//   node3.addEventListener('peer:discovery', (evt) => console.log('Discovered by 3:', evt.detail.id.toString()))

//   // You can now use node1, node2, node3 to interact with the libp2p network.
// })();

