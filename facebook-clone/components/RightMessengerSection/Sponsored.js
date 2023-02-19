import React, { useState } from "react";

export default function Sponsored() {
  const [isActive, setIsActive] = useState(false);
  return isActive ? (
    <div className="sponsored">
      <h4 className="title">Sponsored</h4>
    </div>
  ) : undefined;
}
