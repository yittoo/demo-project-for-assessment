import s from "./index.module.scss";
import Title from "../components/ui/Title/Title";
import PublicReposList from "../containers/PublicReposList/PublicReposList";

const Index = () => {
  return (
    <div className={s.Index}>
      <header>
        <Title element="h1" className={s.PageTitle} spacing="lg">
          Github Public Repos
        </Title>
      </header>
      <main>
        <PublicReposList />
      </main>
      <footer>
        <Title element="h4" spacing="md" className={s.FooterHello}>
          Hello Guidion - Yiğit Sözer
        </Title>
      </footer>
    </div>
  );
};

export default Index;
