import dayjs from "dayjs";

export const getCurrentTime = (): string => {
    return dayjs().format("HH:mm:ss");
};
