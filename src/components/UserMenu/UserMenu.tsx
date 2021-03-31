import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFetchUsers, useUserSession } from 'hooks';
import { Avatar } from 'components';

import styles from './UserMenu.module.scss';

export default function UserMenu() {
  const router = useRouter();
  const fetchUsers = useFetchUsers();
  const { userId, fullName, signOut } = useUserSession();
  const [publicKey, setPublicKey] = useState('');

  function handleLogOut() {
    signOut();
    router.replace('/');
  }

  async function fetchUserPublicKey() {
    if (!userId) {
      return;
    }

    const users = await fetchUsers([userId]);

    if (!users) {
      return;
    }

    setPublicKey(users[0].publicKey);
  }

  useEffect(() => {
    fetchUserPublicKey();
  }, [userId]);

  return (
    <div className={styles.UserMenu}>
      <Avatar fullName={fullName ?? 'User'} publicKey={publicKey} small />

      <div className={styles.RightSection}>
        <span className={styles.Name}>{fullName}</span>

        <button className={styles.SignOutButton} onClick={handleLogOut}>
          <svg height="13" viewBox="0 0 17 13" width="17" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m19.3921072 23c.2213538 0 .409504-.0774736.5644518-.2324213l5.5781117-5.5781117c.1549477-.1549477.2324213-.343098.2324213-.5644518s-.0774736-.4095041-.2324213-.5644518l-5.5781117-5.5781117c-.1549478-.1549477-.343098-.2324213-.5644518-.2324213s-.4095041.0774736-.5644518.2324213-.2324213.343098-.2324213.5644518v3.1874924h-4.5156143c-.2213538 0-.409504.0774736-.5644517.2324213-.1549478.1549477-.2324214.343098-.2324214.5644518v3.1874924c0 .2213538.0774736.4095041.2324214.5644518.1549477.1549477.3430979.2324213.5644517.2324213h4.5156143v3.1874924c0 .2213538.0774736.4095041.2324213.5644518s.343098.2324213.5644518.2324213zm-4.3828021 0c.1106767 0 .2047523-.0387371.2822259-.1162107s.1162107-.1715492.1162107-.2822259v-1.3281218c0-.1106766-.0387371-.2047523-.1162107-.2822259s-.1715492-.1162106-.2822259-.1162106h-2.7890558c-.2877599 0-.5367828-.1051432-.7470686-.315429-.2102857-.2102858-.3154289-.4593086-.3154289-.7470685v-6.3749848c0-.2877599.1051432-.5367827.3154289-.7470685.2102858-.2102858.4593087-.315429.7470686-.315429h2.7890558c.1106767 0 .2047523-.038737.2822259-.1162106s.1162107-.1715493.1162107-.2822259v-1.3281219c0-.1106766-.0387371-.2047522-.1162107-.2822258s-.1715492-.1162107-.2822259-.1162107h-2.7890558c-.8854147 0-1.6380168.3098949-2.25780714.9296853-.61979036.6197903-.92968528 1.3723924-.92968528 2.2578071v6.3749848c0 .8854147.30989492 1.6380168.92968528 2.2578071.61979034.6197904 1.37239244.9296853 2.25780714.9296853z"
              fill="#f4f6f8"
              transform="translate(-9 -10)"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
