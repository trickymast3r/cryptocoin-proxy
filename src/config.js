export default {
  coins: {
    default: {
      pools: [],
      address: null,
      username: null,
      password: 'x',
      allowSelfSSL: true,
    },
  },
  listeners: [
    'ssl://0.0.0.0:1111?diff=120000',
  ],
  devFee: 1,
  agent: 'tm-stratum-proxy/1.0.0',
};
