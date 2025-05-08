// Mock fetch
global.fetch = jest.fn();

describe('GracerAI', () => {
  let sdk;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create new SDK instance
    sdk = new GracerAI({
      apiKey: 'test-api-key',
      host: 'https://test.com'
    });
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const defaultSdk = new GracerAI();
      expect(defaultSdk.apiKey).toBe('');
      expect(defaultSdk.host).toBe(window.location.origin);
    });

    it('should initialize with custom values', () => {
      expect(sdk.apiKey).toBe('test-api-key');
      expect(sdk.host).toBe('https://test.com');
    });
  });

  describe('AI API', () => {
    it('should send chat message', async () => {
      const mockResponse = {
        text: 'Hello',
        usage: { totalTokens: 10 },
        model: 'gpt-3.5-turbo'
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await sdk.ai.chat([
        { role: 'user', content: 'Hi' }
      ]);

      expect(fetch).toHaveBeenCalledWith(
        'https://test.com/api/ai',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key'
          }),
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'Hi' }]
          })
        })
      );
      expect(response).toEqual(mockResponse);
    });

    it('should check AI status', async () => {
      const mockResponse = {
        status: 'ok',
        model: 'gpt-3.5-turbo',
        version: '1.0.0'
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await sdk.ai.status();

      expect(fetch).toHaveBeenCalledWith(
        'https://test.com/api/ai',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key'
          })
        })
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('User API', () => {
    it('should get user profile', async () => {
      const mockResponse = {
        id: 1,
        username: 'test',
        email: 'test@test.com'
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await sdk.user.getProfile('test');

      expect(fetch).toHaveBeenCalledWith(
        'https://test.com/api/user?username=test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key'
          })
        })
      );
      expect(response).toEqual(mockResponse);
    });

    it('should login user', async () => {
      const mockResponse = {
        id: 1,
        username: 'test',
        token: 'test-token'
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await sdk.user.login('test', 'password');

      expect(fetch).toHaveBeenCalledWith(
        'https://test.com/api/user',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key'
          }),
          body: JSON.stringify({
            username: 'test',
            password: 'password'
          })
        })
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('File Manager API', () => {
    it('should list files', async () => {
      const mockResponse = [
        { name: 'file1.txt', type: 'file' },
        { name: 'folder1', type: 'folder' }
      ];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await sdk.fileManager.listFiles('test', {
        path: '/',
        search: 'file'
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://test.com/api/file-manager?username=test&path=%2F&search=file',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key'
          })
        })
      );
      expect(response).toEqual(mockResponse);
    });

    it('should upload file', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockResponse = {
        message: 'File uploaded successfully',
        file: {
          name: 'test.txt',
          path: '/test.txt'
        }
      };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const response = await sdk.fileManager.uploadFile('test', mockFile, '/');

      expect(fetch).toHaveBeenCalledWith(
        'https://test.com/api/file-manager/upload',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key'
          })
        })
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const mockError = {
        error: 'Invalid API key',
        code: 'INVALID_API_KEY',
        status: 401
      };
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve(mockError)
      });

      await expect(sdk.ai.chat([{ role: 'user', content: 'Hi' }]))
        .rejects
        .toThrow('Invalid API key');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(sdk.ai.chat([{ role: 'user', content: 'Hi' }]))
        .rejects
        .toThrow('Network error');
    });
  });
}); 