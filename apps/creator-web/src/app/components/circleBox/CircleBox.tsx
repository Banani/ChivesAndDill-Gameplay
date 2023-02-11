import { FunctionComponent } from "react"

import styles from "./CircleBox.module.scss"

export const CircleBox: FunctionComponent = ({ children }) => {
    return <div className={styles['circle-box']}>{children}</div>
}