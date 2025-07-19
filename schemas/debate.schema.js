// Raw JS validation for debate input

function isUuid(str) {
  // Simple UUID v4 regex
  return typeof str === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function validateDebateInput(input) {
  const errors = {};

  // id
  if (!isUuid(input.id)) {
    errors.id = "Invalid UUID format";
  }

  // title
  if (typeof input.title !== "string" || input.title.length < 10 || input.title.length > 100) {
    errors.title = "Title must be between 10 and 100 characters";
  }

  // description
  if (typeof input.description !== "string" || input.description.length < 20 || input.description.length > 500) {
    errors.description = "Description must be between 20 and 500 characters";
  }

  // category
  if (typeof input.category !== "string" || !input.category) {
    errors.category = "Category is required";
  }

  // tags
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.tags = "Tags must be an array";
    } else if (input.tags.length > 5) {
      errors.tags = "No more than 5 tags allowed";
    } else if (!input.tags.every(tag => typeof tag === "string")) {
      errors.tags = "All tags must be strings";
    }
  }

  // duration
  if (typeof input.duration !== "number" || isNaN(input.duration)) {
    errors.duration = "Duration must be a number";
  }

  // image
  if (input.image !== undefined && input.image !== null && input.image !== "") {
    if (typeof input.image !== "string" || !isUrl(input.image)) {
      errors.image = "Image must be a valid URL";
    }
  }

  // authorId
  if (typeof input.authorId !== "string" || !input.authorId) {
    errors.authorId = "AuthorId is required";
  }

  // createdAt
  if (!(input.createdAt instanceof Date) || isNaN(input.createdAt.getTime())) {
    errors.createdAt = "createdAt must be a valid Date";
  }

  // updatedAt (optional)
  if (input.updatedAt !== undefined && input.updatedAt !== null) {
    if (!(input.updatedAt instanceof Date) || isNaN(input.updatedAt.getTime())) {
      errors.updatedAt = "updatedAt must be a valid Date";
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
    data: Object.keys(errors).length === 0 ? input : null,
  };
}

// For create: validate input without id
function validateCreateDebateInput(input) {
  const errors = {};

  // title
  if (typeof input.title !== "string" || input.title.length < 10 || input.title.length > 100) {
    errors.title = "Title must be between 10 and 100 characters";
  }

  // description
  if (typeof input.description !== "string" || input.description.length < 20 || input.description.length > 500) {
    errors.description = "Description must be between 20 and 500 characters";
  }

  // category
  if (typeof input.category !== "string" || !input.category) {
    errors.category = "Category is required";
  }

  // tags
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.tags = "Tags must be an array";
    } else if (input.tags.length > 5) {
      errors.tags = "No more than 5 tags allowed";
    } else if (!input.tags.every(tag => typeof tag === "string")) {
      errors.tags = "All tags must be strings";
    }
  }

  // duration
  if (typeof input.duration !== "number" || isNaN(input.duration)) {
    errors.duration = "Duration must be a number";
  }

  // image
  if (input.image !== undefined && input.image !== null && input.image !== "") {
    if (typeof input.image !== "string" || !isUrl(input.image)) {
      errors.image = "Image must be a valid URL";
    }
  }

  // authorId
  if (typeof input.authorId !== "string" || !input.authorId) {
    errors.authorId = "AuthorId is required";
  }

  // createdAt
  if (!(input.createdAt instanceof Date) || isNaN(input.createdAt.getTime())) {
    errors.createdAt = "createdAt must be a valid Date";
  }

  // updatedAt (optional)
  if (input.updatedAt !== undefined && input.updatedAt !== null) {
    if (!(input.updatedAt instanceof Date) || isNaN(input.updatedAt.getTime())) {
      errors.updatedAt = "updatedAt must be a valid Date";
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
    data: Object.keys(errors).length === 0 ? input : null,
  };
}

// For update: allow partial fields
function validateUpdateDebateInput(input) {
  const errors = {};

  // Only validate fields if they exist in input
  if (input.title !== undefined) {
    if (typeof input.title !== "string" || input.title.length < 10 || input.title.length > 100) {
      errors.title = "Title must be between 10 and 100 characters";
    }
  }
  if (input.description !== undefined) {
    if (typeof input.description !== "string" || input.description.length < 20 || input.description.length > 500) {
      errors.description = "Description must be between 20 and 500 characters";
    }
  }
  if (input.category !== undefined) {
    if (typeof input.category !== "string" || !input.category) {
      errors.category = "Category is required";
    }
  }
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.tags = "Tags must be an array";
    } else if (input.tags.length > 5) {
      errors.tags = "No more than 5 tags allowed";
    } else if (!input.tags.every(tag => typeof tag === "string")) {
      errors.tags = "All tags must be strings";
    }
  }
  if (input.duration !== undefined) {
    if (typeof input.duration !== "number" || isNaN(input.duration)) {
      errors.duration = "Duration must be a number";
    }
  }
  if (input.image !== undefined && input.image !== null && input.image !== "") {
    if (typeof input.image !== "string" || !isUrl(input.image)) {
      errors.image = "Image must be a valid URL";
    }
  }
  if (input.authorId !== undefined) {
    if (typeof input.authorId !== "string" || !input.authorId) {
      errors.authorId = "AuthorId is required";
    }
  }
  if (input.createdAt !== undefined) {
    if (!(input.createdAt instanceof Date) || isNaN(input.createdAt.getTime())) {
      errors.createdAt = "createdAt must be a valid Date";
    }
  }
  if (input.updatedAt !== undefined && input.updatedAt !== null) {
    if (!(input.updatedAt instanceof Date) || isNaN(input.updatedAt.getTime())) {
      errors.updatedAt = "updatedAt must be a valid Date";
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
    data: Object.keys(errors).length === 0 ? input : null,
  };
}

export const debateSchema = validateDebateInput;
export const createDebateSchema = validateCreateDebateInput;
export const updateDebateSchema = validateUpdateDebateInput;
