export enum Perms {
    ReadFile = 1 << 0,
    WriteFile = 1 << 1,
    AccessShell = 1 << 2,
    AccessEval = 1 << 3,
    AccessEditor = 1 << 4,
    DeleteFile = 1 << 5,
    AccessLogs = 1 << 6,
    AccessSettings = 1 << 7,
    CreateFile = 1 << 8,
    Reboot = 1 << 9,
    AccessFiles = ReadFile | WriteFile | DeleteFile | CreateFile,
    Admin = ReadFile |
        WriteFile |
        AccessShell |
        AccessEval |
        AccessEditor |
        DeleteFile |
        AccessLogs |
        AccessSettings |
        CreateFile |
        Reboot,
}

export function hasPerm(perms: number, perm: Perms) {
    return (perms & perm) === perm;
}