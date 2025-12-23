export const HTTP_RESPONSE = {
  SUCCESS: {
    STATUS: {
        OK: 200,
        CREATED: 201
    },
    MESSAGE: {
    OK: "success",
    USER_CREATED: "user created successfully",
    USER_UPDATED: "user updated successfully",
    USER_DELETED: "user deleted successfully",
    BOOK_CREATED: "book created successfully",
    BOOK_UPDATED: "book updated successfully",
    BOOK_DELETED: "book deleted successfully"
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
    },
    DB:{
    P2025:"Record not found",
    P2002: "Unique constraint failed",
    P2003: "Foreign key constraint failed"
    }
  },
} ;