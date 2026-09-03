export const isDemoMode =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL === 'REPLACE_WITH_VALUE';
