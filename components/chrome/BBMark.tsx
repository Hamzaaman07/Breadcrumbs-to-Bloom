type Props = {
  className?: string;
  strokeColor?: string;
  textColor?: string;
};

/**
 * The B·B monogram — a tall oval (~1:1.4 width:height) with a thin single
 * stroke, containing a centered serif "B · B" with the dot vertically
 * centered between the two letters. Matches Monica's actual tent-sign mark
 * (oval + monogram only — the arced "BREADCRUMBS TO BLOOMS / SOURDOUGH BY
 * MONICA" wordmark is specific to the full tent sign, not the nav/footer
 * inline mark, per client reference photos).
 */
export function BBMark({
  className = "",
  strokeColor = "currentColor",
  textColor = "currentColor",
}: Props) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      role="img"
      aria-label="Breadcrumbs to Blooms monogram"
    >
      <ellipse
        cx="50"
        cy="70"
        rx="46"
        ry="66"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
      />
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontSize="34"
        fontWeight="600"
        fill={textColor}
      >
        B·B
      </text>
    </svg>
  );
}
