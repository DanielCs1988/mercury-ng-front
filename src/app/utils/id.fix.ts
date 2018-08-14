// Wrong value returned by subscription, this is a known issue with the Prisma API.
// It was fixed, but the fix was not available on AWS at the time of this service's upload.
export function getFixedId(originalId: string): string {
    const fixedIdMatch = originalId.match(/^CuidGCValue\((.+)\)$/);
    return fixedIdMatch ? fixedIdMatch[1] : originalId;  // Prepared for a fix to happen in the meantime.
}
