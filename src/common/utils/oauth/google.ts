import { google } from 'googleapis';
import { ENVIRONMENT } from '../../config/environment';

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

export class GoogleOAuthService {
  private static oauth2Client = new google.auth.OAuth2(
    ENVIRONMENT.GOOGLE.CLIENT_ID,
    ENVIRONMENT.GOOGLE.CLIENT_SECRET,
    ENVIRONMENT.GOOGLE.REDIRECT_URI
  );

  /**
   * Generate OAuth URL for Google login
   */
  static getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent' // Force consent to get refresh token
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  static async getTokens(code: string): Promise<GoogleTokens> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        throw new Error('Failed to get access token from Google');
      }

      return {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || undefined,
        scope: tokens.scope || '',
        token_type: tokens.token_type || 'Bearer',
        expiry_date: tokens.expiry_date || undefined
      };
    } catch (error) {
      throw new Error(`Failed to exchange code for tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user information from Google
   */
  static async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      
      const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
      const { data } = await oauth2.userinfo.get();

      if (!data.id || !data.email) {
        throw new Error('Invalid user data received from Google');
      }

      return {
        id: data.id,
        email: data.email,
        verified_email: data.verified_email || false,
        name: data.name || '',
        given_name: data.given_name || '',
        family_name: data.family_name || '',
        picture: data.picture || '',
        locale: data.locale || ''
      };
    } catch (error) {
      throw new Error(`Failed to get user info from Google: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expiry_date?: number }> {
    try {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
      
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      
      if (!credentials.access_token) {
        throw new Error('Failed to refresh access token');
      }

      return {
        access_token: credentials.access_token,
        expiry_date: credentials.expiry_date || undefined
      };
    } catch (error) {
      throw new Error(`Failed to refresh access token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Revoke access token
   */
  static async revokeToken(token: string): Promise<void> {
    try {
      await this.oauth2Client.revokeToken(token);
    } catch (error) {
      // Don't throw error for revocation failures
      console.warn('Failed to revoke Google token:', error);
    }
  }
} 