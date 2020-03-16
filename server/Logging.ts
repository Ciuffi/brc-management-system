import { greenBright, yellowBright, redBright } from "chalk";

export const greenLog = (str: string) => console.log(greenBright(str));

export const yellowLog = (str: string) => console.log(yellowBright(str));

export const redLog = (str: string) => console.log(redBright(str));

export const redError = (...args: any[]) => console.error(redBright(args));
