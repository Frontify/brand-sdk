import Logger from "../utils/logger";
import { Configuration } from "../utils/configuration";

export const logoutUser = (): void => {
    Configuration.set("tokens", null);
    Logger.info("You are now logged out.");
};
