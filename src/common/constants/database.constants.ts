export const DB_COLUMNS = {
  IS_OBSOLETE: 'is_obsolete',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  DELETED_AT: 'deleted_at',
  IS_BLOCKED: 'is_blocked',
  IS_ACTIVE: 'is_active',
  IS_AVAILABLE: 'is_available',
} as const;

export const DB_TYPES = {
  TINYINT: 'tinyint',
  DATETIME: 'datetime',
  CHAR: 'char',
  TEXT: 'text',
} as const;
