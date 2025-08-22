const SIZE = 48;
const BARS = 3;
const BAR_WIDTH = 6;
const BAR_GAP = 10;
const BAR_RADIUS = 2;
const MIN_HEIGHT = 12;
const MAX_HEIGHT = 36;
const BASE_Y = 20;
const TOP_Y = 4;
const DURATION = 0.9;
const STAGGER = 0.15;

export function LoadingSpinner() {
  return (
    <svg
      data-testid='loading'
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="fill-text-primary"
      xmlns="http://www.w3.org/2000/svg"
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: BARS }).map((_, i) => (
        <rect
          key={i}
          x={i * BAR_GAP}
          y={BASE_Y}
          width={BAR_WIDTH}
          height={MIN_HEIGHT}
          rx={BAR_RADIUS}
        >
          <animate
            attributeName="height"
            values={`${MIN_HEIGHT};${MAX_HEIGHT};${MIN_HEIGHT}`}
            dur={`${DURATION}s`}
            begin={`${i * STAGGER}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values={`${BASE_Y};${TOP_Y};${BASE_Y}`}
            dur={`${DURATION}s`}
            begin={`${i * STAGGER}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}
