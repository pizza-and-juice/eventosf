"use client";

import { useEffect, useRef } from "react";

import styles from "./ripple.module.scss";

const { ripple_effect, ripple_container } = styles;

type Props = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function RippleEffect({
  children,
  className,
  disabled,
  ...rest
}: Props) {
  const elmntRef = useRef(null);

  const rippleEffect = (e: any) => {
    const btn = e.currentTarget;

    const circle = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add(ripple_effect);

    btn.appendChild(circle);

    circle.addEventListener("animationend", () => {
      btn.removeChild(circle);
    });
  };

  // add click event lisnter
  useEffect(() => {
    if (!elmntRef.current) return;
    if (disabled) return;

    const btn = elmntRef.current as HTMLElement;

    btn.addEventListener("click", rippleEffect);

    return () => {
      btn.removeEventListener("click", rippleEffect);
    };
  }, [elmntRef, disabled]);

  return (
    <div
      className={`${ripple_container} ${className}`}
      {...rest}
      ref={elmntRef}
    >
      {children}
    </div>
  );
}
