const TvApi = require("node-lgtv-api");


const tvApi = new TvApi("192.168.1.207", "8080", "855692");
tvApi.setDebugMode(true);

//tvApi.displayPairingKey().then(console.log, console.error);


//tvApi.authenticate().then(console.log, console.error);

//tvApi.authenticate().then(() => tvApi.processCommand(TvApi.TV_CMD_MUTE_TOGGLE, {}).then(console.log, console.error), console.error);
//tvApi.authenticate().then(() => tvApi.processCommand("HandleKeyInput", { value: TvApi.TV_CMD_MUTE_TOGGLE }).then(console.log, console.error), console.error);

const filtered = Object.fromEntries(Object.entries(TvApi).filter(
    ([key, val]) => key.startsWith("TV_CMD_") && !isNaN(val)
));

console.log(filtered["TV_CMD_MUTE_TOGGLE"]);

