# Security Policy

## Supported Versions

Currently supported versions of Fluid PWA:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

**⚠️ Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it privately:

### How to Report

1. **Email**: Send details to [harshalmore2468@gmail.com](mailto:harshalmore2468@gmail.com)
2. **Subject Line**: "SECURITY: [Brief Description]"
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release cycle
- **Credit**: We'll credit reporters in CHANGELOG (unless you prefer anonymity)

---

## Security Best Practices

### 1. Input Validation and Sanitization

**Always validate and sanitize user input before storing in IndexedDB:**

```typescript
import DOMPurify from 'dompurify';

const addNote = useAddItem<Note>('notes', {
  onBeforeAdd: (item) => {
    return {
      ...item,
      title: DOMPurify.sanitize(item.title || ''),
      content: DOMPurify.sanitize(item.content || '')
    };
  }
});
```

**Install DOMPurify**:
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### 2. Content Security Policy (CSP)

Fluid PWA includes strong CSP headers by default. Customize if needed:

```typescript
// next.config.ts
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Adjust as needed
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://your-api.com", // Add your API domains
  ].join('; ')
}
```

### 3. Authentication & Authorization

**Never store sensitive authentication tokens in IndexedDB without encryption:**

```typescript
// ❌ BAD - Plaintext tokens
await db.createItem('auth', {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  refreshToken: 'refresh_token_here'
});

// ✅ GOOD - Use encrypted storage or session storage
// Option 1: Session storage (cleared on tab close)
sessionStorage.setItem('token', token);

// Option 2: Encrypted IndexedDB (future Fluid PWA feature)
// Or use a library like crypto-js
import CryptoJS from 'crypto-js';

const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
await db.createItem('auth', { encryptedToken });
```

### 4. HTTPS Only

**Always use HTTPS in production:**

```typescript
// Enforce HTTPS
if (process.env.NODE_ENV === 'production' && window.location.protocol !== 'https:') {
  window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
}
```

### 5. Secure Service Worker

**Validate requests in your service worker:**

```javascript
// sw.js
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Validate request method
  if (!['GET', 'POST'].includes(event.request.method)) {
    return;
  }

  // Continue with caching strategy
  event.respondWith(/* ... */);
});
```

### 6. User Permissions

**Request permissions explicitly:**

```typescript
// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted');
    }
  }
}

// Don't auto-request - wait for user action
<button onClick={requestNotificationPermission}>
  Enable Notifications
</button>
```

### 7. Data Encryption (Optional)

For highly sensitive data, implement client-side encryption:

```typescript
import CryptoJS from 'crypto-js';

const encryptData = (data: any, key: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

const decryptData = (encrypted: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Usage
const addEncryptedNote = useAddItem<Note>('notes', {
  onBeforeAdd: (item) => {
    return {
      ...item,
      content: encryptData(item.content, userKey)
    };
  }
});
```

### 8. XSS Prevention

**Escape output when rendering user content:**

```typescript
// ❌ BAD - Dangerously set HTML
<div dangerouslySetInnerHTML={{ __html: note.content }} />

// ✅ GOOD - Sanitize first
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(note.content)
}} />

// ✅ BETTER - Use text content when possible
<div>{note.content}</div>
```

### 9. Rate Limiting

**Implement client-side rate limiting:**

```typescript
class RateLimiter {
  private attempts: number[] = [];
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 10, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canProceed(): boolean {
    const now = Date.now();
    this.attempts = this.attempts.filter(time => now - time < this.windowMs);

    if (this.attempts.length >= this.maxAttempts) {
      return false;
    }

    this.attempts.push(now);
    return true;
  }
}

const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

const addNote = async () => {
  if (!rateLimiter.canProceed()) {
    alert('Too many requests. Please wait.');
    return;
  }

  // Proceed with adding
};
```

### 10. Audit Dependencies

**Regularly audit for vulnerabilities:**

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# For breaking changes
npm audit fix --force
```

### 11. Secure Sync Endpoints

**Always authenticate API requests:**

```typescript
async function syncToServer(item: any) {
  const token = getAuthToken(); // Retrieve securely

  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-CSRF-Token': getCsrfToken()
    },
    body: JSON.stringify(item)
  });

  if (!response.ok) {
    throw new Error('Sync failed');
  }
}
```

### 12. Error Handling

**Don't expose sensitive information in errors:**

```typescript
// ❌ BAD - Exposes internal details
catch (error) {
  console.error('Database error:', error);
  alert(`Error: ${error.message}`);
}

// ✅ GOOD - Generic user message, log details server-side
catch (error) {
  console.error('Error occurred:', error.code); // Log error code only
  alert('An error occurred. Please try again.');

  // Send to error tracking (Sentry, etc.)
  if (process.env.NODE_ENV === 'production') {
    reportError(error);
  }
}
```

---

## Security Checklist

Use this checklist for your Fluid PWA application:

### Development
- [ ] All user inputs are validated and sanitized
- [ ] XSS prevention measures in place
- [ ] CSP headers configured
- [ ] HTTPS enforced in production
- [ ] Service Worker validates requests
- [ ] Dependencies regularly audited
- [ ] Error messages don't expose sensitive info

### Data Storage
- [ ] Sensitive data encrypted before storage
- [ ] No plaintext passwords or tokens
- [ ] User data isolated (userId field used)
- [ ] Data retention policy implemented
- [ ] Old data cleaned up regularly

### Authentication
- [ ] Secure token storage
- [ ] Refresh token rotation
- [ ] Session timeout implemented
- [ ] Logout clears local data
- [ ] Multi-factor authentication (if applicable)

### PWA Features
- [ ] Permissions requested explicitly
- [ ] Service Worker only caches safe content
- [ ] Install prompt not intrusive
- [ ] Push notifications require opt-in

### Production
- [ ] Security headers enabled
- [ ] HTTPS certificate valid
- [ ] Subresource Integrity (SRI) for CDN scripts
- [ ] Rate limiting on sync endpoints
- [ ] Regular security audits
- [ ] Incident response plan in place

---

## Known Security Considerations

### 1. IndexedDB Access

IndexedDB is accessible to:
- The same origin (domain, protocol, port)
- JavaScript running in the same context
- Browser extensions (with appropriate permissions)

**Mitigation**: Use encryption for sensitive data.

### 2. Service Worker Scope

Service Workers can intercept network requests.

**Mitigation**: Only register trusted service workers from your origin.

### 3. Client-Side Storage Limits

Users can inspect and modify IndexedDB.

**Mitigation**:
- Validate data on the server
- Use sync status to detect tampering
- Implement checksums for critical data

---

## Security Updates

We take security seriously. Security patches are released as soon as possible:

- **Critical vulnerabilities**: Patch within 24-72 hours
- **High severity**: Patch within 1 week
- **Medium severity**: Patch in next minor release
- **Low severity**: Patch in next major release

Subscribe to releases on GitHub to get notified.

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web.dev Security](https://web.dev/secure/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [PWA Security Best Practices](https://web.dev/pwa-checklist/)

---

## Contact

For security concerns:
- Email: [harshalmore2468@gmail.com](mailto:harshalmore2468@gmail.com)
- GitHub Security Advisories: [Private Reporting](https://github.com/harshalmore31/fluid-pwa/security/advisories/new)

Thank you for helping keep Fluid PWA secure!
