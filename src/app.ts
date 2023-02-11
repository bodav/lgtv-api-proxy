import express from "express";
import TvApi from "node-lgtv-api";
import morgan from "morgan";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("combined"));

const port = parseInt(process.env.PORT as string) || 3000;
const tvip: string = process.env.TVIP ?? "192.168.1.207";
const tvport = 8080;

const cmds = Object.fromEntries(
  Object.entries(TvApi).filter(([key, val]) => key.startsWith("TV_CMD_"))
);

app.get("/api/lgtv/pair", async (req, res) => {
  const pairApi = new TvApi(tvip, tvport);
  pairApi.setDebugMode(true);

  try {
    const resp = await pairApi.displayPairingKey();
    res.send({ result: resp });
  } catch (error) {
    res.status(500).send({ result: error });
  }
});

app.get("/api/lgtv/:key/handlekeyinput/:cmd", (req, res) => {
  const tvapi = new TvApi(tvip, tvport, req.params.key);
  tvapi.setDebugMode(true);

  tvapi.authenticate().then(
    () => {
      const cmd = cmds[req.params.cmd.toUpperCase()];
      console.log(`Command ${req.params.cmd}. val ${cmd}`);

      tvapi.processCommand("HandleKeyInput", { value: cmd }).then(
        (value: any) => {
          res.send({ resp: value });
        },
        (reason: Error) => {
          console.error(reason);
          res.status(500).send({ resp: reason.toString() });
        }
      );
    },
    (reason: Error) => {
      console.error(reason);
      res.status(500).send({ resp: reason.toString() });
    }
  );
});

app.get("/api/lgtv/commands", (req, res) => {
  res.send(cmds);
});

app.listen(3000, () => {
  console.log(`LG TV api proxy listening on port ${port}`);
});
