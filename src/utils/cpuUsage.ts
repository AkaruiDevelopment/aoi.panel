export default function getCpuUsage() {
    const startTime = process.hrtime();
    const startUsage = process.cpuUsage();

    // spin the CPU for 500 milliseconds
    const now = Date.now();
    while (Date.now() - now < 500);
    const elapTime = process.hrtime(startTime);
    const elapUsage = process.cpuUsage(startUsage);

    const elapTimeMS = secNSec2ms(elapTime);
    const elapUserMS = secNSec2ms(elapUsage.user);
    const elapSystMS = secNSec2ms(elapUsage.system);
    const cpuPercent = ((100 * (elapUserMS + elapSystMS)) / elapTimeMS).toFixed(2);

    return cpuPercent;
}
function secNSec2ms(secNSec: [number, number] | number) {
    if (Array.isArray(secNSec)) {
        return secNSec[0] * 1000 + secNSec[1] / 1000000;
    }
    return secNSec / 1000;
}
