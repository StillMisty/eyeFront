export default (img_url: string) => {
  return useRuntimeConfig().public.apiUrl + img_url;
};
