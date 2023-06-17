import { writeFile, mkdir, unlink, rm, readFile } from "fs/promises";
import _path from "path";
import { SourceTreePath } from "../typings/interface.js";
import { PathType } from "../typings/enum.js";
import { readdirSync, statSync } from "fs";
export function createSourceTree(base = process.cwd()) {
    const Paths: Map<string, SourceTreePath> = new Map();
    const paths = readdirSync(base);

    for (const p of paths) {
        const path = _path.join(base, p);
        const stats = statSync(path);
        Paths.set(path.replace(process.cwd(), "@root"), {
            name: p,
            path: path.replace(process.cwd(), "@root"),
            type: stats.isDirectory() ? PathType.Folder : PathType.File,
            children: stats.isDirectory() && !p.startsWith(".") ? readdirSync(path) : undefined,
        });

        if (stats.isDirectory() && !path.includes("node_modules") && !p.startsWith(".")) {
            const map = createSourceTree(path);
            for (const [key, value] of map) {
                Paths.set(key, value);
            }
        }
    }
    return Paths;
}

export async function createFile(dir: string, file: string, data: string) {
    return await writeFile(_path.join(dir, file), data).catch((err) => {
        throw err;
    });
}

export async function createFolder(dir: string, folder: string) {
    return await mkdir(_path.join(dir, folder), {
        recursive: true,
    }).catch((err) => {
        throw err;
    });
}

export async function deleteFile(dir: string) {
    return await unlink(dir).catch((err) => {
        throw err;
    });
}

export async function deleteFolder(dir: string) {
    await rm(dir, {
        recursive: true,
    }).catch((err) => {
        throw err;
    });
}

export async function getFileContent(dir: string) {
    const parsedPath = dir.replace("@root", process.cwd());
    return await readFile(parsedPath, "utf-8").catch((err) => {
        throw err;
    });
}

export function createSourceGraph(base = process.cwd()) {
    const Paths:unknown[] =[];
    const paths = readdirSync(base);

    for (const p of paths) {
        const path = _path.join(base, p);
        const stats = statSync(path);
        Paths.push({
            name: p,
            path: path.replace(process.cwd(), "@root"),
            type: stats.isDirectory() ? PathType.Folder : PathType.File,
            children: stats.isDirectory() && (!p.startsWith(".") && !p.includes("node_modules")) ? createSourceGraph(path) : undefined,
        });
    }
    return Paths;
}