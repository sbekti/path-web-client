export default class PathUtils {

  static getEmoji(emotion) {
    switch (emotion) {
      case 'love':
        return '❤️'
      case 'laugh':
        return '😂'
      case 'sad':
        return '😢'
      case 'surprise':
        return '😮'
      case 'happy':
        return '🙂'
    }
  }

}
