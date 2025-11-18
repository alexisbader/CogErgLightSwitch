/**
 * Latin Square counterbalancing for 3 conditions (Design A, B, C)
 * 
 * Each group (A, B, C) has 6 participants with the following Latin Square:
 * 
 * Participant → Design Order:
 * A1: 1, 2, 3 (Design A, B, C)
 * A2: 3, 1, 2 (Design C, A, B)
 * A3: 2, 3, 1 (Design B, C, A)
 * A4: 1, 3, 2 (Design A, C, B)
 * A5: 2, 1, 3 (Design B, A, C)
 * A6: 3, 2, 1 (Design C, B, A)
 * 
 * Same pattern applies to groups B and C
 */

/**
 * Get the condition order for a given participant ID
 * @param {string} participantId - Participant ID (e.g., "A1", "A2", "B1", "C6", etc.)
 * @returns {Array<number>} - Array of condition indices in order (0-2 for the 3 designs)
 */
export const getConditionOrderForParticipant = (participantId) => {
  if (!participantId) {
    return [0, 1, 2]; // Default order if no participant ID
  }
  
  const idUpper = participantId.toUpperCase().trim();
  
  // Extract participant number (1-6) from ID (e.g., "A1" -> 1, "B2" -> 2)
  const match = idUpper.match(/[A-Z](\d+)/);
  const participantNumber = match ? parseInt(match[1], 10) : 1;
  
  // Latin Square mapping for 6 participants across 3 conditions
  // Maps participant number (1-6) to array of condition indices (0-2)
  const latinSquare = {
    1: [0, 1, 2], // A, B, C
    2: [2, 0, 1], // C, A, B
    3: [1, 2, 0], // B, C, A
    4: [0, 2, 1], // A, C, B
    5: [1, 0, 2], // B, A, C
    6: [2, 1, 0]  // C, B, A
  };
  
  // Default to first order if participant number is out of range
  return latinSquare[participantNumber] || latinSquare[1];
};

/**
 * Get the group letter from a participant ID
 * @param {string} participantId - Participant ID (e.g., "A1", "B2", etc.)
 * @returns {string} - Group letter (A, B, or C)
 */
export const getGroupFromParticipantId = (participantId) => {
  if (!participantId) {
    return '';
  }
  
  const idUpper = participantId.toUpperCase().trim();
  const match = idUpper.match(/^([A-Z])/);
  return match ? match[1] : '';
};

/**
 * Legacy function for backwards compatibility
 * Get the condition order for a given group (now uses participant ID)
 * @param {string} group - Group letter or participant ID (A, B, C, or A1, A2, etc.)
 * @returns {Array<number>} - Array of condition indices in order (0-2)
 * @deprecated Use getConditionOrderForParticipant instead
 */
export const getConditionOrderForGroup = (group) => {
  // If it's just a letter (A, B, C), treat as A1, B1, C1
  const groupUpper = group.toUpperCase().trim();
  if (/^[A-Z]$/.test(groupUpper)) {
    return getConditionOrderForParticipant(groupUpper + '1');
  }
  // Otherwise treat as participant ID
  return getConditionOrderForParticipant(group);
};

