import React from "react";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import { Paragraph, Loader } from "../../components/ui/";

import { useGithubLinkHeaderPaginatedFetch } from "../../hooks/useGithubLinkHeaderPaginatedFetch";
import {
  FavoriteRepositoryConsumer,
  IAction,
  IFavoriteRepositoryContextActions,
} from "../../store/favoriteRepositories";
import {
  IRepository,
  IRepositoryWithFavorite,
} from "../../types/githubApiResponses/repositories";

import s from "./PublicReposList.module.scss";

export interface IPublicReposList {
  favorites: IRepositoryWithFavorite[];
  dispatch: React.Dispatch<IAction>;
  actions: IFavoriteRepositoryContextActions;
}

export const PublicReposList: React.FunctionComponent<IPublicReposList> = ({
  favorites,
  dispatch,
  actions,
}): React.ReactElement | null => {
  // could cast response body into global store(like context, redux etc.) to cache it for page change then return
  // but already spent too much time adding pagination so decided not to for a simple test project
  const githubLinkHeaderPaginatedFetch =
    useGithubLinkHeaderPaginatedFetch<IRepository>(
      "https://api.github.com/repositories"
    );
  const renderError = () => {
    return (
      <div className={s.Error}>
        There was trouble getting to Github repos data :(
      </div>
    );
  };
  const renderLoading = () => {
    return (
      <div className={s["ReposList--Loading"]}>
        <Loader />
      </div>
    );
  };
  const favoriteClickedHandler = (favoriteData: IRepository) => {
    dispatch(actions.toggleFavorite(favorites, favoriteData));
  };

  const renderReposList = (reposData: IRepository[]) => {
    return (
      <div className={s.ReposList}>
        <PublicRepoItem
          className={s.TitleWrapper}
          owner={"Repository Owner"}
          item_id={"#"}
          html_url={"Repo Url"}
          name={"Repo Name"}
          index={"Repository ID"}
          onFavoriteButtonClicked={() => function () {}}
          isFavorite
        />
        {renderFavorites()}
        {renderNonFavoriteRepos(reposData)}
        {/* In ideal production scenario, I'd track scroll location 
        of end of list and trigger load when it becomes seen */}
        <button onClick={() => githubLinkHeaderPaginatedFetch.next(false)}>
          Load more...
        </button>
      </div>
    );
  };

  // avoid unnecessary re-render when rest of list updates but
  // the favorites do not change, small and could be unnecessary
  const renderFavorites = React.useCallback(() => {
    return favorites.map((githubRepoData, index) => (
      <PublicRepoItem
        key={githubRepoData.id}
        owner={githubRepoData.owner.login}
        item_id={githubRepoData.id}
        html_url={githubRepoData.html_url}
        name={githubRepoData.name}
        index={index + 1}
        onFavoriteButtonClicked={() => favoriteClickedHandler(githubRepoData)}
        isFavorite
      />
    ));
    // this check to re-calc function is not 100% healthy reason is
    // if in future we add a websocket which items live or something like that
    // repo name might be edited and we'd not update the favorites list
    // most likely would rarely ever happen but on a similar scenario
    // in production affect UX
  }, [favorites?.length]);

  // thought about another useCallback here to prevent re-render, though all the actions
  // happening in our application affects this part's dependency all the time
  // and will cause re-render, so doesn't make much sense to put it
  const renderNonFavoriteRepos = (reposData: IRepository[]) => {
    return reposData
      .filter((githubRepoData) => filterFavoritesFromList(githubRepoData.id))
      .map((githubRepoData, index) => (
        <PublicRepoItem
          key={githubRepoData.id}
          owner={githubRepoData.owner.login}
          item_id={githubRepoData.id}
          html_url={githubRepoData.html_url}
          name={githubRepoData.name}
          index={index + favorites?.length + 1}
          onFavoriteButtonClicked={() => favoriteClickedHandler(githubRepoData)}
        />
      ));
  };
  const filterFavoritesFromList = (itemToCheckId: number) => {
    return favorites.findIndex((fav) => fav.id === itemToCheckId) === -1;
  };

  if (githubLinkHeaderPaginatedFetch.fetchFailed) return renderError();
  if (githubLinkHeaderPaginatedFetch.loading) return renderLoading();
  if (githubLinkHeaderPaginatedFetch.responseBody) {
    return renderReposList(githubLinkHeaderPaginatedFetch.responseBody);
  }
  return null;
};

export default function ReposListWithFavorites() {
  return (
    <FavoriteRepositoryConsumer>
      {(state) => {
        return state.isInitialized ? (
          <PublicReposList
            favorites={state.value}
            dispatch={state.dispatch}
            actions={state.actions}
          />
        ) : null;
      }}
    </FavoriteRepositoryConsumer>
  );
}

export interface IPublicRepoItemProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  owner: string;
  item_id: number | string;
  html_url: string;
  name: string;
  index: number | string;
  isFavorite?: boolean;
  onFavoriteButtonClicked: Function;
  isTitle?: boolean;
}

const PublicRepoItem: React.FunctionComponent<IPublicRepoItemProps> = ({
  owner,
  item_id,
  html_url,
  name,
  index,
  onFavoriteButtonClicked,
  isFavorite,
  isTitle,
  ...rest
}): React.ReactElement<HTMLDivElement> => {
  const classes = [s.ReposListItem];
  if (rest.className) classes.push(rest.className);
  return (
    <div {...rest} className={classes.join(" ")}>
      {isTitle ? (
        <Paragraph />
      ) : (
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={() => onFavoriteButtonClicked()}
        />
      )}
      <Paragraph className={s.Index} bold={isTitle}>
        {index}
      </Paragraph>
      {/* <Paragraph bold={isTitle} className={s.ColWide}>
        {item_id}
      </Paragraph> */}
      <Paragraph bold={isTitle} className={s.ColWide}>
        {name}
      </Paragraph>
      <Paragraph bold={isTitle} className={s.ColWide}>
        {owner}
      </Paragraph>
    </div>
  );
};
