export const getHomeRouteByRole = (role) => {
  if (role === "pharmacy") return "/pharmacy";
  if (role === "admin") return "/admin";
  return "/";
};
