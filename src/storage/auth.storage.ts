import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'eatcloud_auth_token';
const USER_KEY = 'eatcloud_auth_user';

export const authStorage = {
  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async getUser(): Promise<string | null> {
    return AsyncStorage.getItem(USER_KEY);
  },

  async setUser(user: string): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, user);
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },
};
