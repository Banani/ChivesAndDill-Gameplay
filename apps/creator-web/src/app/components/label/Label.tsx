import { FunctionComponent } from "react";
import styles from "./Label.module.scss";

export const Label: FunctionComponent = ({ children }) => {
    return <div className={styles['label']}>{children}</div>
}