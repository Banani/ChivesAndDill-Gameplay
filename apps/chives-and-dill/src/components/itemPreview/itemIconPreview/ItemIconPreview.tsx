import React from 'react';
import styles from '../itemIconPreview/ItemIconPreview.module.scss';

export const ItemIconPreview = ({ itemData, highlight }) => <div style={{ backgroundImage: `url(${itemData.image})` }} className={styles.ItemImage + ` ${highlight ? styles.highlight : null}`} ><div className={styles.Stack}>{itemData.stack}</div></div>

