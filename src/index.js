const fs = require('fs');
const path = require('path');

function isValidPath(filePath) {
  const resolvedPath = path.resolve(filePath);
  return resolvedPath.startsWith(process.cwd());
}

function syncJson(sourcePath, targetPath, fields, options = {}) {
  const defaultOptions = {
    transform: (key, value) => value,
    log: true,
    overwrite: true, // Permitir o no sobrescribir campos existentes en el destino
  };

  // Mezclamos las opciones proporcionadas con las opciones por defecto
  options = { ...defaultOptions, ...options };

  // Validar las rutas de archivos
  if (!isValidPath(sourcePath) || !isValidPath(targetPath)) {
    throw new Error('Invalid file path');
  }

  try {
    // Validar si los archivos existen
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`[ERR]  Source file not found: ${sourcePath}`);
    }
    if (!fs.existsSync(targetPath)) {
      throw new Error(`[ERR]  Target file not found: ${targetPath}`);
    }

    // Leer y parsear archivos JSON
    const source = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
    const target = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));

    // Log de inicio (opcional)
    if (options.log) {
      console.log(`[INF]  Starting sync from ${sourcePath} to ${targetPath}`);
    }

    // Verificar si fields está vacío
    if (fields.length === 0) {
      if (options.log) {
        console.log('[WRN]  No fields specified for sync. Exiting...');
      }
      return;
    }

    // Variables para seguimiento
    const syncedFields = [];
    const skippedFields = [];

    // Sincronizar campos
    fields.forEach((field) => {
      if (source[field] !== undefined) {
        if (options.overwrite || target[field] === undefined) {
          target[field] = options.transform(field, source[field]);
          syncedFields.push(field);
        } else {
          skippedFields.push(field);
        }
      } else {
        skippedFields.push(field);
      }
    });

    // Escribir el archivo actualizado
    fs.writeFileSync(targetPath, JSON.stringify(target, null, 2));

    // Log de resultados (opcional)
    if (options.log) {
      console.log(
        `[SCS]  Synchronized fields: ${syncedFields.join(', ') || 'None'}`
      );
      if (skippedFields.length > 0) {
        console.log(
          `[WRN]  Skipped fields (not found or overwrite disabled): ${skippedFields.join(', ')}`
        );
      }
      console.log(`[SCS]  Sync completed successfully!`);
    }
  } catch (error) {
    // Manejo de errores más limpio
    const errorMessage = `[ERR]  An error occurred during JSON sync:
  - Message: ${error.message}
  - Source: ${sourcePath}
  - Target: ${targetPath}`;

    console.error(errorMessage);

    if (options.log) {
      console.error('Stack trace:', error.stack);
    }

    throw error;
  }
}

module.exports = { syncJson };
