const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function req<T>(method: string, path: string, body?: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Products ──────────────────────────────────────────────────────────────────
export const adminProductApi = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return req<any>('GET', `/api/admin/products${q}`);
  },
  get: (item_id: string) => req<any>('GET', `/api/products/${item_id}`),
  update: (item_id: string, data: any) => req<any>('PUT', `/api/admin/products/${item_id}`, data),
  create: (data: any) => req<any>('POST', `/api/admin/products`, data),

  // S3 image upload flow
  getUploadUrl: (item_id: string, filename: string, contentType: string) =>
    req<{ data: { uploadUrl: string; s3Key: string } }>('POST', `/api/admin/products/${item_id}/upload-url`, { filename, contentType }),
  confirmUpload: (item_id: string, s3Key: string) =>
    req<any>('POST', `/api/admin/products/${item_id}/confirm-upload`, { s3Key }),

  uploadImageDirect: async (item_id: string, file: File) => {
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${item_id}-${Date.now()}.${ext}`;
    const { data } = await adminProductApi.getUploadUrl(item_id, filename, file.type);
    await fetch(data.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
    return adminProductApi.confirmUpload(item_id, data.s3Key);
  },
};

// ── Categories ────────────────────────────────────────────────────────────────
export const adminCategoryApi = {
  list: () => req<any>('GET', '/api/admin/categories/with-subcategories'),
  create: (data: any) => req<any>('POST', '/api/admin/categories', data),
  update: (id: string, data: any) => req<any>('PUT', `/api/admin/categories/${id}`, data),
  delete: (id: string) => req<any>('DELETE', `/api/admin/categories/${id}`),
  createSub: (data: any) => req<any>('POST', '/api/admin/subcategories', data),
  updateSub: (id: string, data: any) => req<any>('PUT', `/api/admin/subcategories/${id}`, data),
  deleteSub: (id: string) => req<any>('DELETE', `/api/admin/subcategories/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const adminOrderApi = {
  list: () => req<any>('GET', '/api/contact/orders'),
  get: (id: string) => req<any>('GET', `/api/contact/orders/${id}`),
};
