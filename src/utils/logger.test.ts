import Logger from "./logger";

const someRandomText = "It’s a trap!";

describe("Logger utils", () => {
    describe(Logger, () => {
        it("should call defaultInfo and log to the console", () => {
            console.log = jest.fn();
            Logger.defaultInfo(someRandomText);
            expect(console.log).toHaveBeenCalled();
        });

        it("should call info and log to the console", () => {
            console.log = jest.fn();
            Logger.info(someRandomText);
            expect(console.log).toHaveBeenCalled();
        });

        it("should call error and log error to the console", () => {
            console.error = jest.fn();
            Logger.error(someRandomText);
            expect(console.error).toHaveBeenCalled();
        });

        it("should give a string with X spaces", () => {
            expect(Logger.spacer(5)).toEqual("     ");
            expect(Logger.spacer(3)).toEqual("   ");
            expect(Logger.spacer()).toEqual(" ");
        });
    });
});
