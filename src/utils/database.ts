/**
 * Normalizes a table name by converting it to lowercase
 * Used for actual database operations
 */
export const normalizeTableName = (tableName: string): string => {
  return tableName.toLowerCase();
};

/**
 * Gets the original table name as stored in master_tables
 * Used for display purposes
 */
export const getDisplayTableName = async (tableName: string): Promise<string> => {
  // For now, just return the name as is
  // Later we can fetch the original name from master_tables if needed
  return tableName;
};

/**
 * Validates if a table name is acceptable
 * Used before table creation
 */
export const isValidTableName = (tableName: string): boolean => {
  // Only allow alphanumeric characters and underscores
  // Must start with a letter
  const validPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  return validPattern.test(tableName);
};

const POSTGRESQL_RESERVED_WORDS = [
  'all', 'analyse', 'analyze', 'and', 'any', 'array', 'as', 'asc', 'asymmetric',
  'authorization', 'between', 'binary', 'both', 'case', 'cast', 'check', 'collate',
  'column', 'constraint', 'create', 'cross', 'current_date', 'current_role',
  'current_time', 'current_timestamp', 'current_user', 'default', 'deferrable',
  'desc', 'distinct', 'do', 'else', 'end', 'except', 'false', 'for', 'foreign',
  'freeze', 'from', 'full', 'grant', 'group', 'having', 'ilike', 'in', 'initially',
  'inner', 'intersect', 'into', 'is', 'isnull', 'join', 'leading', 'left', 'like',
  'limit', 'localtime', 'localtimestamp', 'natural', 'not', 'notnull', 'null',
  'offset', 'on', 'only', 'or', 'order', 'outer', 'overlaps', 'placing', 'primary',
  'references', 'right', 'select', 'session_user', 'similar', 'some', 'symmetric',
  'table', 'then', 'to', 'trailing', 'true', 'union', 'unique', 'user', 'using',
  'verbose', 'when', 'where', 'with'
];

export const isReservedWord = (word: string): boolean => {
  return POSTGRESQL_RESERVED_WORDS.includes(word.toLowerCase());
};