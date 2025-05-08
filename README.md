# GracerAI SDK

SDK สำหรับเรียกใช้ API ของ GracerAI ในรูปแบบ JavaScript

## การติดตั้ง

### 1. ติดตั้งผ่าน CDN

```html
<script src="https://raw.githubusercontent.com/iamapinan/gracerai-sdk/refs/heads/main/GracerAI.js"></script>
```

### 2. ติดตั้งผ่าน NPM

```bash
npm install gracerai-sdk
```

## การใช้งาน

### 1. การกำหนดค่าเริ่มต้น

```javascript
// กำหนดค่าเริ่มต้น
const gracerai = new GracerAI({
  apiKey: 'your-api-key',
  host: 'https://your-domain.com' // ไม่จำเป็นต้องกำหนดถ้าใช้ในเว็บไซต์เดียวกัน
});
```

### 2. การใช้งาน AI API

```javascript
// ส่งข้อความไปยัง AI
const response = await gracerai.ai.chat([
  { role: 'user', content: 'สวัสดี' }
], {
  temperature: 0.7,
  maxTokens: 1000
});

// ตรวจสอบสถานะ AI
const status = await gracerai.ai.status();
```

### 3. การใช้งาน User API

```javascript
// ดูข้อมูลผู้ใช้
const profile = await gracerai.user.getProfile('username');

// เข้าสู่ระบบ
const login = await gracerai.user.login('username', 'password');

// ดูกิจกรรมของผู้ใช้
const activities = await gracerai.user.getActivity('username', {
  limit: 10,
  offset: 0
});

// บันทึกกิจกรรม
await gracerai.user.logActivity('username', 'login', 'User logged in');
```

### 4. การใช้งาน File Manager API

```javascript
// ดูรายการไฟล์
const files = await gracerai.fileManager.listFiles('username', {
  path: '/',
  search: 'document'
});

// อัพโหลดไฟล์
const file = document.querySelector('input[type="file"]').files[0];
const upload = await gracerai.fileManager.uploadFile('username', file, '/documents');

// ดาวน์โหลดไฟล์
const download = await gracerai.fileManager.downloadFile('username', '/documents/file.pdf');

// ลบไฟล์
await gracerai.fileManager.removeFile('username', '/documents/file.pdf');

// สร้างโฟลเดอร์
await gracerai.fileManager.createFolder('username', 'new-folder', '/documents');

// แชร์ไฟล์
const share = await gracerai.fileManager.shareFile('/documents/file.pdf');

// เข้าถึงลิงก์แชร์
const sharedFile = await gracerai.fileManager.getSharedFile('share-code', 'encrypted-data', true);
```

## Rate Limiting

- AI API: 60 requests ต่อนาที
- User API: 60 requests ต่อนาที
- File Manager API:
  - List Files: 100 requests ต่อนาที
  - Upload File: 10 requests ต่อนาที
  - Download File: 50 requests ต่อนาที
  - Remove File: 50 requests ต่อนาที
  - Create Folder: 50 requests ต่อนาที
  - Share File: 50 requests ต่อนาที

## Error Handling

SDK จะ throw error เมื่อเกิดข้อผิดพลาดในการเรียก API โดยมีรูปแบบดังนี้:

```javascript
try {
  await gracerai.ai.chat([{ role: 'user', content: 'Hello' }]);
} catch (error) {
  console.error(error.message); // ข้อความแสดงข้อผิดพลาด
}
```

## หมายเหตุ

- ต้องมีการกำหนด API Key ก่อนใช้งาน
- ต้องมีการยืนยันตัวตนก่อนใช้งาน API
- ควรจัดการ error handling อย่างเหมาะสม
- ควรคำนึงถึง rate limiting ในการใช้งาน 