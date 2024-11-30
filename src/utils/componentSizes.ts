export const getDefaultSize = (type: string) => {
    switch (type) {
      case 'button':
        return { width: 150, height: 95 };
      case 'scorecard':
        return { width: 200, height: 160 };
      case 'table':
        return { width: 700, height: 300 };
      case 'text':
        return { width: 240, height: 100 };
      case 'chart':
        return { width: 400, height: 300 };
      case 'pdf':
        return { width: 400, height: 300 };
      case 'image':
        return { width: 400, height: 300 };
      case 'map':
        return { width: 600, height: 300 };
      default:
        return { width: 400, height: 300 };
    }
  };