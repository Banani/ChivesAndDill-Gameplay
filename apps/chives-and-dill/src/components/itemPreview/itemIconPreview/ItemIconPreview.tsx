import React from 'react';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';

export const ItemIconPreview = ({ itemData, highlight }) => <img src={itemData.image} className={styles.ItemImage + ` ${highlight ? styles.highlight : null}`} alt=""></img>

