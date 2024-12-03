import { supabase } from '../supabaseClient';
import { normalizeTableName } from '../../utils/database';

interface TableField {
  name: string;
  type: string;
  required: boolean;
}

export const createDatabaseTable = async (tableName: string, fields: TableField[]) => {
  try {
    // First check if table already exists in master_tables
    const { data: existingTable, error: checkError } = await supabase
      .from('master_tables')
      .select('table_name')
      .ilike('table_name', tableName)
      .limit(1);

    if (checkError) throw checkError;

    if (existingTable?.length) {
      throw new Error(`A table named "${tableName}" already exists.`);
    }

    const normalizedName = normalizeTableName(tableName);

    // First try to add to master_tables
    await addToMasterTables(tableName);

    // Then create the actual table
    const query = `
      CREATE TABLE ${normalizedName} (
        id BIGSERIAL PRIMARY KEY,
        ${fields.map(field =>
          `${field.name} ${getSqlType(field.type)}${field.required ? ' NOT NULL' : ''}`
        ).join(',\n        ')}
      );
    `;

    // Execute the query using normalized name
    const { data, error } = await supabase.rpc('create_table', {
      table_query: query
    });

    if (error) {
      // If table creation fails, remove from master_tables
      await supabase
        .from('master_tables')
        .delete()
        .match({ table_name: tableName });
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

// Helper function to convert our field types to SQL types
const getSqlType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'text': 'TEXT',
    'number': 'NUMERIC',
    'boolean': 'BOOLEAN',
    'date': 'DATE',
    'timestamp': 'TIMESTAMP WITH TIME ZONE',
    'email': 'TEXT',
    'url': 'TEXT'
  };

  return typeMap[type] || 'TEXT';
};

export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userAccount, error: userError } = await supabase
      .from('user_accounts')
      .select('account_id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError) throw userError;

    // Use ilike for case-insensitive comparison
    const { data, error } = await supabase
      .from('master_tables')
      .select('table_name')
      .ilike('table_name', tableName)
      .eq('account_id', userAccount.account_id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking table existence:', error);
    throw error;
  }
};

export const addToMasterTables = async (tableName: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userAccount, error: userError } = await supabase
      .from('user_accounts')
      .select('account_id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError) throw userError;

    // Insert into master_tables with account_id
    const { error } = await supabase
      .from('master_tables')
      .insert([{
        table_name: tableName,
        account_id: userAccount.account_id
      }])
      .single();

    // Handle unique constraint violation
    if (error?.code === '23505') { // PostgreSQL unique violation code
      throw new Error(`Table "${tableName}" already exists for this account`);
    }

    if (error) throw error;
  } catch (error) {
    console.error('Error adding to master tables:', error);
    throw error;
  }
};

export const fetchTables = async () => {
  try {
    // First get the current user's account_id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userAccount, error: userError } = await supabase
      .from('user_accounts')
      .select('account_id')
      .eq('auth_user_id', user.id)
      .single();

    if (userError) {
      console.error('Error getting user account:', userError);
      throw userError;
    }

    // Then fetch tables for this account only
    const { data, error } = await supabase
      .from('master_tables')
      .select('table_name, type')
      .eq('account_id', userAccount.account_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }

    return data.map(row => row.table_name);
  } catch (error) {
    console.error('Error in fetchTables:', error);
    throw error;
  }
};

export const getTableStructure = async (tableName: string) => {
  try {
    const { data, error } = await supabase.rpc('get_table_structure', {
      target_table: tableName
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching table structure:', error);
    throw error;
  }
};

export const getTableData = async (tableName: string) => {
  try {
    const normalizedName = normalizeTableName(tableName);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // First verify access through master_tables
    const { data: tables } = await supabase
      .from('master_tables')
      .select('table_name')
      .ilike('table_name', tableName)
      .limit(1);

    if (!tables?.length) {
      throw new Error('Table not found or access denied');
    }

    // If verified, query the actual table
    const { data, error } = await supabase
      .from(normalizedName)
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};

export const addColumnToTable = async (tableName: string, columnName: string, columnType: string) => {
  try {
    const sqlType = getSqlType(columnType);
    const { data, error } = await supabase.rpc('add_column', {
      table_name: tableName,
      column_name: columnName,
      column_type: sqlType
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding column:', error);
    throw error;
  }
};

export const deleteColumn = async (tableName: string, columnName: string) => {
  try {
    const { data, error } = await supabase.rpc('delete_column', {
      table_name: tableName,
      column_name: columnName
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting column:', error);
    throw error;
  }
};

export const updateTableCell = async (
  tableName: string,
  rowId: number,
  columnName: string,
  value: any
) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ [columnName]: value })
      .eq('id', rowId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating cell:', error);
    throw error;
  }
};

export const importCSVData = async (tableName: string, data: any[]) => {
  try {
    // Get table structure including nullable status
    const { data: tableInfo } = await supabase
      .from('master_tables_columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', tableName);

    console.log('Table structure:', tableInfo);

    // Create a map of column metadata
    const columnMeta = tableInfo?.reduce((acc: Record<string, any>, col) => {
      acc[col.column_name] = {
        type: col.data_type,
        nullable: col.is_nullable === 'YES',
        hasDefault: col.column_default !== null
      };
      return acc;
    }, {}) || {};

    console.log('Column metadata:', columnMeta);

    // Validate and clean each row before inserting
    const cleanedData = data.map((row, index) => {
      const cleanRow: any = {};

      // First pass: collect all fields
      Object.entries(row).forEach(([key, value]) => {
        console.log(`Processing ${key}: ${value} (type: ${columnMeta[key]?.type})`);

        // Skip id field if it's a UUID or if the column has a default value
        if ((key === 'id' && value && value.includes('-')) || columnMeta[key]?.hasDefault) {
          console.log(`Skipping field ${key} (has default or is UUID)`);
          return;
        }

        // Handle empty values
        if (value === '' || value === undefined) {
          if (!columnMeta[key]?.nullable) {
            // If field is not nullable, use a default value based on type
            switch (columnMeta[key]?.type) {
              case 'bigint':
              case 'integer':
                cleanRow[key] = 0;
                break;
              case 'text':
              case 'character varying':
                cleanRow[key] = '';
                break;
              case 'boolean':
                cleanRow[key] = false;
                break;
              default:
                cleanRow[key] = null;
            }
          } else {
            cleanRow[key] = null;
          }
          return;
        }

        const columnType = columnMeta[key]?.type;

        switch (columnType) {
          case 'bigint':
            cleanRow[key] = /^\d+$/.test(value) ? BigInt(value) : 0;
            break;
          case 'integer':
            cleanRow[key] = /^\d+$/.test(value) ? parseInt(value) : 0;
            break;
          case 'numeric':
          case 'decimal':
          case 'real':
          case 'double precision':
            cleanRow[key] = !isNaN(parseFloat(value)) ? parseFloat(value) : 0;
            break;
          case 'boolean':
            cleanRow[key] = value === 'true' || value === '1' || value === 'yes';
            break;
          case 'date':
            try {
              cleanRow[key] = new Date(value).toISOString().split('T')[0];
            } catch {
              cleanRow[key] = null;
            }
            break;
          case 'timestamp':
          case 'timestamptz':
            try {
              cleanRow[key] = new Date(value).toISOString();
            } catch {
              cleanRow[key] = null;
            }
            break;
          default:
            cleanRow[key] = value;
        }

        console.log(`Converted ${key}: ${cleanRow[key]}`);
      });
      return cleanRow;
    });

    console.log('Cleaned data:', cleanedData);

    const { error } = await supabase
      .from(tableName)
      .insert(cleanedData);

    if (error) {
      console.error('Supabase error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        data: cleanedData
      });
      throw error;
    }
  } catch (error) {
    console.error('Error importing CSV data:', error);
    throw error;
  }
};

export const getTableSchema = async (tableName: string) => {
  const { data, error } = await supabase
    .rpc('get_table_structure', { target_table: tableName });

  if (error) {
    console.error('Error fetching table schema:', error);
    throw error;
  }

  // If data is null, return empty array to prevent errors
  return data || [];
};

export const insertRow = async (tableName: string, data: any) => {
  try {
    // If no ID is provided, get the max ID and increment it
    if (!data.id) {
      const { data: maxResult, error: maxError } = await supabase
        .from(tableName)
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      if (!maxError && maxResult && maxResult.length > 0) {
        // Set the sequence to continue from the max ID
        await supabase.rpc('set_table_sequence', {
          table_name: tableName,
          seq_value: maxResult[0].id
        });
      }
    }

    const response = await supabase
      .from(tableName)
      .insert(data);

    if (response.error) throw response.error;
    return response.data;
  } catch (error) {
    console.error('Error inserting row:', error);
    throw error;
  }
};

export const getAddRowSchema = async (tableName: string) => {
  const { data, error } = await supabase
    .rpc('get_add_row_structure', { target_table: tableName });

  if (error) {
    console.error('Error fetching add row schema:', error);
    throw error;
  }

  return data || [];
};

export const deleteTable = async (tableName: string) => {
  try {
    // First delete from master_tables
    const { error: masterError } = await supabase
      .from('master_tables')
      .delete()
      .eq('table_name', tableName);

    if (masterError) throw masterError;

    // Then drop the actual table using raw SQL query
    const { error } = await supabase.rpc('drop_table_safe', {
      table_name: tableName
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting table:', error);
    throw error;
  }
};

export const deleteRows = async (tableName: string, ids: (number | string)[]) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .in('id', ids);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting rows:', error);
    throw error;
  }
};

export const renameTable = async (oldName: string, newName: string) => {
  try {
    // First check if the new name already exists
    const exists = await checkTableExists(newName);
    if (exists) {
      throw new Error(`A table named "${newName}" already exists. Please choose a different name.`);
    }

    // Use the rename_table stored procedure
    const { error } = await supabase.rpc('rename_table', {
      old_table_name: oldName,
      new_table_name: newName
    });

    if (error) throw error;

    // Update the table name in master_tables
    const { error: masterError } = await supabase
      .from('master_tables')
      .update({ table_name: newName })
      .eq('table_name', oldName);

    if (masterError) throw masterError;

  } catch (error) {
    console.error('Error renaming table:', error);
     throw error;
  }
};
