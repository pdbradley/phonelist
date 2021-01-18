import React, { useRef, useContext, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Contacts from './pages/Contacts';
import Deploy from './pages/Deploy';
import Login from './pages/Login';
import { allContacts } from './contacts';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

type MaybeRouter = HTMLIonRouterOutletElement | null;

const RouterContext = React.createContext({ value: null as MaybeRouter });

export function useRouter() {
  const router = useContext(RouterContext);

  const setRouter = (value: MaybeRouter) => {
    router.value = value;
  };

  return [router.value, setRouter] as [
    MaybeRouter,
    (value: MaybeRouter) => void
  ];
}

const App: React.FC = () => {
  const routerRef = useRef<MaybeRouter>(null);
  const [, setRouter] = useRouter();

  useEffect(() => {
    setRouter(routerRef.current);
  }, [routerRef, setRouter]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet ref={routerRef}>
          <Route path="/" component={Login} exact />
          <Route
            path="/contacts"
            exact
            render={() => <Contacts showAll={true} contactData={allContacts} />}
          />
          <Route path="/deploy" component={Deploy} exact />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
