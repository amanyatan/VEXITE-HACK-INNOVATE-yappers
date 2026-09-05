'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type AuthUser = {
  email: string;
  name?: string;
};

export type SignUpResult = {
  user: AuthUser;
  requiresEmailConfirmation: boolean;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const raw = window.localStorage.getItem('yappers-auth-user');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      window.localStorage.removeItem('yappers-auth-user');
      return null;
    }
  });

  const persistUser = useCallback((nextUser: AuthUser | null) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (nextUser) {
      window.localStorage.setItem('yappers-auth-user', JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem('yappers-auth-user');
    }

    setUser(nextUser);
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    const syncUser = (authUser: { email?: string; user_metadata?: { full_name?: string } } | null) => {
      if (!mounted) {
        return;
      }

      if (!authUser?.email) {
        persistUser(null);
        return;
      }

      persistUser({
        email: authUser.email,
        name: authUser.user_metadata?.full_name ?? authUser.email.split('@')[0],
      });
    };

    void supabase.auth.getUser().then(({ data }) => syncUser(data.user));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [persistUser]);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
        if (error) throw error;
        const nextUser = {
          email: data.user?.email ?? normalizedEmail,
          name: data.user?.user_metadata?.full_name ?? normalizedEmail.split('@')[0],
        };
        persistUser(nextUser);
        return nextUser;
      }

      const nextUser = { email: normalizedEmail, name: normalizedEmail.split('@')[0] };
      persistUser(nextUser);
      return nextUser;
    },
    [persistUser],
  );

  const signUp = useCallback(
    async ({ email, password, fullName }: { email: string; password: string; fullName: string }): Promise<SignUpResult> => {
      const normalizedEmail = email.trim().toLowerCase();

      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        const nextUser = { email: data.user?.email ?? normalizedEmail, name: fullName || normalizedEmail.split('@')[0] };
        const requiresEmailConfirmation = Boolean(data.user && !data.session);

        if (data.session) {
          persistUser(nextUser);
        }

        return { user: nextUser, requiresEmailConfirmation };
      }

      const nextUser = { email: normalizedEmail, name: fullName || normalizedEmail.split('@')[0] };
      persistUser(nextUser);
      return { user: nextUser, requiresEmailConfirmation: false };
    },
    [persistUser],
  );

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    persistUser(null);
  }, [persistUser]);

  return { user, signIn, signUp, signOut };
}
