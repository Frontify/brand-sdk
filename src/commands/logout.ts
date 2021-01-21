import Logger from "../utils/logger";
import { Configuration } from "../utils/configuration";

export const logoutUser = (): void => {
    Configuration.delete("tokens");
    //TODO: Call API endpoint
    Logger.info("You are now logged out.");
};
