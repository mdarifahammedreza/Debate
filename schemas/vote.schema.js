// Raw JS validation for vote input

function isCuid(str) {
  return typeof str === "string" && /^c[^\s-]{8,}$/i.test(str);
}

function validateVoteInput(input) {
  const errors = {};

  // Validate argumentId
  if (!isCuid(input.argumentId)) {
    errors.argumentId = "Invalid CUID format for argumentId";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
    data: Object.keys(errors).length === 0 ? input : null,
  };
}
