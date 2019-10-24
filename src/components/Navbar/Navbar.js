import React from 'react';
import { Menu, Input } from 'semantic-ui-react'
import Logo from '../../resources/images/Crafty_Yak_Logo.png';
import './Navbar.css';


/**
 * Basic Navbar Component which is fixed to the top of the page
 * @returns {*}
 * @constructor
 */
export default function Navbar() {
  return (
      <Menu stackable className="menu-navbar">
        <Menu.Item>
          <img alt="" src={Logo} />
        </Menu.Item>
      <Menu.Menu position="right">
          <Menu.Item>
              <Input icon="search" placeholder="Search" />
          </Menu.Item>
          <Menu.Item name="Checkout" />
      </Menu.Menu>
      </Menu>
  );
}
