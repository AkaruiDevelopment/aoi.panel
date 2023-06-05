import { Perms } from "../typings/enum.js";

export default function hasPerm(perms: number, perm: Perms) {
    return (perms & perm) === perm;
}
