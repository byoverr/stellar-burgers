import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Конструктор */}
          <Link
            to='/'
            className={
              location.pathname === '/' ? styles.link_active : styles.link
            }
          >
            <div className={styles.button}>
              <BurgerIcon type={'primary'} className={styles.icon} />
              <p className='text text_type_main-default'>Конструктор</p>
            </div>
          </Link>

          {/* Лента заказов */}
          <Link
            to='/feed'
            className={
              location.pathname.includes('feed')
                ? styles.link_active
                : styles.link
            }
          >
            <div className={styles.button}>
              <ListIcon type={'primary'} className={styles.icon} />
              <p className='text text_type_main-default'>Лента заказов</p>
            </div>
          </Link>
        </div>

        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>

        <div className={styles.link_position_last}>
          {/* Личный кабинет */}
          <Link
            to='/profile'
            className={
              location.pathname.includes('profile') ||
              location.pathname.includes('login') ||
              location.pathname.includes('register') ||
              location.pathname.includes('forgot-password')
                ? styles.link_active
                : styles.link
            }
          >
            <div className={styles.button}>
              <ProfileIcon type={'primary'} className={styles.icon} />
              <p className='text text_type_main-default'>
                {userName || 'Личный кабинет'}
              </p>
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};
