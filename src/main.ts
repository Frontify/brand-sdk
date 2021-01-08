import dotenv from "dotenv";

//TODO: Command line
import minimist from "minimist";

dotenv.config();

//TODO: Refactor to allow custom commands like deploy
import "./commands/serve.ts";
