import React, { useEffect, useRef, useState } from "react";
import "../styles/moveLetters.css";
import { Button } from "@chakra-ui/react";

const MoveLetters: React.FC = () => {
  const letters =
    "GATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHER".split(
      "",
    );
  const sceneRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<
    { x: number; y: number; vx: number; vy: number; settled: boolean }[]
  >([]);
  const mousePosition = useRef<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Initialize positions for each letter
    const initialPositions = letters.map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0,
      vy: 0,
      settled: false,
    }));
    setPositions(initialPositions);

    // Function to handle collisions and update positions
    const updatePositions = () => {
      setPositions((prevPositions) => {
        // Copy previous positions
        const newPositions = [...prevPositions];

        // Update positions based on mouse interaction
        newPositions.forEach((pos, index) => {
          if (!pos.settled) {
            let newX = pos.x + pos.vx;
            let newY = pos.y + pos.vy;

            // Check boundaries
            const letterWidth = 50; // Assuming 50px width for letters
            const letterHeight = 50; // Assuming 50px height for letters
            const minX = 30;
            const maxX = window.innerWidth - letterWidth;
            const minY = 100;
            const maxY = window.innerHeight - letterHeight;

            if (newX < minX) {
              newX = minX;
              pos.vx *= -1; // Reverse horizontal velocity to bounce off the left border
            } else if (newX > maxX) {
              newX = maxX;
              pos.vx *= -1; // Reverse horizontal velocity to bounce off the right border
            }

            if (newY < minY) {
              newY = minY;
              pos.vy *= -1; // Reverse vertical velocity to bounce off the top border
            } else if (newY > maxY) {
              newY = maxY;
              pos.vy *= -1; // Reverse vertical velocity to bounce off the bottom border
            }

            // Update position
            newPositions[index] = { ...pos, x: newX, y: newY };

            // Check if letter is close to button and mark it as settled
            const buttonRect = sceneRef.current?.getBoundingClientRect();
            if (buttonRect) {
              const distanceToButton = Math.sqrt(
                Math.pow(newX - (buttonRect.left + buttonRect.width / 2), 2) +
                  Math.pow(newY - (buttonRect.top + buttonRect.height / 2), 2),
              );
              if (distanceToButton < 150) {
                // Adjust the distance as needed
                newPositions[index] = { ...pos, settled: true };
              }
            }
          }
        });

        return newPositions.filter((pos) => !pos.settled);
      });

      requestAnimationFrame(updatePositions);
    };

    // Start the animation loop
    updatePositions();

    // Cleanup
    return () => cancelAnimationFrame(updatePositions);
  }, []);

  // Update mouse position
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    mousePosition.current = { x: event.clientX, y: event.clientY };

    // Reset velocities to zero
    setPositions((prevPositions) => {
      return prevPositions.map((pos) => ({ ...pos, vx: 0, vy: 0 }));
    });

    // Influence the velocity of letters based on mouse movement
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions.forEach((pos) => {
        const dx = pos.x - mousePosition.current.x;
        const dy = pos.y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 1.0; // Adjust the speed as needed

        if (distance < 500) {
          // Adjust the range as needed
          pos.vx = (dx / distance) * speed;
          pos.vy = (dy / distance) * speed;
        }
      });
      return newPositions;
    });
  };

  const handleMouseMovePull = () => {
    // Reset velocities to zero
    setPositions((prevPositions) => {
      return prevPositions.map((pos) => ({ ...pos, vx: 0, vy: 0 }));
    });

    // Influence the velocity of letters based on mouse movement
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions.forEach((pos) => {
        const dx = mousePosition.current.x - pos.x;
        const dy = mousePosition.current.y - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 6.0; // Adjust the speed as needed

        if (distance < 5000) {
          // Adjust the range as needed
          pos.vx = (dx / distance) * speed;
          pos.vy = (dy / distance) * speed;
        }
      });
      return newPositions;
    });
  };

  const handleButtonClick = () => {
    setShowText(true); // Show the new text when the button is clicked
    console.log(showText);
    handleMouseMovePull(); // Perform the original button action
  };

  return (
    <div className="letterwrapper">
      <div
        className="letter-container"
        ref={sceneRef}
        onMouseMove={handleMouseMove}
      >
        {positions.map(({ x, y }, index) => (
          <div
            key={index}
            className="letter"
            style={{ left: `${x}px`, top: `${y}px` }}
          >
            {letters[index]}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          variant="ghost"
          sx={{
            position: "absolute", // Ensuring the button is correctly positioned
            top: "50%", // Center vertically
            left: "50%", // Center horizontally
            transform: "translate(-50%, -50%)", // Necessary for centering
            fontSize: "100px",
            padding: "60px 60px",
            color: "black",
            backgroundColor: "white",
            zIndex: "3", // Ensure it is above other content
          }}
          onClick={handleButtonClick}
        >
          GATHER
        </Button>
      </div>
      {showText && (
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "4",
            fontSize: "50px",
            color: "var(--col-dark)",
            whiteSpace: "nowrap",
            fontWeight: "bold",
          }}
        >
          THE WORLD WITH PERFECT ORGANIZATION
        </div>
      )}
      {showText && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: "4",
          }}
        >
          <div style={{ position: "relative" }}>
            {/* Arrow */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: "20px solid white",
                position: "absolute",
                top: "-10px",
                right: "75px",
              }}
            />
            {/* Text */}
            <div
              style={{
                backgroundColor: "white",
                color: "var(--col-secondary)",
                fontSize: "25px",
                padding: "10px",
                borderRadius: "5px",
                textAlign: "center",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              It starts here!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MoveLetters;
