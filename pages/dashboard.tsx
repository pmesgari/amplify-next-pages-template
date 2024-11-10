import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator } from '@aws-amplify/ui-react'
import { getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';

const client = generateClient<Schema>();

function Programs() {
  const { signOut } = useAuthenticator();
  const [currentUser, setCurrentUser] = useState('');
  const [programModules, setProgramModules] = useState<Array<Schema["ProgramModule"]["type"]>>([]);

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const session = await fetchAuthSession();
        const { username } = await getCurrentUser();
        setCurrentUser(username);
        console.log("current user", username)
        const groups = session.tokens?.accessToken.payload["cognito:groups"];
        console.log('groups', groups)
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    // const res = client.models.ProgramModule.observeQuery({authMode: 'userPool'})
    client.models.ProgramModule.observeQuery({authMode: 'userPool'}).subscribe({
      next: (data) => setProgramModules([...data.items]),
    });

    fetchUser();
    
  }, []);
  return (
    <main>
    <section className="hero is-success">
      <div className="hero-body">
        <p className="title">Home</p>
        <p className="subtitle">Weekly Plan</p>
      </div>
    </section>
    <section className='section'>
      <button onClick={signOut}>Sign Out</button>
    </section>
    <section className="section">
        {programModules.map((module) => (
          <div key={module.id}>
            <div>
              <p>{module.id}</p>
              <p>{module.section}</p>
              <p>{module.module}</p>
            </div>
            <br />
          </div>
        ))}
      </section>
  </main>
  )
}

function Dashboard() {
  return (
    <Authenticator>
      <Programs />
    </Authenticator>

  )
}

export default Dashboard