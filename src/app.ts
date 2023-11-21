import express from "express";
import TvApi from "node-lgtv-api";
import morgan from "morgan";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));

const port = parseInt(process.env.PORT as string) || 3000;
const tvip: string = process.env.LGTVIP!;
const tvport = 8080;

const cmds = Object.fromEntries(
  Object.entries(TvApi).filter(([key]) => key.startsWith("TV_CMD_"))
);

app.get("/api/lgtv/pair", async (_req, res) => {
  const pairApi = new TvApi(tvip, tvport);
  pairApi.setDebugMode(true);

  try {
    const result = await pairApi.displayPairingKey();
    res.send({ result: result });
  } catch (error) {
    res.status(500).send({ result: error });
  }
});

app.get("/api/lgtv/:key/handlekeyinput/:cmd", async (req, res) => {
  const tvapi = new TvApi(tvip, tvport, req.params.key);
  tvapi.setDebugMode(true);

  try {
    await tvapi.authenticate();
    const cmd = cmds[req.params.cmd.toUpperCase()];
    const result = await tvapi.processCommand("HandleKeyInput", { value: cmd });

    res.send({ result: result });
  } catch (error) {
    res.status(500).send({ result: error });
  }
});

app.get("/api/lgtv/commands", (_req, res) => {
  res.send(cmds);
});

app.listen(port, () => {
  console.log(`LG TV api proxy listening on port ${port}`);
});
