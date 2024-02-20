import React from 'react';
import styles from '../styles/AppUse.module.css';


const AppUseSection = ({ icon, title, description }) => {
    return (
        <div className={styles.section_container}>
            <img className={styles.section_icon} src={icon} alt="Icono" />
            <h3 className={styles.section_title}>{title}</h3>
            <p className={styles.section_description}>{description}</p>
        </div>
    );
};

export default AppUseSection;