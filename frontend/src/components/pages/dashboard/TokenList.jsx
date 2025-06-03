import React, { useRef, useState, useEffect } from "react";
import TokenCard from "./TokenCard";
import styles from "./tokenList.module.css";
import dashboard from "../dashboard.module.css";
import arrowLeft from "../../../assets/arrowLeft.svg";
import arrowRight from "../../../assets/arrowRight.svg";
import arrowLeftActive from "../../../assets/arrowLeftActive.svg";
import arrowRightActive from "../../../assets/arrowRightActive.svg";

export default function TokenList({ tokens, onCreateSale }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const cardWidth = 128;
  const gap = 16;
  const scrollAmount = (cardWidth + gap) * 3;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    checkScroll();
    node.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      node.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [tokens]);

  return (
    <section className={styles.tokenListContainer}>
      <div className={styles.sliderHeader}>
        <img
          src={canScrollLeft ? arrowLeftActive : arrowLeft}
          alt="slide left"
          onClick={scrollLeft}
          style={{
            cursor: canScrollLeft ? "pointer" : "default",
            transition: "filter 0.3s",
          }}
        />
        <h3>Your Tokens</h3>
        <img
          src={canScrollRight ? arrowRightActive : arrowRight}
          alt="slide right"
          onClick={scrollRight}
          style={{
            cursor: canScrollRight ? "pointer" : "default",
            transition: "filter 0.3s",
          }}
        />
      </div>

      <div className={styles.tokenList} ref={scrollRef}>
        {tokens.length === 0 ? (
          <p className={dashboard.empty}>
            Your own tokens will be displayed here once created
          </p>
        ) : (
          tokens.map((token) => (
            <TokenCard
              key={token.treasuryCapId}
              token={token}
              onCreateSale={onCreateSale}
            />
          ))
        )}
      </div>
    </section>
  );
}
