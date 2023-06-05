import { Colors } from "../typings/enum.js";
/**
  * ? Effects
  * * {Reset}
  * * {Bright}
  * * {Dim}
  * * {Underscore}
  * * {Blink}
  * * {Reverse}
  * * {Hidden}

  * ? Foreground Colors
  * * {FgBlack}
  * * {FgRed}
  * * {FgGreen}
  * * {FgYellow}
  * * {FgBlue}
  * * {FgMagenta}
  * * {FgCyan}
  * * {FgWhite}

  * ? Background Colors
  * * {BgBlack}
  * * {BgRed}
  * * {BgGreen}
  * * {BgYellow}
  * * {BgBlue}
  * * {BgMagenta}
  * * {BgCyan}
  * * {BgWhite}
**/

export function print(text: string) {
    // example text = {Bright, FgRed}Hello World{Reset}

    const colorsInText = text.match(/{(.*?)}/g);
    const date = new Intl.DateTimeFormat("en-GB", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
    }).format(new Date());

    if (colorsInText) {
        for (const color of colorsInText) {
            const possibleColors = color.slice(1, -1);
            const colors = possibleColors.split(",");

            let colorCode = "";
            for (const color of colors) {
                colorCode += Colors[color.trim() as keyof typeof Colors];
            }

            text = text.replace(color, colorCode);
        }
    }

    console.log(
        `[ ${Colors.Bright}${Colors.FgCyan}${date}${Colors.Reset} ] > ${text}`,
    );
}

export function printError(text: string) {
    print(`| {Bright, FgRed}Error{Reset} | > {Bright, FgRed}${text}{Reset}`);
}

export function printWarn(text: string) {
    print(`| {Bright, FgYellow}Warn{Reset} | > {Bright, FgYellow}${text}{Reset}`);
}

export function printInfo(text: string) {
    print(`| {Bright, FgBlue}Info{Reset} | > {Bright, FgBlue}${text}{Reset}`);
}

export function printSuccess(text: string) {
    print(`| {Bright, FgGreen}Success{Reset} | > {Bright, FgGreen}${text}{Reset}`);
}
