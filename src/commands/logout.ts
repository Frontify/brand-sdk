import Logger from "../utils/logger";
import { Configuration } from "../utils/store";

export const logoutUser = (): void => {
    Configuration.set("tokens", null);
    Logger.info("You are now logged out.");
};
