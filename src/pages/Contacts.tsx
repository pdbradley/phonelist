import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonActionSheet,
  ActionSheetButton,
  IonButtons,
  IonButton,
  IonIcon,
  IonAlert,
  IonAvatar,
  IonModal,
} from '@ionic/react';
import React, { useState } from 'react';
import './Contacts.css';
import { phoneDigits, initials } from '../utils';
import contacts, { Contact } from '../contacts';
import { chatbox, home, call, personAdd, mail } from 'ionicons/icons';
import { Redirect } from 'react-router';
import debounce from 'lodash.debounce';
import { useRouter } from '../App';

type SearchState = 'EMPTY' | 'NO_RESULTS' | 'RESULTS';

const MAX_SEARCH_RESULTS = 7;

const ADD_USER_URL = process.env.REACT_APP_AIRTABLE_ADD_USER_URL || '';

const Home: React.FC = () => {
  const [router] = useRouter();

  const [searchValue, setSearchValue] = useState('');

  // either [] or contacts, depending on whether we want to show all by default
  const [defaultContacts] = useState<Contact[]>(contacts);

  const [contactList, setContactList] = useState<Contact[]>([]);

  const [contactCardOpen, setContactCardOpen] = useState(false);

  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  const [showAddAlert, setShowAddAlert] = useState(false);

  function getSearchStateFromResults(contacts: Contact[]) {
    if (contacts.length === 0) {
      if (defaultContacts.length === 0) return 'EMPTY';
      else return 'NO_RESULTS';
    } else {
      return 'RESULTS';
    }
  }

  const [searchState, setSearchState] = useState<SearchState>(
    getSearchStateFromResults(defaultContacts)
  );

  if (!contacts.length) return <Redirect to="/" />;

  function showContactCard(contact: Contact) {
    setCurrentContact(contact);
    setContactCardOpen(true);
  }

  function hideContactCard() {
    setContactCardOpen(false);
    setCurrentContact(null);
  }

  const handleSearch = debounce((value: string) => {
    const search = value.trim();
    setSearchValue(search);
    filterContacts(search);
  }, 300);

  function filterContacts(search = searchValue) {
    let results = defaultContacts.slice();

    search = search.toLowerCase();

    if (search.length > 1) {
      const terms = search.split(' ');
      if (terms[0]) {
        results = contacts
          .filter(
            (contact) =>
              terms.filter((t) => contact.name.toLowerCase().includes(t))
                .length === terms.length ||
              terms.filter((t) => phoneDigits(contact.mobile).includes(t))
                .length === terms.length ||
              terms.filter((t) => phoneDigits(contact.home).includes(t))
                .length === terms.length ||
              terms.filter((t) => contact.email.toLowerCase().includes(t))
                .length === terms.length
          )
          .slice(0, MAX_SEARCH_RESULTS);
      }
    }

    setSearchState(getSearchStateFromResults(results));

    setContactList(results);
  }

  const buttons = [] as ActionSheetButton[];
  if (currentContact) {
    const cc = currentContact;
    if (cc.mobile) {
      buttons.push(
        {
          text: `Mobile ${cc.mobile}`,
          icon: call,
          handler: () => {
            window.location.href = `tel:${cc.mobile}`;
          },
        },
        {
          text: `Text ${cc.mobile}`,
          icon: chatbox,
          handler: () => {
            window.location.href = `sms:${cc.mobile}`;
          },
        }
      );
    }
    if (cc.home) {
      buttons.push({
        text: `Home ${cc.home}`,
        icon: home,
        handler: () => {
          window.location.href = `tel:${cc.home}`;
        },
      });
    }
    if (cc.email) {
      buttons.push({
        text: cc.email,
        icon: mail,
        handler: () => {
          window.location.href = `mailto:${cc.email}`;
        },
      });
    }
  }

  function launchAddForm() {
    const win = window.open(ADD_USER_URL);
    if (!win) window.location.href = ADD_USER_URL;
  }

  function renderContacts() {
    return (
      <IonList>
        {contactList.map((contact, i) => (
          <IonItem
            key={`${contact.id}-${i}`}
            onClick={() => showContactCard(contact)}
            detail={false}
          >
            <IonAvatar slot="start">
              <div className="initials">{initials(contact.name)}</div>
            </IonAvatar>
            <IonLabel>
              <h2>{contact.name}</h2>
              <div
                className="contact-details"
                style={{ color: 'var(--ion-color-medium)' }}
              >
                {contact.mobile && <div>{contact.mobile} M</div>}
                {contact.home && <div>{contact.home} H</div>}
                {contact.email && <div>{contact.email}</div>}
              </div>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    );
  }

  return (
    <IonPage className="contacts-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Phone List</IonTitle>
          {ADD_USER_URL.length > 0 && (
            <IonButtons slot="end">
              <IonButton shape="round" onClick={() => setShowAddAlert(true)}>
                <IonIcon icon={personAdd} />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            onIonChange={(e) => handleSearch(e.detail.value!)}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {searchState === 'EMPTY' && (
          <div className="notice">Search for a name or phone number.</div>
        )}
        {searchState === 'RESULTS' && renderContacts()}
        {searchState === 'NO_RESULTS' && (
          <div className="notice">
            No contacts match your search term. Please try again.
          </div>
        )}
        <IonActionSheet
          isOpen={contactCardOpen}
          onDidDismiss={hideContactCard}
          header={currentContact ? currentContact.name : ''}
          buttons={buttons}
        />
        <IonModal
          isOpen={false}
          swipeToClose
          presentingElement={router || undefined}
          onDidDismiss={hideContactCard}
        >
          <IonToolbar>
            <IonTitle>{currentContact?.name}</IonTitle>
          </IonToolbar>
        </IonModal>
      </IonContent>
      <IonAlert
        isOpen={showAddAlert}
        onDidDismiss={(e) => {
          if (e.detail.role === 'add') {
            launchAddForm();
          }
          setShowAddAlert(false);
        }}
        header="Add Your Info"
        subHeader={
          'Add/edit your contact info using our form. We will add it to this list in a few days.'
        }
        buttons={[
          { text: 'Add my info', role: 'add' },
          { text: 'Cancel', role: 'cancel' },
        ]}
      />
    </IonPage>
  );
};

export default Home;
