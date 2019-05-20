import React from 'react';
import classes from './dropdownNavItem.css';
import NavItem from './NavItem/NavItem';
import { Link } from 'react-router-dom';
export default props => {
  return (
    <li className={classes.Container} data-testid={props['data-testid']}>
      <div className={classes.Header}>{props.name}</div>
      <div className={classes.DropdownContent}>
        {props.list.map(item => {
          return (
            <div className={classes.DropdownItem} key={item.name}>
              <NavItem
                // className={classes.DropdownItem}
                link={item.link}
                name={item.name}
              />
            </div>
          );
        })}
      </div>
    </li>
  );
};
