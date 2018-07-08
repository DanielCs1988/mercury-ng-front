export function isDuplicateEntry(newEntry, existingEntries) {
  return newEntry !== null && newEntry.id !== null && existingEntries.some(entry => newEntry.id === entry.id);
}
