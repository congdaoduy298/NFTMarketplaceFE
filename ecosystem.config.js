module.exports = {
    apps : [{
      name: 'frontend',
      script: 'node_modules/next/dist/bin/next',
      watch: false,
      instances  : 1,
      exec_mode: 'cluster'
    }],
  };