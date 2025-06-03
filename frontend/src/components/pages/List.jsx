import React from "react";
import styles from "./list.module.css";
import clsx from "clsx";

export default function List({ items = [], variant = "bullet", prefix }) {
  return (
    <ul className={clsx(styles.list, styles[variant])}>
      {items.map((item, idx) => {
        const label = typeof item === "string" ? item : item.label;
        const sub = typeof item === "object" && item.sub;

        return (
          <li key={idx} className={styles.item}>
            {variant === "check" && <span className={styles.checkIcon}>✔</span>}
            {variant === "steps" && (
              <span className={styles.prefix}>
                {prefix === "bullet" ? "•" : `${idx + 1}.`}
              </span>
            )}

            <div>
              <span className={styles.label}>{label}</span>
              {sub && <div className={styles.sub}>{sub}</div>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
