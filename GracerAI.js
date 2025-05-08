class GracerAI {
  constructor(config = {}) {
    this.apiKey = config.apiKey || '';
    this.host = config.host || window.location.origin;
    this.version = '1.0.0';

    // AI API
    this.ai = {
      chat: async (messages, options = {}) => {
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
        return this._callAPI(`/api/user?username=${username}`);
      },
      login: async (username, password) => {
        return this._callAPI('/api/user', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });
      },
      getActivity: async (username, options = {}) => {
        const params = new URLSearchParams(options);
        return this._callAPI(`/api/user/${username}/activity?${params}`);
      },
      logActivity: async (username, activityType, description) => {
        return this._callAPI(`/api/user/${username}/activity`, {
          method: 'POST',
          body: JSON.stringify({ activity_type: activityType, description })
        });
      }
    };

    // File Manager API
    this.fileManager = {
      listFiles: async (username, options = {}) => {
        const params = new URLSearchParams({
          username,
          ...options
        });
        return this._callAPI(`/api/file-manager?${params}`);
      },
      uploadFile: async (username, file, path = '/') => {
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
        const params = new URLSearchParams({
          username,
          path: filePath
        });
        return this._callAPI(`/api/file-manager/download?${params}`);
      },
      removeFile: async (username, filePath) => {
        const params = new URLSearchParams({
          username,
          path: filePath
        });
        return this._callAPI(`/api/file-manager/remove?${params}`, {
          method: 'DELETE'
        });
      },
      createFolder: async (username, folderName, parentPath = '/') => {
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
        return this._callAPI('/api/file-manager/share', {
          method: 'POST',
          body: JSON.stringify({ fileName })
        });
      },
      getSharedFile: async (code, data, metadata = false) => {
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