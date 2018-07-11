export function getCurrentDate(timestamp?: number): string {
    const currentDate = timestamp ? new Date(timestamp) : new Date();
    return currentDate.toISOString().substring(0, 16);
}

export function validateDatetimes(dt1: string, dt2: string): boolean {
    const dtime1 = new Date(dt1);
    const dtime2 = new Date(dt2);
    return dtime1 < dtime2 && dtime1 > new Date();
}
