// schemas/argument.schema.js

function isCuid(str) {
  return typeof str === "string" && /^c[^\s-]{8,}$/i.test(str);
}

function validateArgumentInput(input) {
  const errors = {};

  // Validate content
  if (typeof input.content !== "string" || input.content.length < 5) {
    errors.content = "Content must be at least 5 characters";
  }

  // Validate side
  if (input.side !== "support" && input.side !== "oppose") {
    errors.side = "Side must be either 'support' or 'oppose'";
  }

  // Validate debateId
  if (!isCuid(input.debateId)) {
    errors.debateId = "Invalid CUID format";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
    data: Object.keys(errors).length === 0 ? input : null,
  };
}

const bannedWords = [
  // English (mild insults or inappropriate words)
  "stupid",
  "idiot",
  "dumb",
  "moron",
  "fool",
  "nonsense",
  "trash",
  "loser",

  // Bangla (commonly used as insults)
  "pagol",     // পাগল - often used offensively
  "boka",      // বোকা
  "chagol",    // ছাগল
  "gadha",     // গাধা
  "shala",     // শালা - considered offensive
  "haraam",    // হারাম - used in a rude context
  "kuttarbaccha", // কুকুরের বাচ্চা
  "kharap",    // খারাপ - used in insult context
];


export const argumentSchema = validateArgumentInput;
export const cuidString = isCuid;
export { bannedWords };

