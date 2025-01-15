const { syncJson } = require('../index');
const fs = require('fs');

// Mockeamos el módulo `fs`
jest.mock('fs');

describe('syncJson', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
  });

  it('should sync specified fields from source to target', () => {
    const sourceJson = JSON.stringify({ name: 'test', version: '1.0.0' });
    const targetJson = JSON.stringify({ name: 'old', description: 'outdated' });

    fs.existsSync.mockImplementation((path) => true); // Simula que los archivos existen
    fs.readFileSync.mockImplementation((path) =>
      path === 'source.json' ? sourceJson : targetJson
    );
    const writeMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    // Llama a la función que estamos probando
    syncJson('source.json', 'target.json', ['name', 'version'], { log: false });

    // Verifica que los cambios se escribieron correctamente
    const expectedData = {
      name: 'test',
      version: '1.0.0',
      description: 'outdated',
    };
    const receivedData = JSON.parse(writeMock.mock.calls[0][1]);

    expect(receivedData).toEqual(expectedData);
  });

  it('should skip fields not present in source', () => {
    const sourceJson = JSON.stringify({ name: 'test' });
    const targetJson = JSON.stringify({ description: 'outdated' });

    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation((path) =>
      path === 'source.json' ? sourceJson : targetJson
    );
    const writeMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    syncJson('source.json', 'target.json', ['name', 'version'], { log: false });

    const expectedData = { name: 'test', description: 'outdated' };
    const receivedData = JSON.parse(writeMock.mock.calls[0][1]);

    expect(receivedData).toEqual(expectedData);
  });

  it('should not overwrite existing fields in target if overwrite is false', () => {
    const sourceJson = JSON.stringify({ name: 'test', version: '1.0.0' });
    const targetJson = JSON.stringify({ name: 'old', description: 'outdated' });

    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation((path) =>
      path === 'source.json' ? sourceJson : targetJson
    );
    const writeMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    syncJson('source.json', 'target.json', ['name', 'version'], {
      log: false,
      overwrite: false,
    });

    const expectedData = {
      name: 'old',
      version: '1.0.0',
      description: 'outdated',
    };
    const receivedData = JSON.parse(writeMock.mock.calls[0][1]);

    expect(receivedData).toEqual(expectedData);
  });

  it('should throw an error if source file does not exist', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suprime console.error
    fs.existsSync.mockImplementation((path) => path !== 'sourde.json');
    expect(() => {
      syncJson('sourde.json', 'target.json', ['version', 'description']);
    }).toThrow('Source file not found: sourde.json');

    consoleErrorSpy.mockRestore(); // Restaura console.error
  });

  it('should apply transform function to synchronized fields', () => {
    const sourceJson = JSON.stringify({ name: 'test', version: '1.0.0' });
    const targetJson = JSON.stringify({});

    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation((path) =>
      path === 'source.json' ? sourceJson : targetJson
    );
    const writeMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    syncJson('source.json', 'target.json', ['name', 'version'], {
      log: false,
      transform: (key, value) => value.toUpperCase(),
    });

    const expectedData = { name: 'TEST', version: '1.0.0' };
    const receivedData = JSON.parse(writeMock.mock.calls[0][1]);

    expect(receivedData).toEqual(expectedData);
  });

  it('should do nothing if no fields are specified', () => {
    const sourceJson = JSON.stringify({ name: 'test', version: '1.0.0' });
    const targetJson = JSON.stringify({ description: 'outdated' });

    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation((path) =>
      path === 'source.json' ? sourceJson : targetJson
    );
    const writeMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    syncJson('source.json', 'target.json', [], { log: false });

    // Verifica que no se haya escrito nada
    expect(writeMock).not.toHaveBeenCalled();
  });

  it('should handle duplicate fields in the sync list gracefully', () => {
    const sourceJson = JSON.stringify({ name: 'test', version: '1.0.0' });
    const targetJson = JSON.stringify({ description: 'outdated' });

    fs.existsSync.mockImplementation(() => true);
    fs.readFileSync.mockImplementation((path) =>
      path === 'source.json' ? sourceJson : targetJson
    );
    const writeMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {});

    syncJson('source.json', 'target.json', ['name', 'name', 'version'], {
      log: false,
    });

    const expectedData = {
      name: 'test',
      version: '1.0.0',
      description: 'outdated',
    };
    const receivedData = JSON.parse(writeMock.mock.calls[0][1]);

    expect(receivedData).toEqual(expectedData);
  });
});
