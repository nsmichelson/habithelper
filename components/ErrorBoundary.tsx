import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, DevSettings, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    // You could also log this to an error reporting service
  }

  handleRestart = () => {
    if (__DEV__) {
      DevSettings.reload();
    } else {
      // In production without expo-updates, we can't easily force a full bundle reload
      // without native modules. We'll just show an alert asking the user to restart.
      Alert.alert(
        'Restart Required',
        'Please close and reopen the app to continue.',
        [{ text: 'OK' }]
      );
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Ionicons name="alert-circle" size={64} color="#F44336" style={styles.icon} />
            <Text style={styles.title}>Oops! Something went wrong.</Text>
            <Text style={styles.subtitle}>
              We're sorry, but the app has encountered an unexpected error.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.debugBox}>
                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.stackTrace}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
              <Text style={styles.buttonText}>{__DEV__ ? 'Reload App' : 'Close App'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  debugBox: {
    width: '100%',
    backgroundColor: '#FFF0F0',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    marginBottom: 32,
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 12,
    color: '#D32F2F',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
