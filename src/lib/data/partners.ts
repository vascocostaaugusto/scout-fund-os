// The partners who take first looks and own decisions. One list, used both
// to attribute the seeded history and to populate the decision-owner picker
// in the Fund Portal — so the names in the audit trail and the names you can
// act as can't drift apart.
export const PARTNERS = ["Phil", "Thomas", "Inês"] as const;

export type Partner = (typeof PARTNERS)[number];
