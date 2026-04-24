function disabledQuery() {
  const result = Promise.resolve({
    data: null,
    error: new Error('Supabase is not configured for this build.'),
  });

  let proxy: any;
  proxy = new Proxy(result, {
    get(target, prop) {
      if (prop === 'then' || prop === 'catch' || prop === 'finally') {
        return (target as any)[prop].bind(target);
      }
      return () => proxy;
    },
  });

  return proxy;
}

function createDisabledSupabaseClient() {
  return {
    from: () => disabledQuery(),
    rpc: () => disabledQuery(),
    storage: { from: () => disabledQuery() },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => undefined }) }),
      subscribe: () => ({ unsubscribe: () => undefined }),
    }),
    removeChannel: () => undefined,
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => undefined } },
      }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error('Supabase auth has been removed.'),
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: new Error('Supabase auth has been removed.'),
      }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
    },
  };
}

export const supabase = createDisabledSupabaseClient() as any;
