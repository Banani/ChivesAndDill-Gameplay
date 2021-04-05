const hostname = '127.0.0.1';
const port = 3000;

const httpServer = require('http').createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

const io = require('socket.io')(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
  },
});

httpServer.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('test', () => {
    console.log('yup');
  });
});
