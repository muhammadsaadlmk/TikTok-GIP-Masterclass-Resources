import { z } from 'zod';
import { insertAppSchema, apps, stats } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  apps: {
    list: {
      method: 'GET' as const,
      path: '/api/apps' as const,
      responses: {
        200: z.array(z.custom<typeof apps.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/apps/:id' as const,
      responses: {
        200: z.custom<typeof apps.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/apps' as const,
      input: insertAppSchema,
      responses: {
        201: z.custom<typeof apps.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/apps/:id' as const,
      input: insertAppSchema.partial(),
      responses: {
        200: z.custom<typeof apps.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/apps/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    incrementDownload: {
      method: 'POST' as const,
      path: '/api/apps/:id/download' as const,
      responses: {
        200: z.custom<typeof apps.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  stats: {
    get: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      responses: {
        200: z.object({ visitorCount: z.number(), totalDownloads: z.number() }),
      }
    },
    incrementVisitor: {
      method: 'POST' as const,
      path: '/api/stats/visitor' as const,
      responses: {
        200: z.object({ visitorCount: z.number() }),
      }
    }
  },
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ message: z.string() }),
        401: errorSchemas.unauthorized,
      }
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: {
        200: z.object({ message: z.string() }),
      }
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.object({ username: z.string() }),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
