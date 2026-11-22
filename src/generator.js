const toolkit = require("string-toolkit-simple-pratiksh");
const { adjectives, nouns, shortWords, techWords, gamingWords } = require("./wordLists");

/**
 * Get random item from an array
 */
function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a random number string of exact length
 */
function randomNumberString(length) {
  if (length <= 0) return "";
  let res = "";
  for (let i = 0; i < length; i++) {
    res += Math.floor(Math.random() * 10).toString();
  }
  return res;
}

/**
 * Apply formatting style using string-toolkit-simple-pratiksh utilities
 */
function applyStyle(rawText, style = "camelCase") {
  const cleaned = toolkit.removeExtraSpaces(rawText);

  switch (style) {
    case "camelCase":
      return toolkit.toCamelCase(cleaned);
    case "snake_case":
      return toolkit.toSnakeCase(cleaned);
    case "kebab-case":
      return toolkit.toKebabCase(cleaned);
    case "pascal":
    case "PascalCase":
      return toolkit.capitalizeWords(cleaned).split(" ").join("");
    case "uppercase":
      return cleaned.toUpperCase().replace(/\s+/g, "");
    case "lowercase":
    default:
      return cleaned.toLowerCase().replace(/\s+/g, "");
  }
}

/**
 * Pad a string to exact target length using alphanumeric characters or numbers
 */
function padToLength(str, targetLength, style = "camelCase") {
  const diff = targetLength - str.length;
  if (diff <= 0) return str;

  if (diff >= 2 && style === "snake_case" && !str.endsWith("_")) {
    return str + "_" + randomNumberString(diff - 1);
  }
  if (diff >= 2 && style === "kebab-case" && !str.endsWith("-")) {
    return str + "-" + randomNumberString(diff - 1);
  }

  return str + randomNumberString(diff);
}

/**
 * Generate a single username with exact specified length
 *
 * @param {Object} options
 * @param {number} [options.length=8] - Target exact length (3 to 30)
 * @param {string} [options.style='camelCase'] - camelCase | snake_case | kebab-case | pascal | lowercase | uppercase
 * @param {string} [options.category='all'] - all | gaming | tech
 * @param {string} [options.seed=''] - Optional base word or keyword to incorporate
 * @param {boolean} [options.includeNumbers=true] - Whether to allow numbers
 * @returns {string} - Formatted username with length === options.length
 */
function generateUsername(options = {}) {
  const targetLength = Math.max(3, Math.min(30, parseInt(options.length, 10) || 8));
  const style = options.style || "camelCase";
  const category = options.category || "all";
  const includeNumbers = options.includeNumbers !== false;
  let seed = options.seed ? toolkit.removeExtraSpaces(options.seed) : "";

  // Sanitize seed if present
  if (!toolkit.isBlank(seed)) {
    seed = toolkit.slugify(seed).replace(/-/g, " ");
  } else {
    seed = "";
  }

  // Select word pool based on category
  let primaryPool = adjectives;
  let secondaryPool = nouns;

  if (category === "tech") {
    secondaryPool = techWords;
  } else if (category === "gaming") {
    secondaryPool = gamingWords;
  }

  // If user provided a seed that is already >= targetLength, truncate to exact length
  if (seed && seed.replace(/\s+/g, "").length >= targetLength) {
    const formatted = applyStyle(seed, style);
    return toolkit.truncate(formatted, targetLength, "");
  }

  const candidates = [];

  // Try multiple random assemblies to find exact matches
  for (let attempt = 0; attempt < 60; attempt++) {
    let words = [];

    if (seed) {
      words.push(seed);
      if (targetLength > seed.length + 8) {
        words.push(sample(primaryPool));
        words.push(sample(secondaryPool));
      } else if (targetLength > seed.length + 3) {
        words.push(sample(targetLength < 10 ? shortWords : secondaryPool));
      } else if (targetLength > seed.length) {
        words.push(sample(shortWords));
      }
    } else {
      if (targetLength <= 4) {
        words.push(sample(shortWords));
      } else if (targetLength <= 7) {
        words.push(Math.random() > 0.5 ? sample(shortWords) : sample(primaryPool));
        if (Math.random() > 0.4) words.push(sample(shortWords));
      } else if (targetLength <= 14) {
        words.push(sample(primaryPool));
        words.push(sample(secondaryPool));
      } else {
        // For longer usernames: 3 words combination
        words.push(sample(primaryPool));
        words.push(sample(primaryPool));
        words.push(sample(secondaryPool));
      }
    }

    const combinedWords = words.join(" ");
    const formatted = applyStyle(combinedWords, style);

    // Exact match found!
    if (formatted.length === targetLength) {
      return formatted;
    }

    // Check if adding numbers hits exact length
    if (formatted.length < targetLength) {
      const diff = targetLength - formatted.length;
      if (includeNumbers) {
        const padded = padToLength(formatted, targetLength, style);
        if (padded.length === targetLength) {
          candidates.push(padded);
        }
      }
    } else if (formatted.length > targetLength) {
      // Use toolkit.truncate to cleanly trim to exact target length
      const truncated = toolkit.truncate(formatted, targetLength, "");
      if (truncated.length === targetLength) {
        candidates.push(truncated);
      }
    }
  }

  if (candidates.length > 0) {
    return sample(candidates);
  }

  // Fallback guarantee: construct base + pad or truncate using toolkit
  const fallbackBase = seed ? applyStyle(seed, style) : applyStyle(sample(primaryPool) + " " + sample(secondaryPool), style);
  if (fallbackBase.length < targetLength) {
    return padToLength(fallbackBase, targetLength, style);
  }
  return toolkit.truncate(fallbackBase, targetLength, "");
}

/**
 * Generate multiple unique usernames of specified length
 */
function generateUsernames(options = {}, count = 5) {
  const targetLength = Math.max(3, Math.min(30, parseInt(options.length, 10) || 8));
  const targetCount = Math.max(1, Math.min(50, parseInt(count, 10) || 5));
  const results = new Set();
  let maxRetries = targetCount * 30;

  while (results.size < targetCount && maxRetries > 0) {
    maxRetries--;
    const username = generateUsername({ ...options, length: targetLength });
    if (username.length === targetLength) {
      results.add(username);
    }
  }

  // If we couldn't get enough unique usernames, pad with numbered variations
  let fallbackIndex = 1;
  while (results.size < targetCount) {
    const raw = generateUsername({ ...options, length: targetLength });
    results.add(raw + fallbackIndex++);
  }

  return Array.from(results).slice(0, targetCount).map(u => {
    if (u.length === targetLength) return u;
    if (u.length > targetLength) return toolkit.truncate(u, targetLength, "");
    return padToLength(u, targetLength, options.style || "camelCase");
  });
}

module.exports = {
  generateUsername,
  generateUsernames,
  applyStyle,
  toolkit
};
