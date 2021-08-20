import React from "react";

import Router from "../../pages/Router";
import { FavoriteRepositoryProvider } from "../../store/favoriteRepositories";

export default function App(): React.ReactElement {
  return (
    <FavoriteRepositoryProvider>
      <Router />
    </FavoriteRepositoryProvider>
  );
}
