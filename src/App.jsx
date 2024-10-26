import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

//useMotionValue - reactive variable - y ,it represents the scroll position. it holds the current value of the scroll and updates as the user scrolls.

//useTransform - it maps the value of one range(Scroll position) to another range(card)

const App = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const cards = [
    {
      title: "Card 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      color: "#FF6B6B",
    },
    {
      title: "Card 2",
      content:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      color: "#4ECDC4",
    },
    {
      title: "Card 3",
      content:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      color: "#45B7D1",
    },
    {
      title: "Card 4",
      content:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
      color: "#F7DC6F",
    },
    {
      title: "Card 5",
      content:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      color: "#CD6155",
    },
  ];

  return (
    <div ref={containerRef} style={styles.container}>
      <header style={styles.header}>
        <h1>Stacked Cards Header</h1>
      </header>

      <div style={styles.cardContainer}>
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            index={index}
            scrollYProgress={scrollYProgress}
            totalCards={cards.length}
          />
        ))}
      </div>

      <footer style={styles.footer}>
        <p>Stacked Cards Footer</p>
      </footer>
    </div>
  );
};

const Card = ({ card, index, scrollYProgress, totalCards }) => {
  const cardRef = useRef(null);
  const cardHeight = 400;

  // Calculate scroll ranges for each card
  const segmentSize = 1 / totalCards;
  const scrollStart = index * segmentSize;
  const scrollEnd = (index + 1) * segmentSize;

  // Transform Y position to scroll up card height before disappearing
  const y = useTransform(
    scrollYProgress,
    [
      scrollStart, // Start of card's scroll segment
      scrollStart + segmentSize * 0.8, // Point where card reaches top
      scrollEnd, // End of card's scroll segment
    ],
    [
      0, // Start position
      -cardHeight, // Scroll up by card height
      -cardHeight * 2, // Move further up to disappear
    ]
  );

  // Opacity fades out after card has scrolled up its height
  const opacity = useTransform(
    scrollYProgress,
    [
      scrollStart,
      scrollStart + segmentSize * 0.8, // Start fading after scrolling up
      scrollStart + segmentSize * 0.9, // Completely fade out
    ],
    [1, 1, 0]
  );

  //smooth animation
  const springY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  return (
    <motion.div
      ref={cardRef}
      style={{
        ...styles.card,
        y: springY,
        opacity: opacity,
        zIndex: totalCards - index,
        backgroundColor: card.color,
      }}
    >
      <h2 style={styles.cardTitle}>{card.title}</h2>
      <p style={styles.cardContent}>{card.content}</p>
    </motion.div>
  );
};

const styles = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: "20px",
    textAlign: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "60px 0",
    minHeight: "300vh",
  },
  card: {
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    margin: "0 0 -390px 0", // Slightly more than card height for tight stacking
    width: "90%",
    maxWidth: "800px",
    height: "400px",
    position: "sticky",
    top: "100px",
    transition: "all 0.3s ease",
    overflow: "hidden",
    willChange: "transform, opacity",
  },
  cardTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#ffffff",
  },
  cardContent: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#ffffff",
  },
  footer: {
    backgroundColor: "#ffffff",
    padding: "20px",
    textAlign: "center",
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
  },
};

export default App;
