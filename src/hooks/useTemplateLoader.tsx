
import { useState } from 'react';

export function useTemplateLoader() {
  const [templates] = useState([]);
  
  return {
    templates,
    loadTemplate: () => {},
    saveTemplate: () => {}
  };
}
