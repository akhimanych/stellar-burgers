import styles from './modal-overlay.module.css';

type TModalOverlayUIProps = {
  onClick: () => void;
  'data-cy'?: string;
};

export const ModalOverlayUI = ({
  onClick,
  'data-cy': dataCy
}: TModalOverlayUIProps) => (
  <div className={styles.overlay} onClick={onClick} data-cy={dataCy} />
);
