import { supabase, clearAuthData } from '../../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

export class AuthService {
  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static async signOut() {
    try {
      // First clear all auth data
      clearAuthData();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Force reload the page to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Error in signOut:', error);
      // Even if there's an error, try to clear local data
      clearAuthData();
      throw this.handleAuthError(error);
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        clearAuthData();
      }
      callback(session?.user ?? null);
    });
  }

  private static handleAuthError(error: unknown): Error {
    if (this.isAuthError(error)) {
      switch (error.name) {
        case 'AuthSessionMissingError':
          return new Error('Your session has expired. Please sign in again.');
        case 'AuthApiError':
          return new Error(error.message);
        default:
          return new Error('An authentication error occurred. Please try again.');
      }
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }

  private static isAuthError(error: unknown): error is AuthError {
    return (
      typeof error === 'object' &&
      error !== null &&
      '__isAuthError' in error &&
      error.__isAuthError === true
    );
  }
}