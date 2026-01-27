// Below mappings are just to keep code compilation safe if they were used
// But ideally we should remove them eventually.
// PLACED -> PENDING
// PROCESSING -> PREPARING
// IN_ROUTE -> OUT_FOR_DELIVERY
// PREVIOUS_VALUE -> NEW_VALUE as per SQL

// Helper to keep old code working if needed, or we just change the enum.
// The user provided SQL defines:
// ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')
// So we must use exactly this set.
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
