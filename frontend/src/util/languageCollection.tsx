export function languageFromId(value:string|number) {
    switch (value) {
      case "76":
        return "cpp";
      case "91":
        return "java";
      case "93":
        return "javascript";
      case "71":
        return "python";
      default:
        return "javascript";
    }
  }