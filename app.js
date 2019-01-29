const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname + '/dist'));

app.get('/apk', (req, res) => {
    console.log('apk downloaded');
    res.download(path.resolve(__dirname, './app-debug.apk'));
});
// send the user to index html page inspite of the url
app.get('*', (req, res) => {
    console.log('file sent');
    res.sendFile(path.resolve(__dirname, 'dist/index.html'));
});


app.listen(port, () => {
    console.log(`listenning on port ${port}`);
});