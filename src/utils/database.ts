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