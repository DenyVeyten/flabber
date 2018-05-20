const fs = require('fs');
const detecFaces = require('./face-detection');
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.crt')
};

const handler = (req, res) => {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
};

const app = require('https').createServer(options, handler);
const io = require('socket.io')(app);

app.listen(4000, '192.168.100.4');

const timers = {};

io.on('connection', (socket) => {
  socket.on('ready', () => {
    socket.emit('getScreenshot');
  });

  socket.on('screenshot', (data) => {
    const result = detecFaces(data);
    socket.emit('rect', result);
    socket.emit('getScreenshot');
  });

  socket.on('logging', (data) => {
    console.log('logging: ', data);
  });

  socket.on('disconnect', () => {
    clearInterval(timers[socket.id]);
  });
});