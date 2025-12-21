export const HTTP_RESPONSE = {
  SUCCESS: {
    STATUS: {
        OK: 200,
        CREATED: 201
    },
    MESSAGE: {
    OK: "success"
    }
  },

  ERROR: {
    STATUS: {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
    },
    MESSAGE: {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    INVALID_REQUEST: 'Invalid request data'
    }
  },
} ;