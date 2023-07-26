import React from 'react';
import styles from './DetailsModal.module.scss';

export const DetailsModal = ({ children, setModal }) => {

    return (
        <div className={styles.DetailsModal} onMouseLeave={() => setModal(false)}>
            {children}
        </div>
    )
}