"use client";
import { Box } from "@mui/material";
import FadeIn from "./FadeIn";
import Button from "./Button";
export default function FirstPost() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "300px"
      }}
    >
      <FadeIn />
        <Button text="DISCORD LOGIN" url="./pages/next" />
    </Box>
  );
}
