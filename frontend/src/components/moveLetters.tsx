
import React, { useEffect, useRef, useState } from 'react';
import "../styles/moveLetters.css";

const MoveLetters: React.FC = () => {
  const letters = 'GATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHER'.split('');
  const sceneRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{ x: number; y: number; settled: boolean }[]>([]);

  useEffect(() => {
    // Initialize positions for each letter
    const initialPositions = letters.map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      settled: false,
    }));
    setPositions(initialPositions);

    // Function to handle collisions and update positions
    const updatePositions = () => {
      setPositions((prevPositions) => {
        // Copy previous positions
        const newPositions = [...prevPositions];

        // Update positions based on gravity and collision with the bottom of the screen
        newPositions.forEach((pos, index) => {
          if (!pos.settled) {
            const newY = pos.y + 1; // Simulate gravity
            const nextPos = { ...pos, y: newY };

            // Check collision with the bottom of the screen
            if (newY >= window.innerHeight - 50) { // Assuming 50px height for letters
              nextPos.y = window.innerHeight - 50;
              nextPos.settled = true;
            }

            // Check collision with other letters
            let overlapping = false;
            newPositions.forEach((other, otherIndex) => {
              if (index !== otherIndex) {
                if (
                  nextPos.x < other.x + 50 && // Assuming 50px width for letters
                  nextPos.x + 50 > other.x && // Assuming 50px width for letters
                  nextPos.y < other.y + 50 && // Assuming 50px height for letters
                  nextPos.y + 50 > other.y // Assuming 50px height for letters
                  && other.settled == true
                ) {
                  overlapping = true;
                  nextPos.settled = true;
                }
              }
            });

            // If not overlapping with any other letter and close enough to the ground, settle it
            if (!overlapping && newY >= window.innerHeight - 50) { // Assuming 50px height for letters
              nextPos.y = window.innerHeight - 50;
              nextPos.settled = true;
            }

            // Update position
            newPositions[index] = nextPos;
          }
        });

        return newPositions;
      });

      requestAnimationFrame(updatePositions);
    };

    // Start the animation loop
    updatePositions();

    // Cleanup
    return () => cancelAnimationFrame(updatePositions);
  }, []);

  return (
    <div className="container" ref={sceneRef}>
      {positions.map(({ x, y, settled }, index) => (
        <div
          key={index}
          className={`letter ${settled ? 'settled' : ''}`}
          style={{ left: `${x}px`, top: `${y}px` }}
        >
          {letters[index]}
        </div>
      ))}
    </div>
  );
};

export default MoveLetters;
// import React, { useEffect, useRef, useState } from 'react';
// import "../styles/moveLetters.css";

// const MoveLetters: React.FC = () => {
//   const letters = 'GATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHERGATHER'.split('');
//   const sceneRef = useRef<HTMLDivElement>(null);
//   const [positions, setPositions] = useState<{ x: number; y: number; settled: boolean }[]>([]);
//   const mousePosition = useRef<{ x: number; y: number }>({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

//   useEffect(() => {
//     // Initialize positions for each letter
//     const initialPositions = letters.map(() => ({
//       x: Math.random() * window.innerWidth,
//       y: Math.random() * window.innerHeight,
//       settled: false,
//     }));
//     setPositions(initialPositions);

//     // Function to handle collisions and update positions
//     const updatePositions = () => {
//       setPositions((prevPositions) => {
//         // Copy previous positions
//         const newPositions = [...prevPositions];

//         // Update positions based on gravity and collision with the bottom of the screen
//         newPositions.forEach((pos, index) => {
//           if (!pos.settled) {
//             let newX = pos.x;
//             let newY = pos.y;

//             // Check collision with the bottom of the screen
//             if (newY >= window.innerHeight - 50) { // Assuming 50px height for letters
//               newY = window.innerHeight - 50;
//             }

//             // Update position based on mouse position
//             const dx = pos.x - mousePosition.current.x;
//             const dy = pos.y - mousePosition.current.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
//             const pushForce = 10000 / (distance * distance); // Adjust the force as needed

//             // Apply force to move letters away from the mouse position
//             newX += pushForce * dx / distance;
//             newY += pushForce * dy / distance;

//             // Update position
//             newPositions[index] = { x: newX, y: newY, settled: false };
//           }
//         });

//         return newPositions;
//       });

//       requestAnimationFrame(updatePositions);
//     };

//     // Start the animation loop
//     updatePositions();

//     // Cleanup
//     return () => cancelAnimationFrame(updatePositions);
//   }, []);

//   // Update mouse position
//   const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
//     console.log("Mouse position:", event.clientX, event.clientY);
//     mousePosition.current = { x: event.clientX, y: event.clientY };
//   };

//   return (
//     <div className="container" ref={sceneRef} onMouseMove={handleMouseMove}>
//       {positions.map(({ x, y, settled }, index) => (
//         <div
//           key={index}
//           className={`letter ${settled ? 'settled' : ''}`}
//           style={{ left: `${x}px`, top: `${y}px` }}
//         >
//           {letters[index]}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MoveLetters;
