class GracerAI {
  constructor(config = {}) {
    this.apiKey = config.apiKey || '';
    this.host = config.host || window.location.origin;
    this.version = '1.0.2';

    // Validation methods
    this._validateConfig = () => {
      if (!this.apiKey) {
        throw new Error('API key is required');
      }
      if (!this.host) {
        throw new Error('Host is required');
      }
    };

    this._validateUsername = (username) => {
      if (!username || typeof username !== 'string') {
        throw new Error('Username is required and must be a string');
      }
    };

    this._validateMessages = (messages) => {
      if (!Array.isArray(messages)) {
        throw new Error('Messages must be an array');
      }
      if (messages.length === 0) {
        throw new Error('Messages array cannot be empty');
      }
    };

    this._validateFile = (file) => {
      if (!file || !(file instanceof File)) {
        throw new Error('File must be a valid File object');
      }
    };

    this._validatePath = (path) => {
      if (typeof path !== 'string') {
        throw new Error('Path must be a string');
      }
      if (!path.startsWith('/')) {
        throw new Error('Path must start with /');
      }
    };

    // AI API
    this.ai = {
      chat: async (messages, options = {}) => {
        this._validateMessages(messages);
        return this._callAPI('/api/ai', {
          method: 'POST',
          body: JSON.stringify({
            messages,
            ...options
          })
        });
      },
      status: async () => {
        return this._callAPI('/api/ai');
      }
    };

    // User API
    this.user = {
      getProfile: async (username) => {
        this._validateUsername(username);
        return this._callAPI(`/api/user?username=${username}`);
      },
      login: async (username, password) => {
        this._validateUsername(username);
        if (!password || typeof password !== 'string') {
          throw new Error('Password is required and must be a string');
        }
        return this._callAPI('/api/user', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
      },
      getActivity: async (username, options = {}) => {
        this._validateUsername(username);
        const params = new URLSearchParams(options);
        return this._callAPI(`/api/user/${username}/activity?${params}`);
      },
      logActivity: async (username, activityType, description) => {
        this._validateUsername(username);
        if (!activityType || typeof activityType !== 'string') {
          throw new Error('Activity type is required and must be a string');
        }
        if (!description || typeof description !== 'string') {
          throw new Error('Description is required and must be a string');
        }
        return this._callAPI(`/api/user/${username}/activity`, {
          method: 'POST',
          body: JSON.stringify({ activity_type: activityType, description })
        });
      }
    };

    // File Manager API
    this.fileManager = {
      listFiles: async (username, options = {}) => {
        this._validateUsername(username);
        const params = new URLSearchParams({
          username,
          ...options
        });
        return this._callAPI(`/api/file-manager?${params}`);
      },
      uploadFile: async (username, file, path = '/') => {
        this._validateUsername(username);
        this._validateFile(file);
        this._validatePath(path);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        formData.append('username', username);

        return this._callAPI('/api/file-manager/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: formData
        });
      },
      downloadFile: async (username, filePath) => {
        this._validateUsername(username);
        this._validatePath(filePath);
        const params = new URLSearchParams({
          username,
          path: filePath
        });
        return this._callAPI(`/api/file-manager/download?${params}`);
      },
      removeFile: async (username, filePath) => {
        this._validateUsername(username);
        this._validatePath(filePath);
        const params = new URLSearchParams({
          username,
          path: filePath
        });
        return this._callAPI(`/api/file-manager/remove?${params}`, {
          method: 'DELETE'
        });
      },
      createFolder: async (username, folderName, parentPath = '/') => {
        this._validateUsername(username);
        if (!folderName || typeof folderName !== 'string') {
          throw new Error('Folder name is required and must be a string');
        }
        this._validatePath(parentPath);
        return this._callAPI('/api/file-manager/create-folder', {
          method: 'POST',
          body: JSON.stringify({
            username,
            folderName,
            parentPath
          })
        });
      },
      shareFile: async (fileName) => {
        if (!fileName || typeof fileName !== 'string') {
          throw new Error('File name is required and must be a string');
        }
        return this._callAPI('/api/file-manager/share', {
          method: 'POST',
          body: JSON.stringify({ fileName })
        });
      },
      getSharedFile: async (code, data, metadata = false) => {
        if (!code || typeof code !== 'string') {
          throw new Error('Code is required and must be a string');
        }
        if (!data || typeof data !== 'string') {
          throw new Error('Data is required and must be a string');
        }
        const params = new URLSearchParams({
          code,
          data,
          metadata: metadata.toString()
        });
        return this._callAPI(`/api/file-manager/share?${params}`);
      }
    };
  }

  // ฟังก์ชันสำหรับเรียก API พื้นฐาน
  async _callAPI(endpoint, options = {}) {
    // Validate config before making API call
    this._validateConfig();

    const url = `${this.host}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API call failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

// Export SDK
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GracerAI;
} else {
  window.GracerAI = GracerAI;
} 