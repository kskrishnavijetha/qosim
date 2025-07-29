
export function useTemplateLoader() {
  return {
    templates: [],
    loadTemplate: () => {},
    saveTemplate: () => {},
    handleTemplateLoad: (templateId: string) => {}
  };
}
