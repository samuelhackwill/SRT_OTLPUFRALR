module.exports = {
  servers: {
    lepontprod: {
      host: '217.182.252.49',
      username: 'samuel',
      // pem:
      // password:
      // or leave blank for authenticate from ssh-agent
      opts: {
        port: 11142
      },    }
  },

  meteor: {
    name: 'lepontprod',
    path: '../',
    docker: {
      image: 'zodern/meteor:root', // (optional)
    },
    servers: {
      lepontprod: {}
    },
    buildOptions: {
      debug:true,
      serverOnly: true,
    },
    env: {
      PORT: 3003,
      ROOT_URL: 'http://ontraverseralepont.com',
      MONGO_URL: 'mongodb://localhost:27017/lepontprod',
    },

    //dockerImage: 'kadirahq/meteord'
    deployCheckWaitTime: 60
  },

  mongo: {
    oplog: true,
    servers: {
      lepontprod: {},
    },
  },
};

// note à moi même :
// si on peine à deploy cette saleté, 
// lancer le deploy comme ça :

//       "NODE_TLS_REJECT_UNAUTHORIZED": "0" mup deploy
// en utilisant le mac mini de samuel.

// mais aussi un jour il faudra mettre à jour meteor peut être.