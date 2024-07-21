if (typeof window === 'undefined') {
  // const { server } = require('./server');
  // server.listen();
  // ↓ ↓ ↓
  // If using `server` in (`next dev`), the following error will happen.
  // `TypeError: Cannot read properties of undefined (reading 'listen')`
  // In the end, I couldn't find a solution other than removing this.
  //
  // Note:
  // This block runs on the server whose output is displayed on the server console.
  // On the other hand, `else` block is also executed on the browser, at the same time
  // (before the first render).
} else {
  // This block runs on the browser whose output's displayed on the console.
  const { worker, config: workerConfig } = require('./browser');
  worker.start(workerConfig);
}

export {};
