import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Divider, Typography } from "@mui/material";

const speed = 2;

export default function FadeIn() {
  const typographyRef = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    const animate = (element) => {
      gsap.fromTo(
        element,
        { opacity: 0 },
        { opacity: 1, duration: speed, ease: "power2.out" }
      );
    };
    animate(typographyRef.current);
    animate(dividerRef.current);
  }, []);

  return (
    <>
      <Typography ref={typographyRef} fontSize="30px" color="whitesmoke">
        黒猫ちゃんBOT Dashoard
      </Typography>
      <Divider
        ref={dividerRef}
        sx={{
          borderBottom: '3px solid black',
          width: '30%',
          borderColor: 'whitesmoke',
        }}
      />
    </>
  );
}
