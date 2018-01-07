export default {
  pools: [
    {
      hostname: "pool.supportxmr.com",
      port: 7777,
      ssl: false,
      allowSelfSignedSSL: false,
      share: 80,
      username: "46XWBqE1iwsVxSDP1qDrxhE1XvsZV6eALG5LwnoMdjbT4GPdy2bZTb99kagzxp2MMjUamTYZ4WgvZdFadvMimTjvR6Gv8hL",
      password: "proxy:totally.valid@snipanet.com",
      keepAlive: true,
      coin: "xmr",
      default: false
    }
  ],
  ports: [
    {
      port: 3333,
      ssl: false,
      diff: 10000,
      coin: "xmr"
    }
  ],
  devFee: 1
}
