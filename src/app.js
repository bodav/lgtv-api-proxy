const express = require("express")
const TvApi = require("node-lgtv-api");

const app = express()
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = parseInt(process.env.PORT) || 3000;
const tvip = process.env.TVIP ?? "192.168.1.207";
const tvport = 8080;

const cmds = Object.fromEntries(Object.entries(TvApi).filter(
    ([key, val]) => key.startsWith("TV_CMD_") && !isNaN(val)
));

app.get('/api/lgtv/pair', (req, res) => {
    const pairApi = new TvApi(tvip, tvport);
    pairApi.setDebugMode(true);
    pairApi.displayPairingKey().then(value => {
        res.send({ resp: value });
    }, reason => {
        console.error(reason);
        res.status(500).send(reason);
    });
})

app.get('/api/lgtv/:key/handlekeyinput/:cmd', (req, res) => {
    const tvapi = new TvApi(tvip, tvport, req.params.key);
    tvapi.setDebugMode(true);

    tvapi.authenticate().then(() => {

        const cmd = cmds[req.params.cmd.toUpperCase()];
        console.log(`Command ${req.params.cmd}. val ${cmd}`);

        tvapi.processCommand("HandleKeyInput", { value: cmd }).then(value => {
            res.send({ resp: value });
        }, reason => {
            console.error(reason);
            res.status(500).send(reason);
        });

    }, reason => {
        console.error(reason);
        res.status(500).send({ resp: reason });
    });
})

app.get('/api/lgtv/commands', (req, res) => {
    res.send(cmds);
})

app.listen(3000, () => {
    console.log(`LG TV api proxy listening on port ${port}`)
})