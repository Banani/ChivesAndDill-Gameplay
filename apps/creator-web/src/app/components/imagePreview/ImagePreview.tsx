import { FunctionComponent } from "react";
import styles from "./ImagePreview.module.scss";

interface ImagePreviewProps {
    src: string
}

export const ImagePreview: FunctionComponent<ImagePreviewProps> = ({ src }) => {
    return <img src={src} className={styles['item-image-preview']} />
}