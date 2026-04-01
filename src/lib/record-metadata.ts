export interface RecordMetadata {
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export function createRecordMetadata(owner: string): RecordMetadata {
  const timestamp = new Date().toISOString();
  return {
    owner,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function touchRecordMetadata(current: RecordMetadata): RecordMetadata {
  return {
    ...current,
    updatedAt: new Date().toISOString(),
  };
}
