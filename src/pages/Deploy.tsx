import React, { useState } from 'react';
import { IonButton, IonPage, IonContent } from '@ionic/react';

const { REACT_APP_BUILD_HOOK } = process.env;

const BUILD_HOOK_URL = REACT_APP_BUILD_HOOK || '';

const Deploy: React.FC = () => {
  const hasHook = BUILD_HOOK_URL.length > 0;
  const [enabled, setEnabled] = useState(true);
  const [message, setMessage] = useState('');

  function deploy() {
    setEnabled(false);
    fetch(BUILD_HOOK_URL, {
      method: 'POST',
    })
      .then((res) => {
        if (res.ok) {
          setEnabled(false);
          return 'Deploy started!';
        } else {
          setEnabled(true);
          return 'Deploy failed. Please try again.';
        }
      })
      .catch((err) => {
        setEnabled(true);
        return err.toString();
      })
      .then((message) => {
        setMessage(message);
      });
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="ion-text-center">
          {hasHook ? (
            <>
              <h2>Update Phonelist</h2>

              <p>
                Once the Airtable data has been updated, you can deploy new
                changes:
              </p>

              <p>
                <IonButton
                  size="large"
                  color="dark"
                  strong
                  disabled={!enabled}
                  onClick={deploy}
                >
                  Deploy
                </IonButton>
              </p>

              <p>{message}</p>
            </>
          ) : (
            <p>No build hook provided.</p>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Deploy;
