export const routes = {
  home: "/",
  login: "/login",
  products: {
    root: "/products",
    detail: (id: string) => `/products/${id}`,
  },
  attributes: "/attributes",
  enrichment: "/enrichment",
  import: {
    products: "/import",
  },
};

export const apiRoutes = {
  attributes: "/api/attributes",
};
