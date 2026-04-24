export const supabaseAdmin = new Proxy({} as any, {
  get() {
    throw new Error('Supabase admin client has been removed from this build.');
  },
});
