import github from "../assets/github.svg";
import x from "../assets/x.svg";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.sm}>
        <a
          href="https://github.com/E99-X/user_coin_on_eggx"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={github} alt="GitHub" className="icon-md" />
        </a>
        <a href="https://x.com/eggx_" target="_blank" rel="noopener noreferrer">
          <img src={x} alt="X/Twitter" className="icon-md" />
        </a>
      </div>
      <p className={styles.copyright}>© 2025 EggX. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
