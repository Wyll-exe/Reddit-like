import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../../style.css';

function Place() {
    const WIDTH = 50;
    const HEIGHT = 50;

    const [grid, setGrid] = useState(
        Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(null))
    );

    const [selectedColor, setSelectedColor] = useState("#000000"); // noir

    const onClick = (x, y) => {
        setGrid((prevGrid) => {
            const newGrid = [...prevGrid];
            newGrid[y][x] = selectedColor; 
            return newGrid;
        });
    };

    const colors = [
        "#FF5733",
        "#33C1FF",
        "#75FF33",
        "#FF33EC",
        "#FFD133",
        "#8E33FF",
        "#33FFBD",
        "#FF3333",
        "#3385FF",
        "#A6FF33",
        "#000000",
      ];
      
      // 
      //
      // #FF5733  → Rouge orangé
      // #33C1FF  → Bleu clair
      // #75FF33  → Vert vif
      // #FF33EC  → Rose fuchsia
      // #FFD133  → Jaune doré
      // #8E33FF  → Violet
      // #33FFBD  → Turquoise
      // #FF3333  → Rouge vif
      // #3385FF  → Bleu moyen
      // #A6FF33  → Vert citron
      // #000000  → Noir


    return (
        <div>
            <div
                className="grid overflow-auto mx-auto"
                style={{
                    gridTemplateColumns: `repeat(${WIDTH}, 1fr)`,
                    width: "100%",
                    maxWidth: "100%",
                    height: "fit-content",
                    display: "grid",
                }}
            >
                {/* pixel */}
                {grid.flatMap((row, y) =>
                    row.map((color, x) => (
                        <div
                            key={`${x}-${y}`}
                            onClick={() => onClick(x, y)}
                            className="w-4 h-4 border hover:brightness-90"
                            style={{ backgroundColor: color || "#ffffff" }}
                        />
                    ))
                )}
            </div>

            {/* Palette */}
            <div className="flex justify-center mt-4">
                {colors.map((color) => (
                    <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className="w-8 h-8 border-2 border-gray-300 mx-1"
                        style={{
                            backgroundColor: color,
                            border: selectedColor === color ? "2px solid black" : "2px solid gray",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Place;