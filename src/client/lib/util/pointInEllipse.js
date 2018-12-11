export default function (ellipse, location) {
  const xRadius = ellipse.width / 2;
  const yRadius = ellipse.height / 2;

  if (xRadius <= 0.0 || yRadius <= 0.0) {
    return false;
  }

  const center = {
    x: ellipse.left + xRadius,
    y: ellipse.top + yRadius
  };

    /* This is a more general form of the circle equation
     *
     * X^2/a^2 + Y^2/b^2 <= 1
     */

  const normalized = {
    x: location.x - center.x,
    y: location.y - center.y
  };

  const inEllipse = ((normalized.x * normalized.x) / (xRadius * xRadius)) + ((normalized.y * normalized.y) / (yRadius * yRadius)) <= 1.0;


  return inEllipse;
}
