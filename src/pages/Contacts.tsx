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
  IonChip,
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './Contacts.css';
import { phoneDigits, initials } from '../utils';
import contacts, { Contact } from '../contacts';
import { chatbox, home, call, personAdd, mail } from 'ionicons/icons';
import { Redirect } from 'react-router';

const ADD_USER_URL = process.env.REACT_APP_AIRTABLE_ADD_USER_URL || '';

const Home: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const [contactCardOpen, setContactCardOpen] = useState(false);

  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  const [showAddAlert, setShowAddAlert] = useState(false);

  const allHalls = 'All';

  const [hallFilter, setHallFilter] = useState(allHalls);

  const [halls, setHalls] = useState([allHalls]);

  useEffect(() => {
    const unique: Record<string, boolean> = {};

    contacts.forEach((c) => {
      if (c.hall) unique[c.hall] = true;
    });

    const keys = Object.keys(unique);
    if (keys.length) {
      setHalls(halls.concat(keys.sort()));
    }

    // eslint-disable-next-line
  }, []);

  if (!contacts.length) return <Redirect to="/" />;

  function handleHallFilter(value: string) {
    setHallFilter(value);
    filterContacts();
  }

  function showContactCard(contact: Contact) {
    setCurrentContact(contact);
    setContactCardOpen(true);
  }

  function hideContactCard() {
    setContactCardOpen(false);
    setCurrentContact(null);
  }

  function handleSearch(value: string) {
    setSearchValue(value.trim());
    filterContacts();
  }

  function filterContacts() {
    let results = contacts;

    const terms = searchValue.toLowerCase().split(' ');
    if (terms.length > 0) {
      results = contacts.filter(
        (contact) =>
          terms.filter((t) => contact.name.toLowerCase().includes(t)).length ===
            terms.length ||
          terms.filter((t) => phoneDigits(contact.mobile).includes(t))
            .length === terms.length ||
          terms.filter((t) => phoneDigits(contact.home).includes(t)).length ===
            terms.length ||
          terms.filter((t) => contact.email.toLowerCase().includes(t))
            .length === terms.length
      );
    }

    if (hallFilter !== allHalls) {
      console.log('fitering by hall:', hallFilter);
      results = results.filter((c) => c.hall === hallFilter);
    }

    return results;
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
        {halls.length > 2 && (
          <IonToolbar>
            <IonItem>
              <IonLabel>Hall:</IonLabel>
              {halls.map((hall) => (
                <IonChip onClick={() => handleHallFilter(hall)} key={hall}>
                  <IonLabel color={hall === hallFilter ? 'primary' : ''}>
                    {hall}
                  </IonLabel>
                </IonChip>
              ))}
            </IonItem>
          </IonToolbar>
        )}
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {filterContacts().map((contact, i) => (
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
        <IonActionSheet
          isOpen={contactCardOpen}
          onDidDismiss={hideContactCard}
          header={currentContact ? currentContact.name : ''}
          buttons={buttons}
        />
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
