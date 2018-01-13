export default {
  coins: {
    eth: {
      pools: [
        'http://eth-asia1.nanopool.org:8888',
        'stratum://eth-asia1.nanopool.org:9999',
      ],
    },

    etn: {
      pools: [
        'stratum://eupool.electroneum.com:3333?keepAlive=true&diff=120000',
        'stratum://etn-us-west1.nanopool.org:13333?keepAlive=true&diff=120000',
        'stratum://etn-eu1.nanopool.org:13333?keepAlive=true&diff=120000',
        'stratum://etn-eu2.nanopool.org:13333?keepAlive=true&diff=120000',
      ],
    },
    //   address: '46XWBqE1iwsVxSDP1qDrxhE1XvsZV6eALG5LwnoMdjbT4GPdy2bZTb99kagzxp2MMjUamTYZ4WgvZdFadvMimTjvR6Gv8hL',
    //   username: null,
    // eth: {
    //   pools: [
    //     "stratum://asia1.ethermine.org:4444?keepAlive=true&diff=120000",
    //     "stratum://us1.ethermine.org:4444?keepAlive=true&diff=120000",
    //     "stratum://us2.ethermine.org:4444?keepAlive=true&diff=120000",
    //     "stratum://eu1.ethermine.org:4444?keepAlive=true&diff=120000",
    //   ],
    //   address: '0xea7263feb7d8a8ab0a11eedd8f1ce04412ab0820',
    //   username: null,
    //   password: 'x'
    // },

    // xmr: {
    //   pools: [
    //     "xmr-us-east1.nanopool.org:13333?keepAlive=true&diff=120000",
    //     "xmr-us-west1.nanopool.org:13333?keepAlive=true&diff=120000",
    //     "xmr-eu1.nanopool.org:13333?keepAlive=true&diff=120000",
    //     "xmr-eu2.nanopool.org:13333?keepAlive=true&diff=120000",
    //   ],
    //   address: '46XWBqE1iwsVxSDP1qDrxhE1XvsZV6eALG5LwnoMdjbT4GPdy2bZTb99kagzxp2MMjUamTYZ4WgvZdFadvMimTjvR6Gv8hL',
    //   username: null,
    //   password: 'x'
    // }
  },
  listeners: [
    'ssl://0.0.0.0:1111?diff=120000',
    'ssl://0.0.0.0:2222?diff=120000',
    'ssl://0.0.0.0:3333?diff=120000',
  ],
  devFee: 1,
  agent: 'tm-stratum-proxy/1.0.0',
};
