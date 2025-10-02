import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

function buildEmbedUrl(videoUrl) {
  if (!videoUrl) {
    return null;
  }

  const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match) {
    return null;
  }

  return `https://player.vimeo.com/video/${match[1]}`;
}

export default function VimeoPlayer({ videoUrl }) {
  const embedUrl = useMemo(() => buildEmbedUrl(videoUrl), [videoUrl]);

  if (!embedUrl) {
    return null;
  }

  const { width } = Dimensions.get('window');
  const height = width * (9 / 16);

  return (
    <View style={[styles.wrapper, { height }]}> 
      <WebView
        source={{ uri: embedUrl }}
        allowsFullscreenVideo
        javaScriptEnabled
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
});
