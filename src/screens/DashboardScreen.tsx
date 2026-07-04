import React, { useCallback, useRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useAuth } from '../context/AuthContext';
import { env } from '../config/env';

export const DashboardScreen: React.FC = () => {
  const { token, logout } = useAuth();
  const webViewRef = useRef<WebView>(null);
  const logoutRequested = useRef(false);
  const [canGoBack, setCanGoBack] = React.useState(false);

  const injectTokenScript = useCallback(
    (navUrl: string) => {
      if (logoutRequested.current || !token || !navUrl.includes('eatcloud-frontend.vercel.app')) return;
      webViewRef.current?.injectJavaScript(`
        (function() {
          if (!localStorage.getItem('eatcloud_auth_token')) {
            localStorage.setItem('eatcloud_auth_token', '${token}');
            window.location.href = '/dashboard';
          }
        })();
        true;
      `);
    },
    [token],
  );

  const handleNavigationStateChange = useCallback(
    (navState: { url: string; canGoBack: boolean }) => {
      setCanGoBack(navState.canGoBack);
      if (navState.url.includes('/login')) {
        injectTokenScript(navState.url);
      }
    },
    [injectTokenScript],
  );

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);
        if (message.type === 'LOGOUT') {
          logoutRequested.current = true;
          logout();
        }
      } catch {
        // ignore malformed messages
      }
    },
    [logout],
  );

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }, [logout]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: env.FRONTEND_URL }}
        style={styles.webview}
        onLoadEnd={() => injectTokenScript(env.FRONTEND_URL)}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        sharedCookiesEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: 'oklch(1 0 0);',
  },
  webview: {
    flex: 1,
  },
});
